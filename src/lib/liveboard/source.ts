import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LiveboardSnapshot } from "@/lib/liveboard/types";
import { getMockLiveboardSnapshot } from "@/lib/liveboard/mock-snapshot";

function getProfileNameParts(profile: unknown) {
  const value = Array.isArray(profile) ? profile[0] : profile;

  if (!value || typeof value !== "object") {
    return { firstName: null, lastName: null };
  }

  return {
    firstName: "first_name" in value ? String(value.first_name ?? "") : null,
    lastName: "last_name" in value ? String(value.last_name ?? "") : null,
  };
}

function getProfileAvatar(profile: unknown) {
  const value = Array.isArray(profile) ? profile[0] : profile;

  if (!value || typeof value !== "object" || !("avatar_url" in value)) {
    return undefined;
  }

  return value.avatar_url ? String(value.avatar_url) : undefined;
}

async function getSupabaseLiveboardSnapshot(sessionId: string): Promise<LiveboardSnapshot | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data: sessionRow, error: sessionError } = await supabase
    .from("sessions")
    .select(
      `
        id,
        name,
        skill_level,
        price_cents,
        max_players,
        game_duration_minutes,
        status,
        start_time,
        end_time
      `,
    )
    .eq("id", sessionId)
    .maybeSingle();

  if (sessionError || !sessionRow) {
    return null;
  }

  const [{ data: assignmentRows }, { data: queueRows }, { data: eventRows }] = await Promise.all([
    supabase
      .from("court_assignments")
      .select("id, status, timer_status, started_at, duration_minutes, court:courts(name)")
      .eq("session_id", sessionId)
      .is("ended_at", null),
    supabase
      .from("waitlist_entries")
      .select("id, position, status, profile:profiles(first_name, last_name, avatar_url)")
      .eq("session_id", sessionId)
      .in("status", ["waiting", "offered", "accepted"])
      .order("position", { ascending: true }),
    supabase
      .from("liveboard_events")
      .select("id, event_type, payload, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const fallback = getMockLiveboardSnapshot(sessionId);

  return {
    session: {
      ...fallback.session,
      id: sessionRow.id,
      name: sessionRow.name,
      level: sessionRow.skill_level ?? fallback.session.level,
      price: Math.round((sessionRow.price_cents ?? 0) / 100),
      capacity: sessionRow.max_players ?? fallback.session.capacity,
      status:
        sessionRow.status === "in_progress"
          ? "live"
          : sessionRow.status === "full"
            ? "waitlist"
            : fallback.session.status,
      timeLabel: `${new Date(sessionRow.start_time).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${new Date(sessionRow.end_time).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      durationMinutes: sessionRow.game_duration_minutes ?? fallback.session.durationMinutes,
    },
    assignments:
      assignmentRows?.map((row, index) => ({
        id: row.id,
        sessionId,
        courtName:
          typeof row.court === "object" && row.court && "name" in row.court ? String(row.court.name) : `Court ${index + 1}`,
        status:
          row.timer_status === "time_up"
            ? "time-up"
            : row.timer_status === "ending_soon"
              ? "ending-soon"
              : row.status === "occupied"
                ? "playing"
                : row.status === "maintenance"
                  ? "maintenance"
                  : "available",
        endsInSeconds:
          row.started_at && row.duration_minutes
            ? Math.max(
                0,
                row.duration_minutes * 60 -
                  Math.floor((Date.now() - new Date(row.started_at).getTime()) / 1000),
              )
            : undefined,
        teamA: [],
        teamB: [],
      })) ?? fallback.assignments,
    queue:
      queueRows?.map((row) => {
        const profile = getProfileNameParts(row.profile);
        const fullName = `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim();

        return {
          id: row.id,
          sessionId,
          position: row.position,
          player: {
            id: row.id,
            fullName: fullName || "Waiting player",
            firstName: profile.firstName || "Player",
            avatar: getProfileAvatar(row.profile),
          },
          eta: row.status === "offered" ? "On deck" : "Waiting",
        };
      }) ?? fallback.queue,
    events:
      eventRows?.map((row) => ({
        id: row.id,
        timestamp: new Date(row.created_at).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        label: row.event_type,
        detail:
          row.payload && typeof row.payload === "object" && "message" in row.payload
            ? String(row.payload.message)
            : row.event_type,
      })) ?? fallback.events,
    generatedAt: new Date().toISOString(),
    mode: "supabase",
  };
}

export async function getLiveboardSnapshot(sessionId: string): Promise<LiveboardSnapshot> {
  const snapshot = await getSupabaseLiveboardSnapshot(sessionId);

  return snapshot ?? getMockLiveboardSnapshot(sessionId);
}
