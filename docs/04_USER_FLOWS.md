# User Flows

## 1. Player Registration Flow

```txt
Open website
↓
Click Register
↓
Enter name, email, phone, password
↓
Accept terms
↓
Create account
↓
Redirect to profile setup
↓
Upload avatar or skip
↓
Go to sessions page
```

## 2. Player Booking Flow

```txt
Player logs in
↓
Opens sessions page
↓
Filters by date
↓
Selects session
↓
Views details
↓
Clicks Reserve Spot
↓
System checks capacity
↓
Booking is created
↓
Payment step starts or manual payment status is assigned
↓
Booking confirmed
↓
Player sees confirmation
```

## 3. Payment Flow

```txt
Player reserves spot
↓
Backend creates booking with PENDING_PAYMENT
↓
Backend creates payment record
↓
Player goes to checkout
↓
Payment provider returns success/failure
↓
Webhook updates payment status
↓
Booking becomes CONFIRMED if payment PAID
```

## 4. Player Arrival / Check-in Flow

```txt
Player arrives at club
↓
Admin opens session participants
↓
Admin finds player
↓
Clicks Check In
↓
participant.status = CHECKED_IN
↓
Player appears in checked-in list
↓
Admin or system adds player to queue
```

## 5. Automatic Court Assignment Flow

```txt
Court becomes AVAILABLE
↓
System checks queue
↓
If at least 4 waiting players exist
↓
System selects first 4 players
↓
Creates court assignment
↓
Splits players into Team A and Team B
↓
Updates players to PLAYING
↓
Updates court to OCCUPIED
↓
Broadcasts realtime event
↓
TV liveboard updates
```

## 6. Admin Override Flow

```txt
Admin opens liveboard management
↓
Admin drags queue player to different position
↓
System updates queue positions
↓
Realtime event broadcasts
↓
TV updates next-up list
```

## 7. Timer Flow

```txt
Admin starts game
↓
court_assignment.started_at is set
↓
duration_minutes is set
↓
TV calculates remaining time
↓
When remaining time reaches warning threshold
↓
Court card shows ending soon
↓
When time reaches zero
↓
Court card shows time up
↓
Admin ends game manually
```

## 8. TV Liveboard Flow

```txt
TV opens /liveboard/tv/:sessionId
↓
Fetches initial liveboard snapshot
↓
Subscribes to realtime channel
↓
Renders court cards
↓
Receives events
↓
Updates display without refresh
```
