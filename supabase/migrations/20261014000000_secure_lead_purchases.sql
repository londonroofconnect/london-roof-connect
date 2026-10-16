alter table public.leads
  add column if not exists checkout_reservation_id uuid,
  add column if not exists checkout_reservation_expires_at timestamptz,
  add column if not exists stripe_checkout_session_id text,
  add column if not exists sold_at timestamptz;

create index if not exists leads_available_reservations_idx
  on public.leads (status, checkout_reservation_expires_at);

alter table public.leads enable row level security;

revoke all privileges on table public.leads from public, anon, authenticated;
grant insert (name, postcode, phone, job_type, description)
  on table public.leads to anon, authenticated;
grant select, update on table public.leads to service_role;

drop policy if exists leads_public_quote_insert on public.leads;
create policy leads_public_quote_insert
  on public.leads
  for insert
  to anon, authenticated
  with check (true);
