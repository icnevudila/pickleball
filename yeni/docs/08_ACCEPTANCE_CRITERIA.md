# 08 — Acceptance Criteria

## Public booking

- Player can open club booking URL without admin login.
- Player can select date, slot and court.
- System blocks double-booking.
- Booking confirmation shows date, time, court and price.
- Payment/deposit status is stored against reservation.

## Admin command center

- Staff can see all courts and current state.
- Staff can identify next ending match in under 5 seconds.
- Staff can start/end a match.
- Staff can see unpaid/pending bookings.
- Staff can access queue actions without leaving the screen.

## Courts

- Staff can create/edit courts.
- Staff can block a court.
- Staff can put a court into maintenance.
- Court schedule is visible by day.

## Queue

- Staff can add a queue entry.
- Staff can send an offer to a queued player.
- Offer has an expiration state.
- Accepted offer creates or attaches to a reservation.
- Skipped/cancelled entries are logged.

## Payments

- Payment status cannot be updated by public client alone.
- Webhook events update payment state.
- Failed payments remain visible to staff.

## Mobile admin

- Staff can operate live courts from a phone.
- Critical actions are reachable with thumb navigation.
- Cards remain readable at 375px width.

## Liveboard

- Active court status is readable from distance.
- Next reservations and queue calls are visible.
- Board can refresh from realtime events.
