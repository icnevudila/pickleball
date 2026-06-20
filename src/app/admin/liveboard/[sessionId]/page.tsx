import { CourtCard } from "@/components/liveboard/court-card";
import { LiveboardAlertCenter } from "@/components/liveboard/liveboard-alert-center";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      {/* Session Title & Action Controls */}
      <Card variant="surface" className="p-6 border border-[var(--line-strong)] animate-fade-in stagger-1">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge tone="brand">Liveboard Control</Badge>
            <h1 className="section-title text-3xl font-black mt-2">{session.name}</h1>
            <p className="text-sm leading-relaxed text-[var(--muted)] max-w-2xl">
              This mirrors the public liveboard while keeping operator actions for end game, extend time, and queue control.
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

      {/* Main Grid content */}
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <LiveboardAlertCenter
            session={session}
            assignments={assignments}
            queue={queue}
            events={events}
          />

          {/* Now Loading (Top Queue) */}
          <Card variant="surface" className="p-6 border border-[var(--line-strong)]">
            <h2 className="text-xl font-black tracking-tight text-[var(--foreground)] mb-6 border-b border-[var(--line)]/50 pb-4">
              Now Loading
            </h2>
            <div className="space-y-3">
              {queue.slice(0, 4).map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-muted)] p-4 transition-all hover:border-[var(--line-strong)] flex justify-between items-center"
                >
                  <p className="font-extrabold text-[var(--foreground)] text-sm">
                    {entry.position}. {entry.player.firstName}
                  </p>
                  <Badge tone="slate">{entry.eta}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Total Queue Board */}
        <Card variant="surface" className="p-6 border border-[var(--line-strong)]">
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-[var(--line)]/50 pb-4">
            <h2 className="text-xl font-black tracking-tight text-[var(--foreground)]">Waiting Queue</h2>
            <Badge tone="brand">Sync-active</Badge>
          </div>
          <p className="text-xs font-semibold text-[var(--muted)] leading-relaxed mb-6">
            Queue order, public-safe naming, and ETA cards stay aligned with the TV board display.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {queue.map((entry) => (
              <div
                key={entry.id}
                className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-muted)] p-4 transition-all hover:border-[var(--line-strong)] flex flex-col justify-between min-h-[90px]"
              >
                <p className="font-extrabold text-[var(--foreground)] text-xs">{entry.player.fullName}</p>
                <p className="text-[10px] font-bold text-[var(--muted)] mt-2 uppercase tracking-wider">{entry.eta}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Realtime Event Log Trail */}
        <Card variant="surface" className="p-6 border border-[var(--line-strong)] lg:col-span-2">
          <h2 className="text-xl font-black tracking-tight text-[var(--foreground)] mb-6 border-b border-[var(--line)]/50 pb-4">
            Realtime Event Trail
          </h2>
          <div className="grid gap-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-muted)] p-4 transition-all hover:border-[var(--line-strong)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                    {event.label}
                  </p>
                  <p className="text-xs font-black text-[var(--brand-deep)]">{event.timestamp}</p>
                </div>
                <p className="mt-2 text-xs font-semibold text-[var(--muted)] leading-relaxed">
                  {event.detail}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
