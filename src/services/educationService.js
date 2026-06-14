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
