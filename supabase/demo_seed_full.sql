-- Demo seed for a visually full club state.
-- Run after `supabase/final_schema.sql`.
-- This seed creates:
-- - one owner-style admin profile
-- - staff and member profiles
-- - four courts
-- - three sessions
-- - confirmed / checked-in / waitlist / pending bookings
-- - active court assignments
-- - queue, liveboard events, and audit trail

begin;

insert into clubs (
  id,
  name,
  slug,
  timezone,
  city,
  address,
  logo_url,
  phone,
  email,
  primary_color,
  support_text,
  cancellation_policy_summary,
  is_active
)
values (
  '11111111-1111-1111-1111-111111111111',
  'PadelOS Demo Club',
  'padelos-demo-club',
  'Europe/Istanbul',
  'Istanbul',
  'Maslak, Istanbul',
  'https://api.dicebear.com/9.x/shapes/svg?seed=PadelOSClub',
  '+90 212 555 0101',
  'owner@padelos.demo',
  '#F04F2A',
  'Broadcast-grade liveboard and queue control.',
  'Cancellations close 2 hours before session start.',
  true
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  timezone = excluded.timezone,
  city = excluded.city,
  address = excluded.address,
  logo_url = excluded.logo_url,
  phone = excluded.phone,
  email = excluded.email,
  primary_color = excluded.primary_color,
  support_text = excluded.support_text,
  cancellation_policy_summary = excluded.cancellation_policy_summary,
  is_active = excluded.is_active;

insert into profiles (id, auth_user_id, first_name, last_name, display_name, email, phone, avatar_url, skill_level)
values
  ('20000000-0000-0000-0000-000000000001', null, 'Owner', 'Demo', 'Owner Demo', 'owner@padelos.demo', '+90 555 000 0001', 'https://api.dicebear.com/9.x/thumbs/svg?seed=OwnerDemo', '5.0'),
  ('20000000-0000-0000-0000-000000000002', null, 'Selin', 'Kaya', 'Selin', 'selin@padelos.demo', '+90 555 000 0002', 'https://api.dicebear.com/9.x/thumbs/svg?seed=SelinKaya', '4.0'),
  ('20000000-0000-0000-0000-000000000003', null, 'Mert', 'Aydin', 'Mert', 'mert@padelos.demo', '+90 555 000 0003', 'https://api.dicebear.com/9.x/thumbs/svg?seed=MertAydin', '4.5'),
  ('20000000-0000-0000-0000-000000000004', null, 'Ali', 'Kara', 'Ali', 'ali@padelos.demo', '+90 555 000 0004', 'https://api.dicebear.com/9.x/thumbs/svg?seed=AliKara', '3.5'),
  ('20000000-0000-0000-0000-000000000005', null, 'Deniz', 'Yilmaz', 'Deniz', 'deniz@padelos.demo', '+90 555 000 0005', 'https://api.dicebear.com/9.x/thumbs/svg?seed=DenizYilmaz', '3.5'),
  ('20000000-0000-0000-0000-000000000006', null, 'Mark', 'Stone', 'Mark', 'mark@padelos.demo', '+90 555 000 0006', 'https://api.dicebear.com/9.x/thumbs/svg?seed=MarkStone', '3.0'),
  ('20000000-0000-0000-0000-000000000007', null, 'Josh', 'Snow', 'Josh', 'josh@padelos.demo', '+90 555 000 0007', 'https://api.dicebear.com/9.x/thumbs/svg?seed=JoshSnow', '3.0'),
  ('20000000-0000-0000-0000-000000000008', null, 'Maria', 'Rose', 'Maria', 'maria@padelos.demo', '+90 555 000 0008', 'https://api.dicebear.com/9.x/thumbs/svg?seed=MariaRose', '3.0'),
  ('20000000-0000-0000-0000-000000000009', null, 'Kevin', 'Vale', 'Kevin', 'kevin@padelos.demo', '+90 555 000 0009', 'https://api.dicebear.com/9.x/thumbs/svg?seed=KevinVale', '3.5'),
  ('20000000-0000-0000-0000-000000000010', null, 'Sam', 'Moss', 'Sam', 'sam@padelos.demo', '+90 555 000 0010', 'https://api.dicebear.com/9.x/thumbs/svg?seed=SamMoss', '3.0'),
  ('20000000-0000-0000-0000-000000000011', null, 'Leo', 'Ortiz', 'Leo', 'leo@padelos.demo', '+90 555 000 0011', 'https://api.dicebear.com/9.x/thumbs/svg?seed=LeoOrtiz', '3.0'),
  ('20000000-0000-0000-0000-000000000012', null, 'Ana', 'Cruz', 'Ana', 'ana@padelos.demo', '+90 555 000 0012', 'https://api.dicebear.com/9.x/thumbs/svg?seed=AnaCruz', '3.5'),
  ('20000000-0000-0000-0000-000000000013', null, 'Ben', 'North', 'Ben', 'ben@padelos.demo', '+90 555 000 0013', 'https://api.dicebear.com/9.x/thumbs/svg?seed=BenNorth', '3.5'),
  ('20000000-0000-0000-0000-000000000014', null, 'Theo', 'Clark', 'Theo', 'theo@padelos.demo', '+90 555 000 0014', 'https://api.dicebear.com/9.x/thumbs/svg?seed=TheoClark', '3.0'),
  ('20000000-0000-0000-0000-000000000015', null, 'Ken', 'Nash', 'Ken', 'ken@padelos.demo', '+90 555 000 0015', 'https://api.dicebear.com/9.x/thumbs/svg?seed=KenNash', '3.0'),
  ('20000000-0000-0000-0000-000000000016', null, 'Mila', 'Turner', 'Mila', 'mila@padelos.demo', '+90 555 000 0016', 'https://api.dicebear.com/9.x/thumbs/svg?seed=MilaTurner', '2.5'),
  ('20000000-0000-0000-0000-000000000017', null, 'Noah', 'Brooks', 'Noah', 'noah@padelos.demo', '+90 555 000 0017', 'https://api.dicebear.com/9.x/thumbs/svg?seed=NoahBrooks', '4.0'),
  ('20000000-0000-0000-0000-000000000018', null, 'Carlo', 'Ray', 'Carlo', 'carlo@padelos.demo', '+90 555 000 0018', 'https://api.dicebear.com/9.x/thumbs/svg?seed=CarloRay', '3.0'),
  ('20000000-0000-0000-0000-000000000019', null, 'Mia', 'Park', 'Mia', 'mia@padelos.demo', '+90 555 000 0019', 'https://api.dicebear.com/9.x/thumbs/svg?seed=MiaPark', '3.0'),
  ('20000000-0000-0000-0000-000000000020', null, 'Elif', 'Demir', 'Elif', 'elif@padelos.demo', '+90 555 000 0020', 'https://api.dicebear.com/9.x/thumbs/svg?seed=ElifDemir', '3.5')
on conflict (id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  display_name = excluded.display_name,
  email = excluded.email,
  phone = excluded.phone,
  avatar_url = excluded.avatar_url,
  skill_level = excluded.skill_level;

insert into club_memberships (id, club_id, profile_id, role, status)
values
  ('30000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000001', 'admin', 'active'),
  ('30000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000002', 'staff', 'active'),
  ('30000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000003', 'staff', 'active'),
  ('30000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000004', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000005', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000006', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000007', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000008', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000009', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000010', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000011', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000012', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000013', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000014', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000015', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000015', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000016', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000016', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000017', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000017', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000018', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000018', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000019', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000019', 'member', 'active'),
  ('30000000-0000-0000-0000-000000000020', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000020', 'member', 'active')
on conflict (id) do update set
  role = excluded.role,
  status = excluded.status;

insert into courts (id, club_id, name, description, surface, is_indoor, status, sort_order)
values
  ('40000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Court 1', 'Center court', 'Panoramic', true, 'available', 1),
  ('40000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Court 2', 'Fast rotation court', 'Panoramic', true, 'available', 2),
  ('40000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Court 3', 'Training and social', 'Panoramic', true, 'available', 3),
  ('40000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Court 4', 'Premium indoor court', 'Panoramic', true, 'available', 4)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  surface = excluded.surface,
  is_indoor = excluded.is_indoor,
  status = excluded.status,
  sort_order = excluded.sort_order;

insert into sessions (
  id,
  club_id,
  name,
  description,
  session_date,
  start_time,
  end_time,
  skill_level,
  max_players,
  price_cents,
  currency,
  game_duration_minutes,
  payment_required,
  waitlist_enabled,
  cancellation_window_minutes,
  status,
  created_by_membership_id
)
values
  ('50000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Friday Open Play', 'Main live session for TV and desk demos.', date '2026-06-20', timestamptz '2026-06-20 18:00:00+03', timestamptz '2026-06-20 21:00:00+03', 'Intermediate', 24, 1800, 'usd', 12, true, true, 120, 'in_progress', '30000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Saturday Rally', 'Booking-heavy daytime social session.', date '2026-06-21', timestamptz '2026-06-21 09:00:00+03', timestamptz '2026-06-21 12:00:00+03', 'Beginner Friendly', 24, 1400, 'usd', 15, true, true, 120, 'open', '30000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Advanced Night', 'Fully booked high-skill evening session.', date '2026-06-22', timestamptz '2026-06-22 19:00:00+03', timestamptz '2026-06-22 22:00:00+03', 'Advanced', 24, 2200, 'usd', 15, true, true, 120, 'full', '30000000-0000-0000-0000-000000000001')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  session_date = excluded.session_date,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  skill_level = excluded.skill_level,
  max_players = excluded.max_players,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  game_duration_minutes = excluded.game_duration_minutes,
  payment_required = excluded.payment_required,
  waitlist_enabled = excluded.waitlist_enabled,
  cancellation_window_minutes = excluded.cancellation_window_minutes,
  status = excluded.status,
  created_by_membership_id = excluded.created_by_membership_id;

insert into session_courts (id, session_id, court_id)
values
  ('51000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001'),
  ('51000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002'),
  ('51000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003'),
  ('51000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001'),
  ('51000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002'),
  ('51000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003'),
  ('51000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000004'),
  ('51000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001'),
  ('51000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000002'),
  ('51000000-0000-0000-0000-000000000010', '50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003'),
  ('51000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000004')
on conflict (id) do update set
  session_id = excluded.session_id,
  court_id = excluded.court_id;

insert into bookings (
  id, club_id, session_id, profile_id, booking_type, booking_source, booking_status, payment_status,
  guest_full_name, guest_email, guest_phone, reserved_until, total_price_cents, currency, policy_snapshot, metadata
)
values
  ('60000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'member', 'public_web', 'checked_in', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Ali"}'),
  ('60000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', 'member', 'public_web', 'checked_in', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Deniz"}'),
  ('60000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', 'member', 'public_web', 'playing', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Mark"}'),
  ('60000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007', 'member', 'public_web', 'playing', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Josh"}'),
  ('60000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000012', 'member', 'public_web', 'playing', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Ana"}'),
  ('60000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000013', 'member', 'public_web', 'playing', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Ben"}'),
  ('60000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000014', 'member', 'public_web', 'playing', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Theo"}'),
  ('60000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000015', 'member', 'walk_in', 'playing', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Ken"}'),
  ('60000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', 'member', 'public_web', 'waiting', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Maria"}'),
  ('60000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009', 'member', 'public_web', 'waiting', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Kevin"}'),
  ('60000000-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000010', 'member', 'public_web', 'waiting', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Sam"}'),
  ('60000000-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000011', 'member', 'public_web', 'waiting', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Leo"}'),
  ('60000000-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000018', 'member', 'public_web', 'waitlisted', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Carlo"}'),
  ('60000000-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000019', 'member', 'public_web', 'waitlisted', 'paid', null, null, null, null, 1800, 'usd', '{"cancellation":"2h"}', '{"display_name":"Mia"}'),
  ('60000000-0000-0000-0000-000000000015', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000016', 'member', 'public_web', 'pending_payment', 'pending', null, null, null, timestamptz '2026-06-20 10:33:00+03', 1400, 'usd', '{"cancellation":"2h"}', '{"display_name":"Mila"}'),
  ('60000000-0000-0000-0000-000000000016', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000017', 'member', 'public_web', 'waitlisted', 'manual_review', null, null, null, null, 2200, 'usd', '{"cancellation":"2h"}', '{"display_name":"Noah"}')
on conflict (id) do update set
  booking_status = excluded.booking_status,
  payment_status = excluded.payment_status,
  reserved_until = excluded.reserved_until,
  total_price_cents = excluded.total_price_cents,
  metadata = excluded.metadata;

insert into payments (
  id, club_id, booking_id, profile_id, provider, provider_payment_id, provider_checkout_url,
  amount_cents, currency, status, paid_at, metadata
)
values
  ('70000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '60000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'stripe', 'pi_demo_001', null, 1800, 'usd', 'paid', now() - interval '3 hours', '{"source":"seed"}'),
  ('70000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '60000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', 'stripe', 'pi_demo_002', null, 1800, 'usd', 'paid', now() - interval '3 hours', '{"source":"seed"}'),
  ('70000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '60000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', 'stripe', 'pi_demo_003', null, 1800, 'usd', 'paid', now() - interval '3 hours', '{"source":"seed"}'),
  ('70000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '60000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000007', 'stripe', 'pi_demo_004', null, 1800, 'usd', 'paid', now() - interval '3 hours', '{"source":"seed"}'),
  ('70000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '60000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012', 'stripe', 'pi_demo_005', null, 1800, 'usd', 'paid', now() - interval '2 hours', '{"source":"seed"}'),
  ('70000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', '60000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000013', 'stripe', 'pi_demo_006', null, 1800, 'usd', 'paid', now() - interval '2 hours', '{"source":"seed"}'),
  ('70000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', '60000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000014', 'stripe', 'pi_demo_007', null, 1800, 'usd', 'paid', now() - interval '2 hours', '{"source":"seed"}'),
  ('70000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', '60000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000015', 'stripe', 'pi_demo_008', null, 1800, 'usd', 'paid', now() - interval '2 hours', '{"source":"seed"}'),
  ('70000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', '60000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000016', 'stripe', 'pi_demo_015', 'https://checkout.stripe.com/demo-session-015', 1400, 'usd', 'pending', null, '{"source":"seed"}'),
  ('70000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', '60000000-0000-0000-0000-000000000016', '20000000-0000-0000-0000-000000000017', 'stripe', 'pi_demo_016', null, 2200, 'usd', 'manual_review', null, '{"source":"seed"}')
on conflict (id) do update set
  status = excluded.status,
  provider_payment_id = excluded.provider_payment_id,
  provider_checkout_url = excluded.provider_checkout_url,
  paid_at = excluded.paid_at,
  metadata = excluded.metadata;

insert into session_participants (
  id, club_id, session_id, booking_id, profile_id, status, checked_in_at, no_show_at
)
values
  ('80000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'checked_in', now() - interval '70 minutes', null),
  ('80000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', 'checked_in', now() - interval '68 minutes', null),
  ('80000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', 'playing', now() - interval '66 minutes', null),
  ('80000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000007', 'playing', now() - interval '66 minutes', null),
  ('80000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012', 'playing', now() - interval '64 minutes', null),
  ('80000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000013', 'playing', now() - interval '64 minutes', null),
  ('80000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000014', 'playing', now() - interval '63 minutes', null),
  ('80000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000015', 'playing', now() - interval '63 minutes', null),
  ('80000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000008', 'waiting', now() - interval '58 minutes', null),
  ('80000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000009', 'waiting', now() - interval '58 minutes', null),
  ('80000000-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000010', 'waiting', now() - interval '57 minutes', null),
  ('80000000-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000011', 'waiting', now() - interval '57 minutes', null),
  ('80000000-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000018', 'waitlisted', null, null),
  ('80000000-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000019', 'waitlisted', null, null),
  ('80000000-0000-0000-0000-000000000015', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000016', 'confirmed', null, null),
  ('80000000-0000-0000-0000-000000000016', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000016', '20000000-0000-0000-0000-000000000017', 'waitlisted', null, null)
on conflict (id) do update set
  status = excluded.status,
  checked_in_at = excluded.checked_in_at,
  no_show_at = excluded.no_show_at;

insert into waitlist_entries (
  id, club_id, session_id, booking_id, profile_id, participant_id, position, status, promoted_at, expires_at
)
values
  ('90000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000008', '80000000-0000-0000-0000-000000000009', 1, 'offered', now() - interval '2 minutes', now() + interval '3 minutes'),
  ('90000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000009', '80000000-0000-0000-0000-000000000010', 2, 'offered', now() - interval '2 minutes', now() + interval '3 minutes'),
  ('90000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000010', '80000000-0000-0000-0000-000000000011', 3, 'waiting', null, null),
  ('90000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000011', '80000000-0000-0000-0000-000000000012', 4, 'waiting', null, null),
  ('90000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000018', '80000000-0000-0000-0000-000000000013', 5, 'waiting', null, null),
  ('90000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000019', '80000000-0000-0000-0000-000000000014', 6, 'waiting', null, null),
  ('90000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000016', '20000000-0000-0000-0000-000000000017', '80000000-0000-0000-0000-000000000016', 1, 'waiting', null, null)
on conflict (id) do update set
  position = excluded.position,
  status = excluded.status,
  promoted_at = excluded.promoted_at,
  expires_at = excluded.expires_at;

insert into court_assignments (
  id, club_id, session_id, court_id, status, timer_status, started_at, ended_at, duration_minutes, created_by_membership_id
)
values
  ('a0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'occupied', 'running', now() - interval '4 minutes 18 seconds', null, 12, '30000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', 'reserved', 'not_started', null, null, 12, '30000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', 'occupied', 'ending_soon', now() - interval '10 minutes 48 seconds', null, 12, '30000000-0000-0000-0000-000000000003')
on conflict (id) do update set
  status = excluded.status,
  timer_status = excluded.timer_status,
  started_at = excluded.started_at,
  ended_at = excluded.ended_at,
  duration_minutes = excluded.duration_minutes,
  created_by_membership_id = excluded.created_by_membership_id;

insert into court_assignment_players (id, court_assignment_id, participant_id, profile_id, team, position)
values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'A', 1),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', 'A', 2),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006', 'B', 1),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000007', 'B', 2),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012', 'A', 1),
  ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000013', 'A', 2),
  ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000014', 'B', 1),
  ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000015', 'B', 2)
on conflict (id) do update set
  court_assignment_id = excluded.court_assignment_id,
  participant_id = excluded.participant_id,
  profile_id = excluded.profile_id,
  team = excluded.team,
  position = excluded.position;

insert into liveboard_events (id, club_id, session_id, event_type, payload, created_by_membership_id, created_at)
values
  ('c0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', 'payment.updated', '{"message":"Mila Turner capacity hold started after checkout session creation."}', '30000000-0000-0000-0000-000000000002', now() - interval '7 minutes'),
  ('c0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', 'queue.updated', '{"message":"Court 2 next group locked for Maria, Kevin, Sam, and Leo."}', '30000000-0000-0000-0000-000000000002', now() - interval '4 minutes'),
  ('c0000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', 'game.ending_soon', '{"message":"Court 3 entered ending-soon state with 72 seconds left."}', '30000000-0000-0000-0000-000000000003', now() - interval '2 minutes'),
  ('c0000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '50000000-0000-0000-0000-000000000001', 'game.started', '{"message":"Court 1 game started with Ali, Deniz, Mark, and Josh."}', '30000000-0000-0000-0000-000000000002', now() - interval '11 minutes')
on conflict (id) do update set
  event_type = excluded.event_type,
  payload = excluded.payload,
  created_by_membership_id = excluded.created_by_membership_id,
  created_at = excluded.created_at;

insert into audit_logs (id, club_id, actor_membership_id, entity_type, entity_id, action, payload, created_at)
values
  ('d0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '30000000-0000-0000-0000-000000000001', 'session', '50000000-0000-0000-0000-000000000001', 'session.started', '{"note":"Owner started Friday Open Play"}', now() - interval '80 minutes'),
  ('d0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '30000000-0000-0000-0000-000000000002', 'court_assignment', 'a0000000-0000-0000-0000-000000000002', 'queue.called', '{"note":"Called next four players for Court 2"}', now() - interval '4 minutes')
on conflict (id) do update set
  action = excluded.action,
  payload = excluded.payload,
  created_at = excluded.created_at;

commit;

-- Optional next step if you later create a real auth user for the owner:
-- update profiles
-- set auth_user_id = '<supabase-auth-user-uuid>'
-- where id = '20000000-0000-0000-0000-000000000001';
