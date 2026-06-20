# Admin Panel UX

## Goal

Admin should run the entire live session from one control screen.

## Admin UX Principles

- Speed over decoration
- Clear status over clever UI
- Big actions during live play
- Confirm dangerous actions
- Log override actions
- Always show current session context

## Admin Dashboard

### Purpose

Quick overview and entry point.

Dashboard should show:

- Active session
- Today’s sessions
- Checked-in count
- Waiting queue count
- Active courts
- Unpaid bookings
- Quick check-in
- Open liveboard button

## Admin Liveboard Layout

Recommended desktop layout:

```txt
Top bar:
Session name, status, time, TV link, session controls

Main left:
Court cards

Main right:
Checked-in players, queue, next-up

Bottom/side:
Action log or warnings
```

## Court Card Actions

Each court card can show:

- Court name
- Status
- Current players
- Timer
- Start game
- End game
- Extend time
- Mark maintenance
- Assign players

## Queue Management

Queue UI should support:

- Add player
- Remove player
- Move player
- Drag/drop reorder
- Auto-suggest next 4
- Lock next-up group

## Admin Override UX

Admin can override:

- Queue order
- Court assignment
- Team split
- Timer duration
- Court status
- Payment status

Dangerous overrides should show confirmation.

Examples:

```txt
Force end this game?
Remove Maria from queue?
Mark Carlo as no-show?
Set Court 2 to maintenance?
```

## Check-in UX

Admin should search:

```txt
Name
Phone
Email
Booking ID
```

Player rows show:

- Avatar
- Name
- Payment status
- Booking status
- Check-in button
- No-show button

## Payment Flags

Use strong visual signals:

```txt
PAID = green
UNPAID = yellow
FAILED = red
REFUNDED = gray
```

Admin should be able to check in unpaid players only if club policy allows.

Recommended MVP:

```txt
Allow check-in but show unpaid warning.
```

## Mistake Recovery

Admins make mistakes during live operations. Design for recovery.

Examples:

- Undo queue removal for 10 seconds
- Re-add player to queue
- Cancel assignment before start
- Extend timer
- Change court status back to available

## Admin Acceptance Criteria

- Admin can check in a player within 5 seconds.
- Admin can see all court states without scrolling on desktop.
- Admin can identify unpaid players quickly.
- Admin can start/end game quickly.
- Admin can override system suggestions.
- Admin can open TV display link easily.
