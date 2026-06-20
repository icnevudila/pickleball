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
          ? "bg-[linear-gradient(145deg,rgba(122,255,178,0.18),rgba(255,255,255,0.05))]"
          : assignment.status === "ending-soon"
            ? "bg-[linear-gradient(145deg,rgba(255,204,94,0.18),rgba(255,255,255,0.05))]"
            : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`${headingSize} font-semibold tracking-[-0.06em] text-white`}>{assignment.courtName}</p>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Live rotation board</p>
        </div>
        <StatusBadge tone={statusTone[assignment.status]}>
          {assignment.status.replace("-", " ")}
        </StatusBadge>
      </div>

      {assignment.endsInSeconds ? <CountdownTimer initialSeconds={assignment.endsInSeconds} compact={!tv} /> : <div className="h-6" />}

      {assignment.status === "available" && assignment.nextUp ? (
        <div className="space-y-4">
          <p className="text-2xl font-semibold tracking-[-0.05em] text-white">Next Up</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {assignment.nextUp.map((player, index) => (
              <PlayerChip
                key={player.id}
                name={player.firstName}
                detail={`Queue #${index + 1}`}
                size={tv ? "lg" : "md"}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="space-y-3">
            {assignment.teamA.map((player) => (
              <PlayerChip key={player.id} name={player.firstName} detail="Team A" size={tv ? "lg" : "md"} />
            ))}
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-sm font-black tracking-[0.3em] text-lime-200">
            VS
          </div>
          <div className="space-y-3">
            {assignment.teamB.map((player) => (
              <PlayerChip key={player.id} name={player.firstName} detail="Team B" size={tv ? "lg" : "md"} />
            ))}
          </div>
        </div>
      )}
    </SurfaceCard>
  );
}
