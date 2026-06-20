import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import { bookings, realtimeEvents, sessions } from "@/lib/mock-data";

const metrics = [
  [`${sessions.length}`, "Active session groups"],
  [`${bookings.length}`, "Tracked reservations"],
  ["3", "Realtime channels"],
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <SurfaceCard className="p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Live command center</p>
            <h1 className="section-title mt-4">Run booking, queue, payments, and live courts from one operator view.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
              Staff screens should prioritize what needs action now. This is why the command surface leads with court state, queue pressure, and live activity instead of static dashboard noise.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/sessions" className="btn-secondary px-5 py-3">
              Public link
            </Link>
            <Link href="/admin/liveboard/friday-open-play" className="btn-primary px-5 py-3">
              Open live control
            </Link>
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map(([value, label]) => (
          <SurfaceCard key={label} className="p-5">
            <p className="text-4xl font-extrabold tracking-[-0.08em] text-[color:var(--foreground)]">{value}</p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</p>
          </SurfaceCard>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">Live court pulse</p>
            <StatusBadge tone="cyan">Session scoped</StatusBadge>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["Court 01", "36 min left", "Mika / Tara vs Noah / Lea", "72%"],
              ["Court 02", "Starts 18:00", "Open match / 2 seats", "35%"],
              ["Court 03", "Ready in 7 min", "Cleaning turnover", "20%"],
            ].map(([court, status, detail, progress], index) => (
              <div key={court} className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: index === 0 ? "var(--green)" : index === 1 ? "var(--brand)" : "var(--amber)" }}
                    />
                    <div>
                      <p className="font-extrabold text-[color:var(--foreground)]">{court}</p>
                      <p className="text-sm text-[color:var(--muted)]">{detail}</p>
                    </div>
                  </div>
                  <p className="text-sm font-extrabold text-[color:var(--foreground)]">{status}</p>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: progress,
                      background: index === 0 ? "var(--green)" : index === 1 ? "var(--brand)" : "var(--amber)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">Club activity</p>
            <StatusBadge tone="amber">Actionable</StatusBadge>
          </div>
          <div className="mt-5 space-y-3">
            {realtimeEvents.map((event, index) => (
              <div key={event.id} className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--brand-soft)] text-xs font-black text-[color:var(--brand-deep)]">
                      {index + 1}
                    </span>
                    <p className="font-extrabold text-[color:var(--foreground)]">{event.label}</p>
                  </div>
                  <p className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-xs font-bold text-[color:var(--muted)]">
                    {event.timestamp}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{event.detail}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
