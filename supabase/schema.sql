-- M&S Hosting Solutions: database schema.
-- Paste into Supabase > SQL Editor > New query > Run, on a fresh project.

create extension if not exists pgcrypto;

-- Every form on the site writes one row here.
create table if not exists public.inquiries (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  type              text not null check (type in ('contact','property','host','cancellation')),
  name              text not null,
  email             text not null,
  subject           text,
  message           text not null,
  marketing_consent boolean not null default false,
  property_slug     text,
  property_address  text,
  booking_date      text
);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- Admin logins for /admin (passwords stored as bcrypt hashes).
create table if not exists public.admin_users (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  email         text not null unique,
  name          text,
  password_hash text not null
);

-- Lock both tables. The site writes with the service-role key (server only),
-- which bypasses RLS, so no public policies are needed.
alter table public.inquiries   enable row level security;
alter table public.admin_users enable row level security;

-- Add an admin (replace the values; generate the hash with bcrypt, cost 12):
-- insert into public.admin_users (email, name, password_hash)
-- values ('info.mshostingsolutions@gmail.com', 'Madeline', '$2b$12$...');

-- Direct bookings (Hot Tub Oasis). Written only by the server.
create table if not exists public.bookings (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  property_slug         text not null,
  checkin               date not null,
  checkout              date not null,
  guests                int  not null,
  name                  text not null,
  email                 text not null,
  phone                 text not null,
  notes                 text,
  nights                int  not null,
  amount_cents          int  not null,
  currency              text not null default 'cad',
  status                text not null default 'pending'
                        check (status in ('pending','confirmed','expired','failed','cancelled')),
  stripe_session_id     text,
  stripe_payment_intent text,
  confirmed_at          timestamptz,
  check (checkout > checkin)
);
create index if not exists bookings_slug_dates_idx on public.bookings (property_slug, checkin, checkout);
alter table public.bookings enable row level security;

-- Listing status set from /admin/listings (live | unavailable | hidden).
create table if not exists public.listing_status (
  slug        text primary key,
  status      text not null default 'live' check (status in ('live','unavailable','hidden')),
  updated_at  timestamptz not null default now(),
  updated_by  text
);
alter table public.listing_status enable row level security;

-- Inbox workflow for enquiries (new -> replied -> archived).
alter table public.inquiries add column if not exists status text not null default 'new'
  check (status in ('new','replied','archived'));
alter table public.inquiries add column if not exists handled_at timestamptz;
