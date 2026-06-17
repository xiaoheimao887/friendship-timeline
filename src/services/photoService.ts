import { supabase } from '../lib/supabase';
import type { Photo } from '../types';

const BUCKET = 'photos';

export async function fetchPhotos(friendId: string): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('friend_id', friendId)
    .order('taken_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchAllPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('taken_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function uploadPhoto(
  friendId: string,
  file: File,
  caption: string,
  takenAt: string,
): Promise<Photo> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('photos')
    .insert([{
      friend_id: friendId,
      url: urlData.publicUrl,
      caption: caption || null,
      taken_at: takenAt,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePhoto(photo: Photo): Promise<void> {
  const urlPart = photo.url.split('/').pop()?.split('?')[0];
  if (urlPart) {
    await supabase.storage.from(BUCKET).remove([urlPart]);
  }
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photo.id);
  if (error) throw error;
}
