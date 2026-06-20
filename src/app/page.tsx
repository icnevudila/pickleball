import Link from "next/link";
import {
  Tv,
  Users,
  Sparkles,
  Flame,
  Check,
  Play,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans antialiased">
      <SiteHeader />

      <main className="flex-1 pb-24 space-y-16 lg:space-y-24">
        {/* Active Scoreboard / Telemetry (Kitchen Line Üstü) */}
        <section className="container-shell pt-12 animate-fade-in">
          <div className="bg-[#141E1A] dark-theme border border-[var(--line)] rounded-[16px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-[var(--shadow-md)]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-lime)]">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-lime)] animate-pulse" />
                Live Platform Telemetry
              </div>
              <p className="text-xs text-[var(--muted)] font-semibold">Realtime network stats across all active clubs.</p>
            </div>
            
            {/* Mono Stats Grid */}
            <div className="grid grid-cols-3 gap-6 md:gap-12">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Active Clubs</span>
                <p className="text-2xl md:text-3xl font-black font-mono text-[var(--foreground)]">124</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Games Today</span>
                <p className="text-2xl md:text-3xl font-black font-mono text-[var(--foreground)]">1,842</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Queue Avg</span>
                <p className="text-2xl md:text-3xl font-black font-mono text-[var(--accent-lime)]">02:14</p>
              </div>
            </div>
          </div>
        </section>

        {/* SIGNATURE ELEMENT: Kitchen Line */}
        <div className="container-shell">
          <div className="kitchen-line" />
        </div>

        {/* Hero & Pitch */}
        <section className="container-shell text-center space-y-6 max-w-4xl animate-fade-in stagger-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[12px] border border-[var(--line)] bg-[var(--surface-soft)] text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)]">
            <Flame className="w-4 h-4 text-[var(--brand)] fill-[var(--brand)]" /> FOR PICKLEBALL CLUB OPERATORS
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.08em] leading-tight text-[var(--foreground)] max-w-3xl mx-auto">
            Run the club.<br />
            <span className="text-[var(--brand)]">Not the spreadsheet.</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed font-semibold">
            CourtOS handles court assignments, real-time lobby TV screens, and split-payment booking links — so your front desk can focus on players, not paperwork.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button 
              variant="primary" 
              size="lg" 
              asChild 
              className="rounded-[12px] px-8 py-4 font-bold text-sm shadow-[var(--shadow-md)]"
            >
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              asChild 
              className="rounded-[12px] border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--foreground)] px-8 py-4 font-bold text-sm"
            >
              <Link href="/login">Staff Login</Link>
            </Button>
          </div>
        </section>

        {/* HIGH-FIDELITY SPORTY PLATFORM MOCKUP */}
        <section className="container-shell max-w-6xl py-8 animate-fade-in stagger-2">
          <div className="border border-[var(--line-strong)] rounded-[16px] bg-[#141E1A] dark-theme p-4 sm:p-6 shadow-[var(--shadow-lg)] relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[var(--brand)] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-[var(--foreground)]">Sunset Court Club Manager</span>
                <span className="bg-[var(--surface-soft)] text-xs text-[var(--brand)] font-black px-2 py-0.5 rounded-[4px] font-mono">1.04v</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] font-mono">
                <Clock className="w-3.5 h-3.5" /> 21:28:54
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Active Court Status</h3>
                  <span className="text-[10px] font-mono text-[var(--accent-lime)] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-lime)] animate-pulse" /> Live feeds synced
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border border-[var(--line)] rounded-[12px] bg-[var(--surface-soft)] p-4 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-[var(--foreground)]">Court 1 (West)</span>
                      <span className="bg-[var(--brand-soft)] text-[var(--brand)] text-[9px] font-black uppercase px-2 py-0.5 rounded-[6px] tracking-wider">LIVE MATCH</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-[var(--line)]/50 pb-2">
                      <div className="text-xs font-bold text-[var(--muted)]">
                        <p className="text-[var(--foreground)] uppercase">S. Kaya + A. Yılmaz</p>
                        <p className="text-[10px]">vs</p>
                        <p className="text-[var(--foreground)] uppercase">M. Demir + T. Çelik</p>
                      </div>
                      <span className="font-mono text-2xl font-black text-[var(--brand)]">11 : 8</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[var(--muted)]">
                      <span>Standard Open Play</span>
                      <span className="font-mono font-extrabold flex items-center gap-1 text-[var(--accent-lime)]">
                        <Play className="w-3 h-3 fill-current" /> 14:22 left
                      </span>
                    </div>
                  </div>

                  <div className="border border-[var(--line)] rounded-[12px] bg-[var(--surface-soft)] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-[var(--foreground)]">Court 2 (East)</span>
                      <span className="bg-[var(--accent-amber)]/20 text-[var(--accent-amber)] text-[9px] font-black uppercase px-2 py-0.5 rounded-[6px] tracking-wider">UP NEXT</span>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-[var(--line)]/50 pb-2">
                      <div className="text-xs font-bold text-[var(--muted)]">
                        <p className="text-[var(--foreground)] uppercase">O. Şahin + E. Güler</p>
                        <p className="text-[10px]">vs</p>
                        <p className="text-[var(--foreground)] uppercase">Waiting for players...</p>
                      </div>
                      <span className="font-mono text-lg font-bold text-[var(--muted)]">-- : --</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[var(--muted)]">
                      <span>Advanced Drills</span>
                      <span className="font-mono font-extrabold text-[var(--accent-amber)]">Preparing</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-[var(--line)] rounded-[12px] bg-[var(--surface-soft)] p-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--line)]/50 pb-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--foreground)]">Rotation Queue</h3>
                    <span className="bg-[var(--accent-lime)] text-[var(--background)] text-[9px] font-black uppercase px-2 py-0.5 rounded-[6px]">4 GROUPS</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-[8px] bg-[var(--surface)]/5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[var(--brand)]">1.</span>
                        <span className="text-xs font-extrabold uppercase text-[var(--foreground)]">Caner K.</span>
                      </div>
                      <span className="text-[10px] text-[var(--muted)]">Group of 4</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-[8px] bg-[var(--surface)]/5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[var(--muted)]">2.</span>
                        <span className="text-xs font-extrabold uppercase text-[var(--foreground)]">Selim A.</span>
                      </div>
                      <span className="text-[10px] text-[var(--muted)]">Group of 2</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-[8px] bg-[var(--surface)]/5 opacity-60">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[var(--muted)]">3.</span>
                        <span className="text-xs font-extrabold uppercase text-[var(--foreground)]">Deniz T.</span>
                      </div>
                      <span className="text-[10px] text-[var(--muted)]">Group of 4</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--line)]/50 pt-3 mt-4 flex items-center justify-between text-[10px] text-[var(--muted)]">
                  <span>Est. next court clearance:</span>
                  <span className="font-mono font-extrabold text-[var(--accent-lime)]">~4 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features - B2B Operations Focus */}
        <section className="container-shell max-w-5xl py-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="bg-[var(--brand-soft)] text-[var(--brand-deep)] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] rounded-[8px]">
              OPERATIONS HUBS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.07em] text-[var(--foreground)] mt-4">
              Everything to power your desk ops.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] font-semibold mt-2">
              Say goodbye to messy whiteboard rotations, voice screaming, and checkout confusion.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6 flex flex-col justify-between min-h-[220px] hover:border-[var(--brand)] transition-all duration-300 shadow-[var(--shadow-sm)]">
              <div className="w-10 h-10 rounded-[12px] bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)] mb-6">
                <Tv className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold tracking-tight text-[var(--foreground)]">Smart TV Liveboard</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed font-semibold">
                  Auto-broadcast court status timers and queue lines directly to lobby monitors. Keep players informed without desk questions.
                </p>
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6 flex flex-col justify-between min-h-[220px] hover:border-[var(--brand)] transition-all duration-300 shadow-[var(--shadow-sm)]">
              <div className="w-10 h-10 rounded-[12px] bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)] mb-6">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold tracking-tight text-[var(--foreground)]">Active FIFO Queue</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed font-semibold">
                  Track drop-in groups, membership priorities, and player rotations automatically. One tap assigns courts.
                </p>
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6 flex flex-col justify-between min-h-[220px] hover:border-[var(--brand)] transition-all duration-300 shadow-[var(--shadow-sm)]">
              <div className="w-10 h-10 rounded-[12px] bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)] mb-6">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold tracking-tight text-[var(--foreground)]">Split Billing links</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed font-semibold">
                  Generate digital payment cards instantly. Let players invite partners and split court costs dynamically via Stripe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers with Monospace Values */}
        <section className="container-shell max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="bg-[var(--brand-soft)] text-[var(--brand-deep)] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] rounded-[8px]">
              PRICING PLANS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.07em] text-[var(--foreground)] mt-4">
              Flexible tiers for any venue size.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] font-semibold mt-2">
              Every plan features the full TV Board system. Pick based on your active court volume.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 items-stretch">
            {/* Starter Plan */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6 flex flex-col justify-between hover:border-[var(--brand)] transition-all duration-300 shadow-[var(--shadow-sm)]">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[var(--foreground)]">Starter</h3>
                  <p className="text-xs text-[var(--muted)] font-semibold mt-1">For boutique local clubs.</p>
                </div>
                <div className="border-t border-[var(--line)] pt-4">
                  <p className="text-3xl font-extrabold font-mono text-[var(--foreground)]">
                    $79<span className="text-xs font-bold text-[var(--muted)] font-sans">/mo</span>
                  </p>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-[var(--muted)] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--brand)]" /> Up to 2 active courts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--brand)]" /> Mobile check-in link
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--brand)]" /> Basic FIFO queue
                  </li>
                </ul>
              </div>
              <Button variant="secondary" className="w-full mt-6 rounded-[12px] font-bold text-xs" asChild>
                <Link href="/register">Choose Starter</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-[var(--surface)] border-2 border-[var(--brand)] rounded-[16px] p-6 flex flex-col justify-between hover:shadow-[var(--shadow-md)] transition-all duration-300 relative">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[var(--brand)] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-[6px]">
                POPULAR CHOICE
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[var(--foreground)]">Pro</h3>
                  <p className="text-xs text-[var(--muted)] font-semibold mt-1">For active court complexes.</p>
                </div>
                <div className="border-t border-[var(--line)] pt-4">
                  <p className="text-3xl font-extrabold font-mono text-[var(--foreground)]">
                    $149<span className="text-xs font-bold text-[var(--muted)] font-sans">/mo</span>
                  </p>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-[var(--muted)] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--brand)]" /> Up to 6 active courts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--brand)]" /> Automated TV liveboard
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--brand)]" /> Split Stripe checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--brand)]" /> Queue timers & voice alerts
                  </li>
                </ul>
              </div>
              <Button variant="primary" className="w-full mt-6 rounded-[12px] font-bold text-xs" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6 flex flex-col justify-between hover:border-[var(--brand)] transition-all duration-300 shadow-[var(--shadow-sm)]">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[var(--foreground)]">Enterprise</h3>
                  <p className="text-xs text-[var(--muted)] font-semibold mt-1">Multi-branch franchises.</p>
                </div>
                <div className="border-t border-[var(--line)] pt-4">
                  <p className="text-3xl font-extrabold font-mono text-[var(--foreground)]">
                    $299<span className="text-xs font-bold text-[var(--muted)] font-sans">/mo</span>
                  </p>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-[var(--muted)] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--brand)]" /> Unlimited courts & branches
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--brand)]" /> Custom domains & club branding
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--brand)]" /> Dedicated 24/7 priority support
                  </li>
                </ul>
              </div>
              <Button variant="secondary" className="w-full mt-6 rounded-[12px] font-bold text-xs" asChild>
                <Link href="/register">Choose Enterprise</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="container-shell max-w-4xl">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-8 sm:p-12 text-center space-y-6 hover:shadow-[var(--shadow-md)] transition-all duration-300 shadow-[var(--shadow-sm)]">
            <span className="bg-[var(--brand-soft)] text-[var(--brand-deep)] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] rounded-[8px]">
              JOIN THE FUTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.07em] text-[var(--foreground)] max-w-md mx-auto">
              Bring CourtOS to your sports venue.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] max-w-xs mx-auto leading-relaxed font-semibold">
              Optimize court assignments, minimize lobby friction, and boost booking revenue.
            </p>
            <Button 
              variant="primary" 
              size="lg" 
              asChild
              className="rounded-[12px] px-8 py-4 font-bold text-sm shadow-[var(--shadow-md)]"
            >
              <Link href="/register">Start Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
