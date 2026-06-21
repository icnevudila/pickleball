import { NextResponse } from "next/server";

import { getLiveboardSnapshot } from "@/lib/liveboard/source";
import { liveboardActionDescriptors } from "@/lib/liveboard/actions";
import { callNextOnCourt, endSetOnCourt, queueNextOnCourt } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const snapshot = await getLiveboardSnapshot(sessionId);

  return NextResponse.json({
    snapshot,
    actions: liveboardActionDescriptors,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  try {
    const { action, courtId, scoreA, scoreB } = await request.json();

    if (action === "call_next") {
      callNextOnCourt(courtId);
    } else if (action === "end_set") {
      endSetOnCourt(courtId, scoreA, scoreB);
    } else if (action === "queue_next") {
      queueNextOnCourt(courtId);
    }

    const snapshot = await getLiveboardSnapshot(sessionId);
    return NextResponse.json({ success: true, snapshot });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 });
  }
}
