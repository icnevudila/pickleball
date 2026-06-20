# Component System

## Component Categories

```txt
Foundation
Navigation
Cards
Forms
Status
Players
Liveboard
Admin controls
Tables
Feedback
```

## Foundation Components

### App Shell

Used for player/admin pages.

### TV Shell

Used for TV liveboard only.

### Page Header

Includes title, subtitle, actions.

## Navigation Components

### Player Top Nav

Items:

- Sessions
- My Bookings
- Live Status
- Profile

### Admin Sidebar

Items:

- Dashboard
- Sessions
- Courts
- Bookings
- Payments
- Players
- Liveboard
- Settings

## Card Components

### Session Card

Props:

```txt
name
date
startTime
endTime
price
skillLevel
capacity
bookedCount
status
```

### Court Card

Props:

```txt
courtName
status
assignment
timer
nextUp
actions
```

### Stat Card

Props:

```txt
label
value
trend optional
status optional
```

## Player Components

### Avatar

Variants:

```txt
photo
initials
guest
hidden
```

Sizes:

```txt
sm
md
lg
tv
```

### Player Row

Used in admin lists.

Shows:

- Avatar
- Display name
- Status
- Payment badge
- Action button

### Player Tile

Used on TV.

Shows:

- Avatar
- Display name
- Team

## Status Components

### Status Badge

Statuses:

```txt
OPEN
FULL
WAITLIST
PAID
UNPAID
CHECKED IN
WAITING
PLAYING
AVAILABLE
TIME UP
MAINTENANCE
```

### Live Indicator

Small pulsing dot and label:

```txt
LIVE
SYNCED
RECONNECTING
```

## Liveboard Components

### Timer

Props:

```txt
startedAt
durationMinutes
serverTime
status
```

### Next-Up Group

Shows four players.

### Queue Ticker

Shows compact queue list.

### Court Assignment Builder

Admin-only component for selecting players and teams.

## Admin Controls

### Primary Actions

- Check in
- Assign & start
- End game
- Mark paid

### Secondary Actions

- Extend time
- Reorder
- Edit group
- View details

### Dangerous Actions

- Cancel booking
- Remove from queue
- Mark no-show
- End session
- Force court available

## Form Components

### Input

### Select

### Date picker

### Time picker

### Capacity input

### Price input

### Avatar upload

## Feedback Components

### Toast

Used for quick feedback.

### Modal

Used for confirmation.

### Empty State

Used for no data.

### Error Banner

Used for serious operational errors.

## Component Naming

Recommended names for frontend:

```txt
SessionCard
CourtCard
LiveCourtCard
PlayerAvatar
PlayerRow
PlayerTile
QueueList
QueueTicker
NextUpGroup
TimerDisplay
StatusBadge
LiveIndicator
AdminActionBar
CourtAssignmentBuilder
```
