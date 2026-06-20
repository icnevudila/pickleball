# HTML Prototype Guide

## Purpose

The HTML prototype is included to show visual direction quickly without needing a full app.

## Files

```txt
prototype-v2/index.html
prototype-v2/player-booking.html
prototype-v2/admin-control.html
prototype-v2/tv-liveboard.html
prototype-v2/design-system.html
prototype-v2/assets/styles.css
prototype-v2/assets/app.js
```

## How To Use

Open:

```txt
prototype-v2/index.html
```

Then click through pages.

## What The Prototype Shows

- Product landing direction
- Player booking flow
- Admin live control screen
- TV liveboard design
- Component system preview
- Timer simulation
- Status badges
- Avatar placeholders
- Queue/next-up visualization

## What The Prototype Does Not Do

- No backend
- No real booking
- No payment integration
- No real websocket
- No database
- No auth
- No real image upload

## Development Translation

Prototype should be converted to:

```txt
Next.js components
Tailwind classes
Shadcn UI base components
Socket.IO state updates
```

## Suggested Component Extraction

From HTML to React:

```txt
LiveIndicator
StatusBadge
PlayerAvatar
PlayerTile
CourtCard
TVLiveboard
AdminLiveboard
SessionCard
QueuePanel
TimerDisplay
```

## Timer Implementation Note

Prototype uses simple JavaScript countdown.

Production should use:

```txt
startedAt
durationMinutes
serverTime
```

and calculate remaining time client-side.

## Design Warning

Do not copy static prototype logic into production.

Use it for layout, visual direction, and component inspiration only.
