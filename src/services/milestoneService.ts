import { supabase } from '../lib/supabase';
import type { Milestone, MilestoneFormData } from '../types';

export async function fetchMilestones(friendId: string): Promise<Milestone[]> {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('friend_id', friendId)
    .order('date', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createMilestone(
  friendId: string,
  milestone: MilestoneFormData
): Promise<Milestone> {
  const { data, error } = await supabase
    .from('milestones')
    .insert([{ ...milestone, friend_id: friendId, created_at: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMilestone(
  id: string,
  updates: Partial<MilestoneFormData>
): Promise<Milestone> {
  const { data, error } = await supabase
    .from('milestones')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMilestone(id: string): Promise<void> {
  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
