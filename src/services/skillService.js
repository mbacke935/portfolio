import { supabase } from '../lib/supabaseClient.js';

export async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('id, name, category, level, icon, display_order')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}
