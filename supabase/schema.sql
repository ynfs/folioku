-- Skema database Folioku untuk Supabase.
-- Jalankan sekali di Supabase Dashboard → SQL Editor.

-- ---------- users: profil dan peran ----------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now()
);

-- Buat baris profil otomatis saat ada akun baru di Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- templates: untuk panel admin (tahap 2) ----------
-- Template bawaan MVP disimpan sebagai file JSON di folder /templates.
create table if not exists public.templates (
  id text primary key,
  name text not null,
  category text not null,
  tags text[] not null default '{}',
  thumbnail text,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- ---------- projects: salinan template milik klien ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users (id) on delete cascade,
  template_id text not null,
  name text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_owner_idx on public.projects (owner_id, updated_at desc);

-- ---------- publications: slug publik dan status publish ----------
create table if not exists public.publications (
  project_id uuid primary key references public.projects (id) on delete cascade,
  owner_id uuid not null references public.users (id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$'),
  published boolean not null default true,
  published_at timestamptz not null default now()
);

-- ---------- assets: gambar yang diunggah klien ----------
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users (id) on delete cascade,
  path text not null,
  url text not null,
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.users enable row level security;
alter table public.templates enable row level security;
alter table public.projects enable row level security;
alter table public.publications enable row level security;
alter table public.assets enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin');
$$;

-- users: lihat profil sendiri; nama pemilik portofolio terbit boleh dibaca publik
drop policy if exists users_self on public.users;
create policy users_self on public.users for select
  using (id = auth.uid() or public.is_admin()
         or exists (select 1 from public.publications p where p.owner_id = users.id and p.published));
drop policy if exists users_update_self on public.users;
create policy users_update_self on public.users for update
  using (id = auth.uid()) with check (id = auth.uid());
-- Klien hanya boleh mengubah nama, bukan peran.
revoke update on public.users from anon, authenticated;
grant update (name) on public.users to authenticated;

-- templates: semua orang boleh membaca, hanya admin yang mengubah
drop policy if exists templates_read on public.templates;
create policy templates_read on public.templates for select using (true);
drop policy if exists templates_admin on public.templates;
create policy templates_admin on public.templates for all using (public.is_admin()) with check (public.is_admin());

-- projects: pemilik penuh; publik boleh membaca proyek yang terbit
drop policy if exists projects_owner on public.projects;
create policy projects_owner on public.projects for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists projects_public on public.projects;
create policy projects_public on public.projects for select
  using (exists (select 1 from public.publications p where p.project_id = projects.id and p.published));
drop policy if exists projects_admin on public.projects;
create policy projects_admin on public.projects for select using (public.is_admin());

-- publications: pemilik penuh; publik boleh membaca yang terbit
drop policy if exists publications_owner on public.publications;
create policy publications_owner on public.publications for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid()
              and exists (select 1 from public.projects pr where pr.id = project_id and pr.owner_id = auth.uid()));
drop policy if exists publications_public on public.publications;
create policy publications_public on public.publications for select using (published);

-- assets: hanya pemilik
drop policy if exists assets_owner on public.assets;
create policy assets_owner on public.assets for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- ---------- Storage: bucket publik "assets" ----------
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

drop policy if exists "assets upload own folder" on storage.objects;
create policy "assets upload own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'assets' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "assets delete own" on storage.objects;
create policy "assets delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'assets' and (storage.foldername(name))[1] = auth.uid()::text);
