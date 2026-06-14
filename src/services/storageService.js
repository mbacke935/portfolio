import { getSupabaseClient } from '../lib/supabaseClient.js';

const PROFILE_BUCKET = 'profile-assets';

function getFileExtension(fileName) {
  return fileName.split('.').pop()?.toLowerCase() || 'jpg';
}

export async function uploadProfilePhoto(file, userId) {
  const extension = getFileExtension(file.name);
  const filePath = `${userId}/hero-photo-${Date.now()}.${extension}`;

  const { error } = await getSupabaseClient().storage
    .from(PROFILE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data } = getSupabaseClient().storage
    .from(PROFILE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
