"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

export default function AdminBookingsPage() {
  const params = useParams();
  const clubSlug = params.clubSlug as string;

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pickle Pulse</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-[-0.08em] text-slate-100">
            Bookings calendar
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Admin randevu ekranı; takvim/kort board, ödeme riski ve check-in aksiyonu.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">Refresh</Button>
          <Button variant="primary" size="sm" className="rounded-[8px] text-xs bg-[var(--brand)] text-white border-[var(--brand)]">Primary action</Button>
        </div>
      </div>

      {/* Metrics Row */}
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Bookings"
          value="32"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Payment risk"
          value="2"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Walk-ins"
          value="4"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Occupancy"
          value="86%"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
      </section>

      {/* Priority Strip */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[12px] border border-[#e3b197]/40 bg-gradient-to-b from-[#fffaf5]/5 to-[#fff3eb]/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-orange-400">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
              Payment risk
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Court 2 split pending</h3>
            <p className="text-xs text-slate-400 mt-0.5">Collect before check-in</p>
          </div>
          <Button variant="primary" size="sm" className="w-full rounded-[8px] text-xs bg-[var(--brand)]">
            Collect
          </Button>
        </article>

        <article className="rounded-[12px] border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Open slot
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Court 4 is available</h3>
            <p className="text-xs text-slate-400 mt-0.5">Use for walk-in hold</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">
            Hold
          </Button>
        </article>

        <article className="rounded-[12px] border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Deposit
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Corporate group missing</h3>
            <p className="text-xs text-slate-400 mt-0.5">Call contact</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">
            Call
          </Button>
        </article>
      </section>

      {/* Calendar Grid */}
      <section className="rounded-[12px] border border-slate-800 bg-slate-900/60 overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-800/40 border-b border-slate-800 px-4 py-3">
          <div>Time</div>
          <div>Court 1</div>
          <div>Court 2</div>
          <div>Court 3</div>
          <div>Court 4</div>
        </div>

        {/* 18:00 row */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] border-b border-slate-800 px-4 py-3 min-h-[90px] items-center">
          <div className="font-mono font-bold text-slate-500">18:00</div>
          <div className="pr-2">
            <div className="rounded-[8px] border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs">
              <p className="font-extrabold text-emerald-300">Alex / Daniel</p>
              <p className="text-[10px] text-emerald-400/80 mt-0.5">paid · checked-in</p>
            </div>
          </div>
          <div className="pr-2">
            <div className="rounded-[8px] border border-amber-500/30 bg-amber-500/10 p-2 text-xs">
              <p className="font-extrabold text-amber-300">Ali / Mert</p>
              <p className="text-[10px] text-amber-400/80 mt-0.5">split pending</p>
            </div>
          </div>
          <div className="pr-2">
            <div className="rounded-[8px] border border-slate-700 bg-slate-800/80 p-2 text-xs">
              <p className="font-extrabold text-slate-200">Open Play</p>
              <p className="text-[10px] text-slate-400 mt-0.5">10/12 booked</p>
            </div>
          </div>
          <div>
            <div className="rounded-[8px] border border-dashed border-emerald-500/20 bg-emerald-500/5 p-2 text-xs text-center">
              <p className="font-extrabold text-emerald-400/60">Open</p>
              <p className="text-[10px] text-slate-500 mt-0.5">walk-in ready</p>
            </div>
          </div>
        </div>

        {/* 19:00 row */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] px-4 py-3 min-h-[90px] items-center">
          <div className="font-mono font-bold text-slate-500">19:00</div>
          <div className="pr-2">
            <div className="rounded-[8px] border border-amber-500/30 bg-amber-500/10 p-2 text-xs">
              <p className="font-extrabold text-amber-300">Corporate group</p>
              <p className="text-[10px] text-amber-400/80 mt-0.5">deposit missing</p>
            </div>
          </div>
          <div className="pr-2">
            <div className="rounded-[8px] border border-slate-700 bg-slate-800/80 p-2 text-xs">
              <p className="font-extrabold text-slate-200">Mixed doubles</p>
              <p className="text-[10px] text-slate-400 mt-0.5">paid</p>
            </div>
          </div>
          <div className="pr-2">
            <div className="rounded-[8px] border border-dashed border-emerald-500/20 bg-emerald-500/5 p-2 text-xs text-center">
              <p className="font-extrabold text-emerald-400/60">Open</p>
              <p className="text-[10px] text-slate-500 mt-0.5">best slot</p>
            </div>
          </div>
          <div>
            <div className="rounded-[8px] border border-slate-700 bg-slate-800/80 p-2 text-xs">
              <p className="font-extrabold text-slate-200">Private lesson</p>
              <p className="text-[10px] text-slate-400 mt-0.5">coach Ece</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conflict Watch & Walk-in hold split */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-200 tracking-tight">Conflict watch</h3>
              <Badge tone="rose">2 alerts</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border border-slate-800 bg-slate-850 rounded-[10px]">
                <div>
                  <p className="font-extrabold text-sm text-slate-200">Split pending at 18:00</p>
                  <p className="text-xs text-slate-400">Court 2 cannot auto check-in</p>
                </div>
                <Button variant="primary" size="sm" className="rounded-[8px] text-xs bg-[var(--brand)]">Collect</Button>
              </div>

              <div className="flex justify-between items-center p-3 border border-slate-800 bg-slate-850 rounded-[10px]">
                <div>
                  <p className="font-extrabold text-sm text-slate-200">Deposit missing at 19:00</p>
                  <p className="text-xs text-slate-400">Corporate group booking</p>
                </div>
                <Button variant="secondary" size="sm" className="rounded-[8px] text-xs bg-slate-800 border-slate-700 text-slate-300">Call</Button>
              </div>
            </div>
          </Card>

          <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)]">
            <h3 className="text-base font-extrabold text-slate-200 tracking-tight mb-2">Walk-in hold</h3>
            <p className="text-xs text-slate-400 mb-4">Fast add without breaking calendar schedule rhythm.</p>
            <Button variant="primary" className="w-full rounded-[8px] text-xs bg-[var(--brand)] py-2">Create 30-min hold on Court 4</Button>
          </Card>
        </div>

        {/* Right side next action panel */}
        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)] flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-200 tracking-tight">Next action</h3>
              <Badge tone="amber">Now</Badge>
            </div>
            <div className="rounded-[10px] bg-slate-800/80 p-4 border border-slate-700 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-200">Collect Court 2 split</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Selected booking exposes payment, check-in, move, cancel, and TV announcement actions directly.
              </p>
              <div className="flex gap-2 pt-2">
                <Button variant="primary" className="rounded-[8px] text-xs bg-[var(--brand)] px-4 py-2">Run action</Button>
                <Button variant="secondary" className="rounded-[8px] text-xs bg-slate-900 border-slate-850 text-slate-300 px-4 py-2">Details</Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

    </div>
  );
}
