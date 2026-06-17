import { supabase } from '../lib/supabase';
import type { Connection } from '../types';

export async function fetchConnections(friendId: string): Promise<Connection[]> {
  const { data } = await supabase
    .from('connections')
    .select('*')
    .or(`friend_id_a.eq.${friendId},friend_id_b.eq.${friendId}`)
    .order('created_at');
  return data || [];
}

export async function fetchAllConnections(friendIds: string[]): Promise<Connection[]> {
  if (friendIds.length === 0) return [];
  const { data } = await supabase
    .from('connections')
    .select('*')
    .in('friend_id_a', friendIds)
    .in('friend_id_b', friendIds);
  return data || [];
}

export async function createConnection(
  friendIdA: string,
  friendIdB: string,
  relationType: string
): Promise<Connection> {
  const { data, error } = await supabase
    .from('connections')
    .insert([{ friend_id_a: friendIdA, friend_id_b: friendIdB, relation_type: relationType, created_at: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteConnection(id: string): Promise<void> {
  const { error } = await supabase.from('connections').delete().eq('id', id);
  if (error) throw error;
}
