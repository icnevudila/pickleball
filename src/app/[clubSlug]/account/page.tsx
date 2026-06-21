import Link from "next/link";
import { Award, Calendar, Wallet, Swords } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StatCard } from "@/components/ui/stat-card";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { currentUser } from "@/lib/mock-data";

interface AccountPageProps {
  params: Promise<{ clubSlug: string }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { clubSlug } = await params;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header section with Typewriter effect */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--line)] pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
            Pickle Pulse Player Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.06em] text-[var(--foreground)]">
            Player passport: <TypewriterText words={["always in rhythm", "fully synced", "ready to duel"]} className="text-[var(--brand)]" />
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] font-semibold leading-relaxed">
            Your personal dashboard; bookings, level matching, wallet credits, and matches all on a single board.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" asChild className="rounded-[9px]">
            <Link href={`/${clubSlug}/book`}>Book New Session</Link>
          </Button>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Today's Games"
          value="1 game"
          icon={<Calendar className="w-5 h-5 text-[var(--brand)]" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] shadow-[var(--shadow-sm)]"
        />
        <StatCard
          label="Wallet Balance"
          value="₺640"
          icon={<Wallet className="w-5 h-5 text-[var(--out-green)]" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] shadow-[var(--shadow-sm)]"
        />
        <StatCard
          label="Membership tier"
          value="Silver"
          icon={<Award className="w-5 h-5 text-slate-500" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] shadow-[var(--shadow-sm)]"
        />
        <StatCard
          label="Loyalty points"
          value="720 XP"
          icon={<Swords className="w-5 h-5 text-amber-500" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] shadow-[var(--shadow-sm)]"
        />
      </section>

      {/* Priority Cards Row */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[16px] border border-[#e3b197] bg-gradient-to-b from-[#fffaf5] to-[#fff3eb] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#9d3d25]">
              <span className="h-2 w-2 rounded-full bg-[var(--brand)] animate-pulse" />
              Next Game
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">Court 2 at 18:30</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Check-in opens in 22 min</p>
          </div>
          <Button variant="primary" size="sm" className="w-full rounded-[9px] text-xs font-bold py-2 bg-[var(--brand)]">
            Check-in
          </Button>
        </article>

        <article className="rounded-[16px] border border-[#bddbcc] bg-[#f4fbf7] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--green)]">
              <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
              Wallet Credit
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">Balance ready</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Enough for tonight's game fees</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[9px] text-xs font-bold py-2 border-[var(--line-strong)]" asChild>
            <Link href={`/${clubSlug}/account/wallet`}>Top up</Link>
          </Button>
        </article>

        <article className="rounded-[16px] border border-[#e1c486] bg-[#fff8e8] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Match Duel
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">1 missing partner</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Suggest a level 3.5 duel match</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[9px] text-xs font-bold py-2 border-[var(--line-strong)]" asChild>
            <Link href={`/${clubSlug}/account/matchmaking`}>Find Partner</Link>
          </Button>
        </article>
      </section>

      {/* Main Grid: Profile Card & Tonight's Rhythm vs Stats */}
      <section className="grid gap-6 lg:grid-cols-2">
        
        {/* Left: Profile Card & Tonight's Rhythm */}
        <div className="space-y-6">
          
          {/* Profile Details Card */}
          <Card variant="surface" className="p-6 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)]">
            <div className="flex items-start justify-between border-b border-[var(--line)]/50 pb-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">Profile status</h3>
                <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">{currentUser.fullName} • Member since Jan</p>
              </div>
              <Badge tone="lime">Active</Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <Avatar name={currentUser.fullName} src={currentUser.avatar} size="lg" ring={true} />
              <div className="space-y-1">
                <p className="font-extrabold text-sm text-[var(--foreground)]">{currentUser.fullName}</p>
                <p className="text-xs text-[var(--muted)] font-semibold">
                  Skill level: <span className="font-extrabold text-[var(--foreground)] font-mono">{currentUser.skillLevel || "3.6"}</span> • 18 games played
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-bold text-[var(--muted)]">
                <span>XP progress to Gold</span>
                <span className="font-mono text-[var(--foreground)]">720 / 1000</span>
              </div>
              <div className="w-full bg-[var(--surface-soft)] rounded-md h-2 border border-[var(--line)] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[var(--brand)] to-amber-400" style={{ width: "72%" }} />
              </div>
            </div>
          </Card>

          {/* Tonight's Rhythm List */}
          <Card variant="surface" className="p-6 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between border-b border-[var(--line)]/50 pb-4 mb-4">
              <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">Tonight's Rhythm</h3>
              <Badge tone="slate">2 slots planned</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 p-3 border border-[var(--line)] bg-[#f4fbf7] rounded-[12px]">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono font-extrabold text-sm text-[var(--ink)]">18:30</span>
                  <div className="min-w-0">
                    <p className="font-extrabold text-sm text-[var(--ink)] truncate">Court 2 · Mixed Doubles</p>
                    <p className="text-xs text-[var(--muted)] font-semibold truncate">Check-in opens in 22 min</p>
                  </div>
                </div>
                <Button variant="primary" size="sm" className="rounded-[8px] px-3.5 py-1 text-xs">
                  Check-in
                </Button>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 border border-[var(--line)] bg-[#fffdf9] rounded-[12px]">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono font-extrabold text-sm text-[var(--ink)]">19:30</span>
                  <div className="min-w-0">
                    <p className="font-extrabold text-sm text-[var(--ink)] truncate">Wallet Balance Confirmed</p>
                    <p className="text-xs text-[var(--muted)] font-semibold truncate">₺640 credits available for booking fees</p>
                  </div>
                </div>
                <Badge tone="slate" className="text-[10px] px-2 py-0.5">OK</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Stats & Suggestions */}
        <div className="space-y-6">
          
          {/* Quick Statistics Grid */}
          <Card variant="surface" className="p-6 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)]">
            <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight mb-4">Win rate & Rhythm</h3>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-[12px] p-4 text-center">
                <span className="text-2xl font-black font-mono text-[var(--foreground)]">62%</span>
                <p className="text-[10px] text-[var(--muted)] font-semibold mt-1">Win rate (30d)</p>
              </div>
              <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-[12px] p-4 text-center">
                <span className="text-2xl font-black font-mono text-[var(--foreground)]">2.4/w</span>
                <p className="text-[10px] text-[var(--muted)] font-semibold mt-1">Avg visit frequency</p>
              </div>
              <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-[12px] p-4 text-center">
                <span className="text-2xl font-black font-mono text-[var(--foreground)]">19:00</span>
                <p className="text-[10px] text-[var(--muted)] font-semibold mt-1">Favorite play hour</p>
              </div>
            </div>
          </Card>

          {/* Action Recommendations / Rail equivalent */}
          <Card variant="surface" className="p-6 border border-[var(--line-strong)] bg-gradient-to-b from-[#fffaf5] to-[#fff1e8] rounded-[16px] shadow-[var(--shadow-sm)] relative overflow-hidden">
            <div className="absolute right-[-40px] top-[-40px] w-[110px] h-[110px] rounded-full bg-[rgba(223,255,114,0.22)] pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <Badge tone="brand">Next action recommendation</Badge>
              <div>
                <h4 className="text-lg font-black text-[var(--foreground)]">Check-in details ready.</h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed mt-2 font-semibold">
                  Checking in alerts court managers and starts rotation telemetry. If you need to make changes, cancel, or invite members to split the cost, configure them before check-in.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="primary" className="rounded-[9px] text-xs font-bold px-4 py-2 bg-[var(--brand)]">
                  Verify Check-in
                </Button>
                <Button variant="secondary" className="rounded-[9px] text-xs font-bold px-4 py-2 bg-white border-[var(--line-strong)]" asChild>
                  <Link href={`/${clubSlug}/account/bookings`}>Manage bookings</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

    </div>
  );
}
