import { getSupabaseClient } from '../lib/supabaseClient.js';

const certificationSelect =
  'id, title, issuer, issue_date, credential_url, image_url, display_order';
const fallbackCertificationSelect =
  'id, title, issuer, issue_date, credential_url, display_order';

export async function getCertifications() {
  const { data, error } = await getSupabaseClient()
    .from('certifications')
    .select(certificationSelect)
    .order('display_order', { ascending: true })
    .order('issue_date', { ascending: false });

  if (error?.message?.includes('image_url')) {
    const { data: fallbackData, error: fallbackError } = await getSupabaseClient()
      .from('certifications')
      .select(fallbackCertificationSelect)
      .order('display_order', { ascending: true })
      .order('issue_date', { ascending: false });

    if (fallbackError) {
      throw fallbackError;
    }

    return fallbackData ?? [];
  }

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
    image_url: certification.image_url?.trim() || null,
    display_order: Number(certification.display_order) || 0,
  };

  let { data, error } = await getSupabaseClient()
    .from('certifications')
    .upsert(certification.id ? { ...payload, id: certification.id } : payload)
    .select(certificationSelect)
    .single();

  if (error?.message?.includes('image_url')) {
    if (payload.image_url) {
      throw new Error(
        'La colonne certifications.image_url est introuvable. Execute docset/certification-image.sql dans Supabase SQL Editor.',
      );
    }

    const { image_url: _imageUrl, ...fallbackPayload } = payload;
    const fallbackResult = await getSupabaseClient()
      .from('certifications')
      .upsert(
        certification.id
          ? { ...fallbackPayload, id: certification.id }
          : fallbackPayload,
      )
      .select(fallbackCertificationSelect)
      .single();

    data = fallbackResult.data;
    error = fallbackResult.error;
  }

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
