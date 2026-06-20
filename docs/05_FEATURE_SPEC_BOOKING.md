# Feature Specification: Session Booking

## Purpose

The booking module allows players to reserve spots in pickleball open play sessions.

The MVP should prioritize session booking over private court rental because the product depends on live check-in, queue management, and court rotation.

## Booking Types

### MVP

```txt
SESSION_BOOKING
```

### Future

```txt
COURT_RENTAL
LESSON_BOOKING
TOURNAMENT_ENTRY
```

## Session Object

A session is a scheduled play block.

Example:

```txt
Friday Open Play
Date: 2026-07-12
Time: 18:00 - 21:00
Courts: Court 1, Court 2, Court 3
Max players: 24
Game duration: 15 minutes
Price: 10
Skill level: Intermediate
```

## Session Fields

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
created_at
updated_at
```

## Booking Status

```txt
PENDING_PAYMENT
CONFIRMED
WAITLISTED
CANCELLED
EXPIRED
NO_SHOW
COMPLETED
REFUNDED
```

## Capacity Rules

### Rule 1: Confirmed Capacity

The number of confirmed bookings cannot exceed `session.max_players`.

Count these statuses against capacity:

```txt
PENDING_PAYMENT if reserved_until is still active
CONFIRMED
```

Do not count:

```txt
CANCELLED
EXPIRED
NO_SHOW
REFUNDED
```

### Rule 2: Payment Hold

If payment is required:

```txt
booking.status = PENDING_PAYMENT
reserved_until = now + 10 minutes
```

If payment succeeds:

```txt
booking.status = CONFIRMED
payment_status = PAID
```

If payment expires:

```txt
booking.status = EXPIRED
payment_status = EXPIRED
capacity is released
```

## Transaction Requirement

Booking creation must be transactional.

Reason:

Two players could try to book the last spot at the same time.

Safe logic:

```txt
Start transaction
↓
Lock or safely count active bookings
↓
If capacity available, create booking
↓
Commit
```

## Acceptance Criteria

- Player cannot book cancelled session.
- Player cannot book the same session twice.
- Session capacity cannot be exceeded.
- Expired payment hold releases capacity.
- Admin can see all bookings.
- Player can see own bookings only.
- Booking state changes create audit/liveboard events.
