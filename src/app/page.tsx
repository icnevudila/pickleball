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
    title: "Guest and member booking",
    copy: "Guests reserve without friction. Members move faster with saved details and booking control.",
    icon: Smartphone,
  },
  {
    title: "Court-first operations",
    copy: "Sessions, courts, queue calls, and walk-ins stay centered around what the floor needs next.",
    icon: LayoutDashboard,
  },
  {
    title: "Payment and messaging state",
    copy: "Reservation holds, payment capture, and outbound updates all attach to the same product flow.",
    icon: CreditCard,
  },
  {
    title: "Readable liveboard output",
    copy: "The TV board stays aligned with staff actions instead of becoming a disconnected display surface.",
    icon: MonitorPlay,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="pb-20">
        <section className="container-shell grid gap-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <div className="warm-panel p-7 sm:p-9">
            <p className="eyebrow">Club operating system</p>
            <h1 className="hero-title mt-5 max-w-3xl">Public booking, live courts, and staff control on one clear product spine.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
              {club.name} is shaped like a real club product: fast reservations, reliable desk operations, and a public-facing liveboard that answers the room without staff explaining everything.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sessions" className="btn-primary">
                Start booking
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="btn-secondary">
                Staff login
              </Link>
              <Link href="/liveboard/tv/friday-open-play" className="btn-secondary">
                View liveboard
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SurfaceCard className="border-[color:var(--line)] bg-white/85 p-5 shadow-none">
                <p className="text-4xl font-extrabold tracking-[-0.08em] text-[color:var(--foreground)]">24/7</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Public booking</p>
              </SurfaceCard>
              <SurfaceCard className="border-[color:var(--line)] bg-white/85 p-5 shadow-none">
                <p className="text-4xl font-extrabold tracking-[-0.08em] text-[color:var(--foreground)]">&lt;1 min</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Reserve path</p>
              </SurfaceCard>
              <SurfaceCard className="border-[color:var(--line)] bg-white/85 p-5 shadow-none">
                <p className="text-4xl font-extrabold tracking-[-0.08em] text-[color:var(--foreground)]">1 flow</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Court to payment</p>
              </SurfaceCard>
            </div>
          </div>

          <SurfaceCard className="overflow-hidden p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <StatusBadge tone="cyan">Tonight live</StatusBadge>
                <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.07em] text-[color:var(--foreground)]">Friday Open Play</h2>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  18:00 - 21:00 / 3 courts / intermediate
                </p>
              </div>
              <div className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-5 py-4 text-center">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Realtime feed</p>
                <p className="mt-2 text-4xl font-extrabold tracking-[-0.08em] text-[color:var(--foreground)]">07:42</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ["18/24", "Checked in"],
                ["6", "Waiting"],
                ["3", "Courts live"],
              ].map(([value, label]) => (
                <SurfaceCard key={label} className="border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4 shadow-none">
                  <p className="text-3xl font-extrabold tracking-[-0.07em] text-[color:var(--foreground)]">{value}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</p>
                </SurfaceCard>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {realtimeEvents.map((event, index) => (
                <div key={event.id} className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--brand-soft)] text-xs font-black text-[color:var(--brand-deep)]">
                        {index + 1}
                      </span>
                      <p className="font-extrabold text-[color:var(--foreground)]">{event.label}</p>
                    </div>
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">{event.timestamp}</p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{event.detail}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </section>

        <section className="container-shell py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">What ships with the product</p>
              <h2 className="section-title mt-3">Built around real club bottlenecks, not generic dashboard furniture.</h2>
            </div>
            <Link href="/sessions" className="text-sm font-extrabold text-[color:var(--brand-deep)]">
              See booking flow {"->"}
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {valueProps.map(({ title, copy, icon: Icon }) => (
              <SurfaceCard key={title} className="p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-muted)]">
                  <Icon className="h-5 w-5 text-[color:var(--brand-deep)]" />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{copy}</p>
              </SurfaceCard>
            ))}
          </div>
        </section>

        <section className="container-shell py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Active sessions</p>
              <h2 className="section-title mt-3">Public reservation cards stay commercial, but the data shape is ready for the floor.</h2>
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
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <SurfaceCard className="p-6">
              <p className="eyebrow">Delivery posture</p>
              <h2 className="section-title mt-4">The reservation model can drive checkout, staff control, and outbound updates.</h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                This scaffold already carries message-ready booking states, payment holds, and public-safe liveboard shaping. The goal is not a pretty brochure. The goal is a club product you can actually run.
              </p>
            </SurfaceCard>

            <div className="grid gap-4 sm:grid-cols-2">
              <SurfaceCard className="bg-[color:var(--surface-muted)] p-5">
                <MessageSquareShare className="h-5 w-5 text-[color:var(--brand-deep)]" />
                <p className="mt-4 text-lg font-extrabold text-[color:var(--foreground)]">Message hooks</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  Confirmation, waitlist promotion, and reminder sends can hang off the same reservation transitions.
                </p>
              </SurfaceCard>
              <SurfaceCard className="bg-[color:var(--surface-muted)] p-5">
                <CreditCard className="h-5 w-5 text-[color:var(--brand-deep)]" />
                <p className="mt-4 text-lg font-extrabold text-[color:var(--foreground)]">Payment control</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  Checkout session creation, hold expiry, and admin-side payment visibility are already part of the product model.
                </p>
              </SurfaceCard>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
