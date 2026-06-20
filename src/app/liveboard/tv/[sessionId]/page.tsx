import Image from "next/image";

import { CountdownTimer } from "@/components/liveboard/countdown-timer";
import { LiveboardAlertCenter } from "@/components/liveboard/liveboard-alert-center";
import { LiveboardCueEngine } from "@/components/liveboard/liveboard-cue-engine";
import { LiveClock } from "@/components/liveboard/live-clock";
import { LiveboardTicker } from "@/components/liveboard/liveboard-ticker";
import type { CourtAssignment, Person, QueueEntry } from "@/lib/types";
import { getLiveboardSnapshot } from "@/lib/liveboard/source";
import { cx, initials } from "@/lib/utils";

function namesLabel(players: Person[]) {
  return players.map((player) => player.fullName).join(" / ");
}

function splitIntoSides(players: Person[]) {
  return {
    left: players.slice(0, 2),
    right: players.slice(2, 4),
  };
}

function pairQueue(queue: QueueEntry[]) {
  const blocks = [];

  for (let index = 0; index < queue.length; index += 2) {
    blocks.push(queue.slice(index, index + 2));
  }

  return blocks;
}

function statusCopy(assignment: CourtAssignment) {
  if (assignment.status === "available") {
    return {
      label: "Loading",
      tone: "bg-[var(--accent-lime)] text-[var(--brand-deep)]",
      sublabel: "Next group is being called",
    };
  }

  if (assignment.status === "ending-soon") {
    return {
      label: "Ending soon",
      tone: "bg-[var(--accent-amber)] text-[var(--brand-deep)]",
      sublabel: "Front desk should prep next court wave",
    };
  }

  if (assignment.status === "time-up") {
    return {
      label: "Time up",
      tone: "bg-[var(--accent-rose)] text-white",
      sublabel: "Rotation should advance now",
    };
  }

  if (assignment.status === "maintenance") {
    return {
      label: "Maintenance",
      tone: "bg-[rgba(255,255,255,0.12)] text-white",
      sublabel: "Court temporarily unavailable",
    };
  }

  return {
    label: "Live",
    tone: "bg-[var(--brand)] text-white",
    sublabel: "Match currently on court",
  };
}

