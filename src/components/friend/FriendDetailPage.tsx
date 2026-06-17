import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useFriendStore } from '../../store/useFriendStore';
import { FriendAvatar } from '../avatar/FriendAvatar';
import { TagBadge } from '../tags/TagBadge';
import { RelationshipBadge } from './RelationshipBadge';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Modal } from '../ui/Modal';
import { FriendForm } from './FriendForm';
import { MilestoneList } from './MilestoneList';
import { ThoughtList } from './ThoughtList';
import { ConnectionList } from './ConnectionList';
import { formatDate, getDuration } from '../../utils/date-utils';
import { useToast } from '../ui/ToastProvider';

export function FriendDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFriend, removeFriend } = useFriendStore();
  const { showToast } = useToast();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const friend = id ? getFriend(id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!friend) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-warm-muted mb-4">朋友未找到</p>
        <button onClick={() => navigate('/friends')} className="text-warm-primary hover:underline text-sm">
          返回列表
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await removeFriend(friend.id);
      showToast('已删除');
      navigate('/friends');
    } catch {
      showToast('删除失败', 'error');
    }
  };

  const duration = getDuration(friend.met_date);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-warm-muted hover:text-warm-primary transition-colors mb-6 flex items-center gap-1"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 4L6 8l4 4" />
        </svg>
        返回
      </button>

      <div className="bg-white rounded-card p-6 sm:p-8 shadow-card">
        {/* Header */}
        <div className="flex items-start gap-5">
          <FriendAvatar friend={friend} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-warm-text">{friend.nickname}</h1>
                {friend.name && (
                  <p className="text-sm text-warm-muted mt-0.5">名字: {friend.name}</p>
                )}
                <p className="text-sm text-warm-accent mt-1">
                  认识 {duration}
                </p>
                {friend.current_location_name && (
                  <p className="text-xs text-warm-muted mt-1">📍 {friend.current_location_name}</p>
                )}
                {friend.birthday && (
                  <p className="text-xs text-warm-muted mt-1">🎂 {formatDate(friend.birthday)}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowEdit(true)}
                  className="px-3 py-1.5 rounded-btn text-xs border border-warm-border hover:bg-warm-bg transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="px-3 py-1.5 rounded-btn text-xs border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <RelationshipBadge status={friend.relationship} />
              {friend.tags.map(tag => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </div>

        {/* Met story */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider mb-3">相识</h2>
          <div className="pl-4 border-l-2 border-warm-border">
            <p className="text-sm text-warm-muted mb-2">
              {formatDate(friend.met_date)}
              {friend.met_place_name && ` · ${friend.met_place_name}`}
            </p>
            <p className="text-warm-text leading-relaxed whitespace-pre-wrap">{friend.met_story}</p>
          </div>
        </div>

        {/* Milestones */}
        <div className="mt-8">
          <MilestoneList friendId={friend.id} />
        </div>

        {/* Thoughts */}
        <div className="mt-8">
          <ThoughtList friendId={friend.id} />
        </div>
      </div>

      <ConnectionList friendId={friend.id} />

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="删除朋友"
        message={`确定要删除「${friend.nickname}」及其所有里程碑吗？此操作不可撤销。`}
      />

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="编辑朋友">
        <FriendForm friend={friend} onClose={() => setShowEdit(false)} />
      </Modal>
    </div>
  );
}
