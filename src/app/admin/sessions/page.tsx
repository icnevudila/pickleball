import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sessions } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const sessionStatusTones = {
  open: "lime",
  "few-spots": "amber",
  waitlist: "rose",
  live: "live",
  completed: "slate",
} as const;

export default function AdminSessionsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 animate-fade-in stagger-1">
        <Badge tone="brand">Sessions</Badge>
        <h1 className="section-title text-3xl font-black mt-2">
          Capacity, reservation pressure, and court assignment all start here.
        </h1>
        <p className="text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
          Create, edit, and audit active open play schedules. Track player registrations and rotation queue bounds.
        </p>
      </div>

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <Card
            key={session.id}
            variant="surface"
            className={`p-6 border border-[var(--line-strong)] hover:shadow-md transition-all duration-300 animate-slide-up stagger-${
              (index % 3) + 1
            }`}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={sessionStatusTones[session.status] || "slate"}>
                    {session.status}
                  </Badge>
                  <Badge tone="slate">{session.level}</Badge>
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)]">
                    {session.name}
                  </h2>
                  <p className="text-xs font-semibold text-[var(--muted)] mt-1.5">
                    {session.timeLabel} • {session.courts} courts • {session.booked}/{session.capacity} booked • <span className="font-extrabold text-[var(--foreground)] font-mono">{formatCurrency(session.price)}</span>
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <Button variant="primary" size="md" asChild>
                  <Link href={`/admin/sessions/${session.id}`}>Open session</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
