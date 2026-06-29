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
    if (error.message?.toLowerCase().includes('bucket not found')) {
      throw new Error(
        `Le bucket Storage "${PROFILE_BUCKET}" est introuvable. Execute docset/admin-storage.sql dans Supabase SQL Editor.`,
      );
    }

    throw error;
  }

  const { data } = getSupabaseClient().storage
    .from(PROFILE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function uploadProjectCoverImage(file, userId) {
  const extension = getFileExtension(file.name);
  const filePath = `${userId}/projects/cover-${Date.now()}.${extension}`;

  const { error } = await getSupabaseClient().storage
    .from(PROFILE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    if (error.message?.toLowerCase().includes('bucket not found')) {
      throw new Error(
        `Le bucket Storage "${PROFILE_BUCKET}" est introuvable. Execute docset/admin-storage.sql dans Supabase SQL Editor.`,
      );
    }

    throw error;
  }

  const { data } = getSupabaseClient().storage
    .from(PROFILE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function uploadCertificationImage(file, userId) {
  const extension = getFileExtension(file.name);
  const filePath = `${userId}/certifications/certification-${Date.now()}.${extension}`;

  const { error } = await getSupabaseClient().storage
    .from(PROFILE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    if (error.message?.toLowerCase().includes('bucket not found')) {
      throw new Error(
        `Le bucket Storage "${PROFILE_BUCKET}" est introuvable. Execute docset/admin-storage.sql dans Supabase SQL Editor.`,
      );
    }

    throw error;
  }

  const { data } = getSupabaseClient().storage
    .from(PROFILE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