function CourtPanel({ assignment }: { assignment: CourtAssignment }) {
  const state = statusCopy(assignment);
  const nextGroup = assignment.nextUp ? splitIntoSides(assignment.nextUp) : null;

  return (
    <article className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(18,32,25,0.92)] text-[var(--paper)] shadow-[0_24px_90px_rgba(3,8,6,0.34)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--brand),var(--accent-lime))]" />

      <div className="flex items-center justify-between gap-4 border-b border-white/8 bg-[rgba(14,59,54,0.95)] px-5 py-4">
        <div>
          <p className="font-display text-xl tracking-[-0.05em] text-white sm:text-2xl">{assignment.courtName}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#8ca298]">{state.sublabel}</p>
        </div>
        <span className={cx("rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]", state.tone)}>
          {state.label}
        </span>
      </div>

      <div className="flex items-center justify-end px-5 pt-4">
        {assignment.endsInSeconds ? (
          <div className="text-[var(--accent-lime)] [&>div]:!text-[32px] [&>div]:!font-semibold [&>div]:!tracking-[-0.08em] sm:[&>div]:!text-[42px]">
            <CountdownTimer initialSeconds={assignment.endsInSeconds} compact />
          </div>
        ) : (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8ca298]">Awaiting court release</p>
        )}
      </div>

      {nextGroup ? (
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <QueueTeam title="Side A" players={nextGroup.left} accent="text-[var(--brand)]" />
          <div className="grid h-16 w-16 place-items-center rounded-[18px] border border-white/12 bg-[rgba(255,255,255,0.06)] font-display text-xl tracking-[0.18em] text-white">
            VS
          </div>
          <QueueTeam title="Side B" players={nextGroup.right} accent="text-[var(--accent-lime)]" align="right" />
        </div>
      ) : (
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <PlayerSide title="Team A" players={assignment.teamA} accent="text-[var(--brand)]" />
          <div className="rounded-[18px] border border-white/12 bg-[rgba(255,255,255,0.06)] px-4 py-3 text-center">
            <p className="font-display text-4xl tracking-[-0.08em] text-white sm:text-5xl">11 - 8</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#8ca298]">Current score</p>
          </div>
          <PlayerSide title="Team B" players={assignment.teamB} accent="text-[var(--accent-lime)]" align="right" />
        </div>
      )}

      <div className="border-t border-white/8 bg-[rgba(255,255,255,0.03)] px-5 py-4">
        <div className="flex flex-wrap gap-2">
          {(nextGroup ? assignment.nextUp ?? [] : [...assignment.teamA, ...assignment.teamB]).map((player) => (
            <span
              key={player.id}
              className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.06)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#d8dacc]"
            >
              {player.firstName}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function PlayerSide({
  title,
  players,
  accent,
  align = "left",
}: {
  title: string;
  players: Person[];
  accent: string;
  align?: "left" | "right";
}) {
  return (
    <div className={cx("space-y-3", align === "right" && "text-right")}>
      <p className={cx("font-mono text-[10px] uppercase tracking-[0.22em] text-[#8ca298]", align === "right" && "text-right")}>
        <span className={accent}>{title}</span>
      </p>
      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className={cx(
              "flex items-center gap-3 rounded-[20px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-3",
              align === "right" && "flex-row-reverse",
            )}
          >
            {player.avatar ? (
              <Image
                src={player.avatar}
                alt={player.fullName}
                className="h-12 w-12 shrink-0 rounded-full border border-white/12 object-cover"
                width={48}
                height={48}
              />
            ) : (
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/12 bg-[rgba(255,255,255,0.08)] font-display text-sm text-white">
                {initials(player.fullName)}
              </div>
            )}
            <div className={cx("min-w-0", align === "right" && "text-right")}>
              <p className="truncate text-sm font-semibold uppercase tracking-[0.04em] text-white sm:text-base">
                {player.fullName}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8ca298]">
                {player.tag ?? "Active player"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QueueTeam({
  title,
  players,
  accent,
  align = "left",
}: {
  title: string;
  players: Person[];
  accent: string;
  align?: "left" | "right";
}) {
  return (
    <div className={cx("space-y-3", align === "right" && "text-right")}>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8ca298]">
        <span className={accent}>{title}</span>
      </p>
      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className={cx(
              "rounded-[20px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-3",
              align === "right" && "text-right",
            )}
          >
            {player.avatar ? (
              <Image
                src={player.avatar}
                alt={player.fullName}
                className="mb-3 h-12 w-12 rounded-full border border-white/12 object-cover"
                width={48}
                height={48}
              />
            ) : null}
            <p className="truncate text-sm font-semibold uppercase tracking-[0.04em] text-white sm:text-base">
              {player.fullName}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8ca298]">
              Next rotation
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function TvLiveboardPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const { session, assignments, queue, events } = await getLiveboardSnapshot(sessionId);
  const upNextBlocks = pairQueue(queue).slice(0, 3);
  const filledCourts = assignments.filter((assignment) => assignment.status !== "available").length;

  return (
    <div className="min-h-screen overflow-hidden bg-[#0b1512] text-[var(--paper)]">
      <LiveboardCueEngine events={events} assignments={assignments} queue={queue} />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,77,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(200,255,77,0.08),transparent_32%)]" />

      <div className="relative grid min-h-screen grid-rows-[auto_1fr_auto] gap-4 p-4 sm:p-5 xl:p-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-4">
          <div className="flex items-end gap-4">
            <div className="bg-[var(--brand)] px-4 py-2 font-display text-2xl uppercase tracking-[0.04em] text-[#0b1512] [transform:skewX(-6deg)]">
              Pickle Pulse
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#60736b]">Live court status</p>
              <p className="mt-2 font-display text-3xl tracking-[-0.06em] text-white sm:text-4xl">{session.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="inline-flex items-center gap-2 bg-[var(--accent-lime)] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#0b1512]">
              <span className="h-2 w-2 rounded-full bg-[#0b1512]" />
              Live
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8ca298]">Local time</p>
              <div className="mt-1 font-display text-3xl tracking-[-0.04em] text-white sm:text-4xl">
                <LiveClock />
              </div>
            </div>
          </div>
        </header>

        <main className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="grid min-h-0 gap-4 md:grid-cols-2">
            {assignments.map((assignment) => (
              <CourtPanel key={assignment.id} assignment={assignment} />
            ))}
          </section>

          <aside className="grid min-h-0 gap-4 xl:grid-rows-[auto_auto_1fr]">
            <LiveboardAlertCenter
              session={session}
              assignments={assignments}
              queue={queue}
              events={events}
            />

            <section className="rounded-[28px] border border-[rgba(255,106,77,0.5)] bg-[rgba(18,32,25,0.92)] p-5 shadow-[0_24px_90px_rgba(3,8,6,0.32)]">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--brand)]">Capacity</p>
                <span className="bg-[var(--brand)] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#0b1512]">
                  {session.checkedIn >= session.capacity ? "Full" : "Active"}
                </span>
              </div>
              <p className="mt-4 font-display text-3xl tracking-[-0.06em] text-white">
                {filledCourts === assignments.length ? "No open courts" : `${assignments.length - filledCourts} court open`}
              </p>
              <p className="mt-2 text-sm text-[#8ca298]">
                {queue[0] ? `Next opening estimate: ${queue[0].eta}.` : "Queue is clear and the next wave can go direct."}
              </p>
            </section>

            <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(18,32,25,0.92)] shadow-[0_24px_90px_rgba(3,8,6,0.32)]">
              <div className="flex items-center justify-between bg-[rgba(14,59,54,0.95)] px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white">Up next</p>
                <span className="bg-[var(--accent-lime)] px-2 py-1 font-display text-sm text-[#0b1512]">{upNextBlocks.length}</span>
              </div>
              <div>
                {upNextBlocks.map((block, index) => (
                  <div key={block[0]?.id ?? index} className="border-t border-white/8 px-5 py-4 first:border-t-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#60736b]">
                        {assignments[index]?.courtName ?? `Queue block ${index + 1}`}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-lime)]">
                        {index === 0 ? "Preparing" : "Queued"}
                      </p>
                    </div>
                    <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 text-sm font-semibold uppercase tracking-[0.04em] text-white">
                      <span className="truncate">{namesLabel(block.slice(0, 1).map((entry) => entry.player))}</span>
                      <span className="font-display text-xs tracking-[0.18em] text-[#60736b]">VS</span>
                      <span className="truncate text-right">{namesLabel(block.slice(1).map((entry) => entry.player)) || "Waiting opponent"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(18,32,25,0.92)] shadow-[0_24px_90px_rgba(3,8,6,0.32)]">
              <div className="flex items-center justify-between bg-[rgba(14,59,54,0.95)] px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white">Waitlist</p>
                <span className="bg-[var(--accent-lime)] px-2 py-1 font-display text-sm text-[#0b1512]">{queue.length}</span>
              </div>
              <div className="p-2">
                {queue.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 rounded-[16px] px-3 py-3 odd:bg-[rgba(255,255,255,0.03)]"
                  >
                    <div className="font-display text-lg text-[#60736b]">{entry.position}.</div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold uppercase tracking-[0.04em] text-white">
                        {entry.player.fullName}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c9d1cb]">
                      {entry.eta}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </main>

        <footer className="overflow-hidden bg-[var(--paper)] text-[#0b1512]">
          <LiveboardTicker session={session} queue={queue} events={events} />
        </footer>
      </div>
    </div>
  );
}
