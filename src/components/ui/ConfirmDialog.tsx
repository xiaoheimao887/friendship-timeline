import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = '确认删除' }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-warm-muted mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-btn border border-warm-border hover:bg-warm-bg transition-colors text-sm"
        >
          取消
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className="px-4 py-2 rounded-btn bg-red-400 text-white hover:bg-red-500 transition-colors text-sm"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
