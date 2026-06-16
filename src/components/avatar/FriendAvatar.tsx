import type { Friend } from '../../types';
import { getAnimalAvatar } from '../../utils/animal-avatar';
import { ANIMALS } from './AnimalAvatars';

interface FriendAvatarProps {
  friend: Pick<Friend, 'name' | 'avatar_url'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = { sm: 32, md: 48, lg: 80, xl: 120 };

export function FriendAvatar({ friend, size = 'md', className = '' }: FriendAvatarProps) {
  const dimension = SIZE_MAP[size];

  if (friend.avatar_url) {
    return (
      <img
        src={friend.avatar_url}
        alt={friend.name}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: dimension, height: dimension }}
      />
    );
  }

  const { animalIndex, primaryColor, secondaryColor } = getAnimalAvatar(friend.name);
  const AnimalComponent = ANIMALS[animalIndex];

  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <AnimalComponent size={dimension} color={primaryColor} secondaryColor={secondaryColor} />
    </div>
  );
}
