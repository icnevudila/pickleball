"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

export default function AdminAnalyticsPage() {
  const params = useParams();
  const clubSlug = params.clubSlug as string;

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
            Analytics war room
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Grafik çöplüğü değil; hangi gün, hangi kort, hangi üye para getiriyor sorusunun cevabı.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">Refresh</Button>
          <Button variant="primary" size="sm" className="rounded-[8px] text-xs bg-[var(--brand)] text-white border-[var(--brand)]">Export Report</Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Month Revenue"
          value="TRY 126k"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Prime slot occupancy"
          value="82%"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Cohort retention (May)"
          value="41%"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Churn Risk Warning"
          value="24 members"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
      </section>

      {/* Priority Strip */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[12px] border border-red-500/20 bg-red-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              Pricing Optimization
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Friday C2 underpriced</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">Consider prime slot uplift</p>
          </div>
          <Button variant="primary" size="sm" className="w-full rounded-[8px] text-xs bg-[var(--brand)]">
            Model Uplift
          </Button>
        </article>

        <article className="rounded-[12px] border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Cohort analysis
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">May cohort healthy</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">Double down onboarding flow</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">
            View cohort
          </Button>
        </article>

        <article className="rounded-[12px] border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Churn risk
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">24 members inactive</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">Launch win-back campaigns</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">
            Campaigns
          </Button>
        </article>
      </section>

      {/* Main Grid Heatmaps & Cohort progress */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-base font-extrabold text-slate-200 tracking-tight">Court Revenue Heatmap</h3>
            <Badge tone="live">Live sync</Badge>
          </div>

          <div className="grid grid-cols-8 gap-1.5 text-center text-[10px] font-bold">
            <div className="bg-slate-800/40 text-slate-400 rounded p-1.5 flex items-center justify-center font-extrabold border border-slate-800">Day</div>
            <div className="bg-slate-800/20 text-slate-300 rounded p-1.5 border border-slate-800">Mon</div>
            <div className="bg-slate-800/20 text-slate-300 rounded p-1.5 border border-slate-800">Tue</div>
            <div className="bg-slate-800/20 text-slate-300 rounded p-1.5 border border-slate-800">Wed</div>
            <div className="bg-slate-800/20 text-slate-300 rounded p-1.5 border border-slate-800">Thu</div>
            <div className="bg-slate-800/20 text-slate-300 rounded p-1.5 border border-slate-800">Fri</div>
            <div className="bg-slate-800/20 text-slate-300 rounded p-1.5 border border-slate-800">Sat</div>
            <div className="bg-slate-800/20 text-slate-300 rounded p-1.5 border border-slate-800">Sun</div>

            <div className="bg-slate-800/40 text-slate-400 rounded p-1.5 flex items-center justify-center font-extrabold border border-slate-800">C1</div>
            <div className="bg-emerald-500/10 text-emerald-300 rounded p-1.5 border border-emerald-500/20">TRY 3k</div>
            <div className="bg-emerald-500/20 text-emerald-300 rounded p-1.5 border border-emerald-500/30">TRY 4k</div>
            <div className="bg-emerald-500/30 text-emerald-300 rounded p-1.5 border border-emerald-500/40">TRY 6k</div>
            <div className="bg-emerald-500/10 text-emerald-300 rounded p-1.5 border border-emerald-500/20">TRY 3k</div>
            <div className="bg-emerald-500/30 text-emerald-300 rounded p-1.5 border border-emerald-500/40">TRY 7k</div>
            <div className="bg-emerald-500/20 text-emerald-300 rounded p-1.5 border border-emerald-500/30">TRY 5k</div>
            <div className="bg-emerald-500/10 text-emerald-300 rounded p-1.5 border border-emerald-500/20">TRY 3k</div>

            <div className="bg-slate-800/40 text-slate-400 rounded p-1.5 flex items-center justify-center font-extrabold border border-slate-800">C2</div>
            <div className="bg-emerald-500/5 text-emerald-300/60 rounded p-1.5 border border-emerald-500/10">TRY 2k</div>
            <div className="bg-emerald-500/10 text-emerald-300 rounded p-1.5 border border-emerald-500/20">TRY 3k</div>
            <div className="bg-emerald-500/20 text-emerald-300 rounded p-1.5 border border-emerald-500/30">TRY 4k</div>
            <div className="bg-emerald-500/30 text-emerald-300 rounded p-1.5 border border-emerald-500/40 font-extrabold ring-1 ring-emerald-400">TRY 7k</div>
            <div className="bg-emerald-500/30 text-emerald-300 rounded p-1.5 border border-emerald-500/40 font-extrabold ring-1 ring-emerald-400 animate-pulse">TRY 8k</div>
            <div className="bg-emerald-500/20 text-emerald-300 rounded p-1.5 border border-emerald-500/30">TRY 5k</div>
            <div className="bg-emerald-500/10 text-emerald-300 rounded p-1.5 border border-emerald-500/20">TRY 3k</div>
          </div>
        </Card>

        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)] flex flex-col justify-between min-h-[180px]">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-200">Cohort signal</h3>
              <p className="text-xs text-slate-500 mt-0.5">Members who registered in May 2026</p>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <span className="text-3xl font-black font-mono text-slate-100">41%</span>
            <p className="text-xs text-slate-400 font-semibold">returned 3+ times in their first month</p>
            <div className="w-full bg-slate-800 rounded-md h-2 border border-slate-700 overflow-hidden">
              <div className="h-full bg-[var(--brand)]" style={{ width: "41%" }} />
            </div>
          </div>
        </Card>
      </section>

      {/* Grid of leader stats */}
      <section className="grid gap-4 grid-cols-3">
        <Card variant="surface" className="p-4 border border-slate-800 bg-slate-900/60 rounded-[10px] text-center space-y-1">
          <h4 className="text-[10px] font-bold uppercase text-slate-500">Best Performing Court</h4>
          <span className="text-2xl font-black text-slate-100">Court 2</span>
          <p className="text-[10px] text-[var(--brand)] font-semibold mt-1">TRY 8,000 / Friday peak</p>
        </Card>
        <Card variant="surface" className="p-4 border border-slate-800 bg-slate-900/60 rounded-[10px] text-center space-y-1">
          <h4 className="text-[10px] font-bold uppercase text-slate-500">Best Performing Member</h4>
          <span className="text-2xl font-black text-slate-100">TRY 8.2k</span>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">LTV cohort leader</p>
        </Card>
        <Card variant="surface" className="p-4 border border-slate-800 bg-slate-900/60 rounded-[10px] text-center space-y-1">
          <h4 className="text-[10px] font-bold uppercase text-slate-500">Churn risk warnings</h4>
          <span className="text-2xl font-black text-slate-100">24</span>
          <p className="text-[10px] text-amber-500 font-semibold mt-1">No visit recorded in 30 days</p>
        </Card>
      </section>

      {/* Bottom info banner */}
      <Card variant="surface" className="p-5 border border-slate-800 bg-gradient-to-b from-[#fffaf5]/5 to-[#fff1e8]/5 rounded-[12px]">
        <h4 className="text-sm font-extrabold text-slate-200">Friday Court 2 is the money slot</h4>
        <p className="text-xs text-slate-400 leading-relaxed mt-2 max-w-2xl font-semibold">
          Analytics dashboard telemetry outputs clear pricing and session scheduling decisions, rather than generic visual charts alone.
        </p>
      </Card>

    </div>
  );
}
