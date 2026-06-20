# Pickleball Booking & Liveboard Management System

## Overview

Pickleball Booking & Liveboard Management System is a web platform for pickleball clubs that need online session booking, payment handling, player check-in, queue management, court rotation, admin controls, and a real-time TV liveboard.

The system is designed for one club in the MVP, but the database and backend architecture should be built with future multi-club support.

## Core Use Case

A player books a pickleball session online, optionally pays online, arrives at the club, gets checked in, enters the queue, is assigned to a court, appears on the TV liveboard with photo and timer, then rotates out when the match ends.

## Main Product Flow

```txt
Player registers / logs in
↓
Player chooses an open play session
↓
Player books a spot
↓
Payment is completed or marked manually
↓
Booking becomes confirmed
↓
Player arrives at club
↓
Admin checks player in
↓
Player enters waiting queue
↓
System assigns next players to available court
↓
TV liveboard updates in real time
↓
Match timer starts
↓
Admin ends match
↓
Court becomes available
↓
Next group is assigned
```

## Target Users

### Players

Players use the system to:

- Create an account
- Upload profile photo
- View available sessions
- Book a session
- Pay or see payment status
- View upcoming bookings
- Cancel or request reschedule
- See liveboard status
- See queue position

### Admins / Staff

Admins use the system to:

- Manage courts
- Create sessions
- Set capacity and pricing
- View bookings
- Check in players
- Manage waiting queue
- Assign players to courts
- Start and end games
- Override automatic assignment
- Control liveboard visibility
- Update payment statuses

### TV / Public Display

The TV liveboard shows:

- Current active session
- Court cards
- Player photos
- Team versus layout
- Countdown timers
- Court status
- Next-up players
- Waiting queue
- Session capacity

## MVP Stack Recommendation

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- TanStack Query

### Backend

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Socket.IO

### Storage

- S3-compatible object storage for avatars
- Alternative for MVP: Supabase Storage or local development storage

### Payment

- Payment provider adapter pattern
- Manual payment fallback
- Online payment can be added behind adapter

### Deployment

- Frontend: Vercel
- Backend: Railway / Render / VPS / cloud provider
- Database: PostgreSQL managed instance
- Realtime: Socket.IO server
- Optional Redis for pub/sub and scaling
