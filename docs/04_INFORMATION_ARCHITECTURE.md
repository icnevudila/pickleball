# Information Architecture

## High-Level App Structure

```txt
Public
├── Home
├── Sessions
├── Session Detail
├── Login
└── Register

Player
├── Dashboard
├── My Bookings
├── Profile
└── Live Status

Admin
├── Dashboard
├── Courts
├── Sessions
├── Bookings
├── Payments
├── Players
└── Liveboard Control

TV
└── Liveboard Display
```

## Navigation Strategy

### Player Navigation

Keep it simple:

```txt
Sessions
My Bookings
Live Status
Profile
```

The player does not need admin language like "participants" or "court assignments."

### Admin Navigation

Admin should have persistent navigation:

```txt
Dashboard
Sessions
Courts
Bookings
Players
Payments
Liveboard
Settings
```

Liveboard should be one click away from anywhere.

### TV Navigation

No navigation.

TV route should be direct:

```txt
/liveboard/tv/:sessionId
```

## Player Information Hierarchy

### Session Card

Display order:

1. Session name
2. Date/time
3. Available spots
4. Skill level
5. Price
6. Book button

### Session Detail

Display order:

1. Title
2. Date/time
3. Capacity
4. Price/payment
5. Courts used
6. Rules/cancellation
7. Book button

### My Booking

Display order:

1. Status
2. Session date/time
3. Payment status
4. Check-in/live status
5. Cancel/reschedule action

## Admin Information Hierarchy

### Dashboard

Display order:

1. Active session
2. Current live metrics
3. Quick actions
4. Today’s bookings
5. Payment warnings

### Admin Liveboard

Display order:

1. Current session
2. Court cards
3. Queue
4. Checked-in players
5. Suggested next group
6. Manual override actions

## TV Information Hierarchy

Display order:

1. Session name
2. Current time/live indicator
3. Court cards
4. Timers
5. Next-up
6. Waiting queue
7. Capacity

## Route Map

### Player Routes

```txt
/
 /sessions
/sessions/:sessionId
/bookings
/bookings/:bookingId
/profile
/player/live/:sessionId
```

### Admin Routes

```txt
/admin
/admin/sessions
/admin/sessions/new
/admin/sessions/:sessionId
/admin/liveboard/:sessionId
/admin/courts
/admin/bookings
/admin/payments
/admin/players
/admin/settings
```

### TV Routes

```txt
/tv/:sessionId
/tv/:sessionId/compact
/tv/:sessionId/portrait
```

## Empty States

### No Sessions

```txt
No sessions are open yet.
```

Player action:

```txt
Check back later
```

Admin action:

```txt
Create session
```

### No Queue

```txt
No players waiting.
```

Admin helper:

```txt
Checked-in players can be added to the queue.
```

### No Active Game

```txt
Court available.
```

Admin action:

```txt
Assign next group
```

### No TV Session

```txt
No active session.
```

TV display:

```txt
Next session starts at 18:00
```
