-- Skema database Safantara untuk Supabase.
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
  -- Akun pertama yang mendaftar otomatis menjadi admin.
  insert into public.users (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    case when exists (select 1 from public.users) then 'client' else 'admin' end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- templates: template buatan admin ----------
-- Template bawaan disimpan sebagai file JSON di folder /templates.
-- Kolom data berisi { theme, sections }.
create table if not exists public.templates (
  id text primary key,
  name text not null,
  category text not null,
  tags text[] not null default '{}',
  thumbnail text,
  data jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.templates add column if not exists description text not null default '';
alter table public.templates add column if not exists published boolean not null default false;
alter table public.templates add column if not exists created_by uuid references public.users (id) on delete set null;
alter table public.templates add column if not exists updated_at timestamptz not null default now();
alter table public.templates add column if not exists kind text not null default 'portfolio';
alter table public.templates drop constraint if exists templates_kind_check;
alter table public.templates add constraint templates_kind_check check (kind in ('portfolio', 'invitation', 'proposal'));
alter table public.templates add column if not exists style text;

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
alter table public.projects add column if not exists kind text not null default 'portfolio';
alter table public.projects drop constraint if exists projects_kind_check;
alter table public.projects add constraint projects_kind_check check (kind in ('portfolio', 'invitation', 'proposal'));

-- ---------- publications: slug publik dan status publish ----------
create table if not exists public.publications (
  project_id uuid primary key references public.projects (id) on delete cascade,
  owner_id uuid not null references public.users (id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$'),
  published boolean not null default true,
  published_at timestamptz not null default now()
);

-- ---------- rsvps: konfirmasi kehadiran & ucapan tamu undangan ----------
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  attendance text not null check (attendance in ('hadir', 'tidak', 'ragu')),
  guests int not null default 1 check (guests between 1 and 10),
  message text not null default '' check (char_length(message) <= 500),
  created_at timestamptz not null default now()
);
create index if not exists rsvps_project_idx on public.rsvps (project_id, created_at desc);

-- ---------- assets: gambar yang diunggah klien ----------
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users (id) on delete cascade,
  path text not null,
  url text not null,
  created_at timestamptz not null default now()
);

-- ---------- orders: pesanan paket berbayar (pembayaran DANA) ----------
-- Hak akses paket dihitung dari pesanan berstatus 'lunas', yang hanya bisa diubah admin.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  plan text not null check (plan in ('basic', 'premium', 'upgrade-premium', 'pro-bulanan', 'pro-tahunan')),
  project_id uuid references public.projects (id) on delete set null,
  unique_code int not null check (unique_code between 1 and 299),
  status text not null default 'menunggu' check (status in ('menunggu', 'diperiksa', 'lunas', 'ditolak')),
  proof_url text not null default '',
  sender_name text not null default '' check (char_length(sender_name) <= 80),
  note text not null default '' check (char_length(note) <= 300),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references public.users (id) on delete set null
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

-- Waktu terbit pertama tidak bisa diubah pengguna (dasar masa aktif paket gratis).
create or replace function public.keep_published_at()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    new.published_at := now();
  else
    new.published_at := old.published_at;
  end if;
  return new;
end;
$$;
drop trigger if exists publications_keep_published_at on public.publications;
create trigger publications_keep_published_at
  before insert or update on public.publications
  for each row execute function public.keep_published_at();

-- Template asal proyek tidak bisa diganti setelah dibuat (dasar cek template premium).
create or replace function public.keep_template_id()
returns trigger language plpgsql as $$
begin
  new.template_id := old.template_id;
  return new;
end;
$$;
drop trigger if exists projects_keep_template_id on public.projects;
create trigger projects_keep_template_id
  before update on public.projects
  for each row execute function public.keep_template_id();

-- Hak akses halaman terbit untuk pengunjung (tanpa membuka tabel orders ke publik).
create or replace function public.publication_access(p_slug text)
returns json language sql stable security definer set search_path = public as $$
  select json_build_object(
    'project_id', p.project_id,
    'published_at', p.published_at,
    'owner_role', u.role,
    'orders', coalesce((
      select json_agg(json_build_object('plan', o.plan, 'project_id', o.project_id, 'approved_at', o.approved_at))
      from public.orders o
      where o.user_id = p.owner_id and o.status = 'lunas' and o.approved_at is not null
        and (o.project_id = p.project_id or o.plan like 'pro-%')
    ), '[]'::json))
  from public.publications p join public.users u on u.id = p.owner_id
  where p.slug = p_slug and p.published;
$$;
grant execute on function public.publication_access(text) to anon, authenticated;

-- Untuk menjadikan akun kamu admin, jalankan:
--   update public.users set role = 'admin' where id = (select id from auth.users where email = 'email@kamu.com');

-- ---------- Row Level Security ----------
alter table public.users enable row level security;
alter table public.templates enable row level security;
alter table public.projects enable row level security;
alter table public.publications enable row level security;
alter table public.assets enable row level security;
alter table public.rsvps enable row level security;
alter table public.orders enable row level security;

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

-- templates: semua orang boleh membaca yang terbit, hanya admin yang mengubah
drop policy if exists templates_read on public.templates;
create policy templates_read on public.templates for select using (published or public.is_admin());
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

-- publications: pemilik boleh membaca/menambah/mengubah (tidak menghapus, agar masa aktif
-- gratis tidak bisa direset); terhapus otomatis bila proyeknya dihapus.
drop policy if exists publications_owner on public.publications;
drop policy if exists publications_owner_select on public.publications;
create policy publications_owner_select on public.publications for select using (owner_id = auth.uid());
drop policy if exists publications_owner_insert on public.publications;
create policy publications_owner_insert on public.publications for insert
  with check (owner_id = auth.uid()
              and exists (select 1 from public.projects pr where pr.id = project_id and pr.owner_id = auth.uid()));
drop policy if exists publications_owner_update on public.publications;
create policy publications_owner_update on public.publications for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid()
              and exists (select 1 from public.projects pr where pr.id = project_id and pr.owner_id = auth.uid()));
