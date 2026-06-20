"use client";

import { useEffect, useMemo, useState } from "react";

import type { CourtAssignment, QueueEntry, RealtimeEvent, Session } from "@/lib/types";

type AlertTone = "amber" | "lime" | "rose" | "rust" | "sand" | "slate";

type AlertCard = {
  id: string;
  title: string;
  detail: string;
  tone: AlertTone;
};

function formatClock(seconds: number) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");

  return `${minutes}:${remainder}`;
}

export function LiveboardAlertCenter({
  session,
  assignments,
  queue,
  events,
}: {
  session: Session;
  assignments: CourtAssignment[];
  queue: QueueEntry[];
  events: RealtimeEvent[];
}) {
  const [pulseIndex, setPulseIndex] = useState(0);

  const alerts = useMemo<AlertCard[]>(() => {
    const derived = assignments.flatMap<AlertCard>((assignment) => {
      if (assignment.status === "ending-soon" && assignment.endsInSeconds) {
        return [
          {
            id: `${assignment.id}-ending`,
            title: `${assignment.courtName} ending soon`,
            detail: `Next call should start in ${formatClock(assignment.endsInSeconds)}.`,
            tone: "amber" as const,
          },
        ];
      }

      if (assignment.status === "available" && assignment.nextUp?.length) {
        return [
          {
            id: `${assignment.id}-ready`,
            title: `${assignment.courtName} ready for loading`,
            detail: `${assignment.nextUp.map((player) => player.firstName).join(", ")} should move now.`,
            tone: "lime" as const,
          },
        ];
      }

      if (assignment.status === "time-up") {
        return [
          {
            id: `${assignment.id}-time-up`,
            title: `${assignment.courtName} reached time`,
            detail: "Desk should confirm score and rotate queue.",
            tone: "rose" as const,
          },
        ];
      }

      return [];
    });

    if (queue.length > 0) {
      derived.push({
        id: "queue-pressure",
        title: `${queue.length} players in queue`,
        detail: `${queue[0].player.firstName} is first in line for the next free court.`,
        tone: "sand" as const,
      });
    }

    if (session.checkedIn >= session.capacity) {
      derived.push({
        id: "session-full",
        title: "Session at capacity",
        detail: "Walk-ins should route to waitlist or next session.",
        tone: "rust" as const,
      });
    }

    const eventCards = events.slice(0, 2).map((event) => ({
      id: event.id,
      title: event.label.replaceAll(".", " "),
      detail: event.detail,
      tone: "slate" as const,
    }));

    return [...derived, ...eventCards];
  }, [assignments, events, queue, session.capacity, session.checkedIn]);

  useEffect(() => {
    if (alerts.length <= 1) return;

    const interval = window.setInterval(() => {
      setPulseIndex((current) => (current + 1) % alerts.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [alerts.length]);

  const active = alerts[pulseIndex];

  if (!active) return null;

  const toneClass =
    active.tone === "amber"
      ? "border-[rgba(245,166,35,0.45)] bg-[rgba(245,166,35,0.14)] text-[#ffe2b2]"
      : active.tone === "lime"
        ? "border-[rgba(200,255,77,0.4)] bg-[rgba(200,255,77,0.12)] text-[#efffb6]"
        : active.tone === "rose"
          ? "border-[rgba(255,106,77,0.45)] bg-[rgba(255,106,77,0.14)] text-[#ffd4cc]"
          : active.tone === "rust"
            ? "border-[rgba(255,106,77,0.45)] bg-[rgba(255,106,77,0.1)] text-white"
            : active.tone === "sand"
              ? "border-white/14 bg-white/6 text-[#f2eadb]"
              : "border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] text-[#d7ddd9]";

  return (
    <div className={`rounded-[24px] border p-4 transition-all duration-300 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em]">Alert center</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
          {pulseIndex + 1}/{alerts.length}
        </p>
      </div>
      <p className="mt-3 font-display text-2xl tracking-[-0.05em]">{active.title}</p>
      <p className="mt-2 text-sm leading-6 opacity-90">{active.detail}</p>
    </div>
  );
}
