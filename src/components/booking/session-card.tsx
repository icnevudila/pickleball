import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import type { Session } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

const sessionTone = {
  open: "lime",
  "few-spots": "amber",
  waitlist: "rose",
  live: "cyan",
  completed: "slate",
} as const;

export function SessionCard({ session }: { session: Session }) {
  const spotsLeft = Math.max(session.capacity - session.booked, 0);
  const ctaLabel = session.status === "waitlist" ? "Join waitlist" : "Reserve now";

  return (
    <SurfaceCard className="flex h-full flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <StatusBadge tone={sessionTone[session.status]}>
          {session.status === "few-spots" ? "Few spots" : session.status}
        </StatusBadge>
        <p className="text-lg font-semibold text-white">{formatCurrency(session.price)}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-3xl font-semibold tracking-[-0.06em] text-white">{session.name}</h3>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
          {session.dayLabel} · {session.timeLabel} · {session.level}
        </p>
        <p className="text-sm leading-7 text-slate-300">{session.hero}</p>
      </div>

      <div className="space-y-2">
        <div className="h-2 rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#d4ff5f,#36d4ff)]"
            style={{ width: formatPercent(session.booked, session.capacity) }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>
            <strong className="text-white">{session.booked}/{session.capacity}</strong> booked
          </span>
          <span>{session.status === "waitlist" ? "Waitlist open" : `${spotsLeft} spots left`}</span>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-3">
        <Link
          href={`/sessions/${session.id}`}
          className="rounded-full bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)] px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.01]"
        >
          {ctaLabel}
        </Link>
        <Link
          href={`/liveboard/tv/${session.id}`}
          className="rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
        >
          View liveboard
        </Link>
      </div>
    </SurfaceCard>
  );
}
