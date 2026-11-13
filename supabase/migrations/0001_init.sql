-- JCCF FUTA website — Supabase schema (PRD F5–F8, Roles and permissions)
-- Run in Supabase → SQL editor, or with the Supabase CLI: supabase db push
--
-- Model: public forms never talk to Supabase directly. The Next.js API routes verify Turnstile and
-- insert with the service-role key. Signed-in staff read through RLS policies below.
-- Row-level security is ON for every table; anonymous users have no access at all.

create extension if not exists citext;

-- ───────────── Staff roles ─────────────
-- owner     = PRO/Publicity Secretary and General Secretary (joint site owners)
-- admin     = 2–3 Publicity Unit members
-- treasurer = Financial Secretary/Treasurer (payments, read-only)
create table if not exists public.site_roles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  role       text not null check (role in ('owner', 'admin', 'treasurer')),
  label      text,                -- e.g. "PRO 2026/27"
  created_at timestamptz not null default now()
);
alter table public.site_roles enable row level security;

create or replace function public.current_role_is(roles text[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.site_roles where user_id = auth.uid() and role = any (roles));
$$;
revoke all on function public.current_role_is(text[]) from public;
grant execute on function public.current_role_is(text[]) to authenticated;

create policy "staff read own role" on public.site_roles
  for select to authenticated using (user_id = auth.uid() or public.current_role_is(array['owner']));
create policy "owners manage roles" on public.site_roles
  for all to authenticated using (public.current_role_is(array['owner'])) with check (public.current_role_is(array['owner']));

-- ───────────── Newsletter (F7) ─────────────
create table if not exists public.newsletter_subscribers (
  id         bigint generated always as identity primary key,
  email      citext not null unique,
  source     text,
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
create policy "owners and admins read subscribers" on public.newsletter_subscribers
  for select to authenticated using (public.current_role_is(array['owner', 'admin']));
create policy "owners and admins remove subscribers" on public.newsletter_subscribers
  for delete to authenticated using (public.current_role_is(array['owner', 'admin']));

-- ───────────── Prayer requests (F6) — site owners ONLY ─────────────
create table if not exists public.prayer_requests (
  id          bigint generated always as identity primary key,
  name        text,
  contact     text,
  request     text not null check (char_length(request) between 1 and 2000),
  may_contact boolean not null default false,
  prayed_for  boolean not null default false,
  prayed_at   timestamptz,
  created_at  timestamptz not null default now()
);
alter table public.prayer_requests enable row level security;
create policy "owners read prayer requests" on public.prayer_requests
  for select to authenticated using (public.current_role_is(array['owner']));
create policy "owners mark prayed for" on public.prayer_requests
  for update to authenticated using (public.current_role_is(array['owner'])) with check (public.current_role_is(array['owner']));

-- ───────────── Contact messages (F8) ─────────────
create table if not exists public.contact_messages (
  id         bigint generated always as identity primary key,
  name       text not null,
  contact    text not null,
  subject    text,
  message    text not null check (char_length(message) between 1 and 3000),
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy "owners and admins read messages" on public.contact_messages
  for select to authenticated using (public.current_role_is(array['owner', 'admin']));
create policy "owners and admins mark handled" on public.contact_messages
  for update to authenticated using (public.current_role_is(array['owner', 'admin'])) with check (public.current_role_is(array['owner', 'admin']));

-- ───────────── Payments log (F5) — written only by the Paystack webhook ─────────────
create table if not exists public.payments (
  id             bigint generated always as identity primary key,
  reference      text not null unique,
  amount_kobo    bigint not null check (amount_kobo > 0),
  currency       text not null default 'NGN',
  category_id    text,
  category_label text,
  giver_name     text,
  giver_email    text,
  channel        text,
  paid_at        timestamptz not null,
  created_at     timestamptz not null default now()
);
alter table public.payments enable row level security;
create policy "owners and treasurer read payments" on public.payments
  for select to authenticated using (public.current_role_is(array['owner', 'treasurer']));

create index if not exists prayer_requests_created_idx on public.prayer_requests (created_at desc);
create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);
create index if not exists payments_paid_idx on public.payments (paid_at desc);

-- ───────────── First owner ─────────────
-- 1. Supabase → Authentication → Users → "Add user" with the role email (e.g. pro@jccffuta.org).
-- 2. Then run (replace the email):
--    insert into public.site_roles (user_id, role, label)
--    select id, 'owner', 'PRO' from auth.users where email = 'pro@jccffuta.org';
