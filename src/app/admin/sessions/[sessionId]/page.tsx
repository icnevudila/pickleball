import { CourtCard } from "@/components/liveboard/court-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAssignmentsForSession, getQueueForSession, getSessionById } from "@/lib/mock-data";

export default async function AdminSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = getSessionById(sessionId);
  const assignments = getAssignmentsForSession(sessionId);
  const queue = getQueueForSession(sessionId);

  return (
    <div className="space-y-6">
      {/* Session Title & Action Controls */}
      <Card variant="surface" className="p-6 border border-[var(--line-strong)] animate-fade-in stagger-1">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge tone="brand">Session Control</Badge>
            <h1 className="section-title text-3xl font-black mt-2">{session.name}</h1>
            <p className="text-sm leading-relaxed text-[var(--muted)] max-w-2xl">
              Queue management, active court assignments, and operator actions scoped to this workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Button variant="secondary" size="sm">Suggest Group</Button>
            <Button variant="ghost" size="sm">Pause Rotation</Button>
            <Button variant="danger" size="sm">End Session</Button>
          </div>
        </div>
      </Card>

      {/* Courts Live Status Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {assignments.map((assignment) => (
          <CourtCard key={assignment.id} assignment={assignment} />
        ))}
      </div>

      {/* Queue Details */}
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Next Up (FIFO) */}
        <Card variant="surface" className="p-6 border border-[var(--line-strong)]">
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-[var(--line)]/50 pb-4">
            <h2 className="text-xl font-black tracking-tight text-[var(--foreground)]">Next Up</h2>
            <Badge tone="lime">FIFO Mode</Badge>
          </div>
          <div className="space-y-3">
            {queue.slice(0, 4).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-[22px] border border-[var(--line)] bg-[var(--surface-muted)] p-4 transition-all hover:border-[var(--line-strong)]"
              >
                <div>
                  <p className="font-extrabold text-[var(--foreground)] text-sm">
                    {entry.position}. {entry.player.firstName}
                  </p>
                  <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">{entry.eta}</p>
                </div>
                <Badge tone="slate">{entry.player.skillLevel ?? "3.0"}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Total Queue Board */}
        <Card variant="surface" className="p-6 border border-[var(--line-strong)]">
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-[var(--line)]/50 pb-4">
            <h2 className="text-xl font-black tracking-tight text-[var(--foreground)]">Waiting Queue</h2>
            <Badge tone="brand">Interactive</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {queue.map((entry) => (
              <div
                key={entry.id}
                className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-muted)] p-4 transition-all hover:border-[var(--line-strong)] flex flex-col justify-between min-h-[90px]"
              >
                <p className="font-extrabold text-[var(--foreground)] text-xs">
                  {entry.position}. {entry.player.fullName}
                </p>
                <p className="text-[10px] font-bold text-[var(--muted)] mt-2 uppercase tracking-wider">{entry.eta}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
