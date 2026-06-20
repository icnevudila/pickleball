# Interaction and State Rules

## Core State Machine

Player participation states:

```txt
BOOKED
CHECKED_IN
WAITING
PLAYING
COMPLETED
NO_SHOW
CANCELLED
```

The UI must make these states obvious.

## State Transition UX

### BOOKED → CHECKED_IN

Triggered by admin.

UI result:

- Player moves from booked list to checked-in list.
- Toast: `Player checked in`
- TV may update capacity count.

### CHECKED_IN → WAITING

Triggered by admin or auto rule.

UI result:

- Player appears in queue.
- Queue position is assigned.
- TV queue updates.

### WAITING → PLAYING

Triggered by court assignment.

UI result:

- Player leaves waiting queue.
- Player appears on court card.
- Timer starts when game starts.

### PLAYING → COMPLETED

Triggered by admin ending game.

UI result:

- Player removed from active court.
- Court becomes available.
- Next-up group updates.

## Optimistic UI Rules

### Safe for Optimistic Update

- Queue reorder
- Expanding/collapsing panels
- Local filters

### Do Not Optimistically Update Without Server Confirmation

- Payment status
- Booking creation
- Court assignment
- Game start
- Game end
- Check-in

Reason:

These actions affect capacity, money, or live operation.

## Loading States

Use loading states for:

- Booking creation
- Payment confirmation
- Check-in
- Assignment
- Game start/end

## Error Recovery

### Assignment Failed

Message:

```txt
Court is no longer available. Liveboard refreshed.
```

Action:

```txt
Refetch liveboard snapshot.
```

### Payment Failed

Message:

```txt
Payment failed. Booking is not confirmed yet.
```

Action:

```txt
Retry payment.
```

### Realtime Disconnected

Message:

```txt
Reconnecting liveboard...
```

Action:

```txt
Reconnect and refetch snapshot.
```

## Timer Interaction Rules

- Timer starts only after admin clicks start.
- Timer reaching zero does not auto-end game in MVP.
- Admin can extend timer.
- Admin can end game before timer reaches zero.
- Timer state is recalculated using server time.

## Queue Interaction Rules

- Player cannot appear twice in queue.
- Removed player should disappear immediately after server confirms.
- Reorder should update all queue positions.
- Next-up is first four waiting players unless admin locks custom group.

## Admin Confirmation Rules

Require confirmation for:

- End active game
- Remove player from queue
- Mark no-show
- Cancel session
- Force court available
- Refund/mark refunded

No confirmation needed for:

- Check-in
- Add to queue
- Open details
- Filter/search
