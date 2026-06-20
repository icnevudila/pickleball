import { CourtCard } from "@/components/liveboard/court-card";
import { LiveboardAlertCenter } from "@/components/liveboard/liveboard-alert-center";
import { SurfaceCard } from "@/components/surface-card";
import { StatusBadge } from "@/components/status-badge";
import { getLiveboardSnapshot } from "@/lib/liveboard/source";

export default async function AdminLiveboardPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const { session, assignments, queue, events } = await getLiveboardSnapshot(sessionId);

  return (
    <div className="space-y-6">
      <SurfaceCard className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Liveboard control</p>
            <h1 className="section-title mt-4">{session.name}</h1>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              This mirrors the public liveboard while keeping operator actions for end game, extend time, and queue control.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusBadge tone="lime">Suggest next group</StatusBadge>
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
        <div className="space-y-4">
          <LiveboardAlertCenter
            session={session}
            assignments={assignments}
            queue={queue}
            events={events}
          />

          <SurfaceCard className="p-6">
            <p className="text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">Now loading</p>
            <div className="mt-5 space-y-3">
              {queue.slice(0, 4).map((entry) => (
                <div key={entry.id} className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <p className="font-extrabold text-[color:var(--foreground)]">
                    {entry.position}. {entry.player.firstName}
                  </p>
                  <p className="text-sm text-[color:var(--muted)]">{entry.eta}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
        <SurfaceCard className="p-6">
          <p className="text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">Waiting queue</p>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Queue order, public-safe naming, and ETA cards stay aligned with the TV board.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {queue.map((entry) => (
              <div key={entry.id} className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                <p className="font-extrabold text-[color:var(--foreground)]">{entry.player.fullName}</p>
                <p className="text-sm text-[color:var(--muted)]">{entry.eta}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6 lg:col-span-2">
          <p className="text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">Realtime event trail</p>
          <div className="mt-5 grid gap-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-[22px] border border-[color:var(--line)] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{event.label}</p>
                  <p className="text-xs font-bold text-[color:var(--brand-deep)]">{event.timestamp}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">{event.detail}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
