"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

export default function AdminRolesPage() {
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
            Permission matrix
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            RBAC ekranı; rol listesi değil, riskli yetki kararları.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">Refresh</Button>
          <Button variant="primary" size="sm" className="rounded-[8px] text-xs bg-[var(--brand)] text-white border-[var(--brand)]">Invite Staff</Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Roles"
          value="4 roles"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Risk flags active"
          value="3 warnings"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Audit Log Status"
          value="Enabled"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Open invitations"
          value="0 invites"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
      </section>

      {/* Priority Strip */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[12px] border border-red-500/20 bg-red-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              Money permission
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Refund is manager-only</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">Keep financial settings locked</p>
          </div>
          <Button variant="primary" size="sm" className="w-full rounded-[8px] text-xs bg-[var(--brand)]">
            Review
          </Button>
        </article>

        <article className="rounded-[12px] border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Reception
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Operational access clean</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">No finance exposure risk</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">
            Open matrix
          </Button>
        </article>

        <article className="rounded-[12px] border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Coaches
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Session access pending</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">Approve pending staff invite</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">
            Approve
          </Button>
        </article>
      </section>

      {/* Role Matrix Card */}
      <section className="space-y-4">
        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-base font-extrabold text-slate-200 tracking-tight">Active Roles Overview</h3>
            <Badge tone="slate">RBAC</Badge>
          </div>

          <div className="divide-y divide-slate-800">
            {[
              { role: "Reception", desc: "Check-in, queue supervision, quick POS transactions", risk: "No refund permissions", tone: "slate" as const },
              { role: "Manager", desc: "Refund execution, policy parameters edit, staff roles administration", risk: "Full audit tracking active", tone: "brand" as const },
              { role: "Coach / Instructor", desc: "Session slot setup, player attendance tracking", risk: "No financial systems access", tone: "slate" as const },
            ].map((r, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 text-xs font-semibold text-slate-400">
                <div>
                  <p className="font-extrabold text-sm text-slate-200">{r.role}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{r.desc} • <span className="text-amber-500">{r.risk}</span></p>
                </div>
                <Button variant="secondary" size="sm" className="rounded-[6px] text-xs bg-slate-800 border-slate-750 text-slate-300">Edit</Button>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Risky Permissions Matrix */}
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)] flex flex-col justify-between">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-200">Risky permissions</h3>
              <p className="text-xs text-slate-500 mt-0.5">Critical security configuration items</p>
            </div>
            <Badge tone="rose">3 active</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border border-slate-800 bg-slate-850 rounded-[10px]">
              <div>
                <p className="font-extrabold text-sm text-slate-200">Refund without approval</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Manager only</p>
              </div>
              <Badge tone="rose">LOCK</Badge>
            </div>

            <div className="flex justify-between items-center p-3 border border-slate-800 bg-slate-850 rounded-[10px]">
              <div>
                <p className="font-extrabold text-sm text-slate-200">Change cancellation policies</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Requires secure audit ledger log write</p>
              </div>
              <Badge tone="amber">AUDIT</Badge>
            </div>
          </div>
        </Card>

        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)] flex flex-col justify-between h-full">
          <div>
            <h3 className="text-base font-extrabold text-slate-200 tracking-tight mb-2">Staff invite</h3>
            <p className="text-xs text-slate-400 mb-4 font-semibold leading-relaxed">
              Add operational reception agents or coaches. Invites expire after 24 hours automatically.
            </p>
            <Button variant="primary" className="w-full rounded-[8px] text-xs bg-[var(--brand)] py-2">Invite staff member</Button>
          </div>
        </Card>
      </section>
      
    </div>
  );
}
