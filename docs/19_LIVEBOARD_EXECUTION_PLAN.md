# Liveboard Execution Plan

## Goal

Turn liveboard into the main operational surface of the product, with admin actions reflected on the public TV screen through a single snapshot and event pipeline.

## Current State

- UI language is aligned across TV and admin liveboard.
- TV liveboard now has alert center and ticker layers.
- Data is still mostly mock-driven.
- A liveboard snapshot source and API route now exist:
  - `src/lib/liveboard/source.ts`
  - `src/app/api/sessions/[sessionId]/liveboard/route.ts`

## Target Flow

```txt
Admin action
-> Validate role and payload
-> Update session / queue / court tables
-> Insert liveboard_events row
-> Broadcast realtime notification
-> TV and admin screens refresh snapshot
```

## Priority Actions

1. `start_game`
2. `end_game`
3. `extend_time`
4. `call_next_group`
5. `mark_no_show`
6. `free_court`

## Snapshot Payload

The liveboard snapshot should always include:

- session summary
- active court assignments
- waiting queue
- recent liveboard events
- generated timestamp
- source mode (`mock` or `supabase`)

## Realtime Strategy

MVP in this codebase should prefer:

1. initial snapshot fetch from `/api/sessions/:sessionId/liveboard`
2. Supabase realtime channel for `liveboard_events`
3. client refetch on event receipt

This keeps the database as source of truth and avoids per-second broadcast spam.

## Audio And Effect Layer

Liveboard should not play random sounds. It should react to explicit event types.

Initial cue matrix:

- `game.started`: voice + success tone
- `game.ending_soon`: warning tone
- `game.time_up`: voice + alert tone
- `game.ended`: voice + soft chime
- `queue.updated`: voice + soft chime
- `player.no_show`: voice + alert tone
- `court.status.changed`: tone only

Each cue should have a matching visual emphasis:

- ticker badge color
- temporary alert card focus
- court card pulse or border accent
- optional fullscreen modal for critical events only

## Next Build Steps

- Move TV route to consume `getLiveboardSnapshot`.
- Move admin liveboard to consume the same source.
- Add admin mutation endpoints for the priority actions.
- Publish `liveboard_events` from each mutation.
- Subscribe on client and refetch snapshot on event.
- Add optional sound triggers based on event type and timer thresholds.
