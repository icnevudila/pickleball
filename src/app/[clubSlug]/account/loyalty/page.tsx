"use client";

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Award, Flame, Gift, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";

interface LoyaltyPageProps {
  params: Promise<{ clubSlug: string }>;
}

export default function LoyaltyPage({ params }: LoyaltyPageProps) {
  const { clubSlug } = use(params);
  const [xp, setXp] = React.useState(720);

  const handleRedeem = (cost: number) => {
    if (xp >= cost) {
      setXp((prev) => prev - cost);
      alert("Success! Reward redeemed.");
    } else {
      alert("Insufficient XP.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-5 animate-fade-in stagger-1">
        <Link
          href={`/${clubSlug}/account`}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)] hover:text-[var(--brand)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold tracking-[-0.06em] text-[var(--foreground)]">Loyalty XP</h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] font-semibold leading-relaxed">
          Track your visit streaks, earn experience points for court play, and claim reward benefits.
        </p>
      </div>

      {/* Metrics Row */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-4 animate-fade-in stagger-2">
        <StatCard
          label="Active Progress"
          value={`${xp} XP`}
          icon={<Award className="w-5 h-5 text-[var(--brand)]" />}
          className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] border border-[var(--line)] rounded-[18px] shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300"
        />
        <StatCard
          label="To Gold Tier"
          value={`${Math.max(0, 1000 - xp)} XP`}
          icon={<Compass className="w-5 h-5 text-amber-500" />}
          className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] border border-[var(--line)] rounded-[18px] shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300"
        />
        <StatCard
          label="Weekly Streak"
          value="3 visits"
          icon={<Flame className="w-5 h-5 text-[var(--out-green)]" />}
          className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] border border-[var(--line)] rounded-[18px] shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300"
        />
        <StatCard
          label="Claimable Perks"
          value="2 rewards"
          icon={<Gift className="w-5 h-5 text-slate-400" />}
          className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] border border-[var(--line)] rounded-[18px] shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300"
        />
      </section>

      {/* Priority Cards Row */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[20px] border border-[#bddbcc] bg-gradient-to-b from-[#f4fbf7] to-[#e8f6ee] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4 hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--green)]">
              <span className="h-2 w-2 rounded-full bg-[var(--green)] animate-pulse" />
              Streak Alive
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">One more visit gives +80</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Book an open play session this weekend</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[12px] text-xs font-extrabold py-2 border-[var(--line-strong)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] transition-all active:scale-95 shadow-sm bg-white" asChild>
            <Link href={`/${clubSlug}/sessions`}>Book session</Link>
          </Button>
        </article>

        <article className="rounded-[20px] border border-[#e3b197] bg-gradient-to-b from-[#fffcf9] to-[#fff3eb] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4 hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#9d3d25]">
              <span className="h-2 w-2 rounded-full bg-[var(--brand)] animate-pulse" />
              Reward Ready
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">Free water can be redeemed</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Redeemable at the front desk cafe POS</p>
          </div>
          <Button variant="primary" size="sm" className="w-full rounded-[12px] text-xs font-extrabold py-2 shadow-sm transition-transform active:scale-95 bg-[var(--brand)]" onClick={() => handleRedeem(150)}>
            Redeem now
          </Button>
        </article>

        <article className="rounded-[20px] border border-[#e1c486] bg-gradient-to-b from-[#fff8e8] to-[#fff4dd] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4 hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Gold Path
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">{Math.max(0, 1000 - xp)} XP left</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Two open play matches will reach Gold</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[12px] text-xs font-extrabold py-2 border-[var(--line-strong)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] transition-all active:scale-95 shadow-sm bg-white">
            Plan path
          </Button>
        </article>
      </section>

      {/* Experience Road Progress */}
      <section className="space-y-6">
        <Card variant="surface" className="p-6 border border-[var(--line)] rounded-[20px] shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300 space-y-4">
          <div className="flex justify-between items-start border-b border-[var(--line)]/50 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">XP road</h3>
              <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">Silver → Gold level tier progression</p>
            </div>
            <Badge tone="brand" className="font-black">{Math.max(0, 1000 - xp)} XP left</Badge>
          </div>

          <div className="space-y-2">
            <span className="text-3xl font-black font-mono text-[var(--foreground)]">{xp} / 1000 XP</span>
            <div className="w-full bg-[var(--surface-soft)] rounded-md h-2 border border-[var(--line)] overflow-hidden">
              <div className="h-full bg-[var(--brand)]" style={{ width: `${Math.min(100, (xp / 1000) * 100)}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-[14px] p-4 text-center shadow-sm">
              <span className="text-xl font-black font-mono text-[var(--foreground)] block">+80</span>
              <p className="text-[10px] text-[var(--muted)] font-semibold mt-1">Check-in streak bonus</p>
            </div>
            <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-[14px] p-4 text-center shadow-sm">
              <span className="text-xl font-black font-mono text-[var(--foreground)] block">+120</span>
              <p className="text-[10px] text-[var(--muted)] font-semibold mt-1">Open play matches completed</p>
            </div>
            <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-[14px] p-4 text-center shadow-sm">
              <span className="text-xl font-black font-mono text-[var(--foreground)] block">+40</span>
              <p className="text-[10px] text-[var(--muted)] font-semibold mt-1">Cafe POS spend perks</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Rewards Shelf & Streak Heatmap */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card variant="surface" className="p-6 border border-[var(--line)] rounded-[20px] shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300 space-y-4">
          <div className="border-b border-[var(--line)]/50 pb-4">
            <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">Rewards shelf</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">Burn points without staff friction</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3.5 border border-[#bddbcc] bg-[#f4fbf7] rounded-[14px] shadow-sm">
              <div>
                <p className="font-extrabold text-sm text-[var(--foreground)]">Free water bottle</p>
                <p className="text-[10px] text-[var(--muted)] font-bold">150 XP • Redeemable at cafe POS</p>
              </div>
              <Button variant="secondary" size="sm" className="rounded-[10px] px-3.5 py-1 text-xs border-[var(--line-strong)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] transition-all active:scale-95 bg-white" onClick={() => handleRedeem(150)}>
                Redeem
              </Button>
            </div>

            <div className="flex justify-between items-center p-3.5 border border-[var(--line)] bg-[#fffdf9] rounded-[14px] shadow-sm">
              <div>
                <p className="font-extrabold text-sm text-[var(--foreground)]">Complimentary racket rental</p>
                <p className="text-[10px] text-[var(--muted)] font-bold">600 XP • Single court session</p>
              </div>
              <Button variant="secondary" size="sm" className="rounded-[10px] px-3.5 py-1 text-xs border-[var(--line-strong)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] transition-all active:scale-95 bg-white" onClick={() => handleRedeem(600)}>
                Redeem
              </Button>
            </div>
          </div>
        </Card>

        {/* Weekly Streaks Heatmap */}
        <Card variant="surface" className="p-6 border border-[var(--line)] rounded-[20px] shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[220px]">
          <div className="border-b border-[var(--line)]/50 pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">Streak pulse</h3>
                <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">3 visits logged this calendar week</p>
              </div>
              <Badge tone="lime" className="font-black">Streak Active</Badge>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black">
            <div className="bg-[#eaf8b6] text-[#405400] rounded-[10px] p-2 border border-[#d7ec7a] shadow-sm">Mon</div>
            <div className="bg-[#edf6f1] text-[#23624f] rounded-[10px] p-2 border border-[#cbe4d9] shadow-sm">Tue</div>
            <div className="bg-[#eaf8b6] text-[#405400] rounded-[10px] p-2 border border-[#d7ec7a] shadow-sm">Wed</div>
            <div className="bg-[#edf6f1] text-[#23624f] rounded-[10px] p-2 border border-[#cbe4d9] shadow-sm">Thu</div>
            <div className="bg-[#eaf8b6] text-[#405400] rounded-[10px] p-2 border border-[#d7ec7a] shadow-sm">Fri</div>
            <div className="bg-[var(--surface-soft)] rounded-[10px] p-2 border border-[var(--line)] text-[var(--muted)] shadow-sm">Sat</div>
            <div className="bg-[var(--surface-soft)] rounded-[10px] p-2 border border-[var(--line)] text-[var(--muted)] shadow-sm">Sun</div>
          </div>
        </Card>
      </section>
    </div>
  );
}
