import { getSupabaseClient } from '../lib/supabaseClient.js';

export async function getSkills() {
  const { data, error } = await getSupabaseClient()
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

export async function saveSkill(skill) {
  const payload = {
    name: skill.name.trim(),
    category: skill.category.trim(),
    icon: skill.icon?.trim() || null,
    display_order: Number(skill.display_order) || 0,
  };

  const { data, error } = await getSupabaseClient()
    .from('skills')
    .upsert(skill.id ? { ...payload, id: skill.id } : payload)
    .select('id, name, category, level, icon, display_order')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteSkill(id) {
  const { error } = await getSupabaseClient().from('skills').delete().eq('id', id);

  if (error) {
    throw error;
  }
}
