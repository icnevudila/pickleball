import { NextResponse } from "next/server";

import { getLiveboardSnapshot } from "@/lib/liveboard/source";
import { liveboardActionDescriptors } from "@/lib/liveboard/actions";

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
