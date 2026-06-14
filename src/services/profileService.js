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
