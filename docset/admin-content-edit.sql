-- Autoriser l'admin authentifie a gerer competences, diplomes et certificats.
-- A executer dans Supabase SQL Editor.
-- Remplace l'email si le compte admin change.

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.email(), '')) = 'mbackem500@gmail.com';
$$;

alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.certifications enable row level security;

drop policy if exists "Admin can insert skills" on public.skills;
create policy "Admin can insert skills"
on public.skills
for insert
to authenticated
with check (public.is_portfolio_admin());

drop policy if exists "Admin can update skills" on public.skills;
create policy "Admin can update skills"
on public.skills
for update
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Admin can delete skills" on public.skills;
create policy "Admin can delete skills"
on public.skills
for delete
to authenticated
using (public.is_portfolio_admin());

drop policy if exists "Admin can insert education" on public.education;
create policy "Admin can insert education"
on public.education
for insert
to authenticated
with check (public.is_portfolio_admin());

drop policy if exists "Admin can update education" on public.education;
create policy "Admin can update education"
on public.education
for update
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Admin can delete education" on public.education;
create policy "Admin can delete education"
on public.education
for delete
to authenticated
using (public.is_portfolio_admin());

drop policy if exists "Admin can insert certifications" on public.certifications;
create policy "Admin can insert certifications"
on public.certifications
for insert
to authenticated
with check (public.is_portfolio_admin());

drop policy if exists "Admin can update certifications" on public.certifications;
create policy "Admin can update certifications"
on public.certifications
for update
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Admin can delete certifications" on public.certifications;
create policy "Admin can delete certifications"
on public.certifications
for delete
to authenticated
using (public.is_portfolio_admin());
