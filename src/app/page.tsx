import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Zap,
  Tv,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
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

      <main className="flex-1 pb-24 space-y-20">
        {/* Centered spacious Hero Section */}
        <section className="container-shell pt-16 pb-8 text-center space-y-8 max-w-4xl animate-fade-in">
          <Badge tone="brand" className="animate-fade-in stagger-1">
            {club.city} • Active Club System
          </Badge>
          
          <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-none max-w-3xl mx-auto animate-fade-in stagger-2">
            Book your court. <br className="hidden sm:inline" />
            <span className="text-[var(--brand)]">Play your game.</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed animate-fade-in stagger-3">
            Seamless online booking, real-time queue updates, and automated court allocations. Built specifically for modern pickleball venues.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in stagger-4">
            <Button variant="primary" size="lg" asChild>
              <Link href="/sessions">Book a Session</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/login">Staff Sign In</Link>
            </Button>
          </div>
        </section>

        {/* Featured Live Play Banner - Anchors the hero to the active platform */}
        <section className="container-shell max-w-5xl animate-slide-up stagger-2">
          <Card variant="warm" className="p-6 sm:p-8 border border-[var(--line-strong)] hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-soft)] rounded-full blur-3xl opacity-60"></div>
            
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-center">
              {/* Left detail */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge tone="live">Live Now</Badge>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
                    Tonight's Session
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {tonightSession.name}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed max-w-md">
                  {tonightSession.hero}
                </p>
                <div className="flex items-center gap-4 text-xs font-extrabold text-[var(--muted)]">
                  <span>Level: {tonightSession.level}</span>
                  <span>•</span>
                  <span>Time: {tonightSession.timeLabel}</span>
                </div>
              </div>

              {/* Right status & action */}
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-6 space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-[var(--muted)]">
                  <span>Capacity Filled</span>
                  <span>{formatPercent(tonightSession.booked, tonightSession.capacity)}</span>
                </div>
                <div className="w-full bg-[var(--surface-soft)] rounded-full h-2.5 overflow-hidden border border-[var(--line)]">
                  <div
                    className="bg-gradient-to-r from-[var(--brand)] to-[#ff7654] h-full rounded-full"
                    style={{ width: formatPercent(tonightSession.booked, tonightSession.capacity) }}
                  ></div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-black font-mono">
                    {formatCurrency(tonightSession.price)}
                    <span className="text-xs font-bold text-[var(--muted)] font-sans"> /player</span>
                  </span>
                  <Button variant="primary" size="sm" asChild>
                    <Link href={`/book/${tonightSession.id}`}>Book Slot</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* How It Works - Sleek linear stepper layout */}
        <section className="container-shell max-w-5xl py-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <Badge tone="slate" className="mb-3">
              Process
            </Badge>
            <h2 className="section-title">How Pickle Pulse Works</h2>
            <p className="text-xs text-[var(--muted)] mt-2">
              A friction-free player experience from checkout directly to the court.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            {[
              {
                step: "1",
                title: "Choose Session",
                description: "Pick an upcoming session slot matching your preference and skill level.",
                icon: Calendar,
              },
              {
                step: "2",
                title: "Reserve & Split",
                description: "Pay online. Easily add guest spots or split billing with friends.",
                icon: CreditCard,
              },
              {
                step: "3",
                title: "Check in & Play",
                description: "Check in on the lobby TV board, get assigned a court, and start playing.",
                icon: Zap,
              },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4 group">
                <div className="w-12 h-12 rounded-full bg-[var(--surface)] border-2 border-[var(--line)] flex items-center justify-center font-black text-sm text-[var(--brand)] shadow-md group-hover:border-[var(--brand)] transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black tracking-tight">{item.title}</h3>
                  <p className="text-xs text-[var(--muted)] max-w-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid Features - Balanced layout */}
        <section className="container-shell max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-16">
            <Badge tone="slate" className="mb-3">
              Features
            </Badge>
            <h2 className="section-title">Modern Club Operations</h2>
            <p className="text-xs text-[var(--muted)] mt-2">
              Powering both customer booking interfaces and back-office staff workspaces.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6 sm:p-8 border border-[var(--line-strong)] flex flex-col justify-between min-h-[220px]">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--brand)] mb-6">
                <Tv className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black">Live TV Board</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Lobby TV dashboard displaying active matches, timers, waitlists, and voice cues.
                </p>
              </div>
            </Card>

            <Card className="p-6 sm:p-8 border border-[var(--line-strong)] flex flex-col justify-between min-h-[220px]">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--brand)] mb-6">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black">Smart Queue</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Automated FIFO player rotation queue. Reduces staff desk load to zero.
                </p>
              </div>
            </Card>

            <Card className="p-6 sm:p-8 border border-[var(--line-strong)] flex flex-col justify-between min-h-[220px]">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--brand)] mb-6">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black">Split Payments</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Let players split billing totals with their opponents directly via Stripe checkout.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Call To Action Banner */}
        <section className="container-shell max-w-4xl">
          <Card variant="warm" className="p-8 sm:p-12 border border-[var(--line-strong)] text-center space-y-6">
            <Badge tone="brand">Grow Club</Badge>
            <h2 className="text-3xl font-black tracking-tight max-w-md mx-auto">
              Ready to modernize your venue?
            </h2>
            <p className="text-xs text-[var(--muted)] max-w-xs mx-auto leading-relaxed">
              Launch standalone booking widgets, realtime TV boards, and automated rotation queues.
            </p>
            <Button variant="primary" size="lg" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </Card>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
