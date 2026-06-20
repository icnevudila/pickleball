# Product Requirements Document

## 1. Product Name

Working name:

```txt
Pickleball Booking & Liveboard Management System
```

## 2. Problem Statement

Pickleball clubs often manage open play sessions, player capacity, payments, arrivals, court rotation, and waitlists manually through messages, spreadsheets, paper lists, and verbal coordination.

This creates operational problems:

- Players do not know available spots clearly.
- Sessions can be overbooked.
- Payments are hard to track.
- Staff manually decide who plays next.
- Players ask repeatedly when their turn is.
- Courts can stay idle because no one sees the next group.
- Public display is missing or outdated.
- Admin has no reliable live state of the club floor.

## 3. Product Goal

Create a web-based system where players can book sessions online and admins can run the actual live court operation from check-in to court assignment, while a TV liveboard shows the real-time state of the club.

## 4. Primary Objectives

- Let players book sessions online.
- Prevent overbooking with capacity rules.
- Track payment status.
- Let admins check players in.
- Maintain a live waiting queue.
- Assign players to courts automatically.
- Allow admin override at every step.
- Show active courts on TV with player photos and timers.
- Keep all screens updated in real time.
- Build single-club MVP while keeping data model multi-club ready.

## 5. Non-Goals for MVP

The MVP will not include:

- Full tournament bracket engine
- Ranking system
- League standings
- Mobile app
- Push notifications
- AI matchmaking
- Complex skill balancing
- Multi-club admin dashboard
- Coupon system
- Advanced analytics
- Membership subscriptions

## 6. Key Product Principle

The system should be operationally useful before it is visually fancy.

The TV liveboard can look modern and energetic, but it must remain readable from distance.

## 7. User Types

### Player

A player books sessions, pays, checks status, sees queue position, and appears on liveboard when playing.

### Admin

Admin manages the entire system.

### Staff

Staff can check players in and manage liveboard but may not access financial or system settings.

### TV Viewer

Public display mode with no actions.

## 8. Main User Stories

### Player Stories

- As a player, I want to see available sessions so I can choose when to play.
- As a player, I want to reserve a spot online so I do not need to message staff.
- As a player, I want to upload a profile photo so I can appear on the liveboard.
- As a player, I want to see my payment status so I know whether my booking is confirmed.
- As a player, I want to see my queue position so I know when I will play.
- As a player, I want to cancel my booking if I cannot attend.

### Admin Stories

- As an admin, I want to create sessions so players can book them.
- As an admin, I want to set session capacity so the club is not overcrowded.
- As an admin, I want to check players in when they arrive.
- As an admin, I want to see who paid and who has not paid.
- As an admin, I want the system to suggest the next four players automatically.
- As an admin, I want to override the queue when needed.
- As an admin, I want to start and end games from the liveboard screen.
- As an admin, I want to change court status if a court is unavailable.
