import type { RelationshipStatus } from '../../types';
import { RELATIONSHIP_LABELS, RELATIONSHIP_COLORS } from '../../types';

interface RelationshipBadgeProps {
  status: RelationshipStatus;
}

export function RelationshipBadge({ status }: RelationshipBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ backgroundColor: RELATIONSHIP_COLORS[status] }}
      />
      {RELATIONSHIP_LABELS[status]}
    </span>
  );
}
