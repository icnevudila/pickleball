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

export function SessionCard({ session, clubSlug }: { session: Session; clubSlug?: string }) {
  const spotsLeft = Math.max(session.capacity - session.booked, 0);
  const ctaLabel = session.status === "waitlist" ? "Join waitlist" : "Reserve seat";

  return (
    <SurfaceCard className="flex h-full flex-col gap-5 overflow-hidden p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <StatusBadge tone={sessionTone[session.status]}>
            {session.status === "few-spots" ? "Few spots" : session.status}
          </StatusBadge>
          <div>
            <h3 className="text-3xl font-extrabold tracking-[-0.07em] text-[color:var(--foreground)]">{session.name}</h3>
            <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[color:var(--muted)]">
              {session.dayLabel} / {session.timeLabel}
            </p>
          </div>
        </div>
        <div className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-right">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">Price</p>
          <p className="mt-1 text-xl font-extrabold tracking-[-0.05em] text-[var(--foreground)] font-mono">{formatCurrency(session.price)}</p>
        </div>
      </div>

      <p className="text-sm leading-7 text-[var(--muted)]">{session.level}</p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-muted)] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">Booked</p>
          <p className="mt-2 text-2xl font-extrabold tracking-[-0.06em] text-[var(--foreground)] font-mono">
            {session.booked}/{session.capacity}
          </p>
        </div>
        <div className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-muted)] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">Courts</p>
          <p className="mt-2 text-2xl font-extrabold tracking-[-0.06em] text-[var(--foreground)] font-mono">{session.courts}</p>
        </div>
        <div className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-muted)] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">Availability</p>
          <p className="mt-2 text-2xl font-extrabold tracking-[-0.06em] text-[var(--foreground)] font-mono">
            {session.status === "waitlist" ? "Waitlist" : `${spotsLeft} left`}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 rounded-md bg-[var(--brand-soft)]">
          <div
            className="h-full rounded-md"
            style={{ width: formatPercent(session.booked, session.capacity), background: "var(--brand)" }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <span>Public booking route</span>
          <span className="font-bold text-[var(--foreground)] font-mono">{session.durationMinutes} min rounds</span>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-3">
        <Link href={clubSlug ? `/${clubSlug}/book/${session.id}` : `/book/${session.id}`} className="btn-primary px-5 py-3">
          {ctaLabel}
        </Link>
        <Link href={clubSlug ? `/${clubSlug}/liveboard/tv/${session.id}` : `/liveboard/tv/${session.id}`} className="btn-secondary px-5 py-3">
          Liveboard
        </Link>
      </div>
    </SurfaceCard>
  );
}
