# Testing and QA Plan

## Testing Goals

The system must be reliable during live club operations.

Critical areas:

- Booking capacity
- Payment status
- Check-in
- Queue order
- Court assignment
- Timer state
- Realtime updates
- Admin permissions

## Critical Test Cases

### Booking

- Player can book open session.
- Player cannot book cancelled session.
- Player cannot book same session twice.
- Session capacity cannot be exceeded.
- Expired pending payment releases spot.
- Waitlist works when full.

### Payment

- Admin can mark payment as paid.
- Player cannot mark payment as paid.
- Paid booking becomes confirmed.
- Failed payment does not confirm booking.
- Duplicate webhook does not double-update payment.

### Check-in

- Admin can check in confirmed player.
- Admin cannot check in cancelled booking.
- Player marked no-show leaves active flow.
- Checked-in player can be added to queue.

### Queue

- Queue positions are assigned correctly.
- Removing player recalculates positions.
- Drag/drop reorder persists.
- Next-up group uses first 4 waiting players.
- Player cannot be in queue twice.

### Court Assignment

- Available court can receive assignment.
- Occupied court cannot receive another active assignment.
- Assignment requires 4 players for doubles MVP.
- Assigned players become PLAYING.
- Queue entries become PLAYING or removed from waiting.
- Admin can manually assign players.
- Admin override is logged.

### Timer

- Timer starts when game starts.
- Remaining time is calculated correctly.
- Ending soon state appears.
- Time up state appears.
- Time up does not auto-end game in MVP.
- Admin can end game manually.
- Admin can extend timer.
