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
          <h1 className="section-title mt-3">Reservation state, payment state, and next steps in one member view.</h1>
          <p className="text-sm leading-7 text-[color:var(--muted)]">
            This stays intentionally calm. Players should understand where a reservation stands without needing admin context.
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
                    <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">{session.name}</h2>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                      {session.dayLabel} / {session.timeLabel} / {booking.bookingType} booking / {booking.note}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/account/bookings/${booking.id}`} className="btn-primary px-5 py-3">
                      Open detail
                    </Link>
                    <Link
                      href={booking.bookingStatus === "pending-payment" ? `/checkout/${booking.id}` : "/booking/confirm"}
                      className="btn-secondary px-5 py-3"
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
