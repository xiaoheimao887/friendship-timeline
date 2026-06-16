import { supabase } from '../lib/supabase';
import type { Friend, FriendFormData } from '../types';

export async function fetchFriends(pinHash: string): Promise<Friend[]> {
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .eq('pin_hash', pinHash)
    .order('met_date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchFriend(id: string): Promise<Friend | null> {
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createFriend(friend: FriendFormData & { pin_hash: string }): Promise<Friend> {
  const { data, error } = await supabase
    .from('friends')
    .insert([{ ...friend, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateFriend(id: string, updates: Partial<FriendFormData>): Promise<Friend> {
  const { data, error } = await supabase
    .from('friends')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteFriend(id: string): Promise<void> {
  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function uploadAvatar(
  file: File,
  fileName: string
): Promise<string> {
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
  return urlData.publicUrl;
}

export async function deleteAvatar(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('avatars')
    .remove([path]);
  if (error) throw error;
}
