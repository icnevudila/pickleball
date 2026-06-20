import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import { sessions } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function AdminSessionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Sessions</p>
        <h1 className="section-title mt-3">Capacity, payment requirement, and court assignment all start here.</h1>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <SurfaceCard key={session.id} className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-3">
                  <StatusBadge tone={session.status === "waitlist" ? "rose" : session.status === "few-spots" ? "amber" : "cyan"}>
                    {session.status}
                  </StatusBadge>
                  <StatusBadge tone="slate">{session.level}</StatusBadge>
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">{session.name}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {session.timeLabel} · {session.courts} courts · {session.booked}/{session.capacity} booked · {formatCurrency(session.price)}
                </p>
              </div>
              <Link
                href={`/admin/sessions/${session.id}`}
                className="rounded-full bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)] px-5 py-3 text-sm font-bold text-slate-950"
              >
                Open session
              </Link>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
