"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { liveboardEventPresets } from "@/lib/liveboard/event-presets";
import type { CourtAssignment, QueueEntry, RealtimeEvent } from "@/lib/types";

type ToneKey = "soft-chime" | "warning-double" | "success-pulse" | "alert-buzz";

function getAudioContextCtor() {
  if (typeof window === "undefined") return null;

  return window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext || null;
}

function playTone(kind: ToneKey) {
  const AudioContextCtor = getAudioContextCtor();

  if (!AudioContextCtor) {
    return;
  }

  const context = new AudioContextCtor();

  const scheduleBeep = (startAt: number, frequency: number, duration: number, gainValue: number) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = kind === "alert-buzz" ? "square" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.0001;

    oscillator.connect(gain);
    gain.connect(context.destination);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.03);
  };

  const now = context.currentTime;

  if (kind === "soft-chime") {
    scheduleBeep(now, 880, 0.24, 0.06);
  } else if (kind === "warning-double") {
    scheduleBeep(now, 740, 0.18, 0.08);
    scheduleBeep(now + 0.25, 740, 0.18, 0.08);
  } else if (kind === "success-pulse") {
    scheduleBeep(now, 660, 0.15, 0.06);
    scheduleBeep(now + 0.18, 880, 0.22, 0.06);
  } else if (kind === "alert-buzz") {
    scheduleBeep(now, 220, 0.2, 0.07);
    scheduleBeep(now + 0.24, 220, 0.24, 0.07);
  }

  window.setTimeout(() => {
    void context.close();
  }, 1200);
}

function speak(message: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !message) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 0.9;
  utterance.lang = "en-GB";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function joinNames(queue: QueueEntry[]) {
  return queue.map((entry) => entry.player.firstName).join(", ");
}

function cue(kind: ToneKey, voiceMessage?: string) {
  playTone(kind);

  if (voiceMessage) {
    speak(voiceMessage);
  }
}

export function LiveboardCueEngine({
  events,
  assignments,
  queue,
}: {
  events: RealtimeEvent[];
  assignments: CourtAssignment[];
  queue: QueueEntry[];
}) {
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.localStorage.getItem("liveboard_voice_enabled") !== "false";
  });
  const [voiceArmed, setVoiceArmed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("liveboard_voice_armed") === "true";
  });
  const latestEvent = events[0];
  const mountedAtRef = useRef(0);
  const initialEventIdRef = useRef<string | null>(null);
  const lastPlayedEventIdRef = useRef<string | null>(null);
  const spokenCueKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("liveboard_voice_enabled", String(voiceEnabled));
  }, [voiceEnabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("liveboard_voice_armed", String(voiceArmed));
  }, [voiceArmed]);

  const preset = useMemo(() => {
    if (!latestEvent) return null;

    return liveboardEventPresets.find((entry) => entry.eventType === latestEvent.label) ?? null;
  }, [latestEvent]);

  useEffect(() => {
    if (!voiceEnabled || !voiceArmed || !latestEvent) return;

    if (!initialEventIdRef.current) {
      initialEventIdRef.current = latestEvent.id;
      return;
    }

    if (lastPlayedEventIdRef.current === latestEvent.id) {
      return;
    }

    if (!preset) {
      lastPlayedEventIdRef.current = latestEvent.id;
      return;
    }

    if (preset.toneKey && preset.cueMode !== "silent") {
      playTone(preset.toneKey);
    }

    if (preset.cueMode === "voice" && preset.voiceTemplate) {
      speak(preset.voiceTemplate);
    }

    lastPlayedEventIdRef.current = latestEvent.id;
  }, [latestEvent, preset, voiceArmed, voiceEnabled]);

  useEffect(() => {
    if (!voiceEnabled || !voiceArmed) return;

    const interval = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - mountedAtRef.current) / 1000);

      assignments.forEach((assignment) => {
        if (!assignment.endsInSeconds) {
          if (assignment.status === "available" && assignment.nextUp?.length) {
            const key = `${assignment.id}:ready`;

            if (!spokenCueKeysRef.current.has(key)) {
              spokenCueKeysRef.current.add(key);
              cue(
                "soft-chime",
                `${assignment.courtName} is ready. ${assignment.nextUp.map((player) => player.firstName).join(", ")} please prepare.`,
              );
            }
          }

          return;
        }

        const remaining = Math.max(assignment.endsInSeconds - elapsedSeconds, 0);
        const oneMinuteKey = `${assignment.id}:one-minute`;
        const tenSecondKey = `${assignment.id}:ten-seconds`;
        const timeUpKey = `${assignment.id}:time-up`;

        if (remaining <= 60 && remaining > 10 && assignment.status === "ending-soon" && !spokenCueKeysRef.current.has(oneMinuteKey)) {
          spokenCueKeysRef.current.add(oneMinuteKey);
          cue("warning-double", `One minute remaining on ${assignment.courtName}. Next players be ready.`);
        }

        if (remaining <= 10 && remaining > 0 && !spokenCueKeysRef.current.has(tenSecondKey)) {
          spokenCueKeysRef.current.add(tenSecondKey);
          cue("warning-double", `${assignment.courtName}. Ten seconds remaining.`);
        }

        if (remaining === 0 && !spokenCueKeysRef.current.has(timeUpKey)) {
          spokenCueKeysRef.current.add(timeUpKey);
          cue("alert-buzz", `Time is up on ${assignment.courtName}. Please rotate the court now.`);
        }
      });

      if (queue.length > 0) {
        const queueKey = `queue-head:${queue[0].id}`;

        if (!spokenCueKeysRef.current.has(queueKey)) {
          spokenCueKeysRef.current.add(queueKey);
          cue("success-pulse", `Queue ready. ${joinNames(queue.slice(0, 4))} are next in line.`);
        }
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [assignments, queue, voiceArmed, voiceEnabled]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-white/12 bg-[rgba(11,21,18,0.84)] px-3 py-2 text-white shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur">
      <button
        type="button"
        className={`rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] ${
          voiceEnabled ? "bg-[var(--accent-lime)] text-[#0b1512]" : "bg-white/10 text-white"
        }`}
        onClick={() => setVoiceEnabled((current) => !current)}
      >
        {voiceEnabled ? "Voice on" : "Voice off"}
      </button>
      <button
        type="button"
        className={`rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] ${
          voiceArmed ? "bg-[var(--brand)] text-white" : "bg-white/10 text-white"
        }`}
        onClick={() => {
          setVoiceArmed(true);
          cue("soft-chime", "Liveboard voice ready.");
        }}
      >
        {voiceArmed ? "Armed" : "Enable voice"}
      </button>
      <button
        type="button"
        className="rounded-full bg-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white"
        onClick={() => cue("success-pulse", "Test announcement. Liveboard audio is working.")}
      >
        Test
      </button>
    </div>
  );
}
