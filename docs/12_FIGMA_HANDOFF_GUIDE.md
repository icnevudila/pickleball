# Figma Handoff Guide

## Purpose

This document defines how the UI/UX design should be organized before development.

## Recommended Figma Pages

```txt
00 Cover
01 Foundations
02 Components
03 Player Booking
04 Admin Dashboard
05 Admin Liveboard
06 TV Liveboard
07 Responsive States
08 Prototype Flow
09 Developer Handoff
```

## Foundation Styles

Create styles for:

- Colors
- Typography
- Spacing
- Shadows
- Radius
- Icons
- Status badges

## Component Sets

Create components:

```txt
Button
StatusBadge
PlayerAvatar
PlayerTile
PlayerRow
SessionCard
CourtCard
TimerDisplay
QueueItem
NextUpGroup
AdminSidebar
PageHeader
Modal
Toast
Input
Select
```

## Variants

### Button Variants

```txt
Primary
Secondary
Warning
Danger
Ghost
Disabled
Loading
```

### Status Badge Variants

```txt
Live
Open
Full
Waitlist
Paid
Unpaid
Playing
Available
Ending Soon
Time Up
Maintenance
```

### Court Card Variants

```txt
Available
Playing
Ending Soon
Time Up
Maintenance
Closed
```

### Avatar Variants

```txt
Photo
Initials
Guest
Hidden
```

## Prototype Flows

Create clickable prototype flows:

### Player Booking

```txt
Sessions → Session Detail → Checkout → Confirmation → My Booking
```

### Admin Live Operation

```txt
Dashboard → Liveboard → Check-in → Add Queue → Assign Court → Start Game → End Game
```

### TV Liveboard

```txt
No Active Session → Active Session → Playing → Ending Soon → Time Up → Available
```

## Developer Handoff Requirements

Each final screen should include:

- Desktop layout
- Mobile layout if player-facing
- Empty state
- Loading state
- Error state
- Component annotations
- API/state notes where needed

## Measurement Notes

Designers should specify:

- Max content width
- Grid gap
- Card padding
- Avatar sizes
- Badge sizes
- Timer size
- TV safe margins

## Design Token Naming

Example:

```txt
color.bg.primary
color.bg.panel
color.accent.pickle
color.status.playing
color.status.warning
radius.card
radius.badge
shadow.panel
font.size.tv.timer
font.size.page.title
```

## Handoff Rule

Do not hand off only perfect filled states.

The developer needs:

```txt
empty
loading
error
success
offline
reconnecting
time-up
no-player-photo
```
