import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriendStore } from '../store/useFriendStore';
import { fetchAllPhotos, deletePhoto } from '../services/photoService';
import { FriendAvatar } from '../components/avatar/FriendAvatar';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/ToastProvider';
import type { Photo } from '../types';

export function PhotoWallPage() {
  const friends = useFriendStore(s => s.friends);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [deleting, setDeleting] = useState<Photo | null>(null);
  const [filterId, setFilterId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setPhotos(await fetchAllPhotos());
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filterId ? photos.filter(p => p.friend_id === filterId) : photos;

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deletePhoto(deleting);
      showToast('已删除');
      setDeleting(null);
      load();
    } catch {
      showToast('删除失败', 'error');
    }
  };

  const lbIdx = lightbox ? filtered.indexOf(lightbox) : -1;
  const goLightbox = (dir: -1 | 1) => {
    if (!lightbox || filtered.length === 0) return;
    const newIdx = (lbIdx + dir + filtered.length) % filtered.length;
    setLightbox(filtered[newIdx]);
  };

  const getFriendNickname = (friendId: string) => {
    return friends.find(f => f.id === friendId)?.nickname || '未知';
  };

  const getFriendAvatar = (friendId: string) => {
    return friends.find(f => f.id === friendId);
  };

  if (!useFriendStore.getState().initialized || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-warm-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-warm-text">照片墙</h1>
          <p className="text-sm text-warm-muted">
            共 {filtered.length} 张照片
            {filterId && ` · ${getFriendNickname(filterId)}`}
          </p>
        </div>
        {/* Friend filter */}
        <select
          value={filterId || ''}
          onChange={e => setFilterId(e.target.value || null)}
          className="px-3 py-1.5 rounded-btn border border-warm-border bg-white text-sm focus:outline-none"
        >
          <option value="">全部朋友</option>
          {friends.map(f => (
            <option key={f.id} value={f.id}>{f.nickname}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-5xl mb-4">🖼</div>
          <p className="text-warm-muted text-sm">
            {photos.length === 0 ? '还没有照片，在朋友详情页添加吧' : '该朋友没有照片'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map(p => {
            const friend = getFriendAvatar(p.friend_id);
            return (
              <div key={p.id} className="group relative bg-white rounded-card shadow-card-sm overflow-hidden cursor-pointer">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.url}
                    alt={p.caption || ''}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onClick={() => setLightbox(p)}
                  />
                </div>
                <div className="p-2.5">
                  <div className="flex items-center gap-1.5">
                    {friend && <FriendAvatar friend={friend} size="sm" />}
                    <span
                      className="text-xs text-warm-primary hover:underline cursor-pointer"
                      onClick={() => navigate(`/friends/${p.friend_id}`)}
                    >
                      {getFriendNickname(p.friend_id)}
                    </span>
                  </div>
                  {p.caption && (
                    <p className="text-xs text-warm-muted mt-1 truncate">{p.caption}</p>
                  )}
                  <p className="text-[10px] text-warm-muted/60 mt-1">{p.taken_at}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleting(p); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/40 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white text-2xl hover:opacity-70 z-10"
          >
            ✕
          </button>
          {filtered.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goLightbox(-1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:opacity-70 z-10"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goLightbox(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:opacity-70 z-10"
              >
                ›
              </button>
            </>
          )}
          <img
            src={lightbox.url}
            alt={lightbox.caption || ''}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.caption && (
            <p className="absolute bottom-16 text-white/80 text-sm">{lightbox.caption}</p>
          )}
          <p className="absolute bottom-10 text-white/50 text-xs">{getFriendNickname(lightbox.friend_id)} · {lightbox.taken_at}</p>
          <p className="absolute bottom-4 text-white/30 text-xs">{filtered.indexOf(lightbox) + 1} / {filtered.length}</p>
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="删除照片"
        message="确定要删除这张照片吗？"
      />
    </div>
  );
}
