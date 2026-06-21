"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { cx } from "@/lib/utils";

// TypeScript Interfaces
interface QueueItem {
  match: string;
  sub: string;
  players: string[];
}

interface SlotItem {
  time: string;
  status: "past" | "current" | "upcoming";
  match: string;
}

interface Court {
  id: number;
  title: string;
  status: "live" | "ending" | "open";
  type: string;
  timer: number; // in seconds
  set: string;
  score: [number, number];
  teams: [string[], string[]];
  queue: QueueItem[];
  slots: [string, "past" | "current" | "upcoming", string][];
}

interface Player {
  name: string;
  rating: string;
  checked: boolean;
}

interface TickerItem {
  kind: "LIVE" | "QUEUE" | "TV" | "INFO";
  text: string;
}

const INITIAL_COURTS: Court[] = [
  {
    id: 1,
    title: "Court 1 · Center",
    status: "live",
    type: "Men's doubles · 08:00 – 09:00",
    timer: 12 * 60 + 18,
    set: "11–7",
    score: [11, 7],
    teams: [
      ["Alex R.", "Daniel K."],
      ["Mark S.", "Josh P."],
    ],
    queue: [
      {
        match: "Sarah L. / Mike T. vs John D. / Ethan R.",
        sub: "Mixed doubles · pinned to Court 1",
        players: ["Sarah L.", "Mike T.", "John D.", "Ethan R."],
      },
      {
        match: "Olivia H. / Emma A. vs Lisa M. / Anna K.",
        sub: "Women's doubles · flexible",
        players: ["Olivia H.", "Emma A.", "Lisa M.", "Anna K."],
      },
    ],
    slots: [
      ["07:00 – 08:00", "past", "Brad / Chad vs Lisa / Anna"],
      ["08:00 – 09:00", "current", "Alex / Daniel vs Mark / Josh"],
      ["09:00 – 10:00", "upcoming", "Sarah / Mike vs John / Ethan"],
      ["10:00 – 11:00", "upcoming", "Olivia / Emma vs Liam / Noah"],
    ],
  },
  {
    id: 2,
    title: "Court 2",
    status: "live",
    type: "Mixed doubles · 08:00 – 09:00",
    timer: 7 * 60 + 53,
    set: "9–11",
    score: [9, 11],
    teams: [
      ["Zoe T.", "Emma A."],
      ["Brad C.", "Chad Y."],
    ],
    queue: [
      {
        match: "Olivia H. / Ethan R. vs Waiting opponent",
        sub: "Mixed doubles · needs one player",
        players: ["Olivia H.", "Ethan R.", "Waiting opponent"],
      },
    ],
    slots: [
      ["07:00 – 08:00", "past", "David vs Chris"],
      ["08:00 – 09:00", "current", "Zoe / Emma vs Brad / Chad"],
      ["09:00 – 10:00", "upcoming", "Olivia / Ethan vs Waiting opponent"],
      ["10:00 – 11:00", "upcoming", "Jane / Mary vs Lisa / Anna"],
    ],
  },
  {
    id: 3,
    title: "Court 3",
    status: "ending",
    type: "Women’s doubles · 08:00 – 09:00",
    timer: 3 * 60 + 28,
    set: "6–11",
    score: [6, 11],
    teams: [
      ["Lisa M.", "Anna K."],
      ["Jane D.", "Mary S."],
    ],
    queue: [
      {
        match: "Mia Y. / Ava D. vs Lucas K. / Oliver B.",
        sub: "Global queue · first available court",
        players: ["Mia Y.", "Ava D.", "Lucas K.", "Oliver B."],
      },
    ],
    slots: [
      ["07:00 – 08:00", "past", "Zoe / Emma vs Sarah / Mike"],
      ["08:00 – 09:00", "current", "Lisa / Anna vs Jane / Mary"],
      ["09:00 – 10:00", "upcoming", "Mia / Ava vs Lucas / Oliver"],
    ],
  },
  {
    id: 4,
    title: "Court 4",
    status: "open",
    type: "Open court · ready for next match",
    timer: 0,
    set: "",
    score: [0, 0],
    teams: [[], []],
    queue: [
      {
        match: "Sarah L. / Mike T. vs John D. / Ethan R.",
        sub: "Doubles rotation · flexible",
        players: ["Sarah L.", "Mike T.", "John D.", "Ethan R."],
      },
      {
        match: "Liam T. vs Noah S.",
        sub: "Singles · pinned to Court 4",
        players: ["Liam T.", "Noah S."],
      },
    ],
    slots: [
      ["08:00 – 09:00", "past", "David vs Chris"],
      ["09:00 – 10:00", "current", "Sarah & Mike vs John & Ethan"],
      ["10:00 – 11:00", "upcoming", "Liam vs Noah"],
    ],
  },
];

const INITIAL_PLAYERS: Player[] = [
  { name: "Lucas K.", rating: "3.5", checked: false },
  { name: "Oliver B.", rating: "3.0", checked: false },
  { name: "Liam T.", rating: "3.8", checked: false },
  { name: "Noah S.", rating: "3.6", checked: false },
  { name: "Mia Y.", rating: "2.9", checked: false },
  { name: "Ava D.", rating: "3.2", checked: false },
];

const INITIAL_TICKER: TickerItem[] = [
  { kind: "LIVE", text: "Court 3 ending soon, queue is ready" },
  { kind: "QUEUE", text: "Sarah / Mike pinned to Court 4" },
  { kind: "TV", text: "Lobby display synced 08:42" },
];

