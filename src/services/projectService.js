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

export async function getAdminProjects() {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .select(projectSelect)
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

export async function saveProject(project) {
  const payload = {
    title: project.title.trim(),
    slug: project.slug.trim(),
    short_description: project.short_description.trim(),
    full_description: project.full_description?.trim() || null,
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : String(project.technologies ?? '')
          .split(',')
          .map((technology) => technology.trim())
          .filter(Boolean),
    github_url: project.github_url?.trim() || null,
    demo_url: project.demo_url?.trim() || null,
    cover_image: project.cover_image?.trim() || null,
    gallery: Array.isArray(project.gallery)
      ? project.gallery
      : String(project.gallery ?? '')
          .split(',')
          .map((image) => image.trim())
          .filter(Boolean),
    status: project.status || 'draft',
    featured: Boolean(project.featured),
    display_order: Number(project.display_order) || 0,
  };

  const { data, error } = await getSupabaseClient()
    .from('projects')
    .upsert(project.id ? { ...payload, id: project.id } : payload)
    .select(projectSelect)
    .single();

  throwIfError(error);
  return data;
}

export async function deleteProject(id) {
  const { error } = await getSupabaseClient().from('projects').delete().eq('id', id);

  throwIfError(error);
}
