import { CountdownTimer } from "@/components/liveboard/countdown-timer";
import { PlayerChip } from "@/components/liveboard/player-chip";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import type { CourtAssignment } from "@/lib/types";

const statusTone = {
  available: "lime",
  playing: "cyan",
  "ending-soon": "amber",
  "time-up": "rose",
  maintenance: "slate",
} as const;

export function CourtCard({
  assignment,
  tv = false,
}: {
  assignment: CourtAssignment;
  tv?: boolean;
}) {
  const headingSize = tv ? "text-2xl sm:text-3xl" : "text-2xl";

  return (
    <SurfaceCard
      className={`flex h-full flex-col gap-5 p-6 ${
        assignment.status === "available"
          ? "bg-[color:var(--surface-muted)]"
          : assignment.status === "ending-soon"
            ? "bg-[color:var(--surface-soft)]"
            : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`${headingSize} font-extrabold tracking-[-0.06em] text-[color:var(--foreground)]`}>{assignment.courtName}</p>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Live rotation board</p>
        </div>
        <StatusBadge tone={statusTone[assignment.status]}>{assignment.status.replace("-", " ")}</StatusBadge>
      </div>

      {assignment.endsInSeconds ? <CountdownTimer initialSeconds={assignment.endsInSeconds} compact={!tv} /> : <div className="h-6" />}

      {assignment.status === "available" && assignment.nextUp ? (
        <div className="space-y-4">
          <p className="text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">Next Up</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {assignment.nextUp.map((player, index) => (
              <PlayerChip
                key={player.id}
                name={player.firstName}
                detail={`Queue #${index + 1}`}
                avatarUrl={player.avatar}
                size={tv ? "lg" : "md"}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="space-y-3">
            {assignment.teamA.map((player) => (
              <PlayerChip key={player.id} name={player.firstName} detail="Team A" avatarUrl={player.avatar} size={tv ? "lg" : "md"} />
            ))}
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[color:var(--line)] bg-white text-sm font-black tracking-[0.3em] text-[color:var(--brand-deep)]">
            VS
          </div>
          <div className="space-y-3">
            {assignment.teamB.map((player) => (
              <PlayerChip key={player.id} name={player.firstName} detail="Team B" avatarUrl={player.avatar} size={tv ? "lg" : "md"} />
            ))}
          </div>
        </div>
      )}
    </SurfaceCard>
  );
}
