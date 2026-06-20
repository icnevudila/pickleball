import { CourtCard } from "@/components/liveboard/court-card";
import { LiveClock } from "@/components/liveboard/live-clock";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import { getAssignmentsForSession, getQueueForSession, getSessionById } from "@/lib/mock-data";

export default async function TvLiveboardPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = getSessionById(sessionId);
  const assignments = getAssignmentsForSession(sessionId);
  const queue = getQueueForSession(sessionId);

  return (
    <div className="min-h-screen bg-[#04090d] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <header className="grid gap-4 xl:grid-cols-[1fr_auto_320px] xl:items-center">
          <SurfaceCard className="p-6">
            <StatusBadge tone="cyan">Public liveboard</StatusBadge>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.08em] text-white sm:text-6xl">{session.name}</h1>
            <p className="mt-3 text-sm uppercase tracking-[0.24em] text-slate-400">
              {session.timeLabel} · {session.level} · rotation active
            </p>
          </SurfaceCard>

          <SurfaceCard className="p-6 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Local time</p>
            <div className="mt-3 text-4xl font-black tracking-[-0.08em] text-white sm:text-6xl">
              <LiveClock />
            </div>
          </SurfaceCard>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <SurfaceCard className="p-5">
              <p className="text-4xl font-black tracking-[-0.08em] text-white">
                {session.checkedIn}/{session.capacity}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">Checked in</p>
            </SurfaceCard>
            <SurfaceCard className="p-5">
              <p className="text-4xl font-black tracking-[-0.08em] text-white">{session.waiting}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">Waiting</p>
            </SurfaceCard>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-3">
          {assignments.map((assignment) => (
            <CourtCard key={assignment.id} assignment={assignment} tv />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <SurfaceCard className="p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-3xl font-semibold tracking-[-0.06em] text-white">Now loading</p>
              <StatusBadge tone="lime">Court 2 ready</StatusBadge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {queue.slice(0, 4).map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="text-xl font-semibold text-white">
                    {entry.position}. {entry.player.firstName}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{entry.eta}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-3xl font-semibold tracking-[-0.06em] text-white">Waiting queue</p>
              <StatusBadge tone="cyan">{queue.length} players</StatusBadge>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {queue.map((entry) => (
                <span
                  key={entry.id}
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-base font-semibold text-white"
                >
                  {entry.position}. {entry.player.firstName}
                </span>
              ))}
            </div>
          </SurfaceCard>
        </section>
      </div>
    </div>
  );
}
