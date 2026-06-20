"use client";

import { useEffect, useMemo, useRef } from "react";

import { liveboardEventPresets } from "@/lib/liveboard/event-presets";
import type { RealtimeEvent } from "@/lib/types";

function playTone(kind: "soft-chime" | "warning-double" | "success-pulse" | "alert-buzz") {
  if (typeof window === "undefined") return;

  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

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
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function LiveboardCueEngine({ events }: { events: RealtimeEvent[] }) {
  const latestEvent = events[0];
  const initialEventIdRef = useRef<string | null>(null);
  const lastPlayedEventIdRef = useRef<string | null>(null);

  const preset = useMemo(() => {
    if (!latestEvent) return null;

    return liveboardEventPresets.find((entry) => entry.eventType === latestEvent.label) ?? null;
  }, [latestEvent]);

  useEffect(() => {
    if (!latestEvent) return;

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
  }, [latestEvent, preset]);

  return null;
}
