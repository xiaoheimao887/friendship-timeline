import { supabase } from '../lib/supabase';
import type { Thought } from '../types';

export async function fetchThoughts(friendId: string): Promise<Thought[]> {
  const { data, error } = await supabase
    .from('thoughts')
    .select('*')
    .eq('friend_id', friendId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createThought(friendId: string, content: string): Promise<Thought> {
  const { data, error } = await supabase
    .from('thoughts')
    .insert([{ friend_id: friendId, content, created_at: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteThought(id: string): Promise<void> {
  const { error } = await supabase
    .from('thoughts')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
