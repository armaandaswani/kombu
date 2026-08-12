-- Kombu production setup
-- Run this in Supabase SQL Editor once for the project used by Vercel.

create extension if not exists pgcrypto;

create table if not exists public.app_state (
  id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);

create index if not exists app_state_updated_at_idx on public.app_state (updated_at desc);

alter table public.app_state enable row level security;

-- The application reads/writes this table only through Vercel serverless functions
-- using SUPABASE_SERVICE_ROLE_KEY. No browser/client policy is intentionally added.

-- Periodic snapshots of app_state. Written automatically by replaceAppState at
-- most once a day; pruned to the last 30 days. This is the only automated backup
-- the application has, and it exists because the single app_state row holds the
-- entire business: one bad write with no snapshot is unrecoverable.
create table if not exists public.app_state_backups (
  id bigint generated always as identity primary key,
  state_id text not null,
  state jsonb not null,
  source_updated_at timestamptz,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists app_state_backups_created_idx on public.app_state_backups (state_id, created_at desc);

alter table public.app_state_backups enable row level security;

-- Durable archive of the audit trail. The trail lives inside the app_state
-- document and is capped there, so entries are lost as soon as the cap is
-- reached; a single reconciliation can push one entry per changed order line.
-- This table keeps them permanently. The document remains the source of truth
-- for the admin UI; this is written alongside it, never instead of it.
-- dedupe_key makes re-sending the same entries a no-op.
create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  state_id text not null default 'production',
  dedupe_key text not null unique,
  at timestamptz,
  actor text,
  action text,
  detail text,
  entry jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_events_at_idx on public.audit_events (state_id, at desc);

alter table public.audit_events enable row level security;

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  reference_id text,
  recipient text not null,
  subject text not null,
  provider text not null default 'resend',
  provider_id text,
  status text not null default 'sent',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists email_events_reference_idx on public.email_events (event_type, reference_id, created_at desc);

alter table public.email_events enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public-media',
  'public-media',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public media can be viewed" on storage.objects;
create policy "Public media can be viewed"
on storage.objects
for select
using (bucket_id = 'public-media');

-- Writes to storage are made server-side with the service role key.
