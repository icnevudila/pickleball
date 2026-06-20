# Development Roadmap

## Roadmap Philosophy

Build the live operational core first.

Do not start with rankings, tournaments, or social features.

The MVP should prove:

```txt
Players book online.
Admins run live sessions.
TV board updates in real time.
```

## Phase 0 — Planning and Setup

Duration:

```txt
2-3 days
```

Tasks:

- Finalize product scope
- Confirm session booking first
- Confirm payment mode
- Confirm UI style
- Create repository
- Create docs folder
- Define environment variables
- Choose deployment target

## Phase 1 — Foundation

Duration:

```txt
1 week
```

Tasks:

- Set up frontend
- Set up backend
- Set up database
- Configure Prisma
- Configure auth
- Create roles
- Add club seed
- Add admin seed
- Add basic layout

## Phase 2 — Courts and Sessions

Duration:

```txt
1 week
```

Tasks:

- Court CRUD
- Session CRUD
- Assign courts to sessions
- Session list for players
- Session detail page
- Session status logic
- Seed demo sessions

## Phase 3 — Booking and Capacity

Duration:

```txt
1 week
```

Tasks:

- Booking model
- Booking API
- Capacity check
- Transaction-safe booking
- My bookings page
- Cancel booking
- Waitlist basic structure
- Booking status UI

## Phase 4 — Payment Layer

Duration:

```txt
3-5 days
```

Tasks:

- Payment model
- Manual payment status
- Payment adapter interface
- Checkout placeholder
- Webhook route
- Admin payment page

## Phase 5 — Check-in and Queue

Duration:

```txt
1 week
```

Tasks:

- Session participants
- Admin check-in
- No-show action
- Add to queue
- Queue reorder
- Queue remove
- Next-up calculation

## Phase 6 — Court Assignment and Timer

Duration:

```txt
1 week
```

Tasks:

- Court assignment model
- Assignment players
- Auto-suggest next 4 players
- Manual assignment
- Start game
- End game
- Extend timer
- Court status update

## Phase 7 — Realtime and TV Liveboard

Duration:

```txt
1 week
```

Tasks:

- Socket.IO setup
- Liveboard snapshot endpoint
- TV route
- Court card UI
- Player avatars on TV
- Countdown timer UI
- Reconnect handling
- Event broadcasting

## Phase 8 — Polish, QA, Deployment

Duration:

```txt
1 week
```

Tasks:

- Error handling
- Loading states
- Form validation
- Permission testing
- Capacity race condition testing
- Seed demo data
- Deployment
- Production environment setup
- Basic monitoring
