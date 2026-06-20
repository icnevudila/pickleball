import { getAssignmentsForSession, getQueueForSession, getSessionById, realtimeEvents } from "@/lib/mock-data";
import type { LiveboardSnapshot } from "@/lib/liveboard/types";

export function getMockLiveboardSnapshot(sessionId: string): LiveboardSnapshot {
  return {
    session: getSessionById(sessionId),
    assignments: getAssignmentsForSession(sessionId),
    queue: getQueueForSession(sessionId),
    events: realtimeEvents,
    generatedAt: new Date().toISOString(),
    mode: "mock",
  };
}
