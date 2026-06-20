import { NextRequest, NextResponse } from "next/server";

import { getBookingById, getSessionById } from "@/lib/mock-data";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { bookingId?: string };

  if (!body.bookingId) {
    return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
  }

  const booking = getBookingById(body.bookingId);
  const session = getSessionById(booking.sessionId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const stripe = getStripeClient();

  if (!stripe) {
    return NextResponse.json({
      mode: "demo",
      checkoutUrl: `${siteUrl}/booking/confirm?bookingId=${booking.id}`,
      message: "Stripe keys missing. Falling back to local confirmation flow.",
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/booking/confirm?bookingId=${booking.id}`,
    cancel_url: `${siteUrl}/checkout/${booking.id}`,
    customer_email: booking.bookingType === "guest" ? undefined : "member@example.com",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: session.price * 100,
          product_data: {
            name: session.name,
            description: `${session.dayLabel} · ${session.timeLabel}`,
          },
        },
      },
    ],
    metadata: {
      bookingId: booking.id,
      sessionId: session.id,
    },
  });

  return NextResponse.json({
    mode: "stripe",
    checkoutUrl: checkoutSession.url,
    sessionId: checkoutSession.id,
  });
}
