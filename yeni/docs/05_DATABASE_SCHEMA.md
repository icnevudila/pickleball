# 05 — Database Schema Draft

This is a product-level schema draft. It is intentionally readable rather than final migration code.

## Entity overview

- organizations
- clubs
- club_users
- courts
- court_blocks
- players
- reservations
- reservation_players
- queue_entries
- queue_offers
- open_matches
- payments
- match_results
- challenges
- activity_feed
- audit_logs

## SQL-style draft

```sql
create table organizations (
  id uuid primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table clubs (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  name text not null,
  slug text unique not null,
  timezone text not null,
  currency text not null default 'EUR',
  public_booking_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table club_users (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  user_id uuid not null,
  role text not null check (role in ('owner','manager','staff','coach','viewer')),
  created_at timestamptz not null default now(),
  unique (club_id, user_id)
);

create table courts (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  name text not null,
  surface text,
  indoor boolean not null default false,
  status text not null default 'available',
  base_price numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table court_blocks (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  court_id uuid not null references courts(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text not null,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table players (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  full_name text not null,
  phone text,
  email text,
  level numeric(3,1),
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

create table reservations (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  court_id uuid not null references courts(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null,
  source text not null check (source in ('admin','public_booking','open_match','queue')),
  price numeric(10,2) not null default 0,
  deposit_amount numeric(10,2) not null default 0,
  payment_status text not null default 'unpaid',
  created_at timestamptz not null default now()
);

create unique index reservations_no_exact_duplicate
on reservations (court_id, starts_at, ends_at)
where status in ('pending_payment','confirmed','checked_in','playing');

create table reservation_players (
  id uuid primary key,
  reservation_id uuid not null references reservations(id),
  player_id uuid references players(id),
  guest_name text,
  position text,
  created_at timestamptz not null default now()
);

create table queue_entries (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  player_id uuid references players(id),
  party_size int not null default 1,
  desired_start timestamptz,
  desired_end timestamptz,
  status text not null default 'waiting',
  priority int not null default 100,
  notes text,
  created_at timestamptz not null default now()
);

create table queue_offers (
  id uuid primary key,
  queue_entry_id uuid not null references queue_entries(id),
  reservation_id uuid references reservations(id),
  status text not null default 'sent',
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  reservation_id uuid references reservations(id),
  provider text not null default 'stripe',
  provider_reference text,
  amount numeric(10,2) not null,
  currency text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  payload jsonb,
  created_at timestamptz not null default now()
);
```

## Additional constraints for production

- Add exclusion constraints for time overlap if using PostgreSQL range types.
- Add indexes on `club_id`, `starts_at`, `status`, `court_id`.
- Use row-level security for multi-tenant isolation.
- Keep public booking reads limited to club availability and public profile.
