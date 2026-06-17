import { useState, useEffect, useRef } from 'react';
import { fetchPhotos, uploadPhoto, deletePhoto } from '../../services/photoService';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../ui/ToastProvider';
import { DatePicker } from '../ui/DatePicker';
import type { Photo } from '../../types';

interface PhotoListProps {
  friendId: string;
}

export function PhotoList({ friendId }: PhotoListProps) {
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<Photo | null>(null);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      setPhotos(await fetchPhotos(friendId));
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [friendId]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('照片不能超过 10MB', 'error');
      return;
    }
    setUploading(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await uploadPhoto(friendId, file, '', today);
      showToast('已上传');
      load();
    } catch {
      showToast('上传失败', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

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

  const lbIdx = lightbox ? photos.indexOf(lightbox) : -1;
  const goLightbox = (dir: -1 | 1) => {
    if (!lightbox || photos.length === 0) return;
    const newIdx = (lbIdx + dir + photos.length) % photos.length;
    setLightbox(photos[newIdx]);
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider mb-3">照片</h2>
        <p className="text-sm text-warm-muted">加载中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-warm-muted uppercase tracking-wider">照片</h2>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="text-xs text-warm-primary hover:text-warm-primary/80 transition-colors disabled:opacity-50"
        >
          {uploading ? '上传中...' : '+ 添加照片'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {photos.length === 0 ? (
        <p className="text-sm text-warm-muted pl-4 border-l-2 border-warm-border py-2">
          还没有照片
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {photos.map(p => (
            <div key={p.id} className="group relative aspect-square rounded-lg overflow-hidden bg-warm-bg/60 cursor-pointer">
              <img
                src={p.url}
                alt={p.caption || ''}
                className="w-full h-full object-cover"
                loading="lazy"
                onClick={() => setLightbox(p)}
              />
              <button
                onClick={(e) => { e.stopPropagation(); setDeleting(p); }}
                className="absolute top-1 right-1 w-6 h-6 bg-black/40 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                ✕
              </button>
            </div>
          ))}
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
          {photos.length > 1 && (
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
            <p className="absolute bottom-6 text-white/80 text-sm">{lightbox.caption}</p>
          )}
          <p className="absolute bottom-2 text-white/50 text-xs">{photos.indexOf(lightbox) + 1} / {photos.length}</p>
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
