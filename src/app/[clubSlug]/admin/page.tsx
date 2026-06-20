import Link from "next/link";
import { Activity, Layers, Tv, Compass, Layers3, Play } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { bookings, realtimeEvents, sessions } from "@/lib/mock-data";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  const clubName = clubSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="space-y-6">
      {/* Dynamic Header modeled after dentist PageHeader */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-[var(--line)] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--out-green)] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand)]">
              {clubName} Command Center
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-[-0.08em] text-[var(--foreground)]">
            Club Operations Console
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button variant="secondary" size="sm" asChild className="rounded-[12px] text-xs">
            <Link href={`/${clubSlug}/sessions`}>Public Portal</Link>
          </Button>
          <Button variant="primary" size="sm" asChild className="rounded-[12px] text-xs">
            <Link href={`/${clubSlug}/admin/liveboard/friday-open-play`}>Live Control</Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row (Sıkı Ops Summary Grid Layout) */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-soft)]/60 px-4 py-3 shadow-[var(--shadow-sm)]">
          <p className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Active Groups</p>
          <p className="mt-1 text-2xl font-black font-mono text-[var(--foreground)]">{sessions.length}</p>
        </div>
        <div className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-soft)]/60 px-4 py-3 shadow-[var(--shadow-sm)]">
          <p className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Tracked Bookings</p>
          <p className="mt-1 text-2xl font-black font-mono text-[var(--foreground)]">{bookings.length}</p>
        </div>
        <div className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-soft)]/60 px-4 py-3 shadow-[var(--shadow-sm)] col-span-2 lg:col-span-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Active Telemetry</p>
          <p className="mt-1 text-2xl font-black font-mono text-[var(--out-green)] flex items-center gap-1.5">
            100% <span className="text-[10px] font-sans font-bold text-[var(--muted)]">channels sync</span>
          </p>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        
        {/* Live Court Pulse (Left Operational Grid) */}
        <Card variant="surface" className="p-5 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-4 mb-4 border-b border-[var(--line)] pb-3">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-[var(--brand)]" />
              <h2 className="text-base font-black tracking-tight text-[var(--foreground)] uppercase">
                Active Court Feeds
              </h2>
            </div>
            <span className="inline-flex items-center rounded-[8px] bg-[var(--brand-soft)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--brand-deep)]">
              REALTIME TIMERS
            </span>
          </div>

          <div className="space-y-3">
            {[
              { court: "Court 01 (West)", status: "36 min left", detail: "M. Kaya / T. Yılmaz vs N. Demir / L. Çelik", progress: "72%", tone: "live" },
              { court: "Court 02 (East)", status: "Starts 18:00", detail: "Open match / 2 seats open", progress: "35%", tone: "brand" },
              { court: "Court 03 (Training)", status: "Ready in 7 min", detail: "Cleaning turnover cycle", progress: "20%", tone: "amber" },
            ].map((item, index) => (
              <div
                key={item.court}
                className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-muted)] p-4 transition-all hover:border-[var(--line-strong)] space-y-3 shadow-[var(--shadow-sm)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-[var(--foreground)] text-sm">{item.court}</p>
                    <p className="text-xs text-[var(--muted)] font-semibold">{item.detail}</p>
                  </div>
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-[var(--brand)] bg-[var(--brand-soft)] px-2 py-0.5 rounded-[6px]">
                    {item.status}
                  </span>
                </div>
                
                {/* Visual Capacity Bar */}
                <div className="w-full bg-[var(--surface-soft)] rounded-md h-2 overflow-hidden border border-[var(--line)]">
                  <div
                    className="h-full rounded-md transition-all duration-500"
                    style={{
                      width: item.progress,
                      background:
                        index === 0
                          ? "var(--out-green)"
                          : index === 1
                          ? "var(--brand)"
                          : "var(--accent-amber)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Club Activity / Event Trail (Right Panel) */}
        <Card variant="surface" className="p-5 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-4 mb-4 border-b border-[var(--line)] pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[var(--brand)]" />
              <h2 className="text-base font-black tracking-tight text-[var(--foreground)] uppercase">
                Activity Logs
              </h2>
            </div>
            <span className="inline-flex items-center rounded-[8px] bg-[var(--brand-soft)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--brand-deep)]">
              LIVE SIGNAL
            </span>
          </div>

          <div className="space-y-3">
            {realtimeEvents.map((event, index) => (
              <div
                key={event.id}
                className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-muted)] p-3 transition-all hover:border-[var(--line-strong)] space-y-1.5 shadow-[var(--shadow-sm)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--brand-soft)] text-[9px] font-black text-[var(--brand-deep)] font-mono">
                      {index + 1}
                    </span>
                    <p className="font-extrabold text-[var(--foreground)] text-xs uppercase">{event.label}</p>
                  </div>
                  <span className="rounded-[6px] border border-[var(--line)] bg-[var(--surface)] px-2 py-0.5 text-[9px] font-mono font-bold text-[var(--muted)]">
                    {event.timestamp}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[var(--muted)] leading-relaxed">{event.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
