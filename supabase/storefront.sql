-- Additive migration. Run in the existing Supabase project before enabling checkout.
create table if not exists public.creator_codes (
  id uuid primary key,
  code text not null unique check (code ~ '^[A-Z0-9_-]{1,40}$'),
  creator_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.creator_codes enable row level security;
revoke all on public.creator_codes from anon, authenticated;
grant all on public.creator_codes to service_role;

create table if not exists public.storefront_orders (
  id uuid primary key,
  created_at timestamptz not null default now(),
  request_fingerprint text not null,
  quote jsonb not null,
  customer jsonb not null,
  flavors text not null,
  delivery_method text not null,
  pickup_address text not null,
  shipping_quoted_at timestamptz,
  creator_id uuid references public.creator_codes(id),
  commission_cents integer not null default 0 check (commission_cents >= 0),
  commission_status text not null default 'none' check (commission_status in ('none','pending_fulfilment','void')),
  status text not null check (status in ('awaiting_shipping','creating','pending','review','paid','refunded','canceled')),
  callback_hash text,
  checkout_url text,
  paid_at timestamptz,
  transaction_nsu text unique
);
create index if not exists storefront_orders_created_idx on public.storefront_orders (created_at desc);
alter table public.storefront_orders enable row level security;
revoke all on public.storefront_orders from anon, authenticated;
grant all on public.storefront_orders to service_role;
-- No public read policies: the public site uses server endpoints. Commission
-- snapshots are pending fulfilment, never an automatic payout instruction.
