"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { cx } from "@/lib/utils";
import type { CourtAssignment, QueueEntry, Session, RealtimeEvent } from "@/lib/types";

const MOCK_SESSION_ID = "friday-open-play";

interface SnapshotData {
  session: Session;
  assignments: CourtAssignment[];
  queue: QueueEntry[];
  events: RealtimeEvent[];
}

export default function AdminLiveCourtsPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = React.use(params);
  const [data, setData] = useState<SnapshotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<Record<string, { a: number; b: number }>>({});
  const [toast, setToast] = useState<string | null>(null);

  const fetchSnapshot = async () => {
    try {
      const res = await fetch(`/api/sessions/${MOCK_SESSION_ID}/liveboard`);
      if (res.ok) {
        const json = await res.json();
        if (json.snapshot) {
          setData(json.snapshot);
          // Initialize scores state for cards if not already set
          const newScores = { ...scores };
          json.snapshot.assignments.forEach((court: CourtAssignment) => {
            if (!newScores[court.id]) {
              newScores[court.id] = { a: 11, b: 7 };
            }
          });
          setScores(newScores);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
    const interval = setInterval(fetchSnapshot, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (action: "call_next" | "end_set" | "queue_next", courtId: string) => {
    try {
      const body: any = { action, courtId };
      if (action === "end_set") {
        body.scoreA = scores[courtId]?.a ?? 11;
        body.scoreB = scores[courtId]?.b ?? 7;
      }

      const res = await fetch(`/api/sessions/${MOCK_SESSION_ID}/liveboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.snapshot) {
          setData(json.snapshot);
          triggerToast(
            action === "call_next"
              ? "Called next players to court!"
              : action === "end_set"
              ? "Set completed and score saved."
              : "Next group queued for court."
          );
        }
      }
    } catch (err) {
      console.error(err);
      triggerToast("Action failed");
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center font-bold text-[var(--foreground)]">
        Loading admin live desk...
      </div>
    );
  }

  const { session, assignments, queue } = data;
  const liveCourts = assignments.filter((a) => a.status === "playing").length;
  const endingCourts = assignments.filter((a) => a.status === "ending-soon").length;
  const openCourts = assignments.filter((a) => a.status === "available").length;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-12">
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#211C16] text-[#FFFBF2] px-6 py-3 text-sm font-bold shadow-xl border border-white/10 animate-bounce">
          {toast}
        </div>
      )}

      <header className="flex h-[62px] items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-6 lg:px-12 shadow-[var(--shadow-sm)] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand)] font-black text-white shadow-[0_2px_10px_rgba(240,79,42,0.3)]">
            PP
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading text-lg font-black tracking-[-0.035em] text-[var(--foreground)] leading-none">
              Pickle Pulse <span className="opacity-70 font-normal">Kadıköy</span>
            </h1>
            <div className="mt-0.5 text-[10px] font-black uppercase tracking-[0.15em] text-[var(--muted)]">
              ADMIN · LIVE COURTS
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/${clubSlug}/liveboard/tv/${session.id}`} target="_blank">
              ↗ <span className="hidden sm:inline">TV display</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            ⚙
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-[1560px] px-6 lg:px-12 mt-6 lg:mt-10 grid grid-cols-1 lg:grid-cols-[225px_1fr] gap-6 items-start">
        <aside className="rounded-[16px] border border-[var(--line)] bg-[rgba(255,253,250,0.72)] p-2 shadow-[var(--shadow-sm)] hidden lg:flex flex-col gap-1 sticky top-[90px]">
          <nav className="flex flex-col w-full gap-1">
            <Link href={`/${clubSlug}/admin`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]">
              ⌘ Overview
            </Link>
            <Link href={`/${clubSlug}/admin-live`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold bg-[var(--brand)] text-white shadow-[0_4px_12px_rgba(240,79,42,0.2)]">
              ◉ Live courts
            </Link>
            <Link href={`/${clubSlug}/admin/sessions`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]">
              □ Calendar
            </Link>
            <Link href={`/${clubSlug}/admin/bookings`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]">
              ▤ Reservations
            </Link>
            <Link href={`/${clubSlug}/admin/courts`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]">
              ▦ Courts
            </Link>
            <Link href={`/${clubSlug}/admin/members`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]">
              ♙ Members
            </Link>
            <Link href={`/${clubSlug}/admin/settings`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]">
              ⚙ Settings
            </Link>
            <Link href={`/${clubSlug}/admin/payments`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]">
              ▭ Payments
            </Link>
          </nav>
          <div className="my-2 border-t border-[var(--line)]"></div>
          <Link href={`/${clubSlug}/admin`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]">
            &lt; Collapse
          </Link>
        </aside>

        <main className="min-w-0">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-[-0.04em]">
                  {session.name}
                </h2>
                <Badge tone="live">Live</Badge>
              </div>
              <p className="mt-1 text-sm font-medium text-[var(--muted)]">
                {assignments.length} active courts · syncs to TV
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Lobby announcement..."
                className="w-full sm:w-[300px] rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
              />
            </div>
          </header>

          <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2 shadow-[var(--shadow-sm)]">
            <span className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
              FLOOR
            </span>
            <Badge tone={liveCourts > 0 ? "live" : "slate"}>{liveCourts} live</Badge>
            <Badge tone={endingCourts > 0 ? "amber" : "slate"}>{endingCourts} ending</Badge>
            <Badge tone={openCourts > 0 ? "brand" : "slate"}>{openCourts} open</Badge>
            <Badge tone={queue.length > 0 ? "rose" : "slate"}>{queue.length} waiting</Badge>
            {queue[0]?.eta && (
              <Badge tone="slate">Next opening ~{queue[0].eta}</Badge>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {assignments.map((court) => {
              const isLive = court.status === "playing";
              const isEnding = court.status === "ending-soon";
              const isOpen = court.status === "available";

              const currentScore = scores[court.id] || { a: 11, b: 7 };

              return (
                <Card
                  key={court.id}
                  className={cx(
                    "flex flex-col overflow-hidden border-l-[4px]",
                    isLive ? "border-l-[var(--green)]" : isEnding ? "border-l-[var(--accent-amber)]" : "border-l-[var(--muted)]"
                  )}
                >
                  <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-muted)] px-5 py-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-heading text-lg font-extrabold">{court.courtName}</h3>
                      <Badge tone={isLive ? "live" : isEnding ? "amber" : "slate"}>
                        {isLive ? "LIVE" : isEnding ? "ENDING" : "OPEN"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                          NOW PLAYING
                        </div>
                        <div className="text-xs text-[var(--faint)]">Control center · syncs to TV</div>
                      </div>
                      <div className="flex gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-[11px] uppercase tracking-wider text-[var(--brand)] hover:bg-[var(--brand-soft)]"
                          onClick={() => handleAction("call_next", court.id)}
                        >
                          Sıradakini Al (Call Next)
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-[11px] uppercase tracking-wider text-[var(--muted)] hover:bg-[var(--surface-soft)]"
                          onClick={() => handleAction("queue_next", court.id)}
                        >
                          Sıraya Al (Queue Next)
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex -space-x-3">
                          {court.teamA.length > 0 ? (
                            court.teamA.map((p, i) => (
                              <Avatar key={p.id} name={p.fullName} src={p.avatar} size="lg" className={cx("border-2 border-[var(--surface)]", i === 1 && "z-10 relative -top-2")} />
                            ))
                          ) : (
                            <div className="h-12 w-12 rounded-full border-2 border-dashed border-[var(--line-strong)] flex items-center justify-center text-xs text-[var(--muted)] bg-[var(--surface-muted)]">Empty</div>
                          )}
                        </div>
                        <div className="text-xs font-bold text-[var(--foreground)] mt-2">
                          {court.teamA.length > 0 ? court.teamA.map(p => p.firstName).join(" / ") : "Awaiting Team A"}
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className={cx("font-mono text-4xl sm:text-5xl font-black tracking-tight", isEnding ? "text-[var(--accent-amber)]" : "text-[var(--brand-deep)]")}>
                          {court.endsInSeconds ? `${Math.floor(court.endsInSeconds / 60)}:${(court.endsInSeconds % 60).toString().padStart(2, '0')}` : "--:--"}
                        </div>
                        <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                          TIME LEFT
                        </div>
                        <div className="mt-3 flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--muted)]">SETS</span>
                          <span className="font-mono text-sm font-extrabold text-[var(--brand)]">11 - 7</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="flex -space-x-3 flex-row-reverse space-x-reverse">
                          {court.teamB.length > 0 ? (
                            court.teamB.map((p, i) => (
                              <Avatar key={p.id} name={p.fullName} src={p.avatar} size="lg" className={cx("border-2 border-[var(--surface)]", i === 1 && "z-10 relative -top-2")} />
                            ))
                          ) : (
                            <div className="h-12 w-12 rounded-full border-2 border-dashed border-[var(--line-strong)] flex items-center justify-center text-xs text-[var(--muted)] bg-[var(--surface-muted)]">Empty</div>
                          )}
                        </div>
                        <div className="text-xs font-bold text-[var(--foreground)] mt-2">
                          {court.teamB.length > 0 ? court.teamB.map(p => p.firstName).join(" / ") : "Awaiting Team B"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-[var(--line)] pt-4">
                      <div className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted)]">
                        RECORD SET SCORE & END
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <input
                          type="number"
                          value={currentScore.a}
                          onChange={(e) =>
                            setScores({
                              ...scores,
                              [court.id]: { ...currentScore, a: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-16 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] p-2 text-center font-mono text-xl font-bold shadow-sm outline-none focus:border-[var(--brand)]"
                        />
                        <span className="text-xl font-black text-[var(--muted)]">-</span>
                        <input
                          type="number"
                          value={currentScore.b}
                          onChange={(e) =>
                            setScores({
                              ...scores,
                              [court.id]: { ...currentScore, b: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-16 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] p-2 text-center font-mono text-xl font-bold shadow-sm outline-none focus:border-[var(--brand)]"
                        />
                        <Button
                          variant="secondary"
                          size="md"
                          className="ml-2 bg-[var(--brand)] hover:bg-[var(--brand-deep)] text-white"
                          onClick={() => handleAction("end_set", court.id)}
                        >
                          ⚑ Bitir (End Set)
                        </Button>
                      </div>
                    </div>
                  </div>

                  {court.nextUp && court.nextUp.length > 0 && (
                    <div className="bg-[color-mix(in_srgb,var(--brand-soft)_40%,transparent)] px-5 py-4 border-t border-[var(--line)]">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--brand-deep)]">
                          WAITING ON THIS COURT (1)
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-[var(--surface)] p-3 shadow-sm border border-[var(--line)]">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-lg font-bold text-[var(--muted)]">1</span>
                          <div>
                            <div className="text-sm font-bold text-[var(--foreground)]">
                              {court.nextUp.slice(0, 2).map(p => p.firstName).join(" / ")} <span className="text-[var(--muted)] font-normal text-xs mx-1">vs</span> {court.nextUp.slice(2, 4).length > 0 ? court.nextUp.slice(2, 4).map(p => p.firstName).join(" / ") : "Waiting opponent"}
                            </div>
                            <div className="text-xs text-[var(--muted)] mt-0.5">Next rotation</div>
                          </div>
                        </div>
                        <div className="flex -space-x-2">
                           {court.nextUp.slice(0, 4).map(p => (
                             <Avatar key={p.id} name={p.fullName} src={p.avatar} size="sm" className="border-2 border-[var(--surface)]" />
                           ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
