-- Portfolio React + Supabase
-- Phase 4: schema de base de donnees et regles RLS

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  bio text,
  education_summary text,
  email text,
  phone text,
  location text,
  avatar_url text,
  cv_url text,
  github_url text,
  linkedin_url text,
  website_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  full_description text,
  technologies text[] not null default '{}',
  github_url text,
  demo_url text,
  cover_image text,
  gallery text[] not null default '{}',
  status text not null default 'draft',
  featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_status_check check (status in ('draft', 'published', 'archived'))
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  level integer,
  icon text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint skills_level_check check (level is null or (level >= 0 and level <= 100))
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  start_date date,
  end_date date,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date date,
  credential_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists profiles_display_idx
  on public.profiles (created_at desc);

create index if not exists projects_slug_idx
  on public.projects (slug);

create index if not exists projects_public_listing_idx
  on public.projects (status, featured desc, display_order asc, created_at desc);

create index if not exists skills_category_order_idx
  on public.skills (category, display_order asc, name asc);

create index if not exists education_order_idx
  on public.education (display_order asc, start_date desc);

create index if not exists certifications_order_idx
  on public.certifications (display_order asc, issue_date desc);

create index if not exists contacts_created_at_idx
  on public.contacts (created_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_skills_updated_at on public.skills;
create trigger set_skills_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

drop trigger if exists set_education_updated_at on public.education;
create trigger set_education_updated_at
before update on public.education
for each row execute function public.set_updated_at();

drop trigger if exists set_certifications_updated_at on public.certifications;
create trigger set_certifications_updated_at
before update on public.certifications
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.certifications enable row level security;
alter table public.contacts enable row level security;

drop policy if exists "Public can read profiles" on public.profiles;
create policy "Public can read profiles"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public can read skills" on public.skills;
create policy "Public can read skills"
on public.skills
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read education" on public.education;
create policy "Public can read education"
on public.education
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read certifications" on public.certifications;
create policy "Public can read certifications"
on public.certifications
for select
to anon, authenticated
using (true);

drop policy if exists "Public can submit contact messages" on public.contacts;
create policy "Public can submit contact messages"
on public.contacts
for insert
to anon, authenticated
with check (
  length(trim(name)) >= 2
  and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  and length(trim(message)) >= 10
);

-- Aucune policy de lecture publique n'est creee sur contacts.
-- Les operations admin seront ajoutees apres mise en place de l'authentification.
