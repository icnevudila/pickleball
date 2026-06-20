import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import { bookings, realtimeEvents, sessions } from "@/lib/mock-data";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Control room</p>
          <h1 className="section-title mt-3">Run booking, payment, and court rotation from one place.</h1>
        </div>
        <Link
          href="/admin/liveboard/friday-open-play"
          className="rounded-full bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)] px-5 py-3 text-sm font-bold text-slate-950"
        >
          Open live control
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SurfaceCard className="p-5">
          <p className="text-4xl font-black tracking-[-0.08em] text-white">{sessions.length}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">Sessions in system</p>
        </SurfaceCard>
        <SurfaceCard className="p-5">
          <p className="text-4xl font-black tracking-[-0.08em] text-white">{bookings.length}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">Tracked bookings</p>
        </SurfaceCard>
        <SurfaceCard className="p-5">
          <p className="text-4xl font-black tracking-[-0.08em] text-white">3</p>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">Realtime channels</p>
        </SurfaceCard>
      </div>

      <SurfaceCard className="p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-semibold tracking-[-0.05em] text-white">Live event stream</p>
          <StatusBadge tone="cyan">Session scoped</StatusBadge>
        </div>
        <div className="mt-5 space-y-3">
          {realtimeEvents.map((event) => (
            <div key={event.id} className="rounded-2xl border border-white/8 bg-black/15 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{event.label}</p>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">{event.timestamp}</p>
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-300">{event.detail}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
