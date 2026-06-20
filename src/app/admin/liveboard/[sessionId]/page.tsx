import { CourtCard } from "@/components/liveboard/court-card";
import { SurfaceCard } from "@/components/surface-card";
import { StatusBadge } from "@/components/status-badge";
import { getAssignmentsForSession, getQueueForSession, getSessionById } from "@/lib/mock-data";

export default async function AdminLiveboardPage({
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Liveboard control</p>
          <h1 className="section-title mt-3">{session.name}</h1>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            This screen mirrors the TV board but keeps actions for end game, extend time, and queue control.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <StatusBadge tone="lime">Suggest next group</StatusBadge>
          <StatusBadge tone="amber">Pause rotation</StatusBadge>
          <StatusBadge tone="rose">End session</StatusBadge>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {assignments.map((assignment) => (
          <CourtCard key={assignment.id} assignment={assignment} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard className="p-6">
          <p className="text-2xl font-semibold tracking-[-0.05em] text-white">Now loading</p>
          <div className="mt-5 space-y-3">
            {queue.slice(0, 4).map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-white/8 bg-black/15 p-4">
                <p className="font-semibold text-white">
                  {entry.position}. {entry.player.firstName}
                </p>
                <p className="text-sm text-slate-300">{entry.eta}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <p className="text-2xl font-semibold tracking-[-0.05em] text-white">Waiting queue</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {queue.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-white/8 bg-black/15 p-4">
                <p className="font-semibold text-white">{entry.player.fullName}</p>
                <p className="text-sm text-slate-300">{entry.eta}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
