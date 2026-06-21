"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

export default function AdminNotificationsPage() {
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
            Automation command
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            SMS/push/TV/ses otomasyonu; kim neyi ne zaman duyacak net.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">Refresh</Button>
          <Button variant="primary" size="sm" className="rounded-[8px] text-xs bg-[var(--brand)] text-white border-[var(--brand)]">Configure Flows</Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Flows"
          value="8 flows"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Voice templates"
          value="2 scripts"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Delivery Rate"
          value="99%"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
        <StatCard
          label="Failed Queue"
          value="0 failures"
          className="bg-slate-900/60 border border-slate-800 text-slate-200 rounded-[12px]"
        />
      </section>

      {/* Priority Strip */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[12px] border border-red-500/20 bg-red-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              Lobby Voice
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Court ready script active</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">Test before evening rush hours</p>
          </div>
          <Button variant="primary" size="sm" className="w-full rounded-[8px] text-xs bg-[var(--brand)]">
            Test Voice
          </Button>
        </article>

        <article className="rounded-[12px] border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Booking Reminders
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Reminders fully active</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">No failed delivery warnings</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">
            View logs
          </Button>
        </article>

        <article className="rounded-[12px] border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Split payments
            </div>
            <h3 className="font-extrabold text-slate-200 text-sm mt-1">Reminder timings</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">Review split billing SMS copy</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700">
            Edit timings
          </Button>
        </article>
      </section>

      {/* Automation Flows & Voice Script Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-base font-extrabold text-slate-200 tracking-tight">Active Automation Flows</h3>
            <Badge tone="lime">ON</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border border-slate-800 bg-slate-850 rounded-[10px]">
              <div>
                <p className="font-extrabold text-sm text-slate-200">T-24 Booking Reminder</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">SMS + Email template · 24 hours prior</p>
              </div>
              <Badge tone="lime">ON</Badge>
            </div>

            <div className="flex justify-between items-center p-3 border border-slate-800 bg-[#fff4ee]/5 border-[#e2aa93]/20 rounded-[10px]">
              <div>
                <p className="font-extrabold text-sm text-slate-200">Court Ready Announcement</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Lobby TV liveboard pop + voice broadcast</p>
              </div>
              <Button variant="primary" size="sm" className="rounded-[8px] text-xs bg-[var(--brand)]">Test</Button>
            </div>

            <div className="flex justify-between items-center p-3 border border-slate-800 bg-slate-850 rounded-[10px]">
              <div>
                <p className="font-extrabold text-sm text-slate-200">Split payment reminder</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5 font-mono">Triggers at T-60m and T-15m</p>
              </div>
              <Badge tone="amber">EDIT</Badge>
            </div>
          </div>
        </Card>

        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] shadow-[var(--shadow-sm)] flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-200">Lobby Voice Script</h3>
              <p className="text-xs text-slate-500 mt-0.5">Text-to-speech audio setup</p>
            </div>
          </div>

          <div className="rounded-[8px] bg-slate-955 p-3 text-xs font-mono space-y-1.5 border border-slate-800/80">
            <div className="flex justify-between">
              <span className="text-slate-400">Language</span>
              <span className="font-bold text-slate-200">tr-TR (Standard)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Announcement template</span>
              <span className="font-bold text-slate-200">"Kort &#123;court&#125; hazır"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Volume bound</span>
              <span className="font-bold text-slate-200">0.8 (Loud)</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Recent Sends Table */}
      <section className="space-y-4">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-xl font-black text-slate-200">Recent Sends Log</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Realtime delivery confirmation.
          </p>
        </div>

        <Card variant="surface" className="overflow-hidden border border-slate-800 bg-slate-900/60 rounded-[12px]">
          <div className="divide-y divide-slate-800">
            {[
              { desc: "TV Voice Announcement · Court 4 Ready", time: "18:42", status: "sent", tone: "lime" as const },
              { desc: "SMS Reminder · Split payment Ali Düvenci", time: "18:30", status: "sent", tone: "lime" as const },
            ].map((log, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 text-xs font-semibold text-slate-400 hover:bg-slate-850/20 transition-colors">
                <div>
                  <p className="font-extrabold text-sm text-slate-200">{log.desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-500">{log.time}</span>
                  <Badge tone={log.tone}>{log.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Bottom info banner */}
      <Card variant="surface" className="p-5 border border-slate-800 bg-gradient-to-b from-[#fffaf5]/5 to-[#fff1e8]/5 rounded-[12px]">
        <h4 className="text-sm font-extrabold text-slate-200">Test TV voice before rush</h4>
        <p className="text-xs text-slate-400 leading-relaxed mt-2 max-w-2xl font-semibold">
          Automation flows must be audible in the lobby area, traceable in the administration logs, and easy to pause instantly when needed.
        </p>
      </Card>

    </div>
  );
}
