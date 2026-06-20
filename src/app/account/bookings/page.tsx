import Link from "next/link";

import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import { bookings, getSessionById } from "@/lib/mock-data";

export default function AccountBookingsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-10">
        <div className="max-w-3xl space-y-4">
          <p className="eyebrow">Booking control</p>
          <h1 className="section-title mt-3">See status, payment state, and what happens next.</h1>
          <p className="text-sm leading-7 text-slate-300">
            Player-facing booking control is intentionally calm. It explains state without exposing admin noise.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {bookings.map((booking) => {
            const session = getSessionById(booking.sessionId);
            return (
              <SurfaceCard key={booking.id} className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge tone={booking.bookingStatus === "waitlisted" ? "rose" : booking.bookingStatus === "pending-payment" ? "amber" : "lime"}>
                        {booking.bookingStatus}
                      </StatusBadge>
                      <StatusBadge tone="cyan">{booking.paymentStatus}</StatusBadge>
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">{session.name}</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {session.dayLabel} · {session.timeLabel} · {booking.bookingType} booking · {booking.note}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/account/bookings/${booking.id}`}
                      className="rounded-full bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)] px-5 py-3 text-sm font-bold text-slate-950"
                    >
                      Open detail
                    </Link>
                    <Link
                      href={booking.bookingStatus === "pending-payment" ? `/checkout/${booking.id}` : "/booking/confirm"}
                      className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-slate-100"
                    >
                      {booking.bookingStatus === "pending-payment" ? "Finish payment" : "View confirmation"}
                    </Link>
                  </div>
                </div>
              </SurfaceCard>
            );
          })}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
