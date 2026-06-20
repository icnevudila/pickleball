# 06 — API Spec Draft

## Auth

### `POST /api/auth/login`

Login staff or owner.

### `POST /api/auth/magic-link`

Send magic link.

### `GET /api/me`

Return current user, clubs and roles.

## Public booking

### `GET /api/public/clubs/{slug}`

Returns public club profile.

### `GET /api/public/clubs/{slug}/availability?date=YYYY-MM-DD`

Returns available slots.

### `POST /api/public/clubs/{slug}/reservations`

Creates a reservation draft or pending payment booking.

Request:

```json
{
  "courtId": "uuid",
  "startsAt": "2026-06-20T18:00:00+03:00",
  "endsAt": "2026-06-20T19:30:00+03:00",
  "player": {
    "fullName": "Maya Stone",
    "phone": "+90...",
    "email": "maya@example.com"
  },
  "partySize": 4
}
```

### `POST /api/public/reservations/{id}/payment-intent`

Creates payment session/intent.

## Admin courts

### `GET /api/clubs/{clubId}/courts`

List courts with live state.

### `POST /api/clubs/{clubId}/courts`

Create court.

### `PATCH /api/clubs/{clubId}/courts/{courtId}`

Update court settings.

### `POST /api/clubs/{clubId}/courts/{courtId}/block`

Block court for maintenance/private event.

### `POST /api/clubs/{clubId}/courts/{courtId}/status`

Set live status.

## Admin reservations

### `GET /api/clubs/{clubId}/reservations?date=YYYY-MM-DD`

List reservations.

### `POST /api/clubs/{clubId}/reservations`

Create admin booking.

### `PATCH /api/clubs/{clubId}/reservations/{reservationId}`

Update booking.

### `POST /api/clubs/{clubId}/reservations/{reservationId}/start`

Start match.

### `POST /api/clubs/{clubId}/reservations/{reservationId}/complete`

Complete match.

### `POST /api/clubs/{clubId}/reservations/{reservationId}/cancel`

Cancel booking.

## Queue

### `GET /api/clubs/{clubId}/queue`

List waiting entries.

### `POST /api/clubs/{clubId}/queue`

Create queue entry.

### `POST /api/clubs/{clubId}/queue/{entryId}/offer`

Offer a slot to a queue entry.

### `POST /api/clubs/{clubId}/queue-offers/{offerId}/accept`

Accept offer.

### `POST /api/clubs/{clubId}/queue/{entryId}/skip`

Skip entry.

## Payments

### `GET /api/clubs/{clubId}/payments`

List payments.

### `POST /api/webhooks/stripe`

Stripe webhook receiver.

## Realtime event payload example

```json
{
  "type": "court.status_changed",
  "clubId": "uuid",
  "courtId": "uuid",
  "status": "active",
  "reservationId": "uuid",
  "timestamp": "2026-06-20T15:08:00Z"
}
```
