import { getSupabaseClient } from '../lib/supabaseClient.js';

export async function getCurrentSession() {
  const { data, error } = await getSupabaseClient().auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export function onAuthStateChange(callback) {
  const { data } = getSupabaseClient().auth.onAuthStateChange(
    (_event, session) => {
      callback(session);
    },
  );

  return data.subscription;
}

export async function signInAdmin({ email, password }) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw error;
  }

  return data.session;
}

export async function signOutAdmin() {
  const { error } = await getSupabaseClient().auth.signOut();

  if (error) {
    throw error;
  }
}
