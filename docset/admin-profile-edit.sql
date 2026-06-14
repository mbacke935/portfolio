-- Autoriser un utilisateur authentifie a gerer le profil public.
-- A executer dans Supabase SQL Editor.
-- Hypothese actuelle: seuls les comptes admin existent dans Supabase Auth.

drop policy if exists "Authenticated can insert profiles" on public.profiles;
create policy "Authenticated can insert profiles"
on public.profiles
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update profiles" on public.profiles;
create policy "Authenticated can update profiles"
on public.profiles
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete profiles" on public.profiles;
create policy "Authenticated can delete profiles"
on public.profiles
for delete
to authenticated
using (true);
