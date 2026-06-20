# UI/UX Design Brief

## Product Summary

A pickleball club management platform where players reserve open-play sessions online, admins manage check-ins and court rotation, and a TV liveboard displays live courts, players, photos, timers, next-up groups, and waiting queue.

## Primary Experience Goals

### Player

The player should feel:

```txt
I know what sessions exist.
I know whether there is space.
I can reserve quickly.
I know if I paid.
I know when I am next.
```

### Admin

The admin should feel:

```txt
I can control the whole session from one screen.
I can fix mistakes quickly.
I can override the system.
I can trust the liveboard.
```

### TV Viewer

The viewer should feel:

```txt
I can see who is playing.
I can see how much time is left.
I can see who is next.
I do not need to ask staff.
```

## Design Personality

```txt
Modern
Sporty
Confident
Live
Readable
Operational
Premium but not over-designed
```

## UX Strategy

### Main Idea

Separate the system into three experience modes:

1. Player booking mode
2. Admin operation mode
3. TV broadcast mode

Each mode has different priorities.

## Experience Mode Priorities

### Player Booking Mode

Priority order:

1. Available sessions
2. Available spots
3. Price
4. Skill level
5. Payment
6. Booking confirmation
7. Queue status

### Admin Operation Mode

Priority order:

1. Current session
2. Court status
3. Checked-in players
4. Waiting queue
5. Suggested next group
6. Timer
7. Override tools
8. Payment flags

### TV Broadcast Mode

Priority order:

1. Court identity
2. Playing players
3. Team split
4. Remaining time
5. Available courts
6. Next-up group
7. Waiting queue
8. Session capacity

## Design Rule

Do not make one UI serve all users.

The player, admin, and TV screens should share visual language but have different layouts.

## MVP Screens

### Player

- Landing / session discovery
- Session list
- Session detail
- Booking confirmation
- My bookings
- Live status

### Admin

- Dashboard
- Session management
- Booking management
- Payment management
- Liveboard control
- Player search/check-in

### TV

- TV liveboard
- Session ended state
- No active session state
- Reconnecting state

## Emotional Goal

The club should feel organized.

Players should stop asking:

```txt
When am I up?
Who is next?
Which court is open?
How much time is left?
```

The screen answers before they ask.
