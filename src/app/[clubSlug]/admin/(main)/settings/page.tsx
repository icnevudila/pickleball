"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

export default function AdminSettingsPage() {
  const params = useParams();
  const clubSlug = params.clubSlug as string;
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const handleCopy = (path: string, idx: number) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(origin + path);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-200 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pickle Pulse</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-[-0.08em] text-slate-100 mt-1">
            Policy center
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Settings formu değil; işletme politikalarının karar merkezi.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">Refresh</Button>
          <Button variant="primary" size="sm" className="rounded-[8px] text-xs bg-[var(--brand)] text-white border-[var(--brand)]">Save Changes</Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Cancel rule"
          value="24h limit"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Club hours"
          value="07:00–23:00"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Payment modes"
          value="3 active"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Audit Logs"
          value="Enabled"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
      </section>

      {/* Priority Strip */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[12px] border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Policy impact
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Changing refunds affects bookings</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">Requires manager approval pass</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">
            Review
          </Button>
        </article>

        <article className="rounded-[12px] border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Sync status
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Public pages synced</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">No action needed</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">
            View pages
          </Button>
        </article>

        <article className="rounded-[12px] border border-[#e3b197]/20 bg-[#fffaf5]/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-orange-400">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
              Liveboard TV
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Voice synthesizer active</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">Test synthesizer broadcast</p>
          </div>
          <Button variant="primary" size="sm" className="w-full rounded-[8px] text-xs bg-[var(--brand)]">
            Test Voice
          </Button>
        </article>
      </section>

      {/* Settings Sections */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)] flex flex-col justify-between min-h-[180px]">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-200">Cancellation policy</h3>
              <p className="text-xs text-slate-500 mt-0.5">Currently active rules</p>
            </div>
            <Badge tone="amber">24h</Badge>
          </div>

          <div className="space-y-1.5 pt-4">
            <h4 className="text-xl font-black text-slate-100">No refund after 24h</h4>
            <p className="text-xs text-slate-400">Applies automatically to courts, sessions and split payments.</p>
          </div>

          <div className="pt-6">
            <Button variant="secondary" size="sm" className="rounded-[8px] text-xs bg-slate-800 border-slate-700 text-slate-300">Edit rule</Button>
          </div>
        </Card>

        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)] flex flex-col justify-between min-h-[180px]">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-200">Club Hours</h3>
              <p className="text-xs text-slate-500 mt-0.5">Public booking slot visibility bounds</p>
            </div>
            <Badge tone="lime">Open</Badge>
          </div>

          <div className="rounded-[8px] bg-slate-955 p-3 text-xs font-mono space-y-1.5 border border-slate-800/80">
            <div className="flex justify-between">
              <span className="text-slate-400">Weekday hours</span>
              <span className="font-bold text-slate-200">07:00–23:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Weekend hours</span>
              <span className="font-bold text-slate-200">08:00–22:00</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Grid of additional actions */}
      <section className="grid gap-4 grid-cols-3">
        <Card variant="surface" className="p-4 border border-slate-800 bg-slate-900/60 rounded-[10px] text-center space-y-2">
          <h4 className="text-xs font-bold uppercase text-slate-400">Brand config</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed">Accent color theme variables</p>
          <Button variant="secondary" size="sm" className="w-full text-xs font-semibold py-1 rounded-[6px] bg-slate-800 border-slate-700 text-slate-300">Edit brand</Button>
        </Card>
        <Card variant="surface" className="p-4 border border-slate-800 bg-slate-900/60 rounded-[10px] text-center space-y-2">
          <h4 className="text-xs font-bold uppercase text-slate-400">Payments gateway</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed">Split, card, stripe keys</p>
          <Button variant="secondary" size="sm" className="w-full text-xs font-semibold py-1 rounded-[6px] bg-slate-800 border-slate-700 text-slate-300">Edit payments</Button>
        </Card>
        <Card variant="surface" className="p-4 border border-slate-800 bg-slate-900/60 rounded-[10px] text-center space-y-2">
          <h4 className="text-xs font-bold uppercase text-slate-400">Lobby TV screen</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed">Announcer speed rules</p>
          <Button variant="secondary" size="sm" className="w-full text-xs font-semibold py-1 rounded-[6px] bg-slate-800 border-slate-700 text-slate-300">Edit TV</Button>
        </Card>
      </section>

      {/* Player Invite & Access Links */}
      <section className="space-y-4">
        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)]">
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-base font-extrabold text-slate-100 tracking-tight">Invite Links & Player Access</h3>
            <p className="text-xs text-slate-450 mt-0.5 font-semibold">Share these links with your members and players for booking and registration.</p>
          </div>

          <div className="space-y-3">
            {[
              { label: "Public Club Showcase", desc: "For general guests to see seans list, club telemetry, and pricing plans.", path: `/${clubSlug}` },
              { label: "Kort Booking Calendar", desc: "Direct path for players to browse active hours and book slots.", path: `/${clubSlug}/book` },
              { label: "Member Sign Up Form", desc: "Direct register link to share for new player profile registrations.", path: `/${clubSlug}/register` },
              { label: "Member Sign In Portal", desc: "Link for members to view their bookings, wallet balance, and loyalty streaks.", path: `/${clubSlug}/login` },
            ].map((link, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-[8px] bg-slate-950/40 border border-slate-850 gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-200">{link.label}</span>
                  <p className="text-[10px] text-slate-500 font-semibold">{link.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                    {link.path}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-[6px] text-[10px] py-1 bg-slate-800 border-slate-700 text-slate-300 font-extrabold min-w-[64px]"
                    onClick={() => handleCopy(link.path, idx)}
                  >
                    {copiedIdx === idx ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Bottom info banner */}
      <Card variant="surface" className="p-5 border border-slate-800 bg-gradient-to-b from-[#fffaf5]/5 to-[#fff1e8]/5 rounded-[12px]">
        <h4 className="text-sm font-extrabold text-slate-200">Policy change needs audit</h4>
        <p className="text-xs text-slate-400 leading-relaxed mt-2 max-w-2xl font-semibold">
          Every changed configuration shows a live projection of how public calendars, refund rules, and staff permissions will react prior to permanent storage.
        </p>
      </Card>

    </div>
  );
}
