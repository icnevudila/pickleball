import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripeClient();

  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({
      mode: "demo",
      received: true,
      message: "Stripe webhook secret missing. No remote verification performed.",
    });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

  return NextResponse.json({
    received: true,
    eventType: event.type,
    bookingId: event.data.object && "metadata" in event.data.object ? event.data.object.metadata?.bookingId : null,
  });
}
