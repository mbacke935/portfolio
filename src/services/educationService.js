import { getSupabaseClient } from '../lib/supabaseClient.js';

export async function getEducation() {
  const { data, error } = await getSupabaseClient()
    .from('education')
    .select(
      'id, institution, degree, start_date, end_date, description, display_order',
    )
    .order('display_order', { ascending: true })
    .order('start_date', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function saveEducation(item) {
  const payload = {
    institution: item.institution.trim(),
    degree: item.degree.trim(),
    start_date: item.start_date || null,
    end_date: item.end_date || null,
    description: item.description?.trim() || null,
    display_order: Number(item.display_order) || 0,
  };

  const { data, error } = await getSupabaseClient()
    .from('education')
    .upsert(item.id ? { ...payload, id: item.id } : payload)
    .select('id, institution, degree, start_date, end_date, description, display_order')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteEducation(id) {
  const { error } = await getSupabaseClient().from('education').delete().eq('id', id);

  if (error) {
    throw error;
  }
}
