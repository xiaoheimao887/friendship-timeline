import { useRef } from 'react';
import { FriendAvatar } from './FriendAvatar';
import type { Friend } from '../../types';

interface AvatarUploadProps {
  friend: Pick<Friend, 'name' | 'avatar_url'>;
  onUpload: (file: File) => void;
  onRemove: () => void;
  uploading?: boolean;
}

export function AvatarUpload({ friend, onUpload, onRemove, uploading }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
        <FriendAvatar friend={friend} size="xl" />
        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            点击更换
          </span>
        </div>
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {friend.avatar_url && (
        <button
          onClick={onRemove}
          className="text-xs text-warm-muted hover:text-red-400 transition-colors"
          type="button"
        >
          移除头像
        </button>
      )}
      {!friend.avatar_url && (
        <p className="text-xs text-warm-muted">点击头像上传照片</p>
      )}
    </div>
  );
}
