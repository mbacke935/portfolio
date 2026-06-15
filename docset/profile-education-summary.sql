-- Ajouter le texte de parcours scolaire et universitaire au profil public.
-- A executer dans Supabase SQL Editor.

alter table public.profiles
add column if not exists education_summary text;
