import { useState, useEffect } from 'react';
import { fetchThoughts, createThought, deleteThought } from '../../services/thoughtService';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { formatDate } from '../../utils/date-utils';
import { useToast } from '../ui/ToastProvider';
import type { Thought } from '../../types';

interface ThoughtListProps {
  friendId: string;
}

export function ThoughtList({ friendId }: ThoughtListProps) {
  const { showToast } = useToast();
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<Thought | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchThoughts(friendId);
      setThoughts(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [friendId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      await createThought(friendId, trimmed);
      setContent('');
      showToast('已记录');
      load();
    } catch {
      showToast('记录失败', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteThought(deleting.id);
      showToast('已删除');
      setDeleting(null);
      load();
    } catch {
      showToast('删除失败', 'error');
    }
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider mb-3">随想</h2>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-3 px-3 py-2 rounded-btn bg-warm-bg/60 border border-warm-border/40 flex items-center gap-2">
        <span className="shrink-0 text-sm">💭</span>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={200}
          placeholder="想到什么就写下来..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-warm-text placeholder:text-warm-muted/60"
        />
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="shrink-0 text-xs text-warm-primary hover:text-warm-primary/80 transition-colors disabled:opacity-30"
        >
          记下
        </button>
      </form>

      {!loading && thoughts.length === 0 ? (
        <p className="text-sm text-warm-muted pl-4 border-l-2 border-warm-border py-2">
          还没有随想记录
        </p>
      ) : (
        <div className="space-y-2.5">
          {thoughts.map(t => (
            <div key={t.id} className="pl-4 border-l-2 border-warm-accent/30 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-warm-muted/70">{formatDate(t.created_at.slice(0, 10))}</p>
                  <p className="text-sm text-warm-text mt-0.5 italic leading-relaxed break-words">"{t.content}"</p>
                </div>
                <button
                  onClick={() => setDeleting(t)}
                  className="text-xs text-warm-muted hover:text-red-400 transition-colors px-1 opacity-0 group-hover:opacity-100 shrink-0 mt-1"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="删除随想"
        message="确定要删除这条随想吗？"
      />
    </div>
  );
}
