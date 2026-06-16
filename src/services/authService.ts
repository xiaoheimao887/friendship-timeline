import { supabase } from '../lib/supabase';

export async function getAuthByPinHash(pinHash: string): Promise<{pin_hash: string, pin_key_hash: string} | null> {
  const { data } = await supabase
    .from('auth')
    .select('*',)
    .eq('pin_hash', pinHash)
    .maybeSingle();
  return data;
}

export async function createAuth(params: { pin_hash: string; pin_key_hash: string }): Promise<void> {
  const { error } = await supabase
    .from('auth')
    .insert([params]);
  if (error) throw error;
}

export async function updatePinKeyHash(pinHash: string, pinKeyHash: string): Promise<void> {
  const { error } = await supabase
    .from('auth')
    .update({ pin_key_hash: pinKeyHash })
    .eq('pin_hash', pinHash);
  if (error) throw error;
}