drop policy if exists publications_public on public.publications;
create policy publications_public on public.publications for select using (published);

-- rsvps: siapa pun boleh mengisi & membaca ucapan undangan yang terbit; pemilik boleh menghapus
drop policy if exists rsvps_insert_public on public.rsvps;
create policy rsvps_insert_public on public.rsvps for insert
  with check (exists (select 1 from public.publications p where p.project_id = rsvps.project_id and p.published));
drop policy if exists rsvps_read on public.rsvps;
-- Ucapan undangan boleh dibaca publik; respon proposal hanya untuk pemilik.
create policy rsvps_read on public.rsvps for select
  using (exists (select 1 from public.publications p join public.projects pr on pr.id = p.project_id
                 where p.project_id = rsvps.project_id and p.published and pr.kind <> 'proposal')
         or exists (select 1 from public.projects pr where pr.id = rsvps.project_id and pr.owner_id = auth.uid()));
drop policy if exists rsvps_owner_delete on public.rsvps;
create policy rsvps_owner_delete on public.rsvps for delete
  using (exists (select 1 from public.projects pr where pr.id = rsvps.project_id and pr.owner_id = auth.uid()));

-- orders: pemilik membuat pesanan berstatus 'menunggu' dan mengirim bukti (status 'diperiksa');
-- hanya admin yang bisa menandai 'lunas' / 'ditolak'.
drop policy if exists orders_read on public.orders;
create policy orders_read on public.orders for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists orders_insert_own on public.orders;
create policy orders_insert_own on public.orders for insert
  with check (user_id = auth.uid() and status = 'menunggu' and approved_at is null and approved_by is null
              and proof_url = '' and note = ''
              and (project_id is null or exists (select 1 from public.projects pr where pr.id = project_id and pr.owner_id = auth.uid())));
drop policy if exists orders_proof_own on public.orders;
create policy orders_proof_own on public.orders for update
  using (user_id = auth.uid() and status in ('menunggu', 'diperiksa', 'ditolak'))
  with check (user_id = auth.uid() and status = 'diperiksa' and approved_at is null and approved_by is null);
drop policy if exists orders_admin on public.orders;
create policy orders_admin on public.orders for all using (public.is_admin()) with check (public.is_admin());
-- Kolom yang boleh diubah lewat API; paket, proyek & kode unik tidak bisa diganti.
revoke update on public.orders from anon, authenticated;
grant update (proof_url, sender_name, status, note, approved_at, approved_by) on public.orders to authenticated;

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
