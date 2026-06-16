interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  selected?: boolean;
  onClick?: () => void;
}

export function TagBadge({ tag, onRemove, selected, onClick }: TagBadgeProps) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
        selected === false
          ? 'bg-gray-100 text-gray-400'
          : selected
          ? 'bg-warm-primaryLight text-warm-primary ring-1 ring-warm-primary'
          : 'bg-warm-primaryLight/60 text-warm-primary hover:bg-warm-primaryLight'
      }`}
    >
      {tag}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-warm-primary/20 transition-colors"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 2l4 4M6 2l-4 4" />
          </svg>
        </button>
      )}
    </span>
  );
}
