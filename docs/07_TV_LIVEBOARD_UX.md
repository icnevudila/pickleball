# TV Liveboard UX

## Goal

The TV liveboard should answer the room’s questions instantly:

```txt
Who is playing?
How much time is left?
Who is next?
Which court is available?
```

## TV UX Principles

- Big text
- High contrast
- No tiny tables
- No controls
- No private data
- Realtime confidence
- Useful from 3-8 meters away

## TV Layout

Recommended 16:9 layout:

```txt
Header:
Club/session name, live indicator, current time, capacity

Main:
Court cards grid

Bottom:
Next-up group and waiting queue ticker
```

## Court Card

### Playing Card

Must show:

- Court number/name
- Status: Playing
- Team A players
- Team B players
- Player avatars
- Timer
- Ending soon warning

### Available Card

Must show:

- Court number/name
- Status: Available
- Next group if ready

### Time Up Card

Must show:

- Court number/name
- Status: Time up
- Waiting for admin

### Maintenance Card

Must show:

- Court number/name
- Status: Maintenance
- No player information

## Timer UX

Timer should be the largest element in a playing court card.

Timer states:

```txt
Running: normal
Ending soon: yellow
Time up: red/yellow
Completed: hidden or completed badge
```

Warning threshold:

```txt
2 minutes remaining
```

## Player Display

Each player should show:

- Avatar
- Display name
- Team
- Optional status badge

If no photo:

```txt
Show initials
```

If privacy mode:

```txt
Show first name or nickname only
```

## Queue Display

The queue should not overwhelm the screen.

Show:

- Next-up group prominently
- First 6-10 waiting players
- Ticker/scroll if long queue

## TV Realtime States

### Connected

Show small live badge:

```txt
LIVE
```

### Reconnecting

Show visible but not scary message:

```txt
Reconnecting liveboard...
```

### Offline

Show:

```txt
Liveboard offline. Please refresh or contact staff.
```

## Screen Size Variants

### 16:9 Horizontal TV

Use 3-column court grid for 3 courts.

### 4 Courts

Use 2x2 grid.

### 6 Courts

Use 3x2 grid with smaller player tiles.

### Portrait Display

Use vertical court stack and larger queue section.

## Privacy Rules

TV should not show:

- Email
- Phone number
- Payment details
- Full legal name unless player allows it
- Admin notes

TV can show:

- Display name
- Avatar
- Team
- Court
- Queue position

## TV Acceptance Criteria

- Readable from across the room.
- Court status obvious in 2 seconds.
- Timer visible immediately.
- Next-up group obvious.
- TV updates after admin action without refresh.
- Reconnect state is clear.
