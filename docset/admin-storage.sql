-- Configuration Supabase Storage pour les photos locales du hero.
-- A executer dans Supabase SQL Editor.

insert into storage.buckets (id, name, public)
values ('profile-assets', 'profile-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read profile assets" on storage.objects;
create policy "Public can read profile assets"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'profile-assets');

drop policy if exists "Authenticated can upload profile assets" on storage.objects;
create policy "Authenticated can upload profile assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'profile-assets');

drop policy if exists "Authenticated can update profile assets" on storage.objects;
create policy "Authenticated can update profile assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'profile-assets')
with check (bucket_id = 'profile-assets');

drop policy if exists "Authenticated can delete profile assets" on storage.objects;
create policy "Authenticated can delete profile assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'profile-assets');
