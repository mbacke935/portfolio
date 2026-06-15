-- Ajouter une image publique aux certificats.
-- A executer dans Supabase SQL Editor.

alter table public.certifications
add column if not exists image_url text;
