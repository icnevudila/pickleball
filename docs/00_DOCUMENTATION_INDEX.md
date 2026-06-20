# Pickleball Booking & Liveboard Management System — Documentation Index

## Project Definition

This project is a web-based pickleball booking, payment, check-in, queue, court assignment, and TV liveboard management system.

The system allows players to book and pay online, while admins manage check-ins, court assignments, player rotation, match timers, and a live TV board showing active courts, player photos, next-up groups, and remaining time.

## Core Product Sentence

Players book and pay online. Admins manage check-ins and courts. The TV liveboard shows live players, photos, match timers, next-up queue, and court status in real time.

## Recommended Documentation Order

1. `README.md`
2. `01_PRODUCT_REQUIREMENTS.md`
3. `02_MVP_SCOPE.md`
4. `03_USER_ROLES_AND_PERMISSIONS.md`
5. `04_USER_FLOWS.md`
6. `05_FEATURE_SPEC_BOOKING.md`
7. `06_FEATURE_SPEC_LIVEBOARD.md`
8. `07_FEATURE_SPEC_PAYMENT.md`
9. `08_ADMIN_PANEL_SPEC.md`
10. `09_DATABASE_DESIGN.md`
11. `10_API_SPEC.md`
12. `11_REALTIME_ARCHITECTURE.md`
13. `12_UI_UX_PLAN.md`
14. `13_DEVELOPMENT_ROADMAP.md`
15. `14_TESTING_QA_PLAN.md`
16. `15_DEPLOYMENT_AND_OPS.md`
17. `16_BACKLOG_AND_SPRINT_TASKS.md`
18. `17_IMPLEMENTATION_NOTES.md`

## Product Strategy

The first version should focus on session-based booking, not private court rental.

Why session booking first?

- It supports open play events.
- It works naturally with check-in.
- It supports player queues.
- It supports automatic player rotation.
- It makes the TV liveboard meaningful.
- It matches real club operations better than a basic appointment calendar.

Private court rental can be added later as Phase 2.

## MVP Decision Summary

| Area | Decision |
|---|---|
| Club model | Single club for MVP, multi-club ready via `club_id` |
| Booking model | Session booking first |
| Court rental | Phase 2 |
| Payment | Payment adapter + manual fallback |
| TV liveboard | Included in MVP |
| Player photos | Included in MVP |
| Auto assignment | Simple FIFO auto assignment |
| Admin override | Required |
| Match timer | Required |
| Realtime updates | Required |
| Ranking | Not in MVP |
| Tournament bracket | Not in MVP |
| Mobile app | Not in MVP |

## Main Modules

- Authentication
- Player profile
- Avatar upload
- Court management
- Session management
- Online booking
- Capacity control
- Payment status
- Check-in
- Waiting queue
- Automatic court assignment
- Admin override
- Match timer
- TV liveboard
- Realtime events
- Audit/liveboard event log
