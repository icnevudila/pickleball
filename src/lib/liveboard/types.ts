import type { CourtAssignment, QueueEntry, RealtimeEvent, Session } from "@/lib/types";

export type LiveboardMode = "mock" | "supabase";

export interface LiveboardSnapshot {
  session: Session;
  assignments: CourtAssignment[];
  queue: QueueEntry[];
  events: RealtimeEvent[];
  generatedAt: string;
  mode: LiveboardMode;
}

export interface LiveboardActionDescriptor {
  action:
    | "start_game"
    | "end_game"
    | "extend_time"
    | "call_next_group"
    | "mark_no_show"
    | "free_court";
  label: string;
  eventType: string;
  requiresCourtAssignment?: boolean;
}
