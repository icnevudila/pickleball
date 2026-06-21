"use client";

import * as React from "react";
import { use } from "react";
import { getMockLiveboardSnapshot } from "@/lib/liveboard/mock-snapshot";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cx } from "@/lib/utils";

const MOCK_SESSION_ID = "friday-open-play";

interface AdminLivePageProps {
  params: Promise<{ clubSlug: string }>;
}

export default function AdminLivePage({ params }: AdminLivePageProps) {
  const { clubSlug } = use(params);
  const snapshot = getMockLiveboardSnapshot(MOCK_SESSION_ID);
  const { session, assignments, queue } = snapshot;

  const liveCourts = assignments.filter((a) => a.status === "playing").length;
  const endingCourts = assignments.filter((a) => a.status === "ending-soon").length;
  const openCourts = assignments.filter((a) => a.status === "available").length;

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-[-0.06em] text-slate-100">
              {session.name}
            </h1>
            <Badge tone="live">Live</Badge>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-400">
            {assignments.length} active courts · syncs to TV
          </p>
        </div>
        <div className="w-full sm:w-auto flex items-center gap-2">
          <input
            type="text"
            placeholder="Lobby announcement..."
            className="w-full sm:w-[220px] rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 placeholder:text-slate-500 outline-none focus:border-[var(--brand)]"
          />
          <Button variant="secondary" size="sm" className="rounded-[8px] text-xs bg-slate-800 text-slate-300 border-slate-700" onClick={() => window.open(`/${clubSlug}/liveboard/tv/${session.id}`, "_blank")}>
            TV view
          </Button>
        </div>
      </header>

      {/* Floor overview strip */}
      <div className="flex flex-wrap items-center gap-2 rounded-[6px] border border-slate-700/50 bg-slate-900/60 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Floor</span>
        <Badge tone={liveCourts > 0 ? "live" : "slate"}>{liveCourts} live</Badge>
        <Badge tone={endingCourts > 0 ? "amber" : "slate"}>{endingCourts} ending</Badge>
        <Badge tone={openCourts > 0 ? "brand" : "slate"}>{openCourts} open</Badge>
        <Badge tone={queue.length > 0 ? "rose" : "slate"}>{queue.length} waiting</Badge>
        {queue[0]?.eta && (
          <Badge tone="slate">Next opening ~{queue[0].eta}</Badge>
        )}
      </div>

      {/* Courts grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {assignments.map((court) => {
          const isLive = court.status === "playing";
          const isEnding = court.status === "ending-soon";
          const isOpen = court.status === "available";

          return (
            <Card
              key={court.id}
              className={cx(
                "flex flex-col overflow-hidden border border-slate-800 bg-slate-900/70 border-l-4",
                isLive ? "border-l-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]" : isEnding ? "border-l-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.08)]" : "border-l-slate-650"
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-800/20 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-200">{court.courtName}</h3>
                  <Badge tone={isLive ? "live" : isEnding ? "amber" : "slate"}>
                    {isLive ? "LIVE" : isEnding ? "ENDING" : "OPEN"}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col p-4 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex -space-x-2">
                      {court.teamA.map((p) => (
                        <Avatar key={p.id} name={p.fullName} src={p.avatar} size="sm" className="border border-slate-800" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-300">{court.teamA.map(p => p.firstName).join(" / ")}</span>
                  </div>

                  <div className="text-center">
                    <div className="font-mono text-2xl font-black text-emerald-400">
                      {court.endsInSeconds ? `${Math.floor(court.endsInSeconds / 60)}:${(court.endsInSeconds % 60).toString().padStart(2, '0')}` : "--:--"}
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500">Time remaining</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex -space-x-2">
                      {court.teamB.map((p) => (
                        <Avatar key={p.id} name={p.fullName} src={p.avatar} size="sm" className="border border-slate-800" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-300">{court.teamB.map(p => p.firstName).join(" / ")}</span>
                  </div>
                </div>

                {/* Score Recording panel */}
                <div className="border-t border-slate-850 pt-3 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-500">Record set</span>
                  <div className="flex items-center gap-1.5">
                    <input type="number" defaultValue={11} className="w-10 rounded border border-slate-700 bg-slate-800 text-center font-mono text-xs font-bold text-slate-200 py-0.5" />
                    <span className="text-slate-500 font-bold">-</span>
                    <input type="number" defaultValue={7} className="w-10 rounded border border-slate-700 bg-slate-800 text-center font-mono text-xs font-bold text-slate-200 py-0.5" />
                    <Button variant="secondary" size="sm" className="rounded-[4px] text-[10px] font-bold bg-slate-850 border-slate-750 px-2 py-0.5 ml-1">End set</Button>
                  </div>
                </div>
              </div>

              {/* Waiting List */}
              {court.nextUp && court.nextUp.length > 0 && (
                <div className="bg-slate-850/40 p-3 border-t border-slate-850 text-xs">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-2">Next up rotation</p>
                  <div className="rounded-[8px] bg-slate-900 border border-slate-800 p-2 flex justify-between items-center">
                    <span className="font-semibold text-slate-300">
                      {court.nextUp.slice(0, 2).map(p => p.firstName).join(" / ")} vs {court.nextUp.slice(2, 4).map(p => p.firstName).join(" / ")}
                    </span>
                    <div className="flex -space-x-1.5">
                      {court.nextUp.slice(0, 4).map(p => (
                        <Avatar key={p.id} name={p.fullName} src={p.avatar} size="sm" className="border border-slate-800" />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

    </div>
  );
}
