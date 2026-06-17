import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AvatarUpload } from '../avatar/AvatarUpload';
import { TagBadge } from '../tags/TagBadge';
import { useFriendStore } from '../../store/useFriendStore';
import { useToast } from '../ui/ToastProvider';
import { DatePicker } from '../ui/DatePicker';
import { LocationSearch } from '../ui/LocationSearch';
import { uploadAvatar, deleteAvatar } from '../../services/friendService';
import type { FriendFormData, RelationshipStatus } from '../../types';
import type { Friend } from '../../types';

interface FriendFormProps {
  friend?: Friend;
  onClose: () => void;
}

const TAGS_SUGGESTIONS = ['大学', '高中', '初中', '同事', '健身', '游戏', '旅行', '读书会', '朋友的朋友', '邻居', '实习', '留学'];

export function FriendForm({ friend, onClose }: FriendFormProps) {
  const navigate = useNavigate();
  const { addFriend, updateFriend } = useFriendStore();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(friend?.avatar_url);
  const [newTag, setNewTag] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FriendFormData>({
    defaultValues: friend ? {
      nickname: friend.nickname,
      name: friend.name || '',
      birthday: friend.birthday || '',
      met_date: friend.met_date,
      current_location_name: friend.current_location_name || '',
      met_place_lat: friend.met_place_lat,
      current_location_lat: friend.current_location_lat,
      current_location_lng: friend.current_location_lng,
      met_place_lng: friend.met_place_lng,
      met_story: friend.met_story,
      relationship: friend.relationship,
      tags: friend.tags,
    } : {
      name: '',
      nickname: '',
      birthday: '',
      met_date: '',
      met_place_name: '',
      met_story: '',
      relationship: 'regular' as RelationshipStatus,
      tags: [],
    }
  });

  const tags = watch('tags');

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      setValue('tags', [...tags, tag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setValue('tags', tags.filter(t => t !== tag));
  };

  const handleUpload = async (file: File) => {
    setAvatarFile(file);
    setUploading(true);
    try {
      // We'll upload on save instead
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarUrl(undefined);
  };

  const onSubmit = async (data: FriendFormData) => {
    try {
      let finalAvatarUrl = avatarUrl;

      // Upload avatar if there's a new file
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        finalAvatarUrl = await uploadAvatar(avatarFile, fileName);
      }

      // Remove old avatar if changed
      if (friend?.avatar_url && (!avatarUrl || avatarFile)) {
        const oldPath = friend.avatar_url.split('/').pop();
        if (oldPath) deleteAvatar(oldPath).catch(() => {});
      }

      const formData = { ...data, avatar_url: finalAvatarUrl };

      if (friend) {
        await updateFriend(friend.id, formData);
        showToast('朋友信息已更新');
      } else {
        await addFriend(formData);
        showToast('新朋友已添加');
      }
      onClose();
    } catch (error) {
      console.error('Failed to save friend:', error);
      showToast('保存失败: ' + (error instanceof Error ? error.message : JSON.stringify(error)), 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <AvatarUpload
        friend={{ nickname: watch('nickname') || '预览', avatar_url: avatarUrl }}
        onUpload={handleUpload}
        onRemove={handleRemoveAvatar}
        uploading={uploading}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-warm-text mb-1">昵称 *</label>
          <input
            {...register('nickname', { required: '请输入昵称' })}
            className="w-full px-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm transition-colors"
            placeholder="平时怎么称呼？"
          />
          {errors.nickname && <p className="text-xs text-red-400 mt-1">{errors.nickname.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-text mb-1">名字</label>
          <input
            {...register('name')}
            className="w-full px-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm transition-colors"
            placeholder="输入名字（选填）"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-text mb-1">认识日期 *</label>
        <DatePicker
          value={watch('met_date')}
          onChange={(v) => setValue('met_date', v)}
          required
        />
        {errors.met_date && <p className="text-xs text-red-400 mt-1">{errors.met_date.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-text mb-1">关系状态</label>
          <select
            {...register('relationship')}
            className="w-full px-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm transition-colors"
          >
            <option value="close">亲密好友</option>
            <option value="regular">常联系</option>
            <option value="occasional">偶尔联系</option>
            <option value="lost">已失联</option>
          </select>
        </div>

      <div>
        <label className="block text-sm font-medium text-warm-text mb-1">生日（选填）</label>
        <DatePicker
          value={watch('birthday') || ''}
          onChange={(v) => setValue('birthday', v)}
        />
        <p className="text-xs text-warm-muted mt-1">快到时会提醒你</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-text mb-1">认识地点</label>
        <LocationSearch
          placeholder="在哪里认识的？（如：王者荣耀 / 上海XX咖啡馆）"
          value={watch('met_place_name') || ''}
          onChange={(name, lat, lng) => {
            setValue('met_place_name', name);
            if (lat !== undefined) setValue('met_place_lat', lat);
            if (lng !== undefined) setValue('met_place_lng', lng);
          }}
        />
        <p className="text-xs text-warm-muted mt-1">支持输入虚拟地点或搜索真实位置</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-text mb-1">所在地（选填）</label>
        <LocationSearch
          placeholder="现在在哪座城市？"
          value={watch('current_location_name') || ''}
          onChange={(name, lat, lng) => {
            setValue('current_location_name', name);
            if (lat !== undefined) setValue('current_location_lat', lat);
            if (lng !== undefined) setValue('current_location_lng', lng);
          }}
        />
        <p className="text-xs text-warm-muted mt-1">对网友很有用，选填</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-text mb-1">相识故事 *</label>
        <textarea
          {...register('met_story', { required: '请写下相识故事' })}
          rows={4}
          className="w-full px-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm transition-colors resize-none"
          placeholder="写下你们相识的故事..."
        />
        {errors.met_story && <p className="text-xs text-red-400 mt-1">{errors.met_story.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-text mb-2">标签</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map(tag => (
            <TagBadge key={tag} tag={tag} onRemove={() => removeTag(tag)} />
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            className="flex-1 px-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm transition-colors"
            placeholder="输入标签后按回车"
          />
          <button type="button" onClick={addTag} className="px-3 py-2 rounded-btn bg-warm-primaryLight text-warm-primary text-sm hover:bg-warm-primaryLight/80 transition-colors">
            添加
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {TAGS_SUGGESTIONS.filter(t => !tags.includes(t)).slice(0, 8).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setValue('tags', [...tags, t])}
              className="text-xs text-warm-muted hover:text-warm-primary hover:bg-warm-primaryLight/30 px-2 py-1 rounded-full transition-colors"
            >
              + {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-btn border border-warm-border hover:bg-warm-bg transition-colors text-sm"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-btn bg-warm-primary text-white hover:bg-warm-primary/90 transition-colors text-sm disabled:opacity-50"
        >
          {isSubmitting ? '保存中...' : friend ? '保存修改' : '添加朋友'}
        </button>
      </div>
    </form>
  );
}
