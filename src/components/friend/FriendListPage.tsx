import { useFriendStore } from '../../store/useFriendStore';
import { useFilterStore } from '../../store/useFilterStore';
import { FriendCard } from './FriendCard';
import { TagFilterBar } from '../tags/TagFilterBar';
import { EmptyState } from '../ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

export function FriendListPage() {
  const friends = useFriendStore(s => s.friends);
  const { searchQuery, selectedTags, relationshipFilter } = useFilterStore();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    let result = [...friends];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(f =>
        f.nickname.toLowerCase() ||
        (f.name?.toLowerCase().includes(q))
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter(f =>
        selectedTags.some(tag => f.tags.includes(tag))
      );
    }

    if (relationshipFilter !== 'all') {
      result = result.filter(f => f.relationship === relationshipFilter);
    }

    return result.sort((a, b) => b.met_date.localeCompare(a.met_date));
  }, [friends, searchQuery, selectedTags, relationshipFilter]);

  if (!useFriendStore.getState().initialized) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-warm-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-warm-text">
          朋友
          <span className="text-sm font-normal text-warm-muted ml-2">共 {filtered.length} 位</span>
        </h1>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex bg-white rounded-btn border border-warm-border overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1.5 text-xs transition-colors ${viewMode === 'grid' ? 'bg-warm-primaryLight text-warm-primary' : 'text-warm-muted'}`}
            >
              网格
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1.5 text-xs transition-colors ${viewMode === 'list' ? 'bg-warm-primaryLight text-warm-primary' : 'text-warm-muted'}`}
            >
              列表
            </button>
          </div>
          <button
            onClick={() => navigate('/friends/new')}
            className="hidden sm:inline-flex px-4 py-2 rounded-btn bg-warm-primary text-white text-sm hover:bg-warm-primary/90 transition-colors"
          >
            + 添加朋友
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3 3" />
        </svg>
        <input
          value={searchQuery}
          onChange={e => useFilterStore.getState().setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm transition-colors"
          placeholder="搜索名字或昵称..."
        />
      </div>

      <TagFilterBar />

      {filtered.length === 0 ? (
        <EmptyState
          icon="👥"
          title={friends.length === 0 ? '还没有朋友记录' : '没有匹配的朋友'}
          description={friends.length === 0 ? '点击右上角添加你的第一位朋友吧' : '试试调整筛选条件'}
          action={
            friends.length === 0 ? (
              <button
                onClick={() => navigate('/friends/new')}
                className="px-4 py-2 rounded-btn bg-warm-primary text-white text-sm hover:bg-warm-primary/90 transition-colors"
              >
                添加朋友
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-3'
        }>
          {filtered.map(friend => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
}
