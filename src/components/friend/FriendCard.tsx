import { Link } from 'react-router-dom';
import type { Friend } from '../../types';
import { FriendAvatar } from '../avatar/FriendAvatar';
import { TagBadge } from '../tags/TagBadge';
import { RelationshipBadge } from './RelationshipBadge';
import { formatDateShort } from '../../utils/date-utils';

interface FriendCardProps {
  friend: Friend;
}

export function FriendCard({ friend }: FriendCardProps) {
  return (
    <Link
      to={`/friends/${friend.id}`}
      className="block bg-white rounded-card p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex flex-col items-center text-center">
        <FriendAvatar friend={friend} size="lg" className="mb-3" />
        <h3 className="font-semibold text-warm-text">{friend.nickname}</h3>
        {friend.nickname && (
          <p className="text-xs text-warm-muted mt-0.5">{friend.nickname}</p>
        )}
        <p className="text-xs text-warm-muted mt-2">{formatDateShort(friend.met_date)}</p>
        <div className="mt-2">
          <RelationshipBadge status={friend.relationship} />
        </div>
        {friend.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 justify-center">
            {friend.tags.slice(0, 3).map(tag => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {friend.tags.length > 3 && (
              <span className="text-xs text-warm-muted">+{friend.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
