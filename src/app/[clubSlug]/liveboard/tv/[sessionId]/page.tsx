"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { CountdownTimer } from "@/components/liveboard/countdown-timer";
import { LiveClock } from "@/components/liveboard/live-clock";
import { LiveboardTicker } from "@/components/liveboard/liveboard-ticker";
import { LiveboardCueEngine } from "@/components/liveboard/liveboard-cue-engine";
import type { CourtAssignment, Person, QueueEntry, Session, RealtimeEvent } from "@/lib/types";
import { initials, cx } from "@/lib/utils";

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
      label: "Open",
      class: "status-open",
      pillClass: "open",
      sublabel: "Awaiting players to check in",
    };
  }

  if (assignment.status === "ending-soon" || (assignment.endsInSeconds && assignment.endsInSeconds <= 90)) {
    return {
      label: "Time Low",
      class: "status-critical",
      pillClass: "critical",
      sublabel: "Call next group immediately",
    };
  }

  if (assignment.status === "time-up") {
    return {
      label: "Time Up",
      class: "status-critical animate-pulse",
      pillClass: "critical",
      sublabel: "Rotate players now",
    };
  }

  return {
    label: "Live",
    class: "status-live",
    pillClass: "live",
    sublabel: "Match in progress",
  };
}

function CourtPanel({ assignment, idx }: { assignment: CourtAssignment; idx: number }) {
  const state = statusCopy(assignment);
  const nextGroup = assignment.nextUp ? splitIntoSides(assignment.nextUp) : null;
  const PALETTE = ["#E2613D", "#5C8264", "#4F86A6", "#DDA73B"];

  // Circular calculations
  const R = 62;
  const CIRC = 2 * Math.PI * R;
  const endsIn = assignment.endsInSeconds ?? 0;
  const ASSUMED_TOTAL = 3600;
  const frac = Math.max(0, Math.min(1, endsIn / ASSUMED_TOTAL));
  const strokeOffset = CIRC * (1 - frac);

  const getTeamNameColor = (teamIdx: number, pIdx: number) => {
    return PALETTE[(idx * 2 + teamIdx + pIdx) % PALETTE.length];
  };

  return (
    <article className={cx("court-card", state.class)} data-id={assignment.id}>
      <div className="court-head">
        <div className="court-title">
          <div className="court-no">{idx + 1}</div>
          <div>
            <div className="court-name">{assignment.courtName}</div>
            <div className="match-type">Friday Open Play · 18:00 - 21:00</div>
          </div>
        </div>
        <span className={cx("status-pill", state.pillClass)}>
          <span className="dot" />
          {state.label}
        </span>
      </div>

      <div className="match-area">
        {/* Team A */}
        <div className="team team-a">
          <div className="team-label">Team A</div>
          {(nextGroup ? nextGroup.left : assignment.teamA).map((player, pIdx) => (
            <div key={player.id} className="player-row">
              <span className="avatar" style={{ backgroundColor: getTeamNameColor(0, pIdx) }}>
                {initials(player.fullName)}
              </span>
              <span className="pname">{player.fullName}</span>
            </div>
          ))}
        </div>

        {/* Circular Timer & Score */}
        <div className="score-stage">
          <svg className="ring-svg" viewBox="0 0 144 144" width="100%" height="100%">
            <circle className="ring-bg" cx="72" cy="72" r={R}></circle>
            <circle
              className="ring-fg"
              cx="72"
              cy="72"
              r={R}
              strokeDasharray={`${CIRC} ${CIRC}`}
              strokeDashoffset={strokeOffset}
            ></circle>
          </svg>
          <div className="ring-inner">
            <div className="time-left">
              {assignment.endsInSeconds ? (
                <CountdownTimer initialSeconds={assignment.endsInSeconds} compact />
              ) : (
                "--:--"
              )}
            </div>
            <div className="scoreline">
              <span className="snum leading">11</span>
              <span className="dash">–</span>
              <span className="snum">8</span>
            </div>
            <div className="score-sub">Current set</div>
          </div>
        </div>

        {/* Team B */}
        <div className="team team-b">
          <div className="team-label">Team B</div>
          {(nextGroup ? nextGroup.right : assignment.teamB).map((player, pIdx) => (
            <div key={player.id} className="player-row">
              <span className="avatar" style={{ backgroundColor: getTeamNameColor(1, pIdx) }}>
                {initials(player.fullName)}
              </span>
              <span className="pname">{player.fullName}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

interface PageData {
  session: Session;
  assignments: CourtAssignment[];
  queue: QueueEntry[];
  events: RealtimeEvent[];
}

export default function TvLiveboardPage({
  params,
}: {
  params: Promise<{ sessionId: string; clubSlug: string }>;
}) {
  const { sessionId, clubSlug } = React.use(params);
  const [data, setData] = useState<PageData | null>(null);

  // Poll liveboard snapshot endpoint every 2 seconds for realtime updates
  useEffect(() => {
    async function fetchLiveboard() {
      try {
        const response = await fetch(`/api/sessions/${sessionId}/liveboard`);
        if (response.ok) {
          const json = await response.json();
          if (json.snapshot) {
            setData(json.snapshot);
          }
        }
      } catch (err) {
        console.error("Failed to fetch liveboard updates:", err);
      }
    }

    fetchLiveboard();
    const interval = setInterval(fetchLiveboard, 2000);
    return () => clearInterval(interval);
  }, [sessionId]);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F4ECDC] flex items-center justify-center font-sans font-bold text-[#211C16]">
        Connecting to liveboard stream...
      </div>
    );
  }

  const { session, assignments, queue, events } = data;
  const upNextBlocks = pairQueue(queue).slice(0, 3);
  const filledCourts = assignments.filter((assignment) => assignment.status !== "available").length;

  const clubName = clubSlug
    ? clubSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Kadıköy";

  // Quick stats calculation safely preventing Infinity error
  const endsInList = assignments.map((c) => c.endsInSeconds).filter((s): s is number => s !== undefined && s > 0);
  const minSeconds = endsInList.length > 0 ? Math.min(...endsInList) : 900;
  const nextOpenMins = Math.max(1, Math.round(minSeconds / 60));

  return (
    <div className="min-h-screen bg-[#F4ECDC] text-[#211C16] antialiased overflow-hidden font-sans">
      <LiveboardCueEngine events={events} assignments={assignments} queue={queue} />
      
      {/* Background gradients and dots matching template */}
      <div className="pointer-events-none fixed inset-0 z-[-2] bg-[radial-gradient(circle_at_86%_-8%,rgba(221,167,59,0.14),transparent_32%),radial-gradient(circle_at_-8%_96%,rgba(92,130,100,0.12),transparent_36%)]" />
      <div className="pointer-events-none fixed inset-0 z-[-1] opacity-45 bg-[radial-gradient(rgba(33,28,22,0.05)_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:radial-gradient(circle_at_50%_40%,black,transparent_78%)]" />

      {/* Styled Outfit Font Styles injected safely */}
      <style dangerouslySetInnerHTML={{ __html: `
        .board { height: 100vh; display: grid; grid-template-rows: auto 1fr auto; gap: 16px; padding: 22px; }
        .topbar { position: relative; overflow: hidden; background: #FFFBF2; border: 1px solid rgba(33,28,22,.10); border-radius: 26px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; gap: 18px; box-shadow: 0 18px 48px rgba(33,22,12,.10); }
        .topbar::before { content: ""; position: absolute; left: 18px; right: 18px; bottom: 0; height: 4px; border-radius: 8px; background: linear-gradient(90deg,#E2613D,#DDA73B,#5C8264); }
        .mark { width: 44px; height: 44px; border-radius: 50%; background: #211C16; position: relative; flex: 0 0 auto; }
        .mark::before { content: ""; position: absolute; left: 50%; top: 42%; transform: translate(-50%,-58%); width: 18px; height: 24px; border-radius: 10px 10px 7px 7px; background: #F4ECDC; }
        .mark::after { content: ""; position: absolute; left: 50%; bottom: 6px; transform: translateX(-50%); width: 4px; height: 8px; border-radius: 3px; background: #F4ECDC; }
        .brand-title { font-weight: 900; font-size: 24px; line-height: 1; letter-spacing: .01em; color: #211C16; }
        .brand-sub { margin-top: 3px; font-weight: 800; font-size: 10px; line-height: 1; letter-spacing: .16em; text-transform: uppercase; color: #B8431F; }
        
        .marquee-line { flex: 1; max-width: 600px; height: 40px; display: flex; align-items: center; gap: 10px; min-width: 0; bg: #E4EEE1; background-color: #E4EEE1; border: 1px solid rgba(52,84,59,.16); border-radius: 999px; padding: 0 14px; overflow: hidden; }
        .marquee-label { font-size: 9px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #34543B; white-space: nowrap; }
        .marquee { display: flex; gap: 30px; white-space: nowrap; font-weight: 700; font-size: 12px; letter-spacing: .02em; color: #211C16; }
        .marquee b { color: #B8431F; font-weight: 800; }
        
        .live-pill { display: inline-flex; align-items: center; gap: 8px; background: #E2613D; color: #fff; height: 40px; border-radius: 999px; padding: 0 16px; font-weight: 900; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; animation: breathe 1.6s ease-in-out infinite; }
        
        .main { min-height: 0; display: grid; grid-template-columns: minmax(0,1fr) 372px; gap: 16px; }
        .courts { min-height: 0; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); grid-template-rows: repeat(2,minmax(0,1fr)); gap: 16px; }
        .court-card { position: relative; overflow: hidden; border-radius: 22px; background: #FFFBF2; border: 1px solid rgba(33,28,22,.10); box-shadow: 0 18px 48px rgba(33,22,12,.10); display: grid; grid-template-rows: auto 1fr; min-height: 0; }
        .court-card.status-critical { border-color: rgba(226,97,61,.5); background: linear-gradient(165deg,#FBE3D5,#FFFBF2 62%); }
        .court-card.status-open { background: #E4EEE1; }
        
        .court-head { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 18px 4px; }
        .court-no { width: 38px; height: 38px; border-radius: 12px; background: #211C16; color: #F4ECDC; display: grid; place-items: center; font-weight: 800; font-size: 17px; line-height: 1; flex: 0 0 auto; }
        .court-name { font-weight: 800; font-size: 22px; line-height: 1.1; letter-spacing: .01em; color: #211C16; }
        .match-type { font-weight: 700; font-size: 11px; line-height: 1; letter-spacing: .08em; text-transform: uppercase; color: #544A3C; margin-top: 4px; }
        .status-pill { display: inline-flex; align-items: center; gap: 7px; height: 30px; border-radius: 999px; padding: 0 13px; font-weight: 800; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; }
        .status-pill.live { background: #E4EEE1; color: #34543B; }
        .status-pill.critical { background: #E2613D; color: #fff; }
        .status-pill.open { background: #F7E9C9; color: #A87A1F; }
        
        .match-area { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: 14px; padding: 6px 20px 18px; min-height: 0; }
        .team { min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 12px; }
        .team-b { align-items: flex-end; }
        .team-label { font-weight: 700; font-size: 11px; line-height: 1; letter-spacing: .1em; text-transform: uppercase; color: #544A3C; margin-bottom: 4px; }
        .team-b .team-label { text-align: right; }
        .player-row { display: flex; align-items: center; gap: 12px; }
        .team-b .player-row { flex-direction: row-reverse; text-align: right; }
        .avatar { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; font-size: 18px; color: #fff; flex: 0 0 auto; border: 3px solid #FFFBF2; box-shadow: 0 6px 14px rgba(33,22,12,.18); }
        .pname { font-weight: 700; font-size: 15px; line-height: 1.25; color: #211C16; text-transform: uppercase; }
        
        .score-stage { position: relative; width: 148px; height: 148px; display: grid; place-items: center; }
        .ring-svg { position: absolute; inset: 0; transform: rotate(-90deg); }
        .ring-bg { fill: none; stroke: rgba(33,28,22,.10); stroke-width: 8; }
        .ring-fg { fill: none; stroke: #5C8264; stroke-width: 8; stroke-linecap: round; }
        .status-critical .ring-fg { stroke: #E2613D; }
        .status-open .ring-fg { stroke: #DDA73B; }
        .ring-inner { position: relative; z-index: 1; text-align: center; }
        .time-left { font-weight: 800; font-size: 22px; line-height: 1; color: #211C16; }
        .scoreline { margin-top: 3px; display: flex; align-items: baseline; justify-content: center; gap: 9px; }
        .snum { font-weight: 900; font-size: 38px; line-height: .9; color: #544A3C; }
        .snum.leading { color: #34543B; }
        .status-critical .snum.leading { color: #B8431F; }
        .dash { font-weight: 700; font-size: 18px; line-height: 1; color: rgba(33,28,22,.10); }
        .score-sub { margin-top: 5px; font-weight: 700; font-size: 9px; line-height: 1; letter-spacing: .1em; text-transform: uppercase; color: #544A3C; }
        
        .side { min-height: 0; display: grid; grid-template-rows: auto auto auto 1fr; gap: 12px; }
        .side-card { position: relative; overflow: hidden; border-radius: 20px; background: #FFFBF2; border: 1px solid rgba(33,28,22,.10); box-shadow: 0 14px 36px rgba(33,22,12,.08); }
        .side-head { height: 42px; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; border-bottom: 1px solid rgba(33,28,22,.10); }
        .side-title { font-weight: 800; font-size: 13px; line-height: 1; letter-spacing: .12em; text-transform: uppercase; color: #211C16; }
        .count { min-width: 24px; height: 24px; border-radius: 999px; background: #211C16; color: #F4ECDC; display: grid; place-items: center; font-weight: 800; font-size: 11px; line-height: 1; }
        
        .watch-body { padding: 13px 14px; }
        .watch-row { display: flex; align-items: center; gap: 10px; border-radius: 13px; background: #FBE3D5; padding: 9px 11px; margin-bottom: 8px; }
        .watch-row .wdot { width: 8px; height: 8px; border-radius: 50%; background: #E2613D; flex: 0 0 auto; }
        .watch-row strong { display: block; font-weight: 800; font-size: 14px; line-height: 1.25; color: #B8431F; }
        .watch-row span { display: block; font-weight: 600; font-size: 13px; line-height: 1.35; color: #544A3C; }
        .watch-row.synced { background: #E4EEE1; }
        .watch-row.synced .wdot { background: #5C8264; }
        .watch-row.synced strong { color: #34543B; }
        
        .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; padding: 13px 14px; }
        .stat { border: 1px solid rgba(33,28,22,.10); border-radius: 14px; background: #F4ECDC; padding: 11px 6px; text-align: center; }
        .stat strong { display: block; font-weight: 800; font-size: 34px; line-height: .9; color: #211C16; }
        .stat span { display: block; margin-top: 6px; font-weight: 700; font-size: 9px; line-height: 1; letter-spacing: .08em; text-transform: uppercase; color: #544A3C; }
        
        .queue-item { position: relative; padding: 13px 14px; border-bottom: 1px solid rgba(33,28,22,.10); }
        .queue-item:first-child { background: linear-gradient(90deg,#FBE3D5,transparent); }
        .queue-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-weight: 800; font-size: 10px; line-height: 1; letter-spacing: .08em; text-transform: uppercase; color: #544A3C; }
        .queue-meta b { color: #A87A1F; }
        .qmatch { font-weight: 700; font-size: 15px; line-height: 1.35; color: #211C16; }
        .qmatch b { font-weight: 800; }
        .vs { color: #544A3C; font-weight: 600; }
        
        .feed-row { display: grid; grid-template-columns: 32px 1fr auto; align-items: center; gap: 10px; padding: 11px 9px; border-radius: 11px; }
        .feed-row:nth-child(odd) { background: #F4ECDC; }
        .feed-court { font-weight: 800; font-size: 10px; line-height: 1; color: #B8431F; letter-spacing: .05em; text-transform: uppercase; }
        .feed-text { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; font-size: 14px; line-height: 1.25; color: #211C16; }
        .feed-tag { height: 22px; border-radius: 999px; background: #E4EEE1; color: #34543B; display: flex; align-items: center; padding: 0 9px; font-weight: 800; font-size: 9px; line-height: 1; letter-spacing: .05em; text-transform: uppercase; }
        
        @keyframes breathe { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(.7);opacity:.45;} }
      ` }} />

      <div className="board">
        <header className="topbar">
          <div className="brand">
            <div className="mark" aria-hidden="true" />
            <div>
              <div className="brand-title">PICKLE PULSE</div>
              <div className="brand-sub">{clubName} · Live Board</div>
            </div>
          </div>

          <div className="marquee-line" aria-label="Club updates">
            <span className="marquee-label">On deck</span>
            <div className="marquee" id="topMarquee">
              <span><b>{assignments.length} courts live</b> · queue is flowing</span>
              <span className="ml-6">Next wave in <b>~{nextOpenMins}m</b></span>
            </div>
          </div>

          <div className="top-actions">
            <span className="live-pill">
              <span className="dot" />
              Live
            </span>
          </div>
        </header>

        <main className="main">
          {/* Active Courts Wave */}
          <section className="courts">
            {assignments.map((assignment, idx) => (
              <CourtPanel key={assignment.id} assignment={assignment} idx={idx} />
            ))}
          </section>

          {/* Sidebar */}
          <aside className="side">
            <section className="side-card">
              <div className="side-head">
                <div className="side-title">Club Status</div>
              </div>
              <div className="watch-body">
                <div className="watch-row">
                  <span className="wdot" />
                  <div>
                    <strong>Wave 1 · Active</strong>
                    <span>Fast court rotation is online.</span>
                  </div>
                </div>
                <div className="watch-row synced">
                  <span className="wdot" />
                  <div>
                    <strong>Live updates active</strong>
                    <span>Real-time lobby board updates.</span>
                  </div>
                </div>
              </div>
              <div className="stats">
                <div className="stat">
                  <strong>{filledCourts}</strong>
                  <span>Live</span>
                </div>
                <div className="stat">
                  <strong>{queue.length}</strong>
                  <span>Waiting</span>
                </div>
                <div className="stat">
                  <strong>~{nextOpenMins}m</strong>
                  <span>Next open</span>
                </div>
              </div>
            </section>

            {/* Next on Court */}
            <section className="side-card">
              <div className="side-head">
                <div className="side-title">Next On Court</div>
                <span className="count">{upNextBlocks.length}</span>
              </div>
              <div id="queue">
                {upNextBlocks.map((block, idx) => (
                  <div key={block[0]?.id ?? idx} className="queue-item">
                    <div className="queue-meta">
                      <span>Court {idx + 1}</span>
                      <b>On Deck</b>
                    </div>
                    <div className="qmatch">
                      <b>{block[0]?.player.fullName}</b> <span className="vs">vs</span> {block[1]?.player.fullName ?? "Awaiting opponent"}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Highlights Feed */}
            <section className="side-card flex flex-col min-h-0">
              <div className="side-head">
                <div className="side-title">Recent Highlights</div>
                <span className="count">{events.length}</span>
              </div>
              <div className="feed-list overflow-y-auto">
                {events.map((event) => (
                  <div key={event.id} className="feed-row">
                    <div className="feed-court">C1</div>
                    <div className="feed-text">{event.detail}</div>
                    <div className="feed-tag">{event.label.split(".")[1] || "pulse"}</div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </main>

        <footer className="overflow-hidden rounded-full bg-[#211C16] text-[#FFFBF2]">
          <LiveboardTicker session={session} queue={queue} events={events} />
        </footer>
      </div>
    </div>
  );
}
