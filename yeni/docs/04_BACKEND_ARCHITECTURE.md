# 04 — Backend Architecture Plan

## Recommended stack

This package assumes the following practical stack:

- **Frontend:** Next.js with App Router
- **Database:** PostgreSQL
- **Backend platform option:** Supabase for managed Postgres, Auth, Realtime and Storage
- **Payments:** Stripe Payment Intents or Checkout, plus webhooks
- **Realtime:** Supabase Realtime or WebSocket layer
- **Background jobs:** queue worker for reminders, call expirations and payment reconciliation

## Why this stack

Next.js App Router is a strong fit for a multi-surface web app because it supports file-based routing, React Server Components, Suspense and server-side functions. Supabase is a good early-stage fit because it provides Postgres, Auth, Storage, Realtime and instant APIs in one platform. Stripe Payment Intents are appropriate for payment flows that need lifecycle tracking, authentication and asynchronous status updates.

## Core services

### Auth service

Responsibilities:

- Club owner login
- Staff login
- Role-based permissions
- Public booking guest identity
- Optional player account

Roles:

- `owner`
- `manager`
- `staff`
- `coach`
- `player`
- `viewer`

### Booking service

Responsibilities:

- Availability search
- Reservation creation
- Conflict detection
- Deposit rules
- Cancellation rules
- Booking status transitions

Booking statuses:

- `draft`
- `pending_payment`
- `confirmed`
- `checked_in`
- `playing`
- `completed`
- `cancelled`
- `no_show`

### Court service

Responsibilities:

- Court profile
- Court availability
- Maintenance/blocking
- Live status
- Schedule timeline

Court statuses:

- `available`
- `reserved`
- `active`
- `cleaning`
- `maintenance`
- `blocked`

### Queue service

Responsibilities:

- Waitlist entries
- Priority order
- Slot matching
- Offer generation
- Offer expiration
- Staff override

Queue statuses:

- `waiting`
- `offered`
- `accepted`
- `expired`
- `skipped`
- `resolved`
- `cancelled`

### Payments service

Responsibilities:

- Create payment intent/session
- Listen to payment webhooks
- Reconcile booking status
- Handle refunds/deposits
- Track unpaid bookings

### Community service

Responsibilities:

- Player profile
- Match history
- Leaderboards
- Challenges
- Club activity feed
- Open matches

## Realtime architecture

Suggested event channels:

- `club:{club_id}:liveboard`
- `club:{club_id}:courts`
- `club:{club_id}:queue`
- `club:{club_id}:bookings`
- `club:{club_id}:payments`

Events:

- `court.status_changed`
- `booking.created`
- `booking.cancelled`
- `booking.started`
- `booking.completed`
- `queue.item_added`
- `queue.offer_sent`
- `queue.offer_accepted`
- `payment.succeeded`
- `payment.failed`

## Security model

- Each row should belong to a `club_id` where relevant.
- Staff can only access clubs they are assigned to.
- Public booking endpoints should expose limited club availability only.
- Payment webhooks must be verified server-side.
- Queue call links should use short-lived tokens.
- Audit logs should record sensitive staff actions.

## MVP deployment shape

```
Client Browser
  -> Next.js App Router
      -> Server Actions / API Routes
      -> Supabase Auth
      -> Postgres Database
      -> Realtime Channels
      -> Stripe API
      -> Background Worker
```

## Critical backend rules

1. Never create overlapping confirmed reservations for the same court.
2. Payment status must not be trusted from the client.
3. Queue offers must expire automatically.
4. Public booking availability must be recalculated at checkout.
5. Staff overrides must be logged.
6. Liveboard data should be event-driven, not manually refreshed.
