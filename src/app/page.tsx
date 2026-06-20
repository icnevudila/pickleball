import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  LayoutDashboard,
  MessageSquareShare,
  MonitorPlay,
  Smartphone,
} from "lucide-react";

import { SessionCard } from "@/components/booking/session-card";
import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import { club, realtimeEvents, sessions } from "@/lib/mock-data";

const valueProps = [
  {
    title: "Guest + member booking",
    copy: "Guests can reserve and pay without an account wall. Members move faster with saved profile data.",
    icon: Smartphone,
  },
  {
    title: "Admin booking control",
    copy: "Sessions, courts, check-ins, walk-ins, waitlist, and queue rotation sit in one operational control room.",
    icon: LayoutDashboard,
  },
  {
    title: "Payments and message state",
    copy: "Stripe checkout, payment hold logic, and message-ready system states are wired into the product model.",
    icon: CreditCard,
  },
  {
    title: "External TV liveboard",
    copy: "The public board reads like a sports broadcast and updates off the same operational state as staff tools.",
    icon: MonitorPlay,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="pb-20">
        <section className="container-shell grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="eyebrow">Pickleball booking + live operations</p>
              <h1 className="hero-title">A full product spine from mobile checkout to the public court board.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                {club.name} is built to convert external bookings, keep guest and member flows fast, and give the floor
                team a live operational picture with no spreadsheet fallback.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/sessions"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)] px-6 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.01]"
              >
                Start booking
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/liveboard/friday-open-play"
                className="rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Open admin live control
              </Link>
              <Link
                href="/liveboard/tv/friday-open-play"
                className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
              >
                View TV board
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <SurfaceCard className="p-5">
                <p className="text-4xl font-black tracking-[-0.08em] text-white">24/7</p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-400">Public booking access</p>
              </SurfaceCard>
              <SurfaceCard className="p-5">
                <p className="text-4xl font-black tracking-[-0.08em] text-white">&lt;1s</p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-400">Liveboard target update</p>
              </SurfaceCard>
              <SurfaceCard className="p-5">
                <p className="text-4xl font-black tracking-[-0.08em] text-white">1 UI</p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-400">Booking, ops, and TV story</p>
              </SurfaceCard>
            </div>
          </div>

          <SurfaceCard className="overflow-hidden p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <StatusBadge tone="cyan">Tonight live</StatusBadge>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.07em] text-white">Friday Open Play</h2>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-400">18:00 - 21:00 · 3 courts · intermediate</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-black/20 px-5 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Realtime feed</p>
                <p className="mt-2 text-4xl font-black tracking-[-0.08em] text-white">07:42</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <SurfaceCard className="border-white/8 bg-white/5 p-4">
                <p className="text-3xl font-black tracking-[-0.07em] text-white">18/24</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">Checked in</p>
              </SurfaceCard>
              <SurfaceCard className="border-white/8 bg-white/5 p-4">
                <p className="text-3xl font-black tracking-[-0.07em] text-white">6</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">Waiting</p>
              </SurfaceCard>
              <SurfaceCard className="border-white/8 bg-white/5 p-4">
                <p className="text-3xl font-black tracking-[-0.07em] text-white">3</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">Courts live</p>
              </SurfaceCard>
            </div>

            <div className="mt-6 space-y-3">
              {realtimeEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-white/8 bg-black/15 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{event.label}</p>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">{event.timestamp}</p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{event.detail}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </section>

        <section className="container-shell py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">What ships with the product</p>
              <h2 className="section-title mt-3">Built around the real operational bottlenecks.</h2>
            </div>
            <Link href="/sessions" className="text-sm font-semibold text-cyan-100">
              See booking flow →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {valueProps.map(({ title, copy, icon: Icon }) => (
              <SurfaceCard key={title} className="p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                  <Icon className="h-5 w-5 text-lime-200" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{copy}</p>
              </SurfaceCard>
            ))}
          </div>
        </section>

        <section className="container-shell py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Active sessions</p>
              <h2 className="section-title mt-3">Public booking is mobile-first, but the data shape already supports the floor.</h2>
            </div>
            <StatusBadge tone="lime">Guest + member ready</StatusBadge>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>

        <section className="container-shell py-10">
          <SurfaceCard className="grid gap-6 p-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4">
              <p className="eyebrow">Delivery posture</p>
              <h2 className="section-title mt-3">The same product model can trigger checkout, admin control, and outbound communication.</h2>
              <p className="text-sm leading-7 text-slate-300">
                The current implementation includes message-ready booking state, payment hold handling, and liveboard-safe
                public data shaping. Actual email or SMS delivery can hang off the same status transitions via Supabase
                Edge Functions or a queue worker.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SurfaceCard className="border-white/8 bg-black/15 p-5">
                <MessageSquareShare className="h-5 w-5 text-cyan-100" />
                <p className="mt-4 text-lg font-semibold text-white">Message hooks</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Booking confirmation, waitlist promotion, and reminder sends can attach to the same payment and session events.
                </p>
              </SurfaceCard>
              <SurfaceCard className="border-white/8 bg-black/15 p-5">
                <CreditCard className="h-5 w-5 text-lime-200" />
                <p className="mt-4 text-lg font-semibold text-white">Payment control</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Stripe session creation, webhook confirmation, and admin override endpoints are already part of the app scaffold.
                </p>
              </SurfaceCard>
            </div>
          </SurfaceCard>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
