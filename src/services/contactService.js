import { supabase } from '../lib/supabaseClient.js';

export async function submitContactMessage({ name, email, subject, message }) {
  const payload = {
    name: name?.trim(),
    email: email?.trim(),
    subject: subject?.trim() || null,
    message: message?.trim(),
  };

  const { data, error } = await supabase
    .from('contacts')
    .insert(payload)
    .select('id, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}
