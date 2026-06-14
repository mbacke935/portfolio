import { supabase } from '../lib/supabaseClient.js';

export async function getCertifications() {
  const { data, error } = await supabase
    .from('certifications')
    .select('id, title, issuer, issue_date, credential_url, display_order')
    .order('display_order', { ascending: true })
    .order('issue_date', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
