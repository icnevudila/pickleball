# 01 — Information Architecture

## Public surfaces

### Landing page

Purpose: sell PadelOS to club owners.

Sections:

1. Hero with product preview
2. Pain points: empty courts, manual WhatsApp, queue chaos, missed payments
3. Liveboard preview
4. Public booking flow
5. Queue automation
6. Player community
7. Pricing / demo CTA
8. FAQ

### Public booking page

Purpose: let players reserve without seeing admin app.

Main areas:

- Club header
- Date selector
- Time slot selector
- Court selector
- Player details
- Payment/deposit
- Confirmation

### Liveboard display

Purpose: screen displayed at club reception or wall monitor.

Main areas:

- Active courts
- Remaining time
- Next matches
- Queue call status
- Announcements

## Auth surfaces

### Login

- Email / password
- Magic link option
- Staff role indicator
- Club switcher for multi-club users

### Onboarding

- Create club
- Add courts
- Add prices
- Set cancellation policy
- Publish booking link

## Admin app surfaces

### Command center

The main operating screen. Shows current day status, live courts, next reservations, queue, payment alerts and quick actions.

### Courts

Court grid, court availability, schedule timeline, quick block/unblock, maintenance mode and pricing.

### Court detail

Court-specific schedule, current match, next match, booking rules, price rules, maintenance log and display name.

### Queue

Waiting list, called players, expired calls, auto-fill suggestions and empty slot recovery.

### Reservations

Booking calendar, list view, filters, status, payment and cancellation actions.

### Players

Player database, profiles, levels, tags, notes, activity history and balance.

### Community

Leaderboard, challenges, open matches and club activity feed.

### Payments

Revenue summary, unpaid bookings, refunds, deposits, payment method status and payouts.

### Settings

Club profile, public booking URL, roles, permissions, pricing, cancellation policy, notifications and integrations.

## Navigation recommendation

### Web admin

Left sidebar:

- Command
- Courts
- Queue
- Reservations
- Players
- Community
- Payments
- Settings

### Mobile admin

Bottom tabs:

- Live
- Courts
- Queue
- Bookings
- More

### Public booking mobile

No app chrome. Keep it light and focused.
