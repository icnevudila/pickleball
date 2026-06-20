# Player Booking UX

## Goal

The player should book a session in under one minute.

## Player UX Principles

- Use plain language
- Show availability clearly
- Keep payment step obvious
- Do not expose admin operation complexity
- Always show current booking status

## Main Player Flow

```txt
Open Sessions
↓
Choose date/session
↓
View details
↓
Reserve spot
↓
Pay or confirm
↓
See booking confirmation
```

## Session Card UX

Each session card should show:

```txt
Session name
Date
Time
Skill level
Price
Available spots
Book button
```

## Session Card States

### Open

Button:

```txt
Reserve spot
```

Badge:

```txt
OPEN
```

### Few Spots Left

Button:

```txt
Reserve spot
```

Badge:

```txt
FEW SPOTS
```

### Full With Waitlist

Button:

```txt
Join waitlist
```

Badge:

```txt
WAITLIST
```

### Full Without Waitlist

Button disabled:

```txt
Full
```

Badge:

```txt
FULL
```

### Cancelled

Button disabled:

```txt
Cancelled
```

Badge:

```txt
CANCELLED
```

## Booking Confirmation Screen

Show:

- Confirmation status
- Session name
- Date/time
- Payment status
- Check-in instructions
- Add to calendar button
- View my bookings button

Example copy:

```txt
You’re booked for Friday Open Play.
Arrive 10 minutes early and check in at the desk.
```

## Payment UX

### Online Payment

Flow:

```txt
Reserve spot
↓
Checkout
↓
Payment success
↓
Booking confirmed
```

Important UI:

- Show hold timer if capacity is temporarily held
- Show amount clearly
- Do not let client edit price
- Show failed payment recovery button

### Manual Payment

Flow:

```txt
Reserve spot
↓
Booking pending payment
↓
Pay at club/front desk
↓
Admin marks paid
```

Copy:

```txt
Your spot is reserved. Payment will be collected at the club.
```

## Player Live Status

When session is active, player sees:

```txt
Your status: Waiting
Queue position: #5
Estimated group: Next 2 rotations
```

MVP can avoid estimated wait time if not reliable.

Better no estimate than fake confidence.

## Mobile Layout

Player booking must be mobile-first.

Mobile screen order:

1. Header
2. Session filter
3. Session cards
4. Booking CTA
5. Profile/status link

## Error Messages

### Session Full

```txt
This session is full. You can join the waitlist.
```

### Payment Failed

```txt
Payment did not go through. Your spot is not confirmed yet.
```

### Duplicate Booking

```txt
You already have a booking for this session.
```

### Booking Expired

```txt
Your payment time expired. Please reserve again.
```

## UX Acceptance Criteria

- Player can understand session availability immediately.
- Player can reserve with one primary CTA.
- Player sees payment status after booking.
- Player sees live status after check-in.
- Player never sees admin-only terms like assignment id, participant id, or transaction.
