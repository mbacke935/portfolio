import { getSupabaseClient } from '../lib/supabaseClient.js';

const projectSelect = `
  id,
  title,
  slug,
  short_description,
  full_description,
  technologies,
  github_url,
  demo_url,
  cover_image,
  gallery,
  status,
  featured,
  display_order,
  created_at,
  updated_at
`;

function throwIfError(error) {
  if (error) {
    throw error;
  }
}

export async function getProjects() {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .select(projectSelect)
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  throwIfError(error);
  return data ?? [];
}

export async function getFeaturedProjects() {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .select(projectSelect)
    .eq('status', 'published')
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  throwIfError(error);
  return data ?? [];
}

export async function getProjectBySlug(slug) {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .select(projectSelect)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();

  throwIfError(error);
  return data;
}
