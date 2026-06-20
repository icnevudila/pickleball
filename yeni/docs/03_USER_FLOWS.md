# 03 — User Flows

## Flow A — Club onboarding

1. Owner visits landing page
2. Starts trial / demo
3. Creates club account
4. Adds club details
5. Adds courts
6. Sets opening hours
7. Sets base pricing
8. Sets cancellation and deposit rules
9. Publishes public booking link
10. Invites staff

Success state: club can receive bookings from the public link.

## Flow B — Player books a court

1. Player opens public booking link
2. Selects date
3. Selects time
4. Selects court or lets system assign best court
5. Adds player details
6. Adds teammates or marks open spots
7. Pays deposit or confirms booking
8. Receives confirmation
9. Booking appears in admin Command Center

Exception states:

- Slot taken during checkout
- Payment failed
- Booking requires staff approval
- Player joins waiting list instead

## Flow C — Staff manages live courts

1. Staff opens Command Center
2. Sees active courts and next ending court
3. Marks a match as started
4. Countdown begins
5. Payment status is visible
6. Staff gets alert when match is about to end
7. Staff ends match
8. Court moves to cleaning/available state
9. Next reservation or queue candidate is shown

## Flow D — Queue / waiting list

1. Player joins queue from public booking or front desk
2. Staff sees player in Queue screen
3. System detects a free or cancelled slot
4. Staff sends offer to first eligible player
5. Player accepts within time limit
6. Booking is created
7. Queue item is resolved

Rules:

- Queue has priority order but staff can override.
- Call offers should expire.
- Skips should be logged.
- Repeat no-shows can be flagged.

## Flow E — Open match

1. Staff or player creates open match
2. Match has level, time, court and player slots
3. Players join open seats
4. Deposit is collected if needed
5. When full, match becomes confirmed
6. Match appears on liveboard and player activity feed

## Flow F — Player community loop

1. Player books or joins match
2. Match is played
3. Result/activity is added
4. Player earns ranking points or streak progress
5. Player appears in club leaderboard/challenge
6. Player receives next booking/open match prompt

This loop is the retention engine.
