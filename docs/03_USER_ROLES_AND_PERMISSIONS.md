# User Roles and Permissions

## Roles

The system uses role-based access control.

Initial roles:

- SUPER_ADMIN
- CLUB_ADMIN
- STAFF
- PLAYER
- TV_VIEWER

For MVP, `CLUB_ADMIN`, `STAFF`, and `PLAYER` are enough. `SUPER_ADMIN` is reserved for future multi-club SaaS.

## Role Definitions

### CLUB_ADMIN

Primary club manager.

Can:

- Manage club settings
- Manage courts
- Manage sessions
- Manage bookings
- Manage payments
- Manage players
- Manage liveboard
- Assign staff permissions
- View reports

### STAFF

Operational staff.

Can:

- View sessions
- Check in players
- Manage queue
- Assign players to courts
- Start and end games
- Change court status

Cannot:

- Change payment provider settings
- Delete sessions permanently
- Manage club billing
- Manage user roles
- Access sensitive reports unless allowed

### PLAYER

Regular player.

Can:

- Register
- Login
- Edit own profile
- Upload avatar
- Book sessions
- View own bookings
- Cancel own booking if allowed
- View liveboard
- View own queue position

Cannot:

- Access admin panel
- Modify other players
- Assign courts
- Change queue order
- View private payment data of others

### TV_VIEWER

Read-only public display.

Can:

- View TV liveboard for selected session

Cannot:

- Perform any write action
- See sensitive contact/payment data

## Permission Matrix

| Feature | Club Admin | Staff | Player | TV |
|---|---:|---:|---:|---:|
| Manage courts | Yes | Limited | No | No |
| Create sessions | Yes | Optional | No | No |
| Book session | Optional | Optional | Yes | No |
| Cancel own booking | Yes | Yes | Yes | No |
| Cancel any booking | Yes | Optional | No | No |
| Manage payments | Yes | No/Limited | No | No |
| Check-in players | Yes | Yes | No | No |
| Manage queue | Yes | Yes | No | No |
| Assign courts | Yes | Yes | No | No |
| Start/end games | Yes | Yes | No | No |
| View TV liveboard | Yes | Yes | Yes | Yes |
| Manage roles | Yes | No | No | No |

## Display Privacy

Player profile should include `display_name_preference`.

Options:

- FULL_NAME
- FIRST_NAME_ONLY
- NICKNAME
- INITIALS

TV liveboard should use the display name, not necessarily legal/full name.
