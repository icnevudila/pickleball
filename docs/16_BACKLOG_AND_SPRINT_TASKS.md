# Backlog and Sprint Tasks

## Sprint 1 — Foundation

### Backend

- Create NestJS project
- Add config module
- Add PostgreSQL connection
- Add Prisma
- Add users table
- Add clubs table
- Add auth module
- Add JWT strategy
- Add role guard

### Frontend

- Create Next.js app
- Add global layout
- Add auth pages
- Add dashboard shell
- Add API client
- Add protected route handling

### Deliverable

Admin and player can log in.

## Sprint 2 — Courts and Sessions

### Backend

- Add courts model
- Add sessions model
- Add session_courts relation
- Build courts API
- Build sessions API
- Add session status rules

### Frontend

- Admin courts page
- Admin session create page
- Player sessions list
- Session detail page

### Deliverable

Admin creates sessions and players can view them.

## Sprint 3 — Booking and Payment Base

### Backend

- Add bookings model
- Add payments model
- Add capacity transaction logic
- Add manual payment update
- Add payment adapter interface

### Frontend

- Booking button
- Booking confirmation page
- My bookings page
- Admin bookings table
- Admin payment status controls

### Deliverable

Player can book a session and admin can mark payment paid.

## Sprint 4 — Check-in and Queue

### Backend

- Add session_participants model
- Add check-in endpoint
- Add no-show endpoint
- Add waitlist_entries model
- Add queue add/remove/reorder endpoints

### Frontend

- Admin participant list
- Check-in controls
- Queue panel
- Drag/drop queue reorder

### Deliverable

Admin can check in players and build a queue.

## Sprint 5 — Court Assignment and Timer

### Backend

- Add court_assignments model
- Add court_assignment_players model
- Add suggest next group endpoint
- Add manual assignment endpoint
- Add start/end/extend game endpoints
- Add active court assignment guard

### Frontend

- Admin court cards
- Assignment builder
- Start/end game controls
- Timer display

### Deliverable

Admin can run live games.

## Sprint 6 — Realtime and TV Liveboard

### Backend

- Add Socket.IO gateway
- Add liveboard snapshot endpoint
- Broadcast liveboard events
- Add reconnect-safe snapshot logic

### Frontend

- TV liveboard route
- Player avatar tiles
- Court cards
- Countdown timer
- Next-up group
- Queue ticker
- Realtime subscriptions

### Deliverable

TV liveboard updates live.

## Sprint 7 — QA and Launch

### Tasks

- Full flow QA
- Permission QA
- Race condition tests
- Seed demo data
- Deploy staging
- Deploy production
- Create demo script

### Deliverable

MVP is demo-ready.
