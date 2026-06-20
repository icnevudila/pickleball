"use client";

import { useMemo } from "react";

import type { QueueEntry, RealtimeEvent, Session } from "@/lib/types";

type TickerTone = "lime" | "rust" | "teal" | "sand";

type TickerItem = {
  id: string;
  tag: string;
  tone: TickerTone;
  text: string;
};

export function LiveboardTicker({
  session,
  queue,
  events,
}: {
  session: Session;
  queue: QueueEntry[];
  events: RealtimeEvent[];
}) {
  const items = useMemo<TickerItem[]>(() => {
    const base: TickerItem[] = [
      ...session.announcements.map((announcement, index) => ({
        id: `announcement-${index}`,
        tag: index % 2 === 0 ? "Live" : "Desk",
        tone: index % 2 === 0 ? "lime" as const : "rust" as const,
        text: announcement,
      })),
      ...events.map((event) => ({
        id: event.id,
        tag: "Event",
        tone: "teal" as const,
        text: `${event.timestamp} ${event.detail}`,
      })),
    ];

    if (queue.length > 0) {
      base.push({
        id: "queue-head",
        tag: "Queue",
        tone: "sand" as const,
        text: `${queue[0].player.fullName} is next up for the first available court.`,
      });
    }

    return base;
  }, [events, queue, session.announcements]);

  const repeated = [...items, ...items];

  return (
    <div className="overflow-hidden bg-[var(--paper)] text-[#0b1512]">
      <div className="liveboard-marquee flex min-w-max items-center gap-8 px-6 py-3 text-sm font-medium tracking-[0.03em]">
        {repeated.map((item, index) => (
          <span key={`${item.id}-${index}`} className="whitespace-nowrap">
            <span
              className={`mr-3 inline-flex px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${
                item.tone === "lime"
                  ? "bg-[var(--accent-lime)] text-[#0b1512]"
                  : item.tone === "rust"
                    ? "bg-[var(--brand)] text-white"
                    : item.tone === "teal"
                      ? "bg-[var(--brand-deep)] text-[var(--paper)]"
                      : "bg-[rgba(11,21,18,0.12)] text-[#0b1512]"
              }`}
            >
              {item.tag}
            </span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
