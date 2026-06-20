# API Specification

## API Principles

- REST endpoints for core data.
- Socket.IO for realtime updates.
- Server is source of truth.
- Client cannot directly set protected statuses without permission.
- All admin endpoints require role authorization.
- All write actions should return updated entity or liveboard snapshot.

## Auth

```txt
POST /auth/register
POST /auth/login
POST /auth/logout
GET /auth/me
```

## Profile

```txt
GET /users/me
PATCH /users/me
POST /users/me/avatar
```

## Courts

```txt
GET /courts
POST /admin/courts
PATCH /admin/courts/:courtId
PATCH /admin/courts/:courtId/status
DELETE /admin/courts/:courtId
```

## Sessions

```txt
GET /sessions
GET /sessions/:sessionId
POST /admin/sessions
PATCH /admin/sessions/:sessionId
POST /admin/sessions/:sessionId/start
POST /admin/sessions/:sessionId/complete
POST /admin/sessions/:sessionId/cancel
```

## Bookings

```txt
POST /bookings
GET /bookings/my
GET /bookings/:bookingId
PATCH /bookings/:bookingId/cancel
GET /admin/bookings
PATCH /admin/bookings/:bookingId/status
```

## Payments

```txt
POST /payments/:paymentId/checkout
POST /payments/webhook/:provider
GET /admin/payments
PATCH /admin/payments/:paymentId/status
```

## Check-in

```txt
POST /admin/sessions/:sessionId/check-in
POST /admin/sessions/:sessionId/no-show
```

## Queue

```txt
GET /admin/sessions/:sessionId/queue
POST /admin/sessions/:sessionId/queue
PATCH /admin/sessions/:sessionId/queue/reorder
DELETE /admin/queue/:entryId
```

## Liveboard

```txt
GET /sessions/:sessionId/liveboard
GET /admin/sessions/:sessionId/liveboard
```

## Court Assignment

```txt
POST /admin/court-assignments/suggest
POST /admin/court-assignments
POST /admin/court-assignments/:assignmentId/start
POST /admin/court-assignments/:assignmentId/end
POST /admin/court-assignments/:assignmentId/extend
```

## Common Error Codes

```txt
UNAUTHORIZED
FORBIDDEN
VALIDATION_ERROR
SESSION_NOT_FOUND
SESSION_FULL
BOOKING_ALREADY_EXISTS
PAYMENT_REQUIRED
PAYMENT_FAILED
PLAYER_NOT_CHECKED_IN
NOT_ENOUGH_PLAYERS
COURT_NOT_AVAILABLE
ACTIVE_ASSIGNMENT_EXISTS
QUEUE_ENTRY_NOT_FOUND
```
