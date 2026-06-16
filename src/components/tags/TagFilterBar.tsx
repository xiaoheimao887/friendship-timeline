import { useFriendStore } from '../../store/useFriendStore';
import { useFilterStore } from '../../store/useFilterStore';
import { TagBadge } from './TagBadge';

export function TagFilterBar() {
  const friends = useFriendStore(s => s.friends);
  const { selectedTags, toggleTag } = useFilterStore();

  const allTags = Array.from(new Set(friends.flatMap(f => f.tags))).sort();

  if (allTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {allTags.map(tag => (
        <TagBadge
          key={tag}
          tag={tag}
          selected={selectedTags.length === 0 || selectedTags.includes(tag)}
          onClick={() => toggleTag(tag)}
        />
      ))}
      {selectedTags.length > 0 && (
        <button
          onClick={() => useFilterStore.getState().resetFilters()}
          className="text-xs text-warm-muted hover:text-warm-primary transition-colors px-2"
        >
          清除筛选
        </button>
      )}
    </div>
  );
}
