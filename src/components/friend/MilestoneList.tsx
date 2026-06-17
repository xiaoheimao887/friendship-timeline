import { useState, useEffect } from 'react';
import { fetchMilestones, createMilestone, updateMilestone, deleteMilestone } from '../../services/milestoneService';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { formatDate } from '../../utils/date-utils';
import { useToast } from '../ui/ToastProvider';
import { DatePicker } from '../ui/DatePicker';
import type { Milestone, MilestoneFormData } from '../../types';

interface MilestoneListProps {
  friendId: string;
}

export function MilestoneList({ friendId }: MilestoneListProps) {
  const { showToast } = useToast();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [deleting, setDeleting] = useState<Milestone | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchMilestones(friendId);
      setMilestones(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [friendId]);

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
      await deleteMilestone(deleting.id);
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
        <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider mb-3">里程碑</h2>
        <p className="text-sm text-warm-muted">加载中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider">里程碑</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="text-xs text-warm-primary hover:text-warm-primary/80 transition-colors"
        >
          + 添加里程碑
        </button>
      </div>

      {milestones.length === 0 ? (
        <p className="text-sm text-warm-muted pl-4 border-l-2 border-warm-border py-2">
          还没有里程碑记录
        </p>
      ) : (
        <div className="space-y-3">
          {milestones.map(m => (
            <div key={m.id} className="pl-4 border-l-2 border-warm-primaryLight group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-warm-muted">{formatDate(m.date)}</p>
                  <p className="text-sm font-medium text-warm-text mt-0.5">{m.title}</p>
                  {m.description && (
                    <p className="text-sm text-warm-muted mt-0.5">{m.description}</p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditing(m)}
                    className="text-xs text-warm-muted hover:text-warm-primary transition-colors px-1"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => setDeleting(m)}
                    className="text-xs text-warm-muted hover:text-red-400 transition-colors px-1"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
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
        title="删除里程碑"
        message={`确定要删除「${deleting?.title}」吗？`}
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
