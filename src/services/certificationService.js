import { getSupabaseClient } from '../lib/supabaseClient.js';

export async function getCertifications() {
  const { data, error } = await getSupabaseClient()
    .from('certifications')
    .select('id, title, issuer, issue_date, credential_url, display_order')
    .order('display_order', { ascending: true })
    .order('issue_date', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function saveCertification(certification) {
  const payload = {
    title: certification.title.trim(),
    issuer: certification.issuer.trim(),
    issue_date: certification.issue_date || null,
    credential_url: certification.credential_url?.trim() || null,
    display_order: Number(certification.display_order) || 0,
  };

  const { data, error } = await getSupabaseClient()
    .from('certifications')
    .upsert(certification.id ? { ...payload, id: certification.id } : payload)
    .select('id, title, issuer, issue_date, credential_url, display_order')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCertification(id) {
  const { error } = await getSupabaseClient()
    .from('certifications')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
