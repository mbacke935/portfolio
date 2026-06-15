-- Ajouter des reseaux sociaux personnalisables au profil public.
-- A executer dans Supabase SQL Editor si le projet existe deja.

alter table public.profiles
add column if not exists social_links jsonb not null default '[]'::jsonb;
