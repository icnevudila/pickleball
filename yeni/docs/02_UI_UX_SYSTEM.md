# 02 — UI / UX System

## Visual direction

The chosen direction is **coral red + cream**.

This gives the product a warmer and more ownable identity than blue, while staying more premium than a pure orange sports-app look.

## Design tokens

| Token | Value | Usage |
|---|---:|---|
| Primary coral | `#F04F2A` | Primary actions, active states, progress |
| Deep coral | `#B83A22` | Hover, emphasis, strong labels |
| Cream background | `#FFF8F1` | Main app background |
| Warm card | `#FFFFFF` | Panels and cards |
| Graphite | `#211A1D` | Primary text |
| Muted text | `#7D6D66` | Secondary text |
| Soft border | `#F0D6CA` | Card borders, dividers |
| Amber | `#FFB703` | Energy accent, hot slots, challenges |
| Green | `#1F9D55` | Active court, paid, confirmed |
| Red | `#C0392B` | Cancellation, failed payment |

## Component principles

### Cards should act like product modules

Each card needs:

- A clear title
- A state/status
- One primary action
- Supporting data

Avoid generic cards with random numbers.

### Court cards

Court card states:

- Active
- Available
- Next soon
- Maintenance
- Cleaning
- Reserved

Court cards should always show:

- Court name
- Current state
- Current or next booking
- Time remaining or next start
- One action: Start, End, Call next, Block, Open match

### Queue cards

Queue cards should show:

- Player/group name
- Group size
- Desired time window
- Waiting time
- Readiness level
- Action: Call, Offer slot, Skip, Remove

### Booking slots

Slot hierarchy:

1. Available selected slot
2. Available slot
3. Hot / last slot
4. Reserved slot
5. Blocked slot

### Player activity cards

Inspired by sport activity feeds:

- Player avatar
- Activity type
- Match metadata
- Result or duration
- Social proof: kudos, comments, ranking points

## UX rules

1. Never hide the next operational action.
2. Public booking must be possible in under one minute.
3. Queue actions should be reversible.
4. Staff screens must avoid marketing copy.
5. Player-facing screens can be more emotional.
6. Use coral for action, not decoration.
7. Use amber sparingly for urgency and energy.
8. Keep money and payment status highly visible.

## Motion guidance

Recommended micro-interactions:

- Slot selection: subtle scale and border transition
- Queue call: status pulse for 10 seconds
- Court countdown: progress ring/bar
- Booking confirmation: short success state
- Liveboard updates: fade/change, no heavy animations

## Accessibility notes

- Coral text should not be used on cream without enough contrast.
- Use icons plus text for statuses.
- Liveboard must work from distance: large type, high contrast.
- Public booking should be fully usable with one hand on mobile.
