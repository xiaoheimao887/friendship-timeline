import { useFriendStore } from '../../store/useFriendStore';
import { useFilterStore } from '../../store/useFilterStore';
import { FriendAvatar } from '../avatar/FriendAvatar';
import { TagBadge } from '../tags/TagBadge';
import { RelationshipBadge } from '../friend/RelationshipBadge';
import { formatDateShort } from '../../utils/date-utils';
import { EmptyState } from '../ui/EmptyState';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

const YEAR_ITEMS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export function TimelinePage() {
  const friends = useFriendStore(s => s.friends);
  const { searchQuery, selectedTags, timelineZoom } = useFilterStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...friends];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(f =>
        f.nickname.toLowerCase().includes(q) ||
        (f.name?.toLowerCase().includes(q))
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter(f =>
        selectedTags.some(tag => f.tags.includes(tag))
      );
    }

    return result.sort((a, b) => b.met_date.localeCompare(a.met_date));
  }, [friends, searchQuery, selectedTags]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof friends> = {};
    filtered.forEach(f => {
      const year = f.met_date.slice(0, 4);
      if (!groups[year]) groups[year] = [];
      groups[year].push(f);
    });
    return groups;
  }, [filtered]);

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  const scrollToYear = (year: string) => {
    document.getElementById(`year-${year}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!useFriendStore.getState().initialized) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-warm-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-warm-text">时间线</h1>
          <p className="text-sm text-warm-muted">共 {friends.length} 位朋友</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            onChange={e => scrollToYear(e.target.value)}
            className="px-3 py-1.5 rounded-btn border border-warm-border bg-white text-sm focus:outline-none"
          >
            <option value="">按年份跳转</option>
            {years.map(y => (
              <option key={y} value={y}>{y} 年 ({grouped[y].length})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3 3" />
        </svg>
        <input
          value={searchQuery}
          onChange={e => useFilterStore.getState().setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm transition-colors"
          placeholder="搜索朋友..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📅"
          title={friends.length === 0 ? '还没有朋友记录' : '没有匹配的时间线'}
          description="添加朋友后，他们将出现在这里"
        />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-warm-border" />

          {years.map(year => (
            <div key={year} id={`year-${year}`} className="mb-8">
              {/* Year header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-warm-sidebar flex items-center justify-center text-sm font-semibold text-warm-primary relative z-10 border-2 border-white">
                  {year.slice(2)}
                </div>
                <h2 className="text-lg font-semibold text-warm-text">{year} 年</h2>
                <span className="text-xs text-warm-muted">{grouped[year].length} 位朋友</span>
              </div>

              {/* Nodes */}
              <div className="ml-14 space-y-3">
                {grouped[year].map(friend => (
                  <div key={friend.id} className="relative">
                    {/* Dot */}
                    <div className="absolute -left-[35px] top-4 w-3 h-3 rounded-full bg-warm-primary border-2 border-white" />

                    {/* Card */}
                    <div
                      className="bg-white rounded-card-sm shadow-card-sm p-4 hover:shadow-card-hover transition-all duration-200 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === friend.id ? null : friend.id)}
                    >
                      <div className="flex items-center gap-3">
                        <FriendAvatar friend={friend} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/friends/${friend.id}`}
                              className="font-medium text-warm-text hover:text-warm-primary transition-colors"
                              onClick={e => e.stopPropagation()}
                            >
                              {friend.nickname}
                            </Link>
                            <span className="text-xs text-warm-muted shrink-0">{formatDateShort(friend.met_date)}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <RelationshipBadge status={friend.relationship} />
                            {friend.tags.slice(0, 2).map(tag => (
                              <TagBadge key={tag} tag={tag} />
                            ))}
                          </div>
                        </div>
                        <svg
                          className={`text-warm-muted transition-transform duration-200 ${expandedId === friend.id ? 'rotate-180' : ''}`}
                          width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
                        >
                          <path d="M4 6l4 4 4-4" />
                        </svg>
                      </div>

                      {/* Expanded content */}
                      {expandedId === friend.id && (
                        <div className="mt-4 pt-4 border-t border-warm-border/50">
                          <p className="text-sm text-warm-text leading-relaxed line-clamp-4">
                            {friend.met_story}
                          </p>
                          <Link
                            to={`/friends/${friend.id}`}
                            className="inline-block mt-3 text-xs text-warm-primary hover:text-warm-primary/80 transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            查看完整档案 →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
