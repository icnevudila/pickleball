# Implementation Notes

## Important Architecture Choices

### Session booking first

The MVP should use session booking as the main booking model.

Reason:

- It supports open play.
- It supports queue.
- It supports automatic court assignment.
- It supports TV liveboard.
- It matches the real operation flow.

Private court rental can be added later.

### Timer should be client-calculated

Do not broadcast timer every second.

Backend sends:

```txt
started_at
duration_minutes
server_time
```

Frontend calculates remaining time.

### Admin confirms auto assignment

MVP should suggest the next 4 players, not instantly force them into court.

Reason:

Real staff may need to adjust grouping.

### Always keep `club_id`

Even with one club, add `club_id` to core tables.

This makes future SaaS/multi-club expansion possible.

## Suggested Stack

```txt
Frontend:
Next.js + TypeScript + Tailwind + Shadcn UI

Backend:
NestJS + TypeScript + Prisma + PostgreSQL

Realtime:
Socket.IO

Storage:
S3-compatible storage or Supabase Storage

Payment:
Adapter pattern with manual fallback
```

## Development Warning

Do not let TV design drive backend architecture.

The visual screen is easy. The difficult part is the live state machine:

```txt
BOOKED
CHECKED_IN
WAITING
PLAYING
COMPLETED
NO_SHOW
CANCELLED
```

Get the state model right first.
