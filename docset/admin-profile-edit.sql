-- Autoriser l'admin authentifie a gerer le profil public.
-- A executer dans Supabase SQL Editor.
-- Remplace l'email si le compte admin change.

alter table public.profiles enable row level security;

drop policy if exists "Public can read profiles" on public.profiles;
create policy "Public can read profiles"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert profiles" on public.profiles;
drop policy if exists "Admin can insert profiles" on public.profiles;
create policy "Admin can insert profiles"
on public.profiles
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'mbackem500@gmail.com');

drop policy if exists "Authenticated can update profiles" on public.profiles;
drop policy if exists "Admin can update profiles" on public.profiles;
create policy "Admin can update profiles"
on public.profiles
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'mbackem500@gmail.com')
with check ((auth.jwt() ->> 'email') = 'mbackem500@gmail.com');

drop policy if exists "Authenticated can delete profiles" on public.profiles;
drop policy if exists "Admin can delete profiles" on public.profiles;
create policy "Admin can delete profiles"
on public.profiles
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'mbackem500@gmail.com');
