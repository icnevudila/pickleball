import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { TenantHeader } from "@/components/layout/tenant-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { LandingHeroActions } from "@/components/booking/landing-hero-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { club as defaultClub, sessions } from "@/lib/mock-data";

interface ClubLandingPageProps {
  params: Promise<{ clubSlug: string }>;
}

export default async function ClubLandingPage({ params }: ClubLandingPageProps) {
  const { clubSlug } = await params;

  // Formatting club name nicely from slug
  const clubName = clubSlug
    .split("-")
    .map((word) => {
      if (word.toLowerCase() === "istanbul") return "İstanbul";
      if (word.toLowerCase() === "kadikoy") return "Kadıköy";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  const clubTitle = `${clubName} Social Club`;
  const clubLogo = clubName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "PP";

  // Mock courts with states
  const courts = [
    { code: "C1", status: "free", label: "09:00 Free", tone: "live" as const },
    { code: "C2", status: "busy", label: "Busy", tone: "brand" as const },
    { code: "C3", status: "clinic", label: "Clinic", tone: "amber" as const },
    { code: "C4", status: "open", label: "Now Open", tone: "lime" as const },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
      <TenantHeader clubSlug={clubSlug} clubName={clubTitle} clubLogo={clubLogo} />

      <main className="flex-1 max-w-[1580px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Main Grid: Hero Card + Court Pulse */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
                  {/* Hero Banner Section (1920x600 Website Hero format compliant) */}
          <div className="lg:col-span-2 relative min-h-[380px] md:min-h-[460px] flex flex-col justify-between p-8 sm:p-12 md:p-16 overflow-hidden bg-gradient-to-br from-[#FFFDFB] via-[#FFF5EE] to-[#FFEBE0] border border-[#EAC4B0] rounded-[24px] shadow-[0_16px_36px_rgba(240,79,42,0.06)]">
            {/* Design elements matching the Gradient / Minimalist aesthetic */}
            <div className="absolute right-[-40px] top-[-40px] w-[320px] h-[320px] rounded-full bg-gradient-to-br from-[rgba(240,79,42,0.09)] to-[rgba(200,255,77,0.12)] blur-3xl pointer-events-none" />
            <div className="absolute left-[-60px] bottom-[-60px] w-[280px] h-[280px] rounded-full bg-[rgba(240,79,42,0.04)] blur-2xl pointer-events-none" />
            
            {/* Top Zone: Branding & Quick Specs */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#B83A22]">
                <span className="h-2 w-2 rounded-full bg-[var(--brand)] animate-pulse" />
                {clubName} Pickleball Club
              </div>
              <Badge tone="lime" className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-0.5 border border-[#C8FF4D]/30 bg-[#C8FF4D]/10 text-[#4B7300]">
                Court Ops Live
              </Badge>
            </div>

            {/* Middle Zone: Core Value Proposition & Subtext */}
            <div className="relative z-10 max-w-2xl my-8 md:my-12 space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.075em] leading-[0.95] text-[var(--foreground)]">
                Pickleball, <br className="hidden sm:inline" />
                <span className="text-[var(--brand)] bg-gradient-to-r from-[var(--brand)] to-[var(--brand-deep)] bg-clip-text text-transparent">not random.</span>
              </h1>
              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed font-semibold max-w-xl">
                Court availability, sessions, memberships, and lobby broadcasts in a single flow. Players arrive, check the board, and step onto the court.
              </p>
            </div>
            
            {/* Bottom Zone: Call to Action (CTA) & Quick Stats */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-[#EAC4B0]/40">
              <LandingHeroActions clubSlug={clubSlug} />
              
              <div className="flex flex-wrap gap-3">
                <div className="bg-[#FFFDFB]/80 border border-[#EAC4B0]/60 rounded-[12px] px-4 py-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-mono text-sm font-black text-[#1A1614]">4 Live Courts</span>
                </div>
                <div className="bg-[#FFFDFB]/80 border border-[#EAC4B0]/60 rounded-[12px] px-4 py-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="font-mono text-sm font-black text-[#1A1614]">18 Sessions Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Court Pulse Aside Card */}
          <Card variant="surface" className="flex flex-col overflow-hidden bg-[var(--surface)] border border-[var(--line)] rounded-[16px] shadow-[var(--shadow-sm)]">
            <header className="px-6 py-4 flex items-center justify-between border-b border-[var(--line)] bg-[#fffdf9]">
              <div>
                <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">Today's Court Pulse</h3>
                <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">The landing page isn't just a static display; it captures the live rhythm of the club.</p>
              </div>
              <Badge tone="lime">Live</Badge>
            </header>

            <div className="p-6 flex-1 flex flex-col justify-between gap-6">
              {/* Mini Court Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {courts.map((court) => (
                  <div key={court.code} className="relative min-h-[108px] border border-[var(--line)] rounded-[12px] bg-[#fffdf9] p-3 flex flex-col justify-between overflow-hidden">
                    <div className="absolute inset-2.5 border border-[rgba(47,128,102,0.08)] rounded-[8px] pointer-events-none" />
                    <span className="font-mono font-extrabold text-sm text-[var(--ink)] relative z-10">{court.code}</span>
                    <div className="flex justify-end relative z-10">
                      <Badge tone={court.tone} className="text-[9px] px-2 py-0.5">{court.label}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sessions Rows */}
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between gap-4 p-3 border border-[var(--line)] bg-[#fffdf9] rounded-[12px]">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono font-extrabold text-sm text-[var(--ink)] tabular-nums">{session.timeLabel.split(" - ")[0]}</span>
                      <div className="min-w-0">
                        <p className="font-extrabold text-sm text-[var(--ink)] truncate">{session.name}</p>
                        <p className="text-xs text-[var(--muted)] truncate font-semibold">
                          {session.capacity - session.booked} spots left · {session.level}
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" asChild className="rounded-[8px] px-3.5 py-1 text-xs border-[var(--line-strong)]">
                      <Link href={`/${clubSlug}/book`}>
                        {session.status === "live" ? "Join" : session.status === "few-spots" ? "View" : "Queue"}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Social Proof Strip / Club Highlights (Dental layout match with Sunset Court style) */}
        <section className="border-y border-[#F0D6CA]/50 bg-[#FFF8F1]/40 py-8 rounded-[16px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center text-center">
            <div className="space-y-1">
              <div className="text-lg font-black tracking-tight text-[var(--ink)]">
                All-In-One Flow
              </div>
              <div className="text-xs font-semibold text-[var(--muted)]">
                Bookings to live scoreboard
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black tracking-tight text-[var(--ink)]">
                Instant Check-in
              </div>
              <div className="text-xs font-semibold text-[var(--muted)]">
                Smart QR code kiosk flow
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black tracking-tight text-[var(--ink)]">
                Real-Time TV
              </div>
              <div className="text-xs font-semibold text-[var(--muted)]">
                Lobby queue & audio updates
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black tracking-tight text-[var(--ink)]">
                Split Payments
              </div>
              <div className="text-xs font-semibold text-[var(--muted)]">
                Divide match rates easily
              </div>
            </div>
          </div>
        </section>

        {/* Metric Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[10px] p-4 shadow-[var(--shadow-sm)] relative overflow-hidden">
            <div className="absolute right-[-24px] top-[-24px] w-[58px] h-[58px] rounded-full bg-[rgba(217,91,53,0.06)]" />
            <span className="text-base font-black text-[var(--ink)] block">TRY 850 / hr</span>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Peak private court</p>
          </div>
          <div className="bg-[#f4fbf7] border border-[#bddbcc] rounded-[10px] p-4 shadow-[var(--shadow-sm)] relative overflow-hidden">
            <div className="absolute right-[-24px] top-[-24px] w-[58px] h-[58px] rounded-full bg-[rgba(217,91,53,0.06)]" />
            <span className="text-base font-black text-[var(--green)] block">Wallet ready</span>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Fast checkout for members</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[10px] p-4 shadow-[var(--shadow-sm)] relative overflow-hidden">
            <div className="absolute right-[-24px] top-[-24px] w-[58px] h-[58px] rounded-full bg-[rgba(217,91,53,0.06)]" />
            <span className="text-base font-black text-[var(--ink)] block">Split pay</span>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Split between 4 players</p>
          </div>
          <div className="bg-[#f4fbf7] border border-[#bddbcc] rounded-[10px] p-4 shadow-[var(--shadow-sm)] relative overflow-hidden">
            <div className="absolute right-[-24px] top-[-24px] w-[58px] h-[58px] rounded-full bg-[rgba(217,91,53,0.06)]" />
            <span className="text-base font-black text-[var(--green)] block">Liveboard</span>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Next court announcement</p>
          </div>
        </section>

        {/* Pricing Plan Grid */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="border border-[var(--line)] bg-[#fffdf9] rounded-[14px] p-6 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <Badge tone="slate">Starter</Badge>
              <div className="text-3xl font-black text-[var(--ink)] tracking-tight">TRY 0</div>
              <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                Create an account, track sessions, and book courts.
              </p>
            </div>
            <Button variant="secondary" className="w-full text-xs font-bold py-2 rounded-[9px] border-[var(--line-strong)]" asChild>
              <Link href={`/register`}>Get Started</Link>
            </Button>
          </div>

          <div className="border border-[#e3b197] bg-gradient-to-b from-[#fffaf5] to-[#fff1e8] rounded-[14px] p-6 flex flex-col justify-between gap-4 shadow-[0_12px_30px_rgba(49,36,24,0.075)] relative overflow-hidden">
            <div className="absolute right-[-40px] top-[-40px] w-[120px] h-[120px] rounded-full bg-[rgba(223,255,114,0.22)] pointer-events-none" />
            <div className="space-y-2 relative z-10">
              <Badge tone="lime">Most played</Badge>
              <div className="text-3xl font-black text-[var(--ink)] tracking-tight">TRY 1,900</div>
              <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                Monthly Pro · priority booking + wallet bonus.
              </p>
            </div>
            <Button variant="primary" className="w-full text-xs font-bold py-2 rounded-[9px] relative z-10" asChild>
              <Link href={`/register`}>Subscribe Pro</Link>
            </Button>
          </div>

          <div className="border border-[var(--line)] bg-[#fffdf9] rounded-[14px] p-6 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <Badge tone="brand">Weekend</Badge>
              <div className="text-3xl font-black text-[var(--ink)] tracking-tight">TRY 1,250</div>
              <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                Advantageous bundle for weekend players.
              </p>
            </div>
            <Button variant="secondary" className="w-full text-xs font-bold py-2 rounded-[9px] border-[var(--line-strong)]" asChild>
              <Link href={`/register`}>Get Weekend</Link>
            </Button>
          </div>
        </section>

      </main>

      <PublicFooter clubSlug={clubSlug} />
    </div>
  );
}
