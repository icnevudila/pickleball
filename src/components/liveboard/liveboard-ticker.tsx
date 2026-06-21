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
    <div className="overflow-hidden bg-[#211C16] text-[#FFFBF2]">
      <div className="liveboard-marquee flex min-w-max items-center gap-12 px-8 py-4 text-base font-bold uppercase tracking-wider">
        {repeated.map((item, index) => (
          <span key={`${item.id}-${index}`} className="whitespace-nowrap flex items-center">
            <span
              className={`mr-4 inline-flex rounded-[4px] px-2.5 py-1 font-mono text-[11px] font-black uppercase tracking-[0.18em] ${
                item.tone === "lime"
                  ? "bg-[#D4E88F] text-[#211C16]"
                  : item.tone === "rust"
                    ? "bg-[#F04F2A] text-white animate-pulse"
                    : item.tone === "teal"
                      ? "bg-[#4F86A6] text-white"
                      : "bg-white/20 text-[#FFFBF2]"
              }`}
            >
              {item.tag}
            </span>
            <span className="text-white font-extrabold tracking-wide">{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
