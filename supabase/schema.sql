create extension if not exists "pgcrypto";

create type app_role as enum ('guest', 'member', 'staff', 'admin');
create type session_status as enum ('draft', 'open', 'full', 'in_progress', 'completed', 'cancelled');
create type booking_status as enum ('pending_payment', 'confirmed', 'waitlisted', 'cancelled', 'checked_in', 'waiting', 'playing', 'completed', 'no_show');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded', 'manual_review');
create type booking_type as enum ('member', 'guest');
create type booking_source as enum ('public_web', 'admin', 'walk_in');
create type court_status as enum ('available', 'occupied', 'reserved', 'maintenance', 'closed');
create type timer_status as enum ('not_started', 'running', 'ending_soon', 'time_up', 'completed');

create table if not exists clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  timezone text not null default 'Europe/Istanbul',
  city text,
  logo_url text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  club_id uuid not null references clubs(id) on delete cascade,
  role app_role not null default 'member',
  first_name text not null,
  last_name text not null,
  display_name text,
  email text not null,
  phone text,
  avatar_url text,
  skill_level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists courts (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  status court_status not null default 'available',
  surface text,
  is_indoor boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  name text not null,
  description text,
  session_date date not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  skill_level text,
  price_cents int not null,
  currency text not null default 'usd',
  max_players int not null,
  game_duration_minutes int not null default 12,
  payment_required boolean not null default true,
  waitlist_enabled boolean not null default true,
  status session_status not null default 'draft',
  cancellation_window_minutes int not null default 120,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  session_id uuid not null references sessions(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  booking_type booking_type not null,
  booking_source booking_source not null default 'public_web',
  booking_status booking_status not null default 'pending_payment',
  payment_status payment_status not null default 'pending',
  guest_full_name text,
  guest_email text,
  guest_phone text,
  hold_expires_at timestamptz,
  policy_snapshot jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists bookings_session_member_active_idx
  on bookings(session_id, user_id)
  where booking_status in ('pending_payment', 'confirmed', 'checked_in', 'waiting', 'playing');

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  provider text not null default 'stripe',
  provider_payment_id text,
  amount_cents int not null,
  currency text not null default 'usd',
  status payment_status not null default 'pending',
  checkout_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists session_participants (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  session_id uuid not null references sessions(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  status booking_status not null default 'confirmed',
  checked_in_at timestamptz,
  no_show_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  user_id uuid references users(id) on delete set null,
  position int not null,
  promoted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists court_assignments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  court_id uuid not null references courts(id) on delete cascade,
  timer_status timer_status not null default 'not_started',
  status court_status not null default 'reserved',
  started_at timestamptz,
  ended_at timestamptz,
  duration_minutes int not null default 12,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists court_assignments_active_court_idx
  on court_assignments(court_id)
  where ended_at is null;

create table if not exists court_assignment_players (
  id uuid primary key default gen_random_uuid(),
  court_assignment_id uuid not null references court_assignments(id) on delete cascade,
  participant_id uuid references session_participants(id) on delete set null,
  user_id uuid references users(id) on delete set null,
  team text not null,
  position int not null
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete cascade,
  actor_user_id uuid references users(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
