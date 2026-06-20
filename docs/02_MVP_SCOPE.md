# MVP Scope

## MVP Goal

Build the smallest version of the product that proves the complete live club operation:

```txt
Book online → confirm payment status → check in → queue → court assignment → TV liveboard → match timer → game end → next group
```

## MVP Must-Have Features

### 1. Authentication

- Player registration
- Player login
- Admin login
- JWT/session authentication
- Role-based route protection

### 2. Player Profile

- First name
- Last name
- Nickname
- Phone
- Email
- Avatar upload
- Display name preference

Display options:

- Full name
- First name only
- Nickname
- Initials fallback

### 3. Court Management

Admin can:

- Create court
- Edit court
- Activate/deactivate court
- Set court status

Court statuses:

- AVAILABLE
- OCCUPIED
- RESERVED
- MAINTENANCE
- CLOSED

### 4. Session Management

Admin can create a session.

Session fields:

- Name
- Description
- Date
- Start time
- End time
- Max players
- Price
- Game duration minutes
- Skill level
- Assigned courts
- Status

Session statuses:

- DRAFT
- OPEN
- FULL
- IN_PROGRESS
- COMPLETED
- CANCELLED

### 5. Player Booking

Player can:

- See session list
- Open session detail
- Book spot
- See booking confirmation
- View own bookings
- Cancel booking if allowed

Booking statuses:

- PENDING_PAYMENT
- CONFIRMED
- WAITLISTED
- CANCELLED
- EXPIRED
- REFUNDED
- NO_SHOW
- COMPLETED

### 6. Capacity Control

Rules:

- Confirmed bookings cannot exceed max players.
- Pending payment can hold a spot for limited time.
- Expired payment hold releases capacity.
- Admin can manually override only with explicit confirmation.

### 7. Payment Status

MVP must include:

- Manual payment status update
- Payment records
- Payment adapter interface
- Webhook-ready backend endpoint

Actual online payment can be enabled if provider setup is ready.

### 8. Check-in

Admin can:

- View booked players
- Mark player as checked-in
- Mark player as no-show
- Add walk-in player
- Move checked-in player to queue

### 9. Queue Management

Admin can:

- View queue
- Add checked-in player to queue
- Remove player from queue
- Reorder queue with drag and drop
- Lock next-up group
- Clear queue at session end

### 10. Court Assignment

System can:

- Detect available court
- Take next 4 eligible players
- Create assignment
- Split into Team A and Team B
- Set players to PLAYING
- Set court to OCCUPIED

Admin can:

- Override suggested group
- Assign players manually
- Swap players
- Start game
- End game
- Extend timer

### 11. Timer

MVP rule:

- Timer reaching zero does not automatically end the match.
- It marks court as TIME_UP / ENDING_SOON.
- Admin ends the game manually.

### 12. TV Liveboard

TV must show:

- Session name
- Current time
- Checked-in count
- Capacity
- Waiting count
- Court cards
- Player photos
- Team names
- Timer
- Court status
- Next-up group
- Queue ticker

TV must be read-only.

## MVP Will-Not-Have Features

- Tournament bracket
- Ranking
- League standings
- Complex player rating system
- Native mobile app
- Push notification
- Loyalty points
- Complex memberships
- Multi-club admin UI
- Automated refunds
- Skill-based automatic matchmaking