export default function AdminLivePage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";
  const clubName = clubSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Client-side states
  const [courts, setCourts] = useState<Court[]>(INITIAL_COURTS);
  const [playerPool, setPlayerPool] = useState<Player[]>(INITIAL_PLAYERS);
  const [ticker, setTicker] = useState<TickerItem[]>(INITIAL_TICKER);
  const [selectedCourtId, setSelectedCourtId] = useState<number>(4);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lobbyAnnouncement, setLobbyAnnouncement] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [scoreToggles, setScoreToggles] = useState<Record<number, boolean>>({});
  const [mounted, setMounted] = useState<boolean>(false);

  // Input states for right rail
  const [walkinName, setWalkinName] = useState<string>("");
  const [quickPairA, setQuickPairA] = useState<string>("");
  const [quickPairB, setQuickPairB] = useState<string>("");

  // Modals state (LIVE button operations spec)
  const [showEndSetModal, setShowEndSetModal] = useState(false);
  const [endSetCourtId, setEndSetCourtId] = useState<number | null>(null);
  const [endSetScoreA, setEndSetScoreA] = useState(11);
  const [endSetScoreB, setEndSetScoreB] = useState(9);
  const [endSetWinner, setEndSetWinner] = useState("teamA");
  const [endSetNotes, setEndSetNotes] = useState("");
  const [endSetNextAction, setEndSetNextAction] = useState<"next-set" | "end-match">("end-match");

  const [pausedCourts, setPausedCourts] = useState<Record<number, boolean>>({});
  const [prevScores, setPrevScores] = useState<Record<number, [number, number]>>({});
  const [undoCourtId, setUndoCourtId] = useState<number | null>(null);

  const [showSwapSidesConfirm, setShowSwapSidesConfirm] = useState(false);
  const [swapSidesCourtId, setSwapSidesCourtId] = useState<number | null>(null);

  const [showAddQueueDrawer, setShowAddQueueDrawer] = useState(false);
  const [queuePlayerName, setQueuePlayerName] = useState("");
  const [queueGuestName, setQueueGuestName] = useState("");
  const [queuePhone, setQueuePhone] = useState("");
  const [queuePartySize, setQueuePartySize] = useState("2");
  const [queueSkill, setQueueSkill] = useState("3.0");
  const [queueCourtType, setQueueCourtType] = useState("Open Court");
  const [queueNotes, setQueueNotes] = useState("");

  const [showCallNextModal, setShowCallNextModal] = useState(false);
  const [callNextCourtId, setCallNextCourtId] = useState<number | null>(null);
  const [callNextSelectedGroup, setCallNextSelectedGroup] = useState<number>(0);
  const [callNextSkipReason, setCallNextSkipReason] = useState("");

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeCourtId, setRemoveCourtId] = useState<number | null>(null);
  const [removeQueueIndex, setRemoveQueueIndex] = useState<number | null>(null);
  const [removeReason, setRemoveReason] = useState("No-show");
  const [removeNotes, setRemoveNotes] = useState("");

  const tones = ["tone-a", "tone-b", "tone-c", "tone-d", "tone-e"];

  // Log audit events to local storage helper
  const logLiveAudit = (actionType: string, details: string) => {
    const newLog = {
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      user: "Manager Ece",
      action: `${actionType}: ${details}`
    };
    try {
      const logsKey = `pickle_audit_logs_${clubSlug}`;
      const existing = localStorage.getItem(logsKey);
      const logs = existing ? JSON.parse(existing) : [];
      logs.unshift(newLog);
      localStorage.setItem(logsKey, JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  };

  // Show visual toast notifications
  const notify = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const courtsKey = `pickle_courts_${clubSlug}`;
      const poolKey = `pickle_player_pool_${clubSlug}`;
      const tickerKey = `pickle_ticker_${clubSlug}`;

      const savedCourts = localStorage.getItem(courtsKey);
      const savedPool = localStorage.getItem(poolKey);
      const savedTicker = localStorage.getItem(tickerKey);

      if (savedCourts) setCourts(JSON.parse(savedCourts));
      if (savedPool) setPlayerPool(JSON.parse(savedPool));
      if (savedTicker) setTicker(JSON.parse(savedTicker));
    }
  }, [clubSlug]);

  // Listen for storage updates (e.g. from Kiosk check-in in another tab)
  useEffect(() => {
    const handleStorage = () => {
      const courtsKey = `pickle_courts_${clubSlug}`;
      const poolKey = `pickle_player_pool_${clubSlug}`;
      const tickerKey = `pickle_ticker_${clubSlug}`;

      const savedCourts = localStorage.getItem(courtsKey);
      const savedPool = localStorage.getItem(poolKey);
      const savedTicker = localStorage.getItem(tickerKey);

      if (savedCourts) setCourts(JSON.parse(savedCourts));
      if (savedPool) setPlayerPool(JSON.parse(savedPool));
      if (savedTicker) setTicker(JSON.parse(savedTicker));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [clubSlug]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem(`pickle_courts_${clubSlug}`, JSON.stringify(courts));
    }
  }, [courts, clubSlug, mounted]);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem(`pickle_player_pool_${clubSlug}`, JSON.stringify(playerPool));
    }
  }, [playerPool, clubSlug, mounted]);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem(`pickle_ticker_${clubSlug}`, JSON.stringify(ticker));
    }
  }, [ticker, clubSlug, mounted]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2100);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Timer interval to count down active court timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCourts((prevCourts) =>
        prevCourts.map((c) => {
          if (c.timer > 0 && !pausedCourts[c.id]) {
            const nextTimer = c.timer - 1;
            let nextStatus = c.status;
            if (nextTimer > 0 && nextTimer < 5 * 60 && c.status === "live") {
              nextStatus = "ending";
            }
            return {
              ...c,
              timer: nextTimer,
              status: nextStatus,
            };
          }
          return c;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [pausedCourts]);

  // Format seconds to mm:ss
  const fmt = (seconds: number) => {
    const s = Math.max(0, seconds);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  // Helper functions matching index_character.html logic
  const getInitials = (name: string) => {
    return name
      .split(/[\s/.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0])
      .join("")
      .toUpperCase();
  };

  const getUrgencyClass = (c: Court) => {
    if (c.status === "open" && c.queue.length > 0) return "open-ready";
    if (c.status === "ending" && c.timer <= 120) return "critical";
    if ((c.status === "ending" || c.timer < 5 * 60) && c.timer > 0) return "soon";
    return "";
  };

  const getTimerClass = (c: Court) => {
    const u = getUrgencyClass(c);
    if (u === "critical") return "critical";
    if (u === "soon") return "soon";
    return c.status;
  };

  const getTimerLabel = (c: Court) => {
    if (c.status === "open") return c.queue.length > 0 ? "Call next now" : "Court open";
    if (c.timer <= 120) return "Critical time";
    if (c.timer <= 5 * 60) return "Ending soon";
    return "Time left";
  };

  const getLeftMeta = (c: Court) => {
    if (c.status === "open") return c.queue.length > 0 ? "queue ready" : "ready now";
    if (c.timer <= 120) return `${fmt(c.timer)} · finish now`;
    if (c.timer <= 5 * 60) return `${fmt(c.timer)} · ending`;
    return `${fmt(c.timer)} left`;
  };

  const addTicker = (kind: "LIVE" | "QUEUE" | "TV" | "INFO", text: string) => {
    setTicker((prev) => [{ kind, text }, ...prev.slice(0, 4)]);
  };

  const adjustScore = (courtId: number, teamIdx: number, delta: number) => {
    setCourts((prevCourts) =>
      prevCourts.map((c) => {
        if (c.id === courtId) {
          const oldScore = [...c.score] as [number, number];
          const newScore = [...oldScore] as [number, number];
          newScore[teamIdx] = Math.max(0, newScore[teamIdx] + delta);
          
          // Save for undo
          setPrevScores(prev => ({ ...prev, [courtId]: oldScore }));
          setUndoCourtId(courtId);

          logLiveAudit("match.score_adjusted", `${c.title} Team ${teamIdx + 1} score adjusted from ${oldScore[teamIdx]} to ${newScore[teamIdx]}`);
          notify("Score updated.");

          return {
            ...c,
            score: newScore,
          };
        }
        return c;
      })
    );
  };

  const handleUndoScore = () => {
    if (undoCourtId !== null && prevScores[undoCourtId]) {
      const restoredScore = prevScores[undoCourtId];
      setCourts((prevCourts) =>
        prevCourts.map((c) => {
          if (c.id === undoCourtId) {
            logLiveAudit("match.score_adjusted", `${c.title} score adjustment undone to ${restoredScore.join("–")}`);
            return {
              ...c,
              score: restoredScore,
            };
          }
          return c;
        })
      );
      notify("Score restored.");
      setUndoCourtId(null);
    }
  };

  const togglePause = (courtId: number) => {
    const nextPaused = !pausedCourts[courtId];
    setPausedCourts(prev => ({ ...prev, [courtId]: nextPaused }));
    const court = courts.find(c => c.id === courtId);
    logLiveAudit("match.timer_toggled", `${court?.title || "Court"} timer ${nextPaused ? "paused" : "resumed"}`);
    notify(nextPaused ? "Match timer paused." : "Match timer resumed.");
  };

  const executeSwapSides = (courtId: number) => {
    setCourts((prevCourts) =>
      prevCourts.map((c) => {
        if (c.id === courtId) {
          const nextTeams: [string[], string[]] = [c.teams[1], c.teams[0]];
          const nextScore: [number, number] = [c.score[1], c.score[0]];
          logLiveAudit("match.sides_swapped", `${c.title} sides swapped`);
          notify("Sides swapped. Scoreboard updated.");
          return {
            ...c,
            teams: nextTeams,
            score: nextScore,
          };
        }
        return c;
      })
    );
    setShowSwapSidesConfirm(false);
  };

  const openEndSetModal = (courtId: number) => {
    const court = courts.find(c => c.id === courtId);
    if (court) {
      setEndSetCourtId(courtId);
      setEndSetScoreA(court.score[0]);
      setEndSetScoreB(court.score[1]);
      setEndSetWinner(court.score[0] >= court.score[1] ? "teamA" : "teamB");
      setEndSetNotes("");
      setEndSetNextAction("end-match");
      setShowEndSetModal(true);
    }
  };

  const executeEndSet = () => {
    if (endSetCourtId === null) return;
    const court = courts.find(c => c.id === endSetCourtId);
    if (!court) return;

    const winnerName = endSetWinner === "teamA" ? court.teams[0].join(" / ") : court.teams[1].join(" / ");
    logLiveAudit("match.set_ended", `${court.title} set ended with score ${endSetScoreA}–${endSetScoreB}. Winner: ${winnerName}. Action: ${endSetNextAction}`);

    setCourts((prevCourts) =>
      prevCourts.map((c) => {
        if (c.id === endSetCourtId) {
          if (endSetNextAction === "end-match") {
            addTicker("LIVE", `${c.title}: Match ended. Winner ${winnerName}`);
            return {
              ...c,
              status: "open" as const,
              timer: 0,
              teams: [[], []] as [string[], string[]],
              score: [0, 0] as [number, number],
              set: "",
            };
          } else {
            addTicker("LIVE", `${c.title}: Set recorded ${endSetScoreA}–${endSetScoreB}`);
            return {
              ...c,
              timer: 55 * 60,
              score: [0, 0] as [number, number],
              set: `${endSetScoreA}–${endSetScoreB}`,
            };
          }
        }
        return c;
      })
    );

    notify("Set ended. Scoreboard and lobby TV were updated.");
    setShowEndSetModal(false);
  };

  const openCallNextModal = (courtId: number) => {
    setCallNextCourtId(courtId);
    setCallNextSelectedGroup(0);
    setCallNextSkipReason("");
    setShowCallNextModal(true);
  };

  const executeCallNext = () => {
    if (callNextCourtId === null) return;
    const court = courts.find(c => c.id === callNextCourtId);
    if (!court) return;

    if (court.queue.length === 0) {
      notify("No waiting groups in queue");
      return;
    }

    if (callNextSelectedGroup > 0 && !callNextSkipReason.trim()) {
      notify("Skip reason is required to bypass FIFO order");
      return;
    }

    setCourts((prevCourts) =>
      prevCourts.map((c) => {
        if (c.id === callNextCourtId) {
          const nextQueue = [...c.queue];
          const selectedIndex = Math.min(callNextSelectedGroup, nextQueue.length - 1);
          const next = nextQueue.splice(selectedIndex, 1)[0];
          
          if (next) {
            const parts = next.match.split(" vs ");
            const teamA = (parts[0] || "").split(" / ").filter(Boolean);
            const teamB = (parts[1] || "").split(" / ").filter(Boolean);
            
            if (selectedIndex > 0) {
              logLiveAudit("queue.called_next", `${c.title}: FIFO bypassed. Group ${next.match} called. Reason: ${callNextSkipReason}`);
            } else {
              logLiveAudit("queue.called_next", `${c.title}: Called group ${next.match}`);
            }
            
            addTicker("LIVE", `${c.title}: ${next.match} called`);
            return {
              ...c,
              teams: [teamA, teamB],
              status: "live" as const,
              timer: 55 * 60,
              type: next.sub,
              set: "0–0",
              score: [0, 0] as [number, number],
              queue: nextQueue,
            };
          }
        }
        return c;
      })
    );

    notify(`Next group called. Court ${court.title} is assigned.`);
    setShowCallNextModal(false);
  };

  const openRemoveModal = (courtId: number, index: number) => {
    setRemoveCourtId(courtId);
    setRemoveQueueIndex(index);
    setRemoveReason("No-show");
    setRemoveNotes("");
    setShowRemoveModal(true);
  };

  const executeRemoveGroup = () => {
    if (removeCourtId === null || removeQueueIndex === null) return;
    const court = courts.find(c => c.id === removeCourtId);
    if (!court) return;

    const group = court.queue[removeQueueIndex];
    if (!group) return;

    logLiveAudit("waitlist.removed", `${group.match} removed from ${court.title}. Reason: ${removeReason}. Notes: ${removeNotes}`);

    setCourts((prevCourts) =>
      prevCourts.map((c) => {
        if (c.id === removeCourtId) {
          const nextQueue = [...c.queue];
          nextQueue.splice(removeQueueIndex, 1);
          return {
            ...c,
            queue: nextQueue,
          };
        }
        return c;
      })
    );

    addTicker("INFO", `${group.match} removed: ${removeReason}`);
    notify("Removed from waitlist. Queue order has been updated.");
    setShowRemoveModal(false);
  };

  const executeAddQueue = (e: React.FormEvent) => {
    e.preventDefault();
    const name = queuePlayerName.trim() || queueGuestName.trim();
    if (!name) {
      notify("Player or Guest name is required");
      return;
    }

    const matchText = parseInt(queuePartySize) === 4 
      ? `${name} / Guest B vs Guest C / Guest D`
      : parseInt(queuePartySize) === 2 
      ? `${name} vs Guest B`
      : `${name} vs Waiting opponent`;

    const subText = `${queueCourtType} · Party: ${queuePartySize} · Skill: ${queueSkill}`;

    setCourts((prevCourts) =>
      prevCourts.map((c) => {
        if (c.id === selectedCourtId) {
          if (c.queue.some(q => q.match.toLowerCase().includes(name.toLowerCase()))) {
            notify("Duplicate queue entry blocked");
            return c;
          }

          const nextQueue = [
            ...c.queue,
            {
              match: matchText,
              sub: subText,
              players: [name]
            }
          ];

          logLiveAudit("waitlist.added", `${matchText} added to ${c.title}`);
          addTicker("QUEUE", `${matchText} → ${c.title}`);
          notify(`Added to waitlist. They are now #${nextQueue.length} in line.`);
          return {
            ...c,
            queue: nextQueue
          };
        }
        return c;
      })
    );

    setShowAddQueueDrawer(false);
    setQueuePlayerName("");
    setQueueGuestName("");
    setQueuePhone("");
    setQueueNotes("");
  };

  const callNext = (courtId: number) => {
    openCallNextModal(courtId);
  };

  const addWalkIn = () => {
    const name = walkinName.trim();
    if (!name) {
      notify("Walk-in name is empty");
      return;
    }
    if (playerPool.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      notify("This player is already on the list");
      return;
    }
    setPlayerPool((prev) => [...prev, { name, rating: "—", checked: true }]);
    addTicker("INFO", `${name} added to available players list`);
    setWalkinName("");
    notify(`${name} added`);
  };

  const queueLabel = (players: string[]) => {
    if (players.length >= 4) {
      return `${players[0]} / ${players[1]} vs ${players[2]} / ${players[3]}`;
    }
    if (players.length === 3 && players[2] === "Waiting opponent") {
      return `${players[0]} / ${players[1]} vs Waiting opponent`;
    }
    if (players.length === 3) {
      return `${players[0]} / ${players[1]} vs ${players[2]} / Waiting opponent`;
    }
    return `${players[0]} vs ${players[1]}`;
  };

  const queuePlayersToCourt = (players: string[], sub = "Walk-in match · flexible queue") => {
    const clean = players.map((x) => String(x || "").trim()).filter(Boolean);
    if (clean.length < 2) {
      notify("Select at least 2 players");
      return;
    }
    const match = queueLabel(clean);

    setCourts((prevCourts) =>
      prevCourts.map((c) => {
        if (c.id === selectedCourtId) {
          const nextQueue = [
            ...c.queue,
            {
              match,
              sub: clean.length >= 4 ? "Doubles rotation · flexible queue" : sub,
              players: clean,
            },
          ];
          return {
            ...c,
            queue: nextQueue,
          };
        }
        return c;
      })
    );

    setPlayerPool((prev) =>
      prev.filter((p) => !clean.includes(p.name)).map((p) => ({ ...p, checked: false }))
    );

    const targetCourt = courts.find((c) => c.id === selectedCourtId) || courts[0];
    addTicker("QUEUE", `${match} → ${targetCourt.title}`);
    notify(`${targetCourt.title}: added to queue`);
  };

  const queueSelectedPlayers = () => {
    const selected = playerPool.filter((p) => p.checked).map((p) => p.name);
    queuePlayersToCourt(selected);
  };

  const addQuickPair = () => {
    const a = quickPairA.trim();
    const b = quickPairB.trim();
    if (!a || !b) {
      notify("Both names are required for a pair");
      return;
    }
    queuePlayersToCourt([a, b, "Waiting opponent"], "Pair · waiting opponent");
    setQuickPairA("");
    setQuickPairB("");
  };

  const removeQueueItem = (courtId: number, index: number) => {
    setCourts((prevCourts) =>
      prevCourts.map((c) => {
        if (c.id === courtId) {
          const nextQueue = [...c.queue];
          const removed = nextQueue.splice(index, 1)[0];
          if (removed) {
            addTicker("INFO", `${removed.match} removed from ${c.title}`);
          }
          return {
            ...c,
            queue: nextQueue,
          };
        }
        return c;
      })
    );
    notify("Queue item removed");
  };

  // Floor metrics calculations
  const liveCount = courts.filter((c) => c.status !== "open").length;
  const waitingCount = courts.reduce((sum, c) => sum + c.queue.length, 0);

  // Filtered courts based on activeFilter state
  const filteredCourts = courts.filter((c) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "live") return c.status === "live";
    if (activeFilter === "ending") return c.status === "ending";
    if (activeFilter === "open") return c.status === "open";
    if (activeFilter === "waiting") return c.queue.length > 0;
    return true;
  });

  // Desk highlights calculations for top priority cards & right highlights
  const readyCourt = courts.find((c) => c.status === "open" && c.queue.length > 0);
  const endingCourt = [...courts].filter((c) => c.status === "ending").sort((a, b) => a.timer - b.timer)[0];
  const busiestCourt = [...courts].sort((a, b) => b.queue.length - a.queue.length)[0];

  const getPriorityCards = () => {
    const items = [];
    if (readyCourt) {
      items.push({
        tone: "primary",
        kicker: "Action now",
        title: `${readyCourt.title} is ready`,
        copy: readyCourt.queue[0].match,
        action: "Call next",
        callId: readyCourt.id,
      });
    }
    if (endingCourt) {
      items.push({
        tone: "warn",
        kicker: "Watch",
        title: `${endingCourt.title} ends in ${fmt(endingCourt.timer)}`,
        copy: endingCourt.queue.length ? `${endingCourt.queue.length} waiting on court` : "No queue pinned yet",
        action: "Open card",
        callId: null,
      });
    }
    if (busiestCourt) {
      items.push({
        tone: "ready",
        kicker: "Queue load",
        title: `${busiestCourt.queue.length} waiting on ${busiestCourt.title}`,
        copy: busiestCourt.queue[0]?.match || "No immediate queue",
        action: "Pin",
        callId: null,
      });
    }
    return items.slice(0, 3);
  };

  const getCourtAlert = (c: Court) => {
    if (c.status === "open" && c.queue.length > 0) {
      return {
        type: "ready",
        title: "Court open · queue ready",
        sub: c.queue[0].match,
        badge: "CALL",
      };
    }
    if (c.status === "ending" && c.queue.length > 0 && c.timer <= 120) {
      return {
        type: "ready", // orange theme alert
        title: "Critical time · call next",
        sub: `${fmt(c.timer)} left · ${c.queue[0].match}`,
        badge: "NOW",
      };
    }
    if (c.status === "ending" && c.queue.length > 0) {
      return {
        type: "warn",
        title: "Ending soon · next ready",
        sub: `${fmt(c.timer)} left · ${c.queue[0].match}`,
        badge: "WATCH",
      };
    }
    if (c.status === "live" && c.timer < 10 * 60 && c.queue.length > 0) {
      return {
        type: "warn",
        title: "Next group prepared",
        sub: `${fmt(c.timer)} left · ${c.queue.length} waiting`,
        badge: "NEXT",
      };
    }
    if (c.status === "open") {
      return {
        type: "ok",
        title: "Open court",
        sub: "No pressure — keep available",
        badge: "OPEN",
      };
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* CSS Styles embedded to maintain 100% parity with index_character.html */}
      <style dangerouslySetInnerHTML={{ __html: `
        .eyebrow {
          font-size: 12px;
          color: #756a61;
          margin-bottom: 3px;
        }
        h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 720;
          letter-spacing: -.028em;
          line-height: 1.12;
          color: #211b16;
        }
        .subline {
          color: #756a61;
          font-size: 13px;
          margin-top: 5px;
        }
        .op-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 12px;
        }
        .op-metric {
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 8px;
          padding: 9px 10px;
          box-shadow: 0 1px 0 rgba(49,36,24,.04);
        }
        .op-value {
          font-weight: 640;
          color: #211b16;
          letter-spacing: -.01em;
        }
        .op-label {
          font-size: 11px;
          color: #756a61;
          margin-top: 2px;
        }
        .announce {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          padding: 8px;
          border-radius: 12px;
          margin-bottom: 12px;
          box-shadow: 0 1px 0 rgba(49,36,24,.04);
        }
        .announce input {
          height: 36px;
          border: 1px solid #e2d3c4;
          background: #fffdf9;
          border-radius: 8px;
          padding: 0 11px;
          outline: none;
          color: #3a332d;
        }
        .announce input:focus {
          border-color: #d99375;
        }
        .priority-strip {
          display: grid;
          grid-template-columns: 1.25fr .9fr .9fr;
          gap: 9px;
          margin: 0 0 12px;
        }
        .priority-card {
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 12px;
          padding: 10px 11px;
          box-shadow: 0 1px 0 rgba(49,36,24,.04),0 12px 28px rgba(217,91,53,.08);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          min-width: 0;
        }
        .priority-card.primary {
          border-color: #e3b197;
          background: linear-gradient(180deg,#fffaf5 0%,#fff3eb 100%);
        }
        .priority-card.ready {
          border-color: #bddbcc;
          background: #f4fbf7;
        }
        .priority-card.warn {
          border-color: #e1c486;
          background: #fff8e8;
        }
        .priority-kicker {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 650;
          color: #75675d;
          text-transform: uppercase;
          letter-spacing: .045em;
          margin-bottom: 4px;
        }
        .priority-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #d95b35;
          box-shadow: 0 0 0 3px rgba(217,91,53,.1);
        }
        .priority-card.ready .priority-dot {
          background: #2f8066;
          box-shadow: 0 0 0 3px rgba(47,128,102,.1);
        }
        .priority-card.warn .priority-dot {
          background: #a97619;
          box-shadow: 0 0 0 3px rgba(169,118,25,.12);
        }
        .priority-title {
          font-size: 13px;
          font-weight: 640;
          color: #211b16;
          letter-spacing: -.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .priority-copy {
          font-size: 12px;
          color: #756a61;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .priority-action {
          height: 29px;
          border-radius: 999px;
          border: 1px solid #d1bdae;
          background: #fffdf9;
          color: #3a312a;
          padding: 0 10px;
          font-size: 11px;
          font-weight: 590;
          white-space: nowrap;
        }
        .priority-card.primary .priority-action {
          background: #d95b35;
          border-color: #d95b35;
          color: #fff;
        }
        .priority-action:hover {
          filter: brightness(.98);
        }
        .floor-filter {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-wrap: wrap;
          margin-bottom: 13px;
        }
        .filter-label {
          font-size: 11px;
          color: #756a61;
          font-weight: 580;
          margin-right: 2px;
        }
        .filter {
          border: 1px solid #e2d3c4;
          background: #fffaf4;
          border-radius: 999px;
          height: 28px;
          padding: 0 10px;
          font-size: 12px;
          font-weight: 540;
          color: #564b43;
          transition: all 0.1s ease;
        }
        .filter:hover {
          background: #fbf3ea;
        }
        .filter.active {
          border-color: #d49a83;
          color: #9d3d25;
          background: #fff3ed;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 1px solid #e2d3c4;
          background: #fffaf4;
          border-radius: 999px;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 560;
          color: #514941;
          white-space: nowrap;
        }
        .pill.blue {
          background: #edf3f5;
          border-color: #cad9df;
          color: #435f6f;
        }
        .pill.orange {
          background: #fff0e8;
          border-color: #ecc0ae;
          color: #94402a;
        }
        .court-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(520px, 100%), 1fr));
          gap: 12px;
        }
        .court-card {
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 0 rgba(49,36,24,.04),0 14px 34px rgba(49,36,24,.035);
          position: relative;
          min-width: 0;
          transition: all .14s ease;
        }
        .court-card:hover {
          border-color: #d3bfaf;
          box-shadow: 0 16px 38px rgba(49,36,24,.09);
          transform: translateY(-2px);
        }
        .court-card.selected {
          outline: 3px solid rgba(33,27,22,.10);
          border-color: #9c6d56;
        }
        .court-card.call-ready {
          border-color: #d9a58f;
          background: #fff8f2;
        }
        .court-card.call-ready:before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 4px;
          background: #d95b35;
        }
        .court-card.queue-ready {
          border-color: #dfc282;
          background: #fffaf0;
        }
        .court-card.queue-ready:before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 4px;
          background: #a97619;
        }
        .court-card.critical {
          border-color: #b84a2f;
          background: linear-gradient(180deg,#fff7ef 0%,#fff0e7 100%);
          box-shadow: 0 0 0 3px rgba(184,74,47,.12),0 18px 44px rgba(184,74,47,.14);
        }
        .court-card.critical:after {
          content: "TIME LOW";
          position: absolute;
          top: 10px;
          right: 78px;
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 760;
          letter-spacing: .08em;
          color: #fff;
          background: #b84a2f;
          border-radius: 999px;
          padding: 3px 7px;
          box-shadow: 0 5px 14px rgba(184,74,47,.25);
        }
        .court-card.open-ready {
          border-color: #c84f2f;
          background: linear-gradient(180deg,#fff8f2 0%,#ffefe6 100%);
          box-shadow: 0 0 0 3px rgba(217,91,53,.12),0 18px 42px rgba(217,91,53,.10);
        }
        .court-card.open-ready .court-head {
          background: #fff0e8;
        }
        .court-card.open-ready:after {
          content: "CALL NOW";
          position: absolute;
          top: 10px;
          right: 78px;
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 760;
          letter-spacing: .08em;
          color: #fff;
          background: #211b16;
          border-radius: 999px;
          padding: 3px 7px;
        }
        .court-head {
          padding: 12px 13px 10px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          border-bottom: 1px solid #e2d3c4;
          background: #fffdf9;
          align-items: flex-start;
        }
        .court-title {
          font-weight: 640;
          font-size: 15px;
          letter-spacing: -.015em;
          color: #211b16;
        }
        .court-sub {
          color: #756a61;
          font-size: 12px;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .court-left-meta {
          display: inline-flex;
          align-items: center;
          margin-top: 5px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 650;
          color: #8b6f62;
          background: #fff6ef;
          border: 1px solid #efd1c3;
          border-radius: 999px;
          padding: 2px 7px;
        }
        .court-card.critical .court-left-meta {
          background: #b84a2f;
          color: white;
          border-color: #b84a2f;
          animation: hardBlink 1s steps(2,end) infinite;
        }
        @keyframes hardBlink {
          50% { filter: brightness(1.24); }
        }
        .court-status {
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }
        .status {
          font-size: 10px;
          font-weight: 760;
          border-radius: 999px;
          padding: 3px 7px;
          border: 1px solid transparent;
          line-height: 1.2;
          text-transform: capitalize;
          letter-spacing: .02em;
        }
        .status.live {
          background: #e8f8f0;
          color: #145441;
          border-color: #a9d9c5;
        }
        .status.ending {
          background: #fff0d0;
          color: #6d4300;
          border-color: #dfa749;
        }
        .status.open {
          background: #ecf5f8;
          color: #365c6b;
          border-color: #bdd4dd;
        }
        .court-index {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #9b8f85;
          padding-top: 4px;
        }
        .court-alert {
          margin: 10px 13px 0;
          border: 1px solid #e2d3c4;
          border-radius: 9px;
          padding: 8px 9px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: #fffdf9;
        }
        .court-alert.ready {
          background: #fff1e8;
          border-color: #e5b6a0;
          color: #7b3726;
        }
        .court-alert.warn {
          background: #fff7df;
          border-color: #dfc282;
          color: #6e4d07;
        }
        .court-alert.ok {
          background: #eef8f3;
          border-color: #c6e1d4;
          color: #235f4c;
        }
        .alert-main {
          min-width: 0;
        }
        .alert-title {
          font-size: 12px;
          font-weight: 650;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .alert-sub {
          font-size: 11px;
          color: currentColor;
          opacity: .72;
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .alert-badge {
          font-family: var(--font-mono);
          font-size: 10px;
          border: 1px solid currentColor;
          border-radius: 999px;
          padding: 2px 6px;
          opacity: .72;
          white-space: nowrap;
        }
        .section {
          padding: 12px 13px;
          border-bottom: 1px solid #e2d3c4;
        }
        .section-title {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
        }
        .live-label {
          display: block !important;
          position: static !important;
          font-size: 11px !important;
          color: #73675e !important;
          font-weight: 620 !important;
          line-height: 1.4 !important;
          margin: 0 !important;
          letter-spacing: normal !important;
        }
        .live-hint {
          display: block !important;
          position: static !important;
          font-size: 11px !important;
          color: #8d8177 !important;
          line-height: 1.4 !important;
          margin: 0 !important;
          letter-spacing: normal !important;
        }
        .score-toggle {
          height: 25px;
          border-radius: 999px;
          border: 1px solid #e2d3c4;
          background: #fffaf6;
          color: #80695e;
          padding: 0 8px;
          font-size: 11px;
          font-weight: 560;
          line-height: 23px;
        }
        .score-toggle.on {
          background: #fff1ea;
          border-color: #ecc0ae;
          color: #9d3d25;
        }
        .match-box {
          background: #fffdf9;
          border: 1px solid #d8c4b4;
          border-radius: 10px;
          padding: 14px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.75);
        }
        .match-row {
          display: grid;
          grid-template-columns: 1fr 148px 1fr;
          gap: 15px;
          align-items: center;
          text-align: center;
        }
        .team {
          min-width: 0;
          display: grid;
          gap: 6px;
          justify-items: center;
        }
        .avatars {
          height: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid #fffdf9;
          color: #352d26;
          display: grid;
          place-items: center;
          font-size: 12px;
          font-weight: 760;
          margin-left: -8px;
          box-shadow: 0 0 0 1px #d8c8bb, 0 8px 18px rgba(49,36,24,.10);
          transition: transform .14s ease, box-shadow .14s ease;
          position: relative;
          overflow: hidden;
        }
        .avatar:first-child {
          margin-left: 0;
        }
        .avatar:hover {
          transform: translateY(-2px) scale(1.06);
          box-shadow: 0 0 0 1px #caa990, 0 12px 22px rgba(49,36,24,.14);
          z-index: 5;
        }
        .avatar.tone-a { background: linear-gradient(145deg,#f8e1d7,#d95b35); color: #4d1d12; }
        .avatar.tone-b { background: linear-gradient(145deg,#e8f5ee,#2f8066); color: #143f32; }
        .avatar.tone-c { background: linear-gradient(145deg,#e8eef1,#617987); color: #203946; }
        .avatar.tone-d { background: linear-gradient(145deg,#fff1c9,#a97619); color: #4d3603; }
        .avatar.tone-e { background: linear-gradient(145deg,#f1e6f4,#8d6aa0); color: #3f2e4e; }
        
        .names {
          font-size: 13px;
          font-weight: 680;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          color: #211b16;
        }
        .timer {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 112px;
          padding: 7px 10px 8px;
          border-radius: 13px;
          background: #211b16;
          color: #fff7e8;
          font-size: 37px;
          font-weight: 760;
          line-height: .95;
          letter-spacing: -.075em;
          box-shadow: inset 0 -10px 18px rgba(255,255,255,.035),0 9px 22px rgba(33,27,22,.18);
          font-family: var(--font-mono);
        }
        .timer.live { background: #1f5f4b; color: #eafff5; }
        .timer.ending, .timer.soon { background: #7b4f08; color: #fff3c4; }
        .timer.critical {
          background: #b84a2f;
          color: #fff;
          animation: timerBang .8s ease-in-out infinite;
          box-shadow: 0 0 0 4px rgba(184,74,47,.14), 0 12px 26px rgba(184,74,47,.22);
        }
        .timer.open { background: #435f6f; color: #f1fbff; }
        @keyframes timerBang {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.035); }
        }
        .time-label {
          font-size: 11px;
          color: #6c5e54;
          font-weight: 720;
          margin-top: 3px;
          text-transform: uppercase;
          letter-spacing: .045em;
        }
        .set-line {
          margin-top: 7px;
          font-size: 11px;
          color: #6d625b;
          font-weight: 560;
          display: flex;
          justify-content: center;
          gap: 5px;
          align-items: center;
        }
        .set-pill {
          font-family: var(--font-mono);
          background: #fffaf4;
          border: 1px solid #d1bdae;
          border-radius: 6px;
          padding: 2px 6px;
          color: #312b27;
          font-weight: 560;
        }
        .score-area {
          margin-top: 11px;
          padding-top: 10px;
          border-top: 1px solid #e2d3c4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }
        .record-label {
          font-size: 11px;
          color: #7e7167;
          font-weight: 620;
        }
        .scoreline {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .score-input {
          width: 44px;
          height: 32px;
          border: 1px solid #d1bdae;
          border-radius: 8px;
          background: #fffaf4;
          text-align: center;
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 580;
          outline: none;
        }
        .dash {
          color: #a29286;
          font-weight: 650;
        }
        .ghost-button {
          height: 29px;
          border: 1px solid #d1bdae;
          background: #fffaf4;
          border-radius: 999px;
          padding: 0 10px;
          font-weight: 560;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .ghost-button:hover {
          background: #fbf3ea;
        }
        .available-box {
          border: 1px dashed #d7c5b7;
          border-radius: 10px;
          background: #fffdf9;
          min-height: 128px;
          display: grid;
          place-items: center;
          text-align: center;
          color: #83756b;
          padding: 16px;
        }
        .available-box strong {
          display: block;
          color: #2b241f;
          margin: 4px 0;
          font-weight: 620;
          font-size: 16px;
          letter-spacing: -.02em;
        }
        .queue {
          padding: 11px 13px;
          border-bottom: 1px solid #e2d3c4;
          background: linear-gradient(180deg,#fffaf5 0%,#fff7ef 100%);
        }
        .queue-list {
          display: grid;
          gap: 6px;
        }
        .queue-row {
          display: grid;
          grid-template-columns: 31px minmax(0,1fr) auto;
          gap: 8px;
          align-items: start;
          border: 1px solid #e2d3c4;
          border-radius: 10px;
          padding: 10px;
          background: #fffdf9;
          transition: all 0.12s ease;
          cursor: pointer;
        }
        .queue-row:hover {
          transform: translateX(2px);
          border-color: #cfa08d;
          background: #fff3ec;
          box-shadow: 0 7px 18px rgba(49,36,24,.06);
        }
        .queue-row.first {
          background: #fff1e8;
          border-color: #d95b35;
          box-shadow: inset 4px 0 0 #d95b35;
        }
        .queue-row.first .queue-title {
          font-weight: 760;
          color: #211b16;
        }
        .queue-number {
          font-family: var(--font-mono);
          font-size: 12px;
          background: #211b16;
          color: #fff;
          border-radius: 999px;
          height: 23px;
          display: grid;
          place-items: center;
          padding: 0;
          margin-top: 1px;
        }
        .queue-row.first .queue-number {
          color: #fff;
          background: #d95b35;
        }
        .queue-main {
          min-width: 0;
        }
        .queue-title {
          font-size: 12px;
          font-weight: 590;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #332c27;
        }
        .queue-sub {
          font-size: 11px;
          color: #7c7068;
          margin-top: 1px;
          font-weight: 560;
        }
        .queue-chip {
          justify-self: end;
          align-self: center;
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 760;
          letter-spacing: .055em;
          color: #7c3422;
          background: #ffe5d8;
          border: 1px solid #e9b39c;
          border-radius: 999px;
          padding: 3px 6px;
        }
        .mini-avatars {
          display: flex;
          margin-top: 8px;
        }
        .mini-avatars .avatar {
          width: 28px;
          height: 28px;
          font-size: 8px;
          border-width: 2px;
          margin-left: -5px;
          box-shadow: 0 0 0 1px #d8c8bb,0 5px 10px rgba(49,36,24,.08);
        }
        .schedule {
          padding: 11px 13px;
          border-bottom: 1px solid #e2d3c4;
        }
        .slot-row {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          scrollbar-width: thin;
          padding-bottom: 2px;
        }
        .slot {
          min-width: 132px;
          border: 1px solid #e2d3c4;
          border-radius: 8px;
          background: #fffdf9;
          padding: 8px;
        }
        .slot.current {
          border-color: #dea68e;
          background: #fff5ee;
        }
        .slot.past {
          opacity: .54;
        }
        .slot-time {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 560;
        }
        .slot-tag {
          float: right;
          font-size: 10px;
          color: #7d7168;
          font-weight: 560;
          margin-top: 1px;
          text-transform: capitalize;
        }
        .slot-match {
          font-size: 11px;
          color: #685d55;
          margin-top: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-actions {
          padding: 10px 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: space-between;
          background: #fffdf9;
        }
        .action-left, .action-right {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .btn-small {
          height: 30px;
          padding: 0 10px;
          font-size: 12px;
          border-radius: 7px;
        }
        .btn-primary {
          background: #d95b35;
          border-color: #d95b35;
          color: white;
          font-weight: 680;
          box-shadow: 0 7px 16px rgba(217,91,53,.12);
        }
        .btn-primary.is-hot {
          animation: buttonPulse 1.25s ease-in-out infinite;
          box-shadow: 0 0 0 4px rgba(217,91,53,.14),0 10px 22px rgba(217,91,53,.18);
        }
        @keyframes buttonPulse {
          0%,100% { transform: translateY(0) }
          50% { transform: translateY(-1px) }
        }
        .btn-quiet {
          background: transparent;
          border-color: transparent;
          color: #756a61;
        }
        .btn {
          height: 34px;
          border: 1px solid #d1bdae;
          background: #fffaf4;
          border-radius: 8px;
          padding: 0 12px;
          font-size: 12px;
          font-weight: 560;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #332b25;
          white-space: nowrap;
          transition: all 0.12s ease;
        }
        .btn:hover {
          background: #fff5ed;
          border-color: #c8ae9b;
        }
        
        /* Right rail styling */
        .right-rail {
          min-width: 0;
          display: grid;
          gap: 12px;
          align-self: start;
        }
        .rail-card {
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 16px;
          box-shadow: 0 1px 0 rgba(49,36,24,.04);
          overflow: hidden;
        }
        .rail-head {
          padding: 12px 13px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          border-bottom: 1px solid #e2d3c4;
          background: #fffdf9;
        }
        .rail-title {
          font-size: 14px;
          font-weight: 640;
          letter-spacing: -.015em;
          color: #211b16;
        }
        .rail-sub {
          font-size: 12px;
          color: #756a61;
          margin-top: 2px;
          font-weight: 440;
        }
        .rail-body {
          padding: 12px 13px;
          display: grid;
          gap: 10px;
        }
        .rail-label {
          display: block;
          font-size: 11px;
          color: #73675e;
          font-weight: 620;
          margin-bottom: 5px;
        }
        .rail-select, .rail-input {
          width: 100%;
          height: 34px;
          border: 1px solid #d1bdae;
          background: #fffdf9;
          border-radius: 8px;
          padding: 0 10px;
          outline: none;
          color: #332c27;
        }
        .rail-select:focus, .rail-input:focus {
          border-color: #d99375;
        }
        .rail-form {
          display: grid;
          gap: 7px;
        }
        .rail-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }
        .rail-divider {
          height: 1px;
          background: #e2d3c4;
          margin: 2px 0;
        }
        .rail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .rail-note {
          font-size: 11px;
          color: #7b7068;
          line-height: 1.35;
        }
        .player-pool {
          display: grid;
          gap: 6px;
          max-height: 168px;
          overflow: auto;
          padding-right: 2px;
          scrollbar-width: thin;
        }
        .pool-row {
          height: 33px;
          border: 1px solid #e2d3c4;
          background: #fffdf9;
          border-radius: 8px;
          padding: 0 8px;
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }
        .pool-row input {
          accent-color: #d95b35;
        }
        .pool-name {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #3a312a;
        }
        .pool-rating {
          margin-left: auto;
          font-family: var(--font-mono);
          font-size: 10px;
          color: #7d7168;
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 999px;
          padding: 1px 6px;
        }
        .rail-queue-list {
          display: grid;
          gap: 7px;
        }
        .rail-queue-row {
          border: 1px solid #e2d3c4;
          background: #fffdf9;
          border-radius: 8px;
          padding: 9px;
          display: grid;
          gap: 7px;
        }
        .rail-queue-row.next {
          border-color: #e1b39f;
          background: #fff5ef;
          box-shadow: inset 4px 0 0 #d95b35;
        }
        .rail-queue-top {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .rail-num {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #6d625b;
          font-weight: 560;
          min-width: 17px;
          text-align: center;
          padding-top: 1px;
        }
        .rail-match {
          font-size: 12px;
          font-weight: 580;
          line-height: 1.28;
          min-width: 0;
          color: #312a24;
        }
        .rail-match small {
          display: block;
          color: #7b7068;
          font-size: 11px;
          font-weight: 440;
          margin-top: 3px;
        }
        .rail-queue-actions {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
        }
        .ticker-list {
          display: grid;
          gap: 7px;
        }
        .ticker-item {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 8px;
          border-top: 1px solid #e2d3c4;
          padding-top: 7px;
          font-size: 11px;
          color: #6f645d;
        }
        .ticker-item:first-child {
          border-top: 0;
          padding-top: 0;
        }
        .ticker-kind {
          font-family: var(--font-mono);
          font-weight: 560;
          color: #9d3d25;
          font-size: 10px;
        }
        .ticker-text {
          min-width: 0;
          line-height: 1.3;
        }
        .empty-state {
          border: 1px dashed #d1bdae;
          border-radius: 8px;
          background: #fffdf9;
          padding: 12px;
          text-align: center;
          color: #85776e;
          font-size: 12px;
        }
        
        .rail-highlight {
          display: grid;
          grid-template-columns: 10px minmax(0, 1fr) auto;
          gap: 8px;
          align-items: center;
          border: 1px solid #e2d3c4;
          border-radius: 9px;
          background: #fffdf9;
          padding: 8px;
        }
        .rail-highlight.hot {
          border-color: #e2aa93;
          background: #fff4ee;
          box-shadow: inset 4px 0 0 #d95b35;
        }
        .rail-highlight.warn {
          border-color: #ddc07e;
          background: #fff8e6;
        }
        .rail-highlight.ready {
          border-color: #c1ddce;
          background: #f2faf6;
        }
        .rail-hit-dot {
          width: 8px;
          height: 8px;
          border-radius: 99px;
          background: #9c8d80;
        }
        .rail-highlight.hot .rail-hit-dot { background: #d95b35; }
        .rail-highlight.warn .rail-hit-dot { background: #a97619; }
        .rail-highlight.ready .rail-hit-dot { background: #2f8066; }
        .rail-hit-title {
          font-size: 12px;
          font-weight: 640;
          color: #211b16;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rail-hit-sub {
          font-size: 11px;
          color: #756a61;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 1px;
        }
        .rail-hit-btn {
          height: 26px;
          border: 1px solid #d1bdae;
          background: #fffdf9;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 590;
          padding: 0 8px;
          white-space: nowrap;
        }
        .rail-highlight.hot .rail-hit-btn {
          background: #d95b35;
          border-color: #d95b35;
          color: #fff;
        }
        
        .toast {
          position: fixed;
          right: 24px;
          bottom: 22px;
          background: #211b16;
          color: white;
          border-radius: 10px;
          padding: 10px 12px;
          box-shadow: 0 14px 30px rgba(0,0,0,.16);
          font-weight: 560;
          transform: translateY(16px);
          opacity: 0;
          pointer-events: none;
          transition: .18s ease;
          z-index: 50;
        }
        .toast.show {
          transform: translateY(0);
          opacity: 1;
        }
      ` }} />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 w-full items-start">
        {/* Left Side: Operations */}
        <div className="flex flex-col gap-3 min-w-0">
          <section className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 mb-2">
            <div>
              <div className="eyebrow">Kadıköy club desk</div>
              <h1>Courts are live, queue is flowing</h1>
              <div className="subline">Kadıköy desk flow: court, queue, and lobby display in one rhythm.</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-small" onClick={() => notify("Courts refreshed")}>
                Sync
              </button>
              <button className="btn btn-small" onClick={() => notify("Focus mode activated")}>
                Desk focus
              </button>
            </div>
          </section>

          {/* Floor metrics strip */}
          <section className="op-strip">
            <div className="op-metric">
              <div className="op-value">{liveCount} courts live</div>
              <div className="op-label">Current play</div>
            </div>
            <div className="op-metric">
              <div className="op-value">{waitingCount} waiting</div>
              <div className="op-label">Across desk queue</div>
            </div>
            <div className="op-metric">
              <div className="op-value">Next opening ~14m</div>
              <div className="op-label">Projected from timers</div>
            </div>
            <div className="op-metric">
              <div className="op-value">TV synced</div>
              <div className="op-label">Lobby display online</div>
            </div>
          </section>

          {/* Announcement Bar */}
          <section className="announce">
            <input
              id="announceInput"
              placeholder="Lobby announcement..."
              value={lobbyAnnouncement}
              onChange={(e) => setLobbyAnnouncement(e.target.value)}
              className="flex-1"
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                notify(lobbyAnnouncement ? `TV: ${lobbyAnnouncement}` : "Announcement text is empty");
                setLobbyAnnouncement("");
              }}
            >
              Send to TV
            </button>
          </section>

          {/* Priority Highlights Strip */}
          <section className="priority-strip" aria-label="Desk highlights">
            {getPriorityCards().map((h, i) => (
              <article key={i} className={cx("priority-card", h.tone)}>
                <div className="min-w-0">
                  <div className="priority-kicker">
                    <span className="priority-dot" />
                    {h.kicker}
                  </div>
                  <div className="priority-title">{h.title}</div>
                  <div className="priority-copy">{h.copy}</div>
                </div>
                <button
                  className="priority-action animate-pulse"
                  onClick={() => h.callId && callNext(h.callId)}
                >
                  {h.action}
                </button>
              </article>
            ))}
          </section>

          {/* Filters Bar */}
          <section className="floor-filter">
            <span className="filter-label">View</span>
            {[
              { id: "all", label: "All courts" },
              { id: "live", label: "Live" },
              { id: "ending", label: "Ending soon" },
              { id: "open", label: "Open" },
              { id: "waiting", label: "Has queue" },
            ].map((f) => (
              <button
                key={f.id}
                className={cx("filter", activeFilter === f.id && "active")}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
            <span className="pill blue">Hybrid queue</span>
          </section>

          {/* Courts Grid */}
          <section className="court-grid">
            {filteredCourts.map((c) => {
              const alert = getCourtAlert(c);
              const urgency = getUrgencyClass(c);
              const isScoreOn = scoreToggles[c.id];

              return (
                <article
                  key={c.id}
                  className={cx(
                    "court-card",
                    c.status,
                    urgency,
                    selectedCourtId === c.id && "selected"
                  )}
                  onClick={(e) => {
                    // Prevent select on clicking buttons or inputs
                    if ((e.target as HTMLElement).closest("button, input")) return;
                    setSelectedCourtId(c.id);
                    notify(`Court ${c.id} selected`);
                  }}
                >
                  <header className="court-head">
                    <div>
                      <div className="court-title">{c.title}</div>
                      <div className="court-sub">{c.type}</div>
                      <span className="court-left-meta">{getLeftMeta(c)}</span>
                    </div>
                    <div className="court-status">
                      <span className={cx("status", c.status)}>
                        {c.status === "ending" ? "ending soon" : c.status}
                      </span>
                      <span className="court-index">#{String(c.id).padStart(2, "0")}</span>
                    </div>
                  </header>

                  {/* Court Alert Panel */}
                  {alert && (
                    <div className={cx("court-alert", alert.type)}>
                      <div className="alert-main">
                        <div className="alert-title">{alert.title}</div>
                        <div className="alert-sub">{alert.sub}</div>
                      </div>
                      <span className="alert-badge">{alert.badge}</span>
                    </div>
                  )}

                  {/* Now Playing Panel */}
                  <section className="section">
                    <div className="section-title">
                      <div>
                        <div className="live-label">Now playing</div>
                        <div className="live-hint font-medium">Timer syncs to lobby display</div>
                      </div>
                      <button
                        className={cx("score-toggle", isScoreOn && "on")}
                        onClick={() =>
                          setScoreToggles((prev) => ({ ...prev, [c.id]: !prev[c.id] }))
                        }
                      >
                        {isScoreOn ? "Score on" : "Score off"}
                      </button>
                    </div>

                    {c.status === "open" ? (
                      <div className="available-box">
                        <div>
                          <span className="live-label">Available now</span>
                          <strong>Ready for next match</strong>
                          <div className="text-xs text-[#756a61] mt-1">
                            {c.queue[0]?.match || "No match waiting"}
                          </div>
                          <div className="text-[11px] text-[#9b8f85] mt-0.5">
                            {c.queue[0]?.sub || "Keep court open"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="match-box">
                        <div className="match-row">
                          {/* Team 1 */}
                          <div className="team">
                            <div className="avatars">
                              {c.teams[0].map((p, idx) => (
                                <span
                                  key={idx}
                                  className={cx("avatar", tones[idx % tones.length])}
                                  title={p}
                                >
                                  {getInitials(p)}
                                </span>
                              ))}
                            </div>
                            <div className="names">{c.teams[0].join(" / ") || "—"}</div>
                          </div>

                          {/* Timer & Set Info */}
                          <div className="clock flex flex-col items-center">
                            <div className={cx("timer", getTimerClass(c))}>{fmt(c.timer)}</div>
                            <div className="time-label">{getTimerLabel(c)}</div>
                            <button
                              className="btn btn-small mt-1 px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#f3e7dc] text-[#554b42]"
                              onClick={() => togglePause(c.id)}
                            >
                              {pausedCourts[c.id] ? "▶ Resume" : "⏸ Pause"}
                            </button>
                            <div className="set-line mt-1">
                              Set <span className="set-pill">{c.set}</span>
                            </div>
                          </div>

                          {/* Team 2 */}
                          <div className="team">
                            <div className="avatars">
                              {c.teams[1].map((p, idx) => (
                                <span
                                  key={idx}
                                  className={cx("avatar", tones[(idx + 2) % tones.length])}
                                  title={p}
                                >
                                  {getInitials(p)}
                                </span>
                              ))}
                            </div>
                            <div className="names">{c.teams[1].join(" / ") || "—"}</div>
                          </div>
                        </div>

                        {/* LIVE-003 Score Adjuster with +/- Buttons */}
                        <div className="score-area mt-3 pt-3 border-t border-[#e2d3c4]/60 flex flex-col items-center gap-1.5 w-full">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#73675e]">Live match score</span>
                            <div className="flex items-center gap-2">
                              {undoCourtId === c.id && (
                                <button
                                  className="text-[10px] text-amber-700 font-extrabold hover:underline"
                                  onClick={handleUndoScore}
                                >
                                  Undo (5s)
                                </button>
                              )}
                              <button
                                className="text-[10px] text-[#9d3d25] font-bold hover:underline"
                                onClick={() => {
                                  setSwapSidesCourtId(c.id);
                                  setShowSwapSidesConfirm(true);
                                }}
                              >
                                Swap Sides
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 justify-center w-full">
                            {/* Team 1 Score Adjuster */}
                            <div className="flex items-center gap-1">
                              <button
                                className="w-7 h-7 rounded-full bg-[#f2e7dc] text-[#211b16] font-black text-sm flex items-center justify-center hover:bg-[#ebdcd0]"
                                onClick={() => adjustScore(c.id, 0, -1)}
                              >
                                –
                              </button>
                              <span className="font-mono text-xl font-black w-6 text-center tabular-nums">{c.score[0]}</span>
                              <button
                                className="w-7 h-7 rounded-full bg-[#f2e7dc] text-[#211b16] font-black text-sm flex items-center justify-center hover:bg-[#ebdcd0]"
                                onClick={() => adjustScore(c.id, 0, 1)}
                              >
                                +
                              </button>
                            </div>

                            <span className="text-sm font-bold text-[#bfaea0]">:</span>

                            {/* Team 2 Score Adjuster */}
                            <div className="flex items-center gap-1">
                              <button
                                className="w-7 h-7 rounded-full bg-[#f2e7dc] text-[#211b16] font-black text-sm flex items-center justify-center hover:bg-[#ebdcd0]"
                                onClick={() => adjustScore(c.id, 1, -1)}
                              >
                                –
                              </button>
                              <span className="font-mono text-xl font-black w-6 text-center tabular-nums">{c.score[1]}</span>
                              <button
                                className="w-7 h-7 rounded-full bg-[#f2e7dc] text-[#211b16] font-black text-sm flex items-center justify-center hover:bg-[#ebdcd0]"
                                onClick={() => adjustScore(c.id, 1, 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Waiting rotation on this court */}
                  <section className="queue">
                    <div className="section-title">
                      <div className="live-label">Waiting on this court ({c.queue.length})</div>
                      {c.queue.length > 0 && (
                        <span className="pill orange">ready</span>
                      )}
                    </div>
                    <div className="queue-list">
                      {c.queue.length > 0 ? (
                        c.queue.map((q, idx) => (
                          <div
                            key={idx}
                            className={cx("queue-row", idx === 0 && "first")}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCourtId(c.id);
                              notify(`Queue #${idx + 1} selected`);
                            }}
                          >
                            <div className="queue-number">{idx + 1}</div>
                            <div className="queue-main">
                              <div className="queue-title">{q.match}</div>
                              <div className="queue-sub">{q.sub}</div>
                              <div className="mini-avatars">
                                {q.players.map((p, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className={cx("avatar", tones[pIdx % tones.length])}
                                    title={p}
                                  >
                                    {getInitials(p)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="queue-chip">{idx === 0 ? "NEXT" : "WAIT"}</span>
                          </div>
                        ))
                      ) : (
                        <div className="queue-row pointer-events-none">
                          <div className="queue-number">—</div>
                          <div className="queue-main">
                            <div className="queue-title">No one waiting</div>
                            <div className="queue-sub">Court can stay open after this match</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Hourly Schedule */}
                  <section className="schedule">
                    <div className="section-title">
                      <div className="live-label">Hourly schedule</div>
                    </div>
                    <div className="slot-row">
                      {c.slots.map((s, idx) => (
                        <div key={idx} className={cx("slot", s[1])}>
                          <div>
                            <span className="slot-time">{s[0]}</span>
                            <span className="slot-tag">{s[1]}</span>
                          </div>
                          <div className="slot-match">{s[2]}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Card Actions */}
                  <footer className="card-actions">
                    <div className="action-left">
                      <button
                        className="btn btn-small"
                        onClick={() => {
                          setCourts((prevCourts) =>
                            prevCourts.map((court) =>
                              court.id === c.id
                                ? { ...court, timer: court.timer + 300, status: court.status === "open" ? "live" : court.status }
                                : court
                            )
                          );
                          notify(`${c.title}: +5 minutes added`);
                        }}
                      >
                        +5 min
                      </button>
                      {c.status === "open" ? (
                        <button
                          className={cx("btn btn-primary btn-small", c.queue.length > 0 && "is-hot")}
                          onClick={() => openCallNextModal(c.id)}
                        >
                          Call players
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-small bg-[#d95b35] text-white"
                          onClick={() => openEndSetModal(c.id)}
                        >
                          End Set
                        </button>
                      )}
                    </div>
                    <div className="action-right">
                      <button className="btn btn-small" onClick={() => notify(`${c.title} lobby preview ready`)}>
                        Preview
                      </button>
                    </div>
                  </footer>
                </article>
              );
            })}
          </section>
        </div>

        {/* Right Side: Right Rail (Highlights + Queue Control) */}
        <div className="right-rail">
          {/* Desk Highlights */}
          <section className="rail-card">
            <header className="rail-head">
              <div>
                <div className="rail-title">Desk highlights</div>
                <div className="rail-sub font-medium">Only what needs attention</div>
              </div>
            </header>
            <div className="rail-body">
              <div className="rail-highlight-list flex flex-col gap-2">
                {readyCourt && (
                  <div className="rail-highlight hot">
                    <span className="rail-hit-dot" />
                    <div className="min-w-0">
                      <div className="rail-hit-title">{readyCourt.title} open</div>
                      <div className="rail-hit-sub">{readyCourt.queue[0].match}</div>
                    </div>
                    <button className="rail-hit-btn" onClick={() => callNext(readyCourt.id)}>
                      Call
                    </button>
                  </div>
                )}
                {endingCourt && (
                  <div className="rail-highlight warn">
                    <span className="rail-hit-dot" />
                    <div className="min-w-0">
                      <div className="rail-hit-title">
                        {endingCourt.title} · {fmt(endingCourt.timer)}
                      </div>
                      <div className="rail-hit-sub">
                        {endingCourt.queue.length ? endingCourt.queue[0].match : "No pinned queue"}
                      </div>
                    </div>
                    <button className="rail-hit-btn" onClick={() => setSelectedCourtId(endingCourt.id)}>
                      View
                    </button>
                  </div>
                )}
                <div className="rail-highlight ready">
                  <span className="rail-hit-dot" />
                  <div className="min-w-0">
                    <div className="rail-hit-title">TV display synced</div>
                    <div className="rail-hit-sub">Lobby board receives desk announcements</div>
                  </div>
                  <button className="rail-hit-btn" onClick={() => notify("TV display synced")}>
                    OK
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Desk Queue Controller */}
          <section className="rail-card">
            <header className="rail-head flex items-center justify-between w-full">
              <div>
                <div className="rail-title">Desk queue</div>
                <div className="rail-sub font-medium">Hybrid: global queue + court pin</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  className="btn btn-small px-2 py-1 text-[10px] font-extrabold rounded-[6px] bg-[#f04f2a] text-white hover:bg-[#b83a22] transition-colors"
                  onClick={() => setShowAddQueueDrawer(true)}
                >
                  + Add to Queue
                </button>
                <span className="pill orange font-mono text-[10px]">{waitingCount} waiting</span>
              </div>
            </header>
            <div className="rail-body">
              {/* Target Court Select */}
              <div>
                <label className="rail-label">Target court</label>
                <select
                  className="rail-select"
                  value={selectedCourtId}
                  onChange={(e) => setSelectedCourtId(Number(e.target.value))}
                >
                  {courts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} · {c.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Walk-in Player Form */}
              <div className="rail-form">
                <label className="rail-label">Walk-in player</label>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <input
                    className="rail-input"
                    placeholder="Name / member..."
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                  />
                  <button className="btn btn-small" onClick={addWalkIn}>
                    Add
                  </button>
                </div>
              </div>

              {/* Quick Pair Form */}
              <div className="rail-form">
                <div className="rail-row">
                  <span className="rail-label">Quick pair</span>
                  <span className="rail-note font-medium">queue direct</span>
                </div>
                <div className="rail-two">
                  <input
                    className="rail-input"
                    placeholder="Player A"
                    value={quickPairA}
                    onChange={(e) => setQuickPairA(e.target.value)}
                  />
                  <input
                    className="rail-input"
                    placeholder="Player B"
                    value={quickPairB}
                    onChange={(e) => setQuickPairB(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary btn-small w-full" onClick={addQuickPair}>
                  Add pair
                </button>
              </div>

              <div className="rail-divider" />

              {/* Available Players Pool */}
              <div className="rail-row">
                <span className="rail-label">Available players</span>
                <span className="pill blue">
                  {playerPool.filter((p) => p.checked).length} selected
                </span>
              </div>
              <div className="player-pool flex flex-col gap-1">
                {playerPool.length > 0 ? (
                  playerPool.map((p, idx) => (
                    <label key={idx} className="pool-row">
                      <input
                        type="checkbox"
                        checked={p.checked}
                        onChange={(e) => {
                          const nextPool = [...playerPool];
                          nextPool[idx].checked = e.target.checked;
                          setPlayerPool(nextPool);
                        }}
                      />
                      <span className="pool-name">{p.name}</span>
                      <span className="pool-rating">{p.rating}</span>
                    </label>
                  ))
                ) : (
                  <div className="empty-state">No loose players. Add a walk-in first.</div>
                )}
              </div>
              <button className="btn btn-primary btn-small w-full" onClick={queueSelectedPlayers}>
                Queue selected
              </button>
              <div className="rail-note text-center">
                2 players for singles, 4 players for doubles. If 3 players, the system reserves a spot for a waiting opponent.
              </div>
            </div>
          </section>

          {/* Next Up Rotation for Selected Court */}
          {(() => {
            const selectedCourt = courts.find((c) => c.id === selectedCourtId) || courts[0];
            return (
              <section className="rail-card">
                <header className="rail-head">
                  <div>
                    <div className="rail-title">Next on court</div>
                    <div className="rail-sub font-medium">{selectedCourt.title}</div>
                  </div>
                  <button className="btn btn-small font-semibold" onClick={() => callNext(selectedCourtId)}>
                    Call next
                  </button>
                </header>
                <div className="rail-body">
                  <div className="rail-queue-list flex flex-col gap-2">
                    {selectedCourt.queue.length > 0 ? (
                      selectedCourt.queue.map((q, idx) => (
                        <div key={idx} className={cx("rail-queue-row", idx === 0 && "next")}>
                          <div className="rail-queue-top">
                            <div className="rail-num">{idx + 1}</div>
                            <div className="rail-match">
                              {q.match}
                              <small>{q.sub}</small>
                              <div className="mini-avatars flex mt-1">
                                {q.players.map((p, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className={cx("avatar", tones[pIdx % tones.length])}
                                    title={p}
                                  >
                                    {getInitials(p)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="rail-queue-actions">
                            <button
                              className="btn btn-small font-semibold text-red-700"
                              onClick={() => openRemoveModal(selectedCourt.id, idx)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">Bu kortta bekleyen yok.</div>
                    )}
                  </div>
                </div>
              </section>
            );
          })()}

          {/* Recent Action Ticker */}
          <section className="rail-card">
            <header className="rail-head">
              <div>
                <div className="rail-title">Recent actions</div>
                <div className="rail-sub font-medium">Desk activity</div>
              </div>
            </header>
            <div className="rail-body">
              <div className="ticker-list">
                {ticker.map((t, idx) => (
                  <div key={idx} className="ticker-item">
                    <div className="ticker-kind">{t.kind}</div>
                    <div className="ticker-text">{t.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* LIVE-001 End Set Modal */}
      {showEndSetModal && (
        <div className="modal-backdrop" onClick={() => setShowEndSetModal(false)}>
          <div className="modal-content text-left max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-sm font-extrabold text-[#211b16]">Record Final Score</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowEndSetModal(false)}>×</button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Team A Score</label>
                  <input
                    type="number"
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-center font-mono text-lg font-black text-[#211b16]"
                    value={endSetScoreA}
                    onChange={e => {
                      setEndSetScoreA(Math.max(0, parseInt(e.target.value) || 0));
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Team B Score</label>
                  <input
                    type="number"
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-center font-mono text-lg font-black text-[#211b16]"
                    value={endSetScoreB}
                    onChange={e => {
                      setEndSetScoreB(Math.max(0, parseInt(e.target.value) || 0));
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Winner</label>
                <select
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16]"
                  value={endSetWinner}
                  onChange={e => setEndSetWinner(e.target.value)}
                >
                  <option value="teamA">Team A (Left Side)</option>
                  <option value="teamB">Team B (Right Side)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Match Notes</label>
                <textarea
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16] h-14 resize-none"
                  placeholder="e.g. Friendly game, intense rallies..."
                  value={endSetNotes}
                  onChange={e => setEndSetNotes(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Next Action</label>
                <select
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16]"
                  value={endSetNextAction}
                  onChange={e => setEndSetNextAction(e.target.value as any)}
                >
                  <option value="end-match">End Match Completely (Free Court)</option>
                  <option value="next-set">Start Next Set (Reset Clock)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  className="btn btn-primary flex-1 text-xs py-2 bg-[#f04f2a] hover:bg-[#b83a22]"
                  onClick={executeEndSet}
                >
                  Confirm End Set
                </button>
                <button
                  className="btn btn-secondary flex-1 text-xs py-2 border-[#d1bdae] hover:bg-[#fbf3ea]"
                  onClick={() => setShowEndSetModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE-004 Swap Sides Modal */}
      {showSwapSidesConfirm && (
        <div className="modal-backdrop" onClick={() => setShowSwapSidesConfirm(false)}>
          <div className="modal-content text-left max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-3">
              <h3 className="text-sm font-extrabold text-[#211b16]">Swap Sides</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowSwapSidesConfirm(false)}>×</button>
            </div>
            <p className="text-xs text-[#756a61] mb-4">
              Are you sure you want to swap the player slots and match scores on this court?
            </p>
            <div className="flex gap-2">
              <button
                className="btn btn-primary flex-1 text-xs py-2 bg-[#f04f2a] hover:bg-[#b83a22]"
                onClick={() => swapSidesCourtId && executeSwapSides(swapSidesCourtId)}
              >
                Swap Sides
              </button>
              <button
                className="btn btn-secondary flex-1 text-xs py-2 border-[#d1bdae]"
                onClick={() => setShowSwapSidesConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE-006 Call Next Modal */}
      {showCallNextModal && (
        <div className="modal-backdrop" onClick={() => setShowCallNextModal(false)}>
          <div className="modal-content text-left max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-3">
              <h3 className="text-sm font-extrabold text-[#211b16]">Call Next Group</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowCallNextModal(false)}>×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Target Court</label>
                <select
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16]"
                  value={callNextCourtId || ""}
                  onChange={e => setCallNextCourtId(Number(e.target.value))}
                >
                  {courts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.status})
                    </option>
                  ))}
                </select>
              </div>

              {(() => {
                const targetC = courts.find(c => c.id === (callNextCourtId || selectedCourtId));
                if (!targetC || targetC.queue.length === 0) {
                  return <p className="text-xs text-red-600 font-semibold">No waiting groups in queue for this court.</p>;
                }
                return (
                  <>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Select Group (FIFO Queue)</label>
                      <select
                        className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16]"
                        value={callNextSelectedGroup}
                        onChange={e => setCallNextSelectedGroup(Number(e.target.value))}
                      >
                        {targetC.queue.map((q, idx) => (
                          <option key={idx} value={idx}>
                            #{idx + 1}: {q.match} ({q.sub})
                          </option>
                        ))}
                      </select>
                    </div>

                    {callNextSelectedGroup > 0 && (
                      <div className="animate-fade-in">
                        <label className="block text-[9px] font-black uppercase text-amber-700 mb-1">
                          FIFO Bypassed! Skip Reason Required
                        </label>
                        <textarea
                          className="w-full border border-amber-400 rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16] h-14 resize-none"
                          placeholder="Why is this group skipping ahead? (e.g. VIP Member priority, partner matched...)"
                          value={callNextSkipReason}
                          onChange={e => setCallNextSkipReason(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                );
              })()}

              <div className="flex gap-2 pt-2">
                <button
                  className="btn btn-primary flex-1 text-xs py-2 bg-[#f04f2a] hover:bg-[#b83a22]"
                  onClick={executeCallNext}
                >
                  Assign Court
                </button>
                <button
                  className="btn btn-secondary flex-1 text-xs py-2 border-[#d1bdae]"
                  onClick={() => setShowCallNextModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE-007 Remove Group Modal */}
      {showRemoveModal && (
        <div className="modal-backdrop" onClick={() => setShowRemoveModal(false)}>
          <div className="modal-content text-left max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-3">
              <h3 className="text-sm font-extrabold text-[#211b16]">Remove Group</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowRemoveModal(false)}>×</button>
            </div>
            <div className="space-y-3 text-xs">
              <p className="text-xs text-[#756a61]">
                Are you sure you want to remove this group from the waiting queue?
              </p>

              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Reason</label>
                <select
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16]"
                  value={removeReason}
                  onChange={e => setRemoveReason(e.target.value)}
                >
                  <option value="No-show">No-show / Tardy</option>
                  <option value="Left early">Left early</option>
                  <option value="Booking Cancelled">Booking Cancelled</option>
                  <option value="Other">Other (Specify in notes)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Staff Note</label>
                <textarea
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16] h-14 resize-none"
                  value={removeNotes}
                  onChange={e => setRemoveNotes(e.target.value)}
                  placeholder="Additional context..."
                />
              </div>

              <label className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  onChange={e => {
                    const btn = document.getElementById("confirmRemoveBtn") as HTMLButtonElement;
                    if (btn) btn.disabled = !e.target.checked;
                  }}
                />
                <span className="text-[11px] font-bold text-[#756a61]">I confirm removing this group</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  id="confirmRemoveBtn"
                  className="btn btn-primary flex-1 text-xs py-2 bg-[#d95b35] hover:bg-[#b83a22]"
                  disabled
                  onClick={executeRemoveGroup}
                >
                  Remove Group
                </button>
                <button
                  className="btn btn-secondary flex-1 text-xs py-2 border-[#d1bdae]"
                  onClick={() => setShowRemoveModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE-005 Add to Queue Drawer / Modal */}
      {showAddQueueDrawer && (
        <div className="modal-backdrop" onClick={() => setShowAddQueueDrawer(false)}>
          <div className="modal-content text-left max-w-sm animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-3">
              <h3 className="text-sm font-extrabold text-[#211b16]">Add to Waitlist</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowAddQueueDrawer(false)}>×</button>
            </div>
            <form onSubmit={executeAddQueue} className="space-y-3 text-xs">
              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Search Member / Player</label>
                <input
                  type="text"
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-semibold text-[#211b16]"
                  placeholder="Type name (e.g. Selin T.)"
                  value={queuePlayerName}
                  onChange={e => setQueuePlayerName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Or Guest Name</label>
                <input
                  type="text"
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-semibold text-[#211b16]"
                  placeholder="Guest Full Name"
                  value={queueGuestName}
                  onChange={e => setQueueGuestName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Phone Number (Required for guests)</label>
                <input
                  type="tel"
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-semibold text-[#211b16]"
                  placeholder="+90 555..."
                  value={queuePhone}
                  onChange={e => setQueuePhone(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Party Size</label>
                  <select
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16]"
                    value={queuePartySize}
                    onChange={e => setQueuePartySize(e.target.value)}
                  >
                    <option value="1">1 (Single)</option>
                    <option value="2">2 (Pair)</option>
                    <option value="3">3 (Needs opponent)</option>
                    <option value="4">4 (Doubles Group)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Skill Rating</label>
                  <select
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16]"
                    value={queueSkill}
                    onChange={e => setQueueSkill(e.target.value)}
                  >
                    <option value="2.5">2.5 (Beginner)</option>
                    <option value="3.0">3.0 (Intermediate)</option>
                    <option value="3.5">3.5 (Experienced)</option>
                    <option value="4.0">4.0+ (Advanced)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Requested Court / Session</label>
                <select
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16]"
                  value={queueCourtType}
                  onChange={e => setQueueCourtType(e.target.value)}
                >
                  <option value="Open Court">Open Court (flexible)</option>
                  <option value="Court 1 · Center">Court 1 (Center only)</option>
                  <option value="Court 4">Court 4 (Singles block)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Queue Notes</label>
                <textarea
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] font-medium text-[#211b16] h-12 resize-none"
                  placeholder="Any extra requests..."
                  value={queueNotes}
                  onChange={e => setQueueNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary flex-1 text-xs py-2 bg-[#f04f2a] hover:bg-[#b83a22]"
                >
                  Add to Queue
                </button>
                <button
                  type="button"
                  className="btn btn-secondary flex-1 text-xs py-2 border-[#d1bdae]"
                  onClick={() => setShowAddQueueDrawer(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      <div className={cx("toast", showToast && "show")}>{toastMessage}</div>
    </div>
  );
}
