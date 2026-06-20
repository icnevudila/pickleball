import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Zap,
  Tv,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { club, sessions } from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function HomePage() {
  const tonightSession = sessions.find((s) => s.id === "friday-open-play") || sessions[0];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="container-shell py-12 lg:py-20 animate-fade-in">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
            {/* Hero Left */}
            <div className="warm-panel p-8 sm:p-12 flex flex-col justify-center">
              <Badge tone="brand" className="w-fit mb-6 animate-fade-in stagger-1">
                {club.city}• Active System
              </Badge>
              <h1 className="hero-title max-w-xl text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none animate-fade-in stagger-2">
                Book your court. <br />
                <span className="text-[var(--brand)]">Play your game.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-[var(--muted)] max-w-md leading-relaxed animate-fade-in stagger-3">
                Online booking, live court status, and smart player rotation for modern pickleball clubs.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 animate-fade-in stagger-4">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/sessions">Book a Session</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/login">Staff Sign In</Link>
                </Button>
              </div>
            </div>

            {/* Hero Right: Live Session Preview Card */}
            <div className="flex flex-col justify-center">
              <Card variant="surface" className="p-8 border border-[var(--line-strong)] hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full min-h-[350px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--brand-soft)] rounded-full blur-3xl opacity-60"></div>
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
                      Happening {tonightSession.dayLabel}
                    </span>
                    <Badge tone={tonightSession.status === "live" ? "live" : "brand"}>
                      {tonightSession.status}
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-black mt-3 tracking-[-0.04em]">
                    {tonightSession.name}
                  </h3>
                  <p className="text-sm font-semibold text-[var(--muted)] mt-2">
                    {tonightSession.timeLabel} • {tonightSession.level}
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-4 leading-relaxed max-w-sm">
                    {tonightSession.hero}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--line)]">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider text-[var(--muted)] mb-2">
                    <span>Spots Filled</span>
                    <span>{formatPercent(tonightSession.booked, tonightSession.capacity)}</span>
                  </div>
                  <div className="w-full bg-[var(--surface-soft)] rounded-full h-3.5 border border-[var(--line)] overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[var(--brand)] to-[#ff7654] h-full rounded-full transition-all duration-500"
                      style={{ width: formatPercent(tonightSession.booked, tonightSession.capacity) }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-2xl font-black font-mono">
                      {formatCurrency(tonightSession.price)}
                      <span className="text-xs font-bold text-[var(--muted)] font-sans"> /player</span>
                    </span>
                    <Button variant="primary" size="sm" asChild>
                      <Link href={`/sessions#${tonightSession.id}`}>Join Seans</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container-shell py-12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Badge tone="slate" className="mb-3">
              Process
            </Badge>
            <h2 className="section-title">How Pickle Pulse Works</h2>
            <p className="text-sm text-[var(--muted)] mt-3">
              A frictionless flow from discovering a session to leaving the court.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Pick a Session",
                description: "Browse upcoming scheduled events, select one that matches your skill level, and secure your place.",
                icon: Calendar,
              },
              {
                step: "02",
                title: "Reserve & Pay",
                description: "Pay securely online. Your court spot is held instantly, keeping checkout fast and fully automated.",
                icon: CreditCard,
              },
              {
                step: "03",
                title: "Show Up & Play",
                description: "Check in on the lobby TV or front desk, get assigned a court automatically, and start playing.",
                icon: Zap,
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -right-4 -top-8 text-8xl font-black text-[var(--surface-soft)] font-mono opacity-60 select-none group-hover:scale-105 transition-transform duration-300">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-[18px] bg-[var(--surface-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--brand)] mb-6">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black tracking-tight">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Sessions */}
        <section className="container-shell py-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <Badge tone="brand" className="mb-2">
                Live Slots
              </Badge>
              <h2 className="section-title">Upcoming Sessions</h2>
            </div>
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/sessions" className="flex items-center gap-1.5">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session, index) => (
              <Card
                key={session.id}
                className={`p-6 flex flex-col justify-between border border-[var(--line)] animate-slide-up stagger-${(index % 3) + 1}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Badge tone={session.status === "live" ? "live" : "brand"}>
                      {session.status}
                    </Badge>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)] bg-[var(--surface-soft)] px-2 py-1 rounded border border-[var(--line)]">
                      {session.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight mb-1">{session.name}</h3>
                  <p className="text-xs font-bold text-[var(--muted)] mb-4">
                    {session.dayLabel} • {session.timeLabel}
                  </p>
                  <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed mb-6">
                    {session.hero}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[var(--muted)] mb-1.5">
                    <span>Capacity</span>
                    <span>{session.booked}/{session.capacity} spots</span>
                  </div>
                  <div className="w-full bg-[var(--surface-soft)] rounded-full h-2 overflow-hidden border border-[var(--line)] mb-6">
                    <div
                      className="bg-[var(--brand)] h-full rounded-full"
                      style={{ width: formatPercent(session.booked, session.capacity) }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-[var(--line-strong)]/40">
                    <span className="text-xl font-black font-mono">
                      {formatCurrency(session.price)}
                    </span>
                    <Button variant={session.status === "waitlist" ? "secondary" : "primary"} size="sm" asChild>
                      <Link href={`/sessions#${session.id}`}>
                        {session.status === "waitlist" ? "Join Waitlist" : "Book Spot"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="container-shell py-12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Badge tone="slate" className="mb-3">
              Features
            </Badge>
            <h2 className="section-title">Built for Club Excellence</h2>
            <p className="text-sm text-[var(--muted)] mt-3">
              Powering both front-of-house operations and player booking portals.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 md:col-span-2 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--brand)] mb-6">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black">Live Lobby Court Display</h3>
                <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
                  Broadcast-grade TV dashboard for your reception. Display court timers, be-next queues, and real-time announcements automatically.
                </p>
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--brand)] mb-6">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black">Smart Queue</h3>
                <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
                  Automated FIFO rotation engine. Rotates matches, tracks match times, and assignments seamlessly.
                </p>
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--brand)] mb-6">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black">Membership & Loyalty</h3>
                <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
                  Reward systems, tiered pricing models, and credits that keep players returning week after week.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="container-shell pt-12">
          <div className="warm-panel p-8 sm:p-16 text-center flex flex-col items-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-[var(--brand-soft)]/20 to-transparent pointer-events-none"></div>
            <Badge tone="brand" className="mb-4">
              Get Started
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-md">
              Ready to modernize your club operations?
            </h2>
            <p className="text-sm text-[var(--muted)] mt-4 max-w-sm leading-relaxed">
              Launch public booking flows, realtime be-next queues, and Lobby TV screens in under 10 minutes.
            </p>
            <Button variant="primary" size="lg" className="mt-8" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
