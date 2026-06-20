# Database Design

## Design Principles

- PostgreSQL is the recommended database.
- All operational data should include `club_id` where future multi-club support is expected.
- Backend database state is the source of truth.
- Realtime events are notifications, not permanent truth.
- Critical state changes must happen in transactions.
- Liveboard actions should be auditable.

## Core Tables

```txt
clubs
users
courts
sessions
session_courts
bookings
payments
session_participants
waitlist_entries
court_assignments
court_assignment_players
liveboard_events
audit_logs
```

## clubs

```txt
id
name
slug
timezone
address
phone
email
logo_url
status
created_at
updated_at
```

## users

```txt
id
club_id
first_name
last_name
nickname
email
phone
password_hash
role
avatar_url
display_name_preference
skill_level
status
created_at
updated_at
```

## courts

```txt
id
club_id
name
description
surface
is_indoor
status
sort_order
created_at
updated_at
```

## sessions

```txt
id
club_id
name
description
session_date
start_time
end_time
max_players
price
currency
game_duration_minutes
skill_level
status
waitlist_enabled
payment_required
created_by
created_at
updated_at
```

## bookings

```txt
id
club_id
session_id
user_id
status
payment_status
reserved_until
total_price
currency
cancelled_at
cancelled_by
cancel_reason
created_at
updated_at
```

## payments

```txt
id
club_id
booking_id
user_id
provider
provider_payment_id
provider_checkout_url
amount
currency
status
metadata
paid_at
failed_at
refunded_at
created_at
updated_at
```

## session_participants

```txt
id
club_id
session_id
booking_id
user_id
status
checked_in_at
no_show_at
created_at
updated_at
```

## waitlist_entries

```txt
id
club_id
session_id
user_id
participant_id
position
status
created_at
updated_at
```

## court_assignments

```txt
id
club_id
session_id
court_id
status
timer_status
started_at
ended_at
duration_minutes
created_by
created_at
updated_at
```

## court_assignment_players

```txt
id
court_assignment_id
user_id
participant_id
team
position
created_at
```

## liveboard_events

```txt
id
club_id
session_id
event_type
payload
created_by
created_at
```

## Important Constraints

### Capacity Constraint

Capacity must be enforced in backend transaction.

### Active Court Assignment Constraint

A court cannot have two active assignments.

### Active Booking Constraint

A player cannot have multiple active bookings for same session.

### Queue Order Constraint

Queue positions should be recalculated after reorder/removal.
