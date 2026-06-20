# UI / UX Plan

## Design Direction

The product should feel like a modern sports operations dashboard.

Keywords:

- Live
- Clean
- Energetic
- High contrast
- Fast
- Operational
- TV-readable

## Visual Style

Recommended:

- Dark theme for liveboard
- Light or mixed theme for admin/player dashboard
- Large court cards
- Rounded player avatar cards
- Strong status badges
- Smooth transitions
- No excessive animation

## TV Liveboard Design Rules

TV screen must be readable from distance.

Rules:

- Large fonts
- High contrast
- Few columns
- No tiny metadata
- No complex tables
- No forms
- No scroll dependency for critical information
- Use simple animation only when state changes

## TV Layout

```txt
Header
- Club logo
- Session name
- Current time
- Capacity

Main
- Court grid

Bottom
- Next up
- Waiting queue ticker
```

## Admin UX

Admin is used during pressure. Keep it practical.

Admin actions should be:

- Big enough to tap/click quickly
- Clearly labeled
- Protected by confirmation only when dangerous
- Fast feedback after click

## Player UX

Player should not need to understand club operations.

Player flow should be simple:

```txt
Choose session
↓
Reserve
↓
Pay
↓
Show confirmation
```
