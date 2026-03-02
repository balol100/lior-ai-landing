-- Enable extension for UUID generation (usually already enabled on Supabase projects)
create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  phone text,
  email text,
  source text not null default 'chat_widget',
  page_url text,
  notes text,
  status text not null default 'new'
);

-- Optional: basic index for faster filtering by time/status
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- Security (recommended)
alter table public.leads enable row level security;

-- No public insert policy on purpose, because we insert via Edge Function using SERVICE ROLE.
-- If you *do* want client-side insert later, tell me and I'll add a safe policy.
