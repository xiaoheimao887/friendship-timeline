import { useState } from 'react';
import { createThought } from '../../services/thoughtService';
import { useToast } from '../ui/ToastProvider';

interface ThoughtInputProps {
  friendId: string;
  onCreated: () => void;
}

export function ThoughtInput({ friendId, onCreated }: ThoughtInputProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      await createThought(friendId, trimmed);
      setContent('');
      showToast('已记录');
      onCreated();
    } catch {
      showToast('记录失败', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
  );
}
