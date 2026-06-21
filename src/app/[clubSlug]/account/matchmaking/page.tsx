"use client";

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Swords, Users, Shield, Target, Plus, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";

interface MatchmakingPageProps {
  params: Promise<{ clubSlug: string }>;
}

export default function MatchmakingPage({ params }: MatchmakingPageProps) {
  const { clubSlug } = use(params);
  const [activeTab, setActiveTab] = React.useState("doubles");
  const [needPlayers, setNeedPlayers] = React.useState(1);

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
        <h1 className="text-3xl font-extrabold tracking-[-0.06em] text-[var(--foreground)]">Duels board</h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] font-semibold leading-relaxed">
          Find missing players or create open duels. Matches matching your skill level automatically highlight.
        </p>
      </div>

      {/* Metrics Row */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-4 animate-fade-in stagger-2">
        <StatCard
          label="Open Duels"
          value="3 open"
          icon={<Swords className="w-5 h-5 text-[var(--brand)]" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
        <StatCard
          label="Players looking"
          value="9 players"
          icon={<Users className="w-5 h-5 text-amber-500" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
        <StatCard
          label="Average rating"
          value="3.4 match"
          icon={<Target className="w-5 h-5 text-[var(--out-green)]" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
        <StatCard
          label="Peak demand slot"
          value="19:30 tonight"
          icon={<Shield className="w-5 h-5 text-slate-400" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
      </section>

      {/* Priority Cards Row */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[16px] border border-[#e3b197] bg-gradient-to-b from-[#fffaf5] to-[#fff3eb] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#9d3d25]">
              <span className="h-2 w-2 rounded-full bg-[var(--brand)] animate-pulse" />
              Needs 2 Players
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">Mixed doubles 19:30</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Excellent rating compatibility for you</p>
          </div>
          <Button variant="primary" size="sm" className="w-full rounded-[9px] text-xs font-bold py-2 bg-[var(--brand)]">
            Invite players
          </Button>
        </article>

        <article className="rounded-[16px] border border-[#bddbcc] bg-[#f4fbf7] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--green)]">
              <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
              Quality Guard
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">Rating match is clean</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">No mismatch alert triggered</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[9px] text-xs font-bold py-2 bg-white border-[var(--line-strong)]">
            Approve match
          </Button>
        </article>

        <article className="rounded-[16px] border border-[#e1c486] bg-[#fff8e8] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              No-show risk
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">One player unconfirmed</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Send SMS confirmation alert</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[9px] text-xs font-bold py-2 bg-white border-[var(--line-strong)]">
            Send confirmation
          </Button>
        </article>
      </section>

      {/* Main Grid: Hot Duels & Create Duel */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card variant="surface" className="p-6 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)] space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--line)]/50 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">Hot duels</h3>
              <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">Active groups searching for matching players</p>
            </div>
            <Badge tone="brand">3 Open</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 p-3 border border-[var(--line)] bg-[#fff4ee] border-[#e2aa93] rounded-[12px]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono font-extrabold text-sm text-[var(--ink)]">2/4</span>
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-[var(--ink)] truncate">Mixed doubles · 19:30</p>
                  <p className="text-xs text-[var(--muted)] font-semibold truncate">Needs 2 · rating 3.0–3.8 • Court flexible</p>
                </div>
              </div>
              <Button variant="primary" size="sm" className="rounded-[8px] px-3.5 py-1 text-xs bg-[var(--brand)]">
                Join Match
              </Button>
            </div>

            <div className="flex items-center justify-between gap-4 p-3 border border-[var(--line)] bg-[#f4fbf7] border-[#bddbcc] rounded-[12px]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono font-extrabold text-sm text-[var(--ink)]">3/4</span>
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-[var(--ink)] truncate">Women’s doubles · 20:00</p>
                  <p className="text-xs text-[var(--muted)] font-semibold truncate">Needs 1 · friendly tempo</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="rounded-[8px] px-3.5 py-1 text-xs border-[var(--line-strong)]">
                Request
              </Button>
            </div>
          </div>
        </Card>

        {/* Create Duel Setup */}
        <Card variant="surface" className="p-6 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)] flex flex-col justify-between min-h-[220px]">
          <div className="border-b border-[var(--line)]/50 pb-4">
            <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">Create duel invitation</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">Quick setup without calling front desk supervisors</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4">
            <Button
              variant={needPlayers === 1 ? "primary" : "secondary"}
              className="text-xs font-semibold py-1.5 rounded-[8px]"
              onClick={() => setNeedPlayers(1)}
            >
              Need 1 Player
            </Button>
            <Button
              variant={needPlayers === 2 ? "primary" : "secondary"}
              className="text-xs font-semibold py-1.5 rounded-[8px]"
              onClick={() => setNeedPlayers(2)}
            >
              Need 2 Players
            </Button>
            <Button
              variant={activeTab === "singles" ? "primary" : "secondary"}
              className="text-xs font-semibold py-1.5 rounded-[8px]"
              onClick={() => setActiveTab("singles")}
            >
              Singles
            </Button>
            <Button
              variant={activeTab === "doubles" ? "primary" : "secondary"}
              className="text-xs font-semibold py-1.5 rounded-[8px]"
              onClick={() => setActiveTab("doubles")}
            >
              Doubles
            </Button>
          </div>

          <div className="pt-6">
            <Button variant="primary" className="w-full rounded-[9px] text-xs font-bold py-2.5 bg-[var(--brand)]">
              Publish Duel Invitation
            </Button>
          </div>
        </Card>
      </section>

      {/* Heatmap level display */}
      <section className="space-y-4">
        <div className="border-b border-[var(--line)] pb-4">
          <h2 className="text-xl font-black text-[var(--foreground)]">Match Quality Guard</h2>
          <p className="text-xs font-semibold text-[var(--muted)] mt-1">
            Visual indicator showing active player density matching specific rating tiers.
          </p>
        </div>

        <Card variant="surface" className="p-4 border border-[var(--line-strong)] rounded-[16px] overflow-hidden">
          <div className="grid grid-cols-8 gap-2 text-center text-[11px] font-bold">
            <div className="bg-[var(--surface-soft)] rounded-[8px] p-2 flex items-center justify-center font-extrabold text-[var(--foreground)] border border-[var(--line)]">Tiers</div>
            <div className="bg-[#edf6f1] text-[#23624f] rounded-[8px] p-2 border border-[#cbe4d9]">2.5</div>
            <div className="bg-[#fbf0d8] text-[#755308] rounded-[8px] p-2 border border-[#ead59c]">3.0</div>
            <div className="bg-[#eaf8b6] text-[#405400] rounded-[8px] p-2 border border-[#d7ec7a] font-extrabold ring-1 ring-[#c8ff4d]">3.5</div>
            <div className="bg-[#fff0e8] text-[#94402a] rounded-[8px] p-2 border border-[#ecc0ae]">4.0</div>
            <div className="bg-[#edf6f1] text-[#23624f] rounded-[8px] p-2 border border-[#cbe4d9]">4.5</div>
            <div className="bg-[#fbf0d8] text-[#755308] rounded-[8px] p-2 border border-[#ead59c]">Open</div>
            <div className="bg-[#edf6f1] text-[#23624f] rounded-[8px] p-2 border border-[#cbe4d9]">Coach</div>
          </div>
        </Card>
      </section>
    </div>
  );
}
