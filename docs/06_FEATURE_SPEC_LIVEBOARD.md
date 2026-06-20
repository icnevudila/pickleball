# Feature Specification: TV Liveboard and Live Court Operations

## Purpose

The liveboard module shows real-time court activity on a TV screen and gives admins tools to manage check-ins, queue, assignments, game timers, and court status.

This is the signature feature of the product.

## Liveboard Types

### Admin Liveboard

Route:

```txt
/admin/liveboard/:sessionId
```

Purpose:

- Operational control
- Check-in
- Queue management
- Assignment
- Timer control
- Court status control

### TV Liveboard

Route:

```txt
/liveboard/tv/:sessionId
```

Purpose:

- Public display
- No buttons
- No sensitive data
- Optimized for large screens

### Player Liveboard

Route:

```txt
/player/liveboard/:sessionId
```

Purpose:

- Player sees own queue status
- Player sees court assignments
- Player sees next-up group

## TV Liveboard Content

TV should display:

- Club logo/name
- Session name
- Current time
- Session time range
- Checked-in count
- Capacity
- Waiting count
- Court cards
- Player photos
- Team A vs Team B
- Countdown timer
- Court status
- Next-up group
- Waiting queue ticker
- Optional announcements

## Court Card States

### AVAILABLE

Shows:

```txt
Court 1
Available
Next up: Player A, Player B, Player C, Player D
```

### OCCUPIED / PLAYING

Shows:

```txt
Court 1
Team A vs Team B
Player photos
Time left: 07:42
```

### ENDING_SOON

Shows:

```txt
Court 1
Ending Soon
Time left: 01:00
```

### TIME_UP

Shows:

```txt
Court 1
Time Up
Waiting for admin
```

## Timer Logic

Each active court assignment has:

```txt
started_at
duration_minutes
ends_at
timer_status
```

Timer status:

```txt
NOT_STARTED
RUNNING
ENDING_SOON
TIME_UP
COMPLETED
```

### MVP Rule

Timer does not auto-complete the game.

Instead:

```txt
Time reaches zero
↓
TV shows TIME_UP
↓
Admin clicks End Game
```

## Auto Assignment

MVP auto assignment:

```txt
When court available and queue has >= 4 players:
    take first 4 waiting players
    assign Player 1 + Player 2 to Team A
    assign Player 3 + Player 4 to Team B
```

Recommended MVP:

```txt
Suggest group, admin confirms.
```

## Acceptance Criteria

- TV board loads initial state.
- TV board receives realtime updates.
- Player photos appear correctly.
- Fallback initials appear when no avatar exists.
- Timer counts down visibly.
- Admin actions update TV within 1 second under normal conditions.
- Queue updates without refresh.
- Court cannot have two active games.
- Admin override is logged.
