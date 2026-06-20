export type LiveboardCueMode = "silent" | "tone" | "voice";

export interface LiveboardEventPreset {
  eventType:
    | "game.started"
    | "game.ending_soon"
    | "game.time_up"
    | "game.ended"
    | "queue.updated"
    | "player.no_show"
    | "court.status.changed"
    | "payment.updated"
    | "booking.confirmed"
    | "booking.waitlisted";
  label: string;
  visualPriority: "low" | "medium" | "high" | "critical";
  cueMode: LiveboardCueMode;
  toneKey?: "soft-chime" | "warning-double" | "success-pulse" | "alert-buzz";
  voiceTemplate?: string;
}

export const liveboardEventPresets: LiveboardEventPreset[] = [
  {
    eventType: "game.started",
    label: "Game started",
    visualPriority: "medium",
    cueMode: "voice",
    toneKey: "success-pulse",
    voiceTemplate: "Court started. Players are now live.",
  },
  {
    eventType: "game.ending_soon",
    label: "Low time",
    visualPriority: "high",
    cueMode: "tone",
    toneKey: "warning-double",
  },
  {
    eventType: "game.time_up",
    label: "Time up",
    visualPriority: "critical",
    cueMode: "voice",
    toneKey: "alert-buzz",
    voiceTemplate: "Time is up. Please rotate the court.",
  },
  {
    eventType: "game.ended",
    label: "Game ended",
    visualPriority: "high",
    cueMode: "voice",
    toneKey: "soft-chime",
    voiceTemplate: "Game finished. Next group prepare.",
  },
  {
    eventType: "queue.updated",
    label: "Queue updated",
    visualPriority: "medium",
    cueMode: "voice",
    toneKey: "soft-chime",
    voiceTemplate: "Next group has been called.",
  },
  {
    eventType: "player.no_show",
    label: "No-show",
    visualPriority: "high",
    cueMode: "voice",
    toneKey: "alert-buzz",
    voiceTemplate: "Player no-show marked. Queue will advance.",
  },
  {
    eventType: "court.status.changed",
    label: "Court status changed",
    visualPriority: "medium",
    cueMode: "tone",
    toneKey: "soft-chime",
  },
  {
    eventType: "payment.updated",
    label: "Payment updated",
    visualPriority: "low",
    cueMode: "silent",
  },
  {
    eventType: "booking.confirmed",
    label: "Booking confirmed",
    visualPriority: "low",
    cueMode: "silent",
  },
  {
    eventType: "booking.waitlisted",
    label: "Waitlist joined",
    visualPriority: "low",
    cueMode: "silent",
  },
];
