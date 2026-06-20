import type { LiveboardActionDescriptor } from "@/lib/liveboard/types";

export const liveboardActionDescriptors: LiveboardActionDescriptor[] = [
  {
    action: "start_game",
    label: "Start game",
    eventType: "game.started",
    requiresCourtAssignment: true,
  },
  {
    action: "end_game",
    label: "End game",
    eventType: "game.ended",
    requiresCourtAssignment: true,
  },
  {
    action: "extend_time",
    label: "Extend time",
    eventType: "game.extended",
    requiresCourtAssignment: true,
  },
  {
    action: "call_next_group",
    label: "Call next group",
    eventType: "queue.updated",
  },
  {
    action: "mark_no_show",
    label: "Mark no-show",
    eventType: "player.no_show",
  },
  {
    action: "free_court",
    label: "Free court",
    eventType: "court.status.changed",
    requiresCourtAssignment: true,
  },
];
