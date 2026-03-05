create extension if not exists pgcrypto;

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  idempotency_key text not null unique,
  provider text not null default 'stripe',
  provider_payment_intent_id text not null,
  client_secret text not null,
  amount_agorot integer not null check (amount_agorot > 0),
  currency text not null default 'ILS',
  customer_name text,
  customer_email text,
  customer_phone text,
  source text not null default 'site_checkout',
  status text not null default 'requires_payment_method',
  raw_provider_response jsonb,
  paid_at timestamptz
);

create index if not exists payment_requests_created_at_idx on public.payment_requests (created_at desc);
create index if not exists payment_requests_status_idx on public.payment_requests (status);
create index if not exists payment_requests_provider_intent_idx on public.payment_requests (provider_payment_intent_id);

create or replace function public.set_updated_at_payment_requests()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_payment_requests_updated_at on public.payment_requests;
create trigger trg_payment_requests_updated_at
before update on public.payment_requests
for each row execute function public.set_updated_at_payment_requests();

alter table public.payment_requests enable row level security;

-- Insert / update is performed by Edge Function using SERVICE ROLE only.
-- Keep public policies disabled by default for payment safety.
