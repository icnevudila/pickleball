# Admin Panel Specification

## Purpose

The admin panel is the operational control center for the pickleball club.

It must be fast, clear, and reliable. Admins will use it during live play, so every action should be obvious.

## Admin Routes

```txt
/admin/dashboard
/admin/courts
/admin/sessions
/admin/sessions/create
/admin/sessions/:sessionId
/admin/liveboard/:sessionId
/admin/bookings
/admin/players
/admin/payments
/admin/settings
```

## Dashboard

Dashboard cards:

- Today's sessions
- Active session
- Total bookings today
- Checked-in players
- Waiting players
- Active courts
- Unpaid bookings
- Next session

Quick actions:

- Create session
- Open liveboard
- Check in player
- Add walk-in

## Admin Liveboard

This is the most important admin screen.

### Layout

```txt
Top Bar
- Session name
- Current time
- Session status
- Open TV button
- Start/end session controls

Main Area
- Court cards

Side Panel
- Checked-in players
- Waiting queue
- No-show list
```

### Court Card Admin Actions

Each court card should allow:

- Assign players
- Start game
- End game
- Extend timer
- Set available
- Set maintenance
- Set closed

### Queue Controls

- Drag and drop reorder
- Add player
- Remove player
- Move player to top
- Lock next-up
- Auto-build next group

## Walk-in Player Flow

Admin can add walk-in player.

Options:

- Existing user
- Guest user

Guest fields:

- Name
- Phone optional
- Avatar optional
- Payment status
- Notes

## Admin UX Rules

- Actions must show loading state.
- Failed actions must show clear error.
- Liveboard actions should optimistically update only if rollback is handled.
- Admin should always know current session context.
- Avoid tiny buttons during live operations.
- Use big primary actions for check-in/start/end.
