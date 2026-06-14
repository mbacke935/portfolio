import { getSupabaseClient } from '../lib/supabaseClient.js';

export async function getProfile() {
  const { data, error } = await getSupabaseClient()
    .from('profiles')
    .select(
      `
        id,
        name,
        title,
        bio,
        email,
        phone,
        location,
        avatar_url,
        cv_url,
        github_url,
        linkedin_url,
        website_url,
        created_at,
        updated_at
      `,
    )
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveProfile(profile) {
  const payload = {
    name: profile.name.trim(),
    title: profile.title.trim(),
    bio: profile.bio?.trim() || null,
    email: profile.email?.trim() || null,
    phone: profile.phone?.trim() || null,
    location: profile.location?.trim() || null,
    avatar_url: profile.avatar_url?.trim() || null,
    cv_url: profile.cv_url?.trim() || null,
    github_url: profile.github_url?.trim() || null,
    linkedin_url: profile.linkedin_url?.trim() || null,
    website_url: profile.website_url?.trim() || null,
  };

  const query = getSupabaseClient()
    .from('profiles')
    .upsert(profile.id ? { ...payload, id: profile.id } : payload)
    .select(
      `
        id,
        name,
        title,
        bio,
        email,
        phone,
        location,
        avatar_url,
        cv_url,
        github_url,
        linkedin_url,
        website_url,
        created_at,
        updated_at
      `,
    )
    .single();

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}
