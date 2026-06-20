# Realtime Architecture

## Purpose

Realtime architecture keeps the TV liveboard, admin panel, and player screens updated without manual refresh.

## Recommended Technology

MVP:

```txt
Socket.IO
```

Backend:

```txt
NestJS WebSocket Gateway
```

Future scaling:

```txt
Redis adapter for Socket.IO
```

## Source of Truth

The database is the source of truth.

Realtime events are notifications that tell clients to update.

Important rule:

```txt
Never rely only on websocket memory for permanent state.
```

## Realtime Flow

```txt
Admin action
↓
Backend validates permission
↓
Backend updates database in transaction
↓
Backend writes liveboard event
↓
Backend broadcasts socket event
↓
Clients update UI
↓
If needed, clients refetch snapshot
```

## Socket Rooms

```txt
club:{clubId}
session:{sessionId}
liveboard:{sessionId}
admin-liveboard:{sessionId}
player:{userId}
```

## Event Naming

```txt
liveboard.snapshot.updated
player.checked_in
player.no_show
queue.updated
queue.reordered
court.assignment.created
game.started
game.ending_soon
game.time_up
game.ended
court.status.changed
session.status.changed
payment.updated
```

## Timer Handling

Timer should not require a websocket event every second.

Better:

- Server sends `started_at` and `duration_minutes`.
- Client calculates remaining time locally.
- Server sends state changes like STARTED, ENDING_SOON, TIME_UP, ENDED.

This avoids spamming events.
