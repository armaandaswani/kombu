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
