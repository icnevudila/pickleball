create extension if not exists "pgcrypto";

create type app_role as enum ('member', 'staff', 'admin');
create type membership_status as enum ('invited', 'active', 'inactive');
create type booking_status as enum (
  'pending_payment',
  'confirmed',
  'waitlisted',
  'cancelled',
  'checked_in',
  'waiting',
  'playing',
  'completed',
  'no_show'
);
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded', 'manual_review');
create type booking_type as enum ('member', 'guest');
create type booking_source as enum ('public_web', 'admin', 'walk_in');
create type session_status as enum ('draft', 'open', 'full', 'in_progress', 'completed', 'cancelled');
create type court_status as enum ('available', 'occupied', 'reserved', 'maintenance', 'closed');
create type timer_status as enum ('not_started', 'running', 'ending_soon', 'time_up', 'completed');
create type queue_entry_status as enum ('waiting', 'offered', 'accepted', 'removed', 'expired');

create table if not exists clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'Europe/Istanbul',
  city text,
  address text,
  logo_url text,
  phone text,
  email text,
  primary_color text default '#F04F2A',
  support_text text,
  cancellation_policy_summary text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
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

create table if not exists club_memberships (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role app_role not null default 'member',
  status membership_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, profile_id)
);

create table if not exists courts (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  name text not null,
  description text,
  surface text,
  is_indoor boolean not null default true,
  status court_status not null default 'available',
  sort_order integer not null default 0,
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
  max_players integer not null,
  price_cents integer not null,
  currency text not null default 'usd',
  game_duration_minutes integer not null default 12,
  payment_required boolean not null default true,
  waitlist_enabled boolean not null default true,
  cancellation_window_minutes integer not null default 120,
  status session_status not null default 'draft',
  created_by_membership_id uuid references club_memberships(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists session_courts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  court_id uuid not null references courts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (session_id, court_id)
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  session_id uuid not null references sessions(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  booking_type booking_type not null,
  booking_source booking_source not null default 'public_web',
  booking_status booking_status not null default 'pending_payment',
  payment_status payment_status not null default 'pending',
  guest_full_name text,
  guest_email text,
  guest_phone text,
  reserved_until timestamptz,
  total_price_cents integer not null default 0,
  currency text not null default 'usd',
  cancelled_at timestamptz,
  cancelled_by_membership_id uuid references club_memberships(id) on delete set null,
  cancel_reason text,
  policy_snapshot jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists bookings_session_profile_active_idx
  on bookings(session_id, profile_id)
  where booking_status in ('pending_payment', 'confirmed', 'checked_in', 'waiting', 'playing');

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  booking_id uuid not null references bookings(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  provider text not null default 'stripe',
  provider_payment_id text,
  provider_checkout_url text,
  amount_cents integer not null,
  currency text not null default 'usd',
  status payment_status not null default 'pending',
  paid_at timestamptz,
  failed_at timestamptz,
  refunded_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists session_participants (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  session_id uuid not null references sessions(id) on delete cascade,
  booking_id uuid not null references bookings(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  status booking_status not null default 'confirmed',
  checked_in_at timestamptz,
  no_show_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (booking_id)
);

create table if not exists waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  session_id uuid not null references sessions(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  profile_id uuid references profiles(id) on delete set null,
  participant_id uuid references session_participants(id) on delete set null,
  position integer not null,
  status queue_entry_status not null default 'waiting',
  promoted_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists waitlist_entries_session_position_idx
  on waitlist_entries(session_id, position)
  where status in ('waiting', 'offered', 'accepted');

create table if not exists court_assignments (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  session_id uuid not null references sessions(id) on delete cascade,
  court_id uuid not null references courts(id) on delete cascade,
  status court_status not null default 'reserved',
  timer_status timer_status not null default 'not_started',
  started_at timestamptz,
  ended_at timestamptz,
  duration_minutes integer not null default 12,
  created_by_membership_id uuid references club_memberships(id) on delete set null,
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
  profile_id uuid references profiles(id) on delete set null,
  team text not null check (team in ('A', 'B')),
  position integer not null,
  created_at timestamptz not null default now()
);

create table if not exists liveboard_events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  session_id uuid not null references sessions(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_by_membership_id uuid references club_memberships(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  actor_membership_id uuid references club_memberships(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
