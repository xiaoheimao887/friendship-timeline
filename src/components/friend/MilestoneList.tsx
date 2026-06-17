import { useState, useEffect, useMemo } from 'react';
import { fetchMilestones, createMilestone, updateMilestone, deleteMilestone } from '../../services/milestoneService';
import { fetchThoughts, deleteThought } from '../../services/thoughtService';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { formatDate } from '../../utils/date-utils';
import { useToast } from '../ui/ToastProvider';
import { DatePicker } from '../ui/DatePicker';
import { ThoughtInput } from './ThoughtInput';
import type { Milestone, MilestoneFormData, Thought } from '../../types';

interface MilestoneListProps {
  friendId: string;
}

type TimelineItem =
  | { kind: 'milestone'; data: Milestone }
  | { kind: 'thought'; data: Thought };

export function MilestoneList({ friendId }: MilestoneListProps) {
  const { showToast } = useToast();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [deleting, setDeleting] = useState<TimelineItem | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [ms, ts] = await Promise.all([
        fetchMilestones(friendId),
        fetchThoughts(friendId),
      ]);
      setMilestones(ms);
      setThoughts(ts);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [friendId]);

  const timeline: TimelineItem[] = useMemo(() => {
    const items: TimelineItem[] = [
      ...milestones.map(m => ({ kind: 'milestone' as const, data: m })),
      ...thoughts.map(t => ({ kind: 'thought' as const, data: t })),
    ];
    items.sort((a, b) => {
      const da = a.kind === 'milestone' ? a.data.date : a.data.created_at.slice(0, 10);
      const db = b.kind === 'milestone' ? b.data.date : b.data.created_at.slice(0, 10);
      // Most recent first
      return db.localeCompare(da);
    });
    return items;
  }, [milestones, thoughts]);

  const handleCreate = async (data: MilestoneFormData) => {
    try {
      await createMilestone(friendId, data);
      showToast('里程碑已添加');
      setShowAdd(false);
      load();
    } catch {
      showToast('添加失败', 'error');
    }
  };

  const handleUpdate = async (id: string, data: MilestoneFormData) => {
    try {
      await updateMilestone(id, data);
      showToast('已更新');
      setEditing(null);
      load();
    } catch {
      showToast('更新失败', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      if (deleting.kind === 'milestone') {
        await deleteMilestone(deleting.data.id);
      } else {
        await deleteThought(deleting.data.id);
      }
      showToast('已删除');
      setDeleting(null);
      load();
    } catch {
      showToast('删除失败', 'error');
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider mb-3">回忆</h2>
        <p className="text-sm text-warm-muted">加载中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider">回忆</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="text-xs text-warm-primary hover:text-warm-primary/80 transition-colors"
        >
          + 添加里程碑
        </button>
      </div>

      {/* Thought input */}
      <div className="mb-4 px-3 py-2 rounded-btn bg-warm-bg/60 border border-warm-border/40">
        <ThoughtInput friendId={friendId} onCreated={load} />
      </div>

      {timeline.length === 0 ? (
        <p className="text-sm text-warm-muted pl-4 border-l-2 border-warm-border py-2">
          还没有回忆记录
        </p>
      ) : (
        <div className="space-y-3">
          {timeline.map(item => (
            item.kind === 'thought' ? (
              <div key={item.data.id} className="pl-4 border-l-2 border-warm-accent/30 group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-warm-muted/70">
                      {formatDate(item.data.created_at.slice(0, 10))}
                    </p>
                    <p className="text-sm text-warm-text mt-0.5 italic leading-relaxed">
                      "{item.data.content}"
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleting(item)}
                    className="text-xs text-warm-muted hover:text-red-400 transition-colors px-1 opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    删除
                  </button>
                </div>
              </div>
            ) : (
              <div key={item.data.id} className="pl-4 border-l-2 border-warm-primaryLight group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-warm-muted">{formatDate(item.data.date)}</p>
                    <p className="text-sm font-medium text-warm-text mt-0.5">{item.data.title}</p>
                    {item.data.description && (
                      <p className="text-sm text-warm-muted mt-0.5">{item.data.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditing(item.data)}
                      className="text-xs text-warm-muted hover:text-warm-primary transition-colors px-1"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => setDeleting(item)}
                      className="text-xs text-warm-muted hover:text-red-400 transition-colors px-1"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      <MilestoneFormModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleCreate}
        title="添加里程碑"
      />

      {editing && (
        <MilestoneFormModal
          open={!!editing}
          onClose={() => setEditing(null)}
          onSubmit={(data) => handleUpdate(editing.id, data)}
          title="编辑里程碑"
          initial={editing}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={deleting?.kind === 'thought' ? '删除随想' : '删除里程碑'}
        message={
          deleting?.kind === 'thought'
            ? `确定要删除这条随想吗？`
            : `确定要删除「${(deleting?.data as Milestone)?.title || ''}」吗？`
        }
      />
    </div>
  );
}

function MilestoneFormModal({ open, onClose, onSubmit, title, initial }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MilestoneFormData) => void;
  title: string;
  initial?: Milestone;
}) {
  const [date, setDate] = useState(initial?.date || '');
  const [t, setT] = useState(initial?.title || '');
  const [desc, setDesc] = useState(initial?.description || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !t) return;
    setSubmitting(true);
    await onSubmit({ date, title: t, description: desc || undefined });
    setSubmitting(false);
    if (!initial) { setDate(''); setT(''); setDesc(''); }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-warm-text mb-1">日期</label>
          <DatePicker
            value={date}
            onChange={setDate}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-text mb-1">标题</label>
          <input
            value={t}
            onChange={e => setT(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-btn border border-warm-border focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm"
            placeholder="发生了什么？"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-text mb-1">描述（可选）</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-btn border border-warm-border focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-btn border border-warm-border text-sm hover:bg-warm-bg transition-colors">
            取消
          </button>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded-btn bg-warm-primary text-white text-sm hover:bg-warm-primary/90 transition-colors disabled:opacity-50">
            {submitting ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
