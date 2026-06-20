# Pickle Pulse

Full-stack starter for a pickleball club product with:

- mobile-first public booking
- guest and member checkout
- account-based booking control
- admin operations
- public TV liveboard

## Stack

- Next.js App Router
- Tailwind CSS v4
- Supabase-ready client/server wiring
- Stripe-ready checkout and webhook routes

## Local run

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` before enabling Supabase or Stripe.

## Important folders

- `src/app`: routes and app UI
- `src/components`: shared UI pieces
- `src/lib`: mock domain data, utilities, Supabase, Stripe helpers
- `supabase/schema.sql`: initial database schema
- `docs/delivery`: market notes and Claude design prompt pack
- `docs`, `prototype`, `prototype-v2`, `wireframes`: original product/design references

## Current status

This repo now includes a production-facing frontend scaffold and integration surface, but live Supabase auth, realtime persistence, outbound messaging, and Stripe production keys still require environment setup.
