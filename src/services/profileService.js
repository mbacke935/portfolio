import { getSupabaseClient } from '../lib/supabaseClient.js';

const profileSelect = `
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
  social_links,
  created_at,
  updated_at
`;

const fallbackProfileSelect = `
  id,
  name,
  title,
  bio,
  education_summary,
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
`;

function normalizeSocialLinks(value) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item?.label && item?.url)
      .map((item) => ({
        label: String(item.label).trim(),
        url: String(item.url).trim(),
      }));
  }

  return String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...urlParts] = line.split('|');
      return {
        label: label?.trim(),
        url: urlParts.join('|').trim(),
      };
    })
    .filter((item) => item.label && item.url);
}

export async function getProfile() {
  const query = getSupabaseClient()
    .from('profiles')
    .select(profileSelect)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data, error } = await query;

  if (error?.message?.includes('education_summary') || error?.message?.includes('social_links')) {
    const { data: fallbackData, error: fallbackError } = await getSupabaseClient()
      .from('profiles')
      .select(fallbackProfileSelect)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (fallbackError) {
      throw fallbackError;
    }

    return fallbackData;
  }

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
    education_summary: profile.education_summary?.trim() || null,
    email: profile.email?.trim() || null,
    phone: profile.phone?.trim() || null,
    location: profile.location?.trim() || null,
    avatar_url: profile.avatar_url?.trim() || null,
    cv_url: profile.cv_url?.trim() || null,
    github_url: profile.github_url?.trim() || null,
    linkedin_url: profile.linkedin_url?.trim() || null,
    website_url: profile.website_url?.trim() || null,
    social_links: normalizeSocialLinks(profile.social_links),
  };

  let query = getSupabaseClient()
    .from('profiles')
    .upsert(profile.id ? { ...payload, id: profile.id } : payload)
    .select(profileSelect)
    .single();

  let { data, error } = await query;

  if (error?.message?.includes('education_summary') || error?.message?.includes('social_links')) {
    const {
      education_summary: _educationSummary,
      social_links: _socialLinks,
      ...fallbackPayload
    } = payload;

    query = getSupabaseClient()
      .from('profiles')
      .upsert(profile.id ? { ...fallbackPayload, id: profile.id } : fallbackPayload)
      .select(fallbackProfileSelect)
      .single();

    const fallbackResult = await query;
    data = fallbackResult.data;
    error = fallbackResult.error;
  }

  if (error) {
    throw error;
  }

  return data;
}
