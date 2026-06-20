import Link from "next/link";
import { Activity, LayoutGrid, Layers, Tv, Compass, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { bookings, realtimeEvents, sessions } from "@/lib/mock-data";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card variant="surface" className="p-6 sm:p-8 border border-[var(--line-strong)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge tone="brand">Live Command Center</Badge>
            <h1 className="section-title text-3xl font-black mt-2 leading-tight">
              Run booking, queue, payments, and live courts from one operator view.
            </h1>
            <p className="text-sm leading-relaxed text-[var(--muted)] max-w-3xl">
              Staff screens prioritize what needs action now. Leads with court state, queue pressure, and live activity instead of static dashboard noise.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/sessions">Public Booking</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/admin/liveboard/friday-open-play">Open Live Control</Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Active Session Groups"
          value={sessions.length}
          icon={<Layers className="w-5 h-5" />}
        />
        <StatCard
          label="Tracked Reservations"
          value={bookings.length}
          icon={<LayoutGrid className="w-5 h-5" />}
        />
        <StatCard
          label="Realtime Channels"
          value="3"
          icon={<Activity className="w-5 h-5" />}
          trend={{ value: "Active", direction: "neutral" }}
        />
      </div>

      {/* Main Grid content */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Live Court Pulse */}
        <Card variant="surface" className="p-6 border border-[var(--line-strong)]">
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-[var(--line)]/50 pb-4">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-[var(--brand)]" />
              <h2 className="text-xl font-black tracking-tight text-[var(--foreground)]">
                Live Court Pulse
              </h2>
            </div>
            <Badge tone="brand">Session Scoped</Badge>
          </div>

          <div className="space-y-4">
            {[
              { court: "Court 01", status: "36 min left", detail: "Mika / Tara vs Noah / Lea", progress: "72%", tone: "live" },
              { court: "Court 02", status: "Starts 18:00", detail: "Open match / 2 seats", progress: "35%", tone: "brand" },
              { court: "Court 03", status: "Ready in 7 min", detail: "Cleaning turnover", progress: "20%", tone: "amber" },
            ].map((item, index) => (
              <div
                key={item.court}
                className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-muted)] p-5 transition-all hover:border-[var(--line-strong)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        index === 0
                          ? "bg-[var(--green)] animate-pulse"
                          : index === 1
                          ? "bg-[var(--brand)]"
                          : "bg-[var(--amber)]"
                      }`}
                    />
                    <div>
                      <p className="font-extrabold text-[var(--foreground)] text-sm">{item.court}</p>
                      <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                  <p className="text-xs font-black uppercase tracking-wider text-[var(--foreground)]">{item.status}</p>
                </div>
                <div className="mt-4 h-2.5 rounded-full bg-[var(--surface-soft)] overflow-hidden border border-[var(--line)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: item.progress,
                      background:
                        index === 0
                          ? "var(--green)"
                          : index === 1
                          ? "linear-gradient(90deg,var(--brand),#ff7654)"
                          : "var(--amber)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Club Activity */}
        <Card variant="surface" className="p-6 border border-[var(--line-strong)]">
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-[var(--line)]/50 pb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[var(--brand)]" />
              <h2 className="text-xl font-black tracking-tight text-[var(--foreground)]">
                Club Activity
              </h2>
            </div>
            <Badge tone="amber">Actionable</Badge>
          </div>

          <div className="space-y-4">
            {realtimeEvents.map((event, index) => (
              <div
                key={event.id}
                className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-muted)] p-4 transition-all hover:border-[var(--line-strong)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--brand-soft)] text-[10px] font-black text-[var(--brand-deep)]">
                      {index + 1}
                    </span>
                    <p className="font-extrabold text-[var(--foreground)] text-xs">{event.label}</p>
                  </div>
                  <p className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-0.5 text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider">
                    {event.timestamp}
                  </p>
                </div>
                <p className="mt-2 text-xs font-semibold text-[var(--muted)] leading-relaxed">{event.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
