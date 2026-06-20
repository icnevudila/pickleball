import { CourtCard } from "@/components/liveboard/court-card";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
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
      <SurfaceCard className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Session control</p>
            <h1 className="section-title mt-4">{session.name}</h1>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              Queue, court assignment, and operator actions stay inside one session-specific workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusBadge tone="cyan">Suggest next group</StatusBadge>
            <StatusBadge tone="amber">Pause rotation</StatusBadge>
            <StatusBadge tone="rose">End session</StatusBadge>
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-4 xl:grid-cols-3">
        {assignments.map((assignment) => (
          <CourtCard key={assignment.id} assignment={assignment} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">Next up</p>
            <StatusBadge tone="lime">FIFO with override</StatusBadge>
          </div>
          <div className="mt-5 space-y-3">
            {queue.slice(0, 4).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                <div>
                  <p className="font-extrabold text-[color:var(--foreground)]">
                    {entry.position}. {entry.player.firstName}
                  </p>
                  <p className="text-sm text-[color:var(--muted)]">{entry.eta}</p>
                </div>
                <StatusBadge tone="slate">{entry.player.skillLevel ?? "3.0"}</StatusBadge>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">Waiting queue</p>
            <StatusBadge tone="cyan">Drag/drop in app</StatusBadge>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {queue.map((entry) => (
              <div key={entry.id} className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                <p className="font-extrabold text-[color:var(--foreground)]">
                  {entry.position}. {entry.player.fullName}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">{entry.eta}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
