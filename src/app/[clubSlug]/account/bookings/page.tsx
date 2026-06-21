import Link from "next/link";
import { ArrowLeft, Calendar, Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bookings, getSessionById } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const bookingStatusTones = {
  "pending-payment": "amber",
  confirmed: "lime",
  "checked-in": "live",
  waiting: "amber",
  playing: "live",
  waitlisted: "rose",
  cancelled: "slate",
} as const;

const paymentStatusTones = {
  pending: "amber",
  paid: "lime",
  failed: "rose",
  refunded: "slate",
  "manual-review": "amber",
} as const;

interface BookingsPageProps {
  params: Promise<{ clubSlug: string }>;
}

export default async function AccountBookingsPage({ params }: BookingsPageProps) {
  const { clubSlug } = await params;

  return (
    <div className="space-y-6">
      
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[var(--line)] pb-5 animate-fade-in stagger-1">
        <div className="space-y-2">
          <Link
            href={`/${clubSlug}/account`}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)] hover:text-[var(--brand)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold tracking-[-0.06em] text-[var(--foreground)]">My Reservations</h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] font-semibold leading-relaxed">
            Track your reservation states, payment records, and court queues in one central view.
          </p>
        </div>
        <Button variant="secondary" size="sm" asChild className="rounded-[9px]">
          <Link href={`/${clubSlug}/sessions`}>
            <Calendar className="w-4 h-4 mr-1.5" /> Book New Session
          </Link>
        </Button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <Card variant="surface" className="p-12 text-center border border-[var(--line)] rounded-[16px]">
            <Ticket className="w-12 h-12 text-[var(--muted)] mx-auto opacity-40 mb-4" />
            <h3 className="text-lg font-black">No active bookings</h3>
            <p className="text-xs font-semibold text-[var(--muted)] mt-1">
              Any future bookings you make will appear right here.
            </p>
            <Button variant="primary" size="sm" className="mt-6 rounded-[9px]" asChild>
              <Link href={`/${clubSlug}/sessions`}>Browse Sessions</Link>
            </Button>
          </Card>
        ) : (
          bookings.map((booking, index) => {
            const session = getSessionById(booking.sessionId);
            return (
              <Card
                key={booking.id}
                variant="surface"
                className={`p-6 sm:p-8 border border-[var(--line-strong)] hover:shadow-md transition-all duration-300 rounded-[16px] animate-slide-up stagger-${
                  (index % 3) + 1
                }`}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-4">
                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={bookingStatusTones[booking.bookingStatus] || "slate"}>
                        Booking: {booking.bookingStatus}
                      </Badge>
                      <Badge tone={paymentStatusTones[booking.paymentStatus] || "slate"}>
                        Payment: {booking.paymentStatus}
                      </Badge>
                    </div>

                    {/* Session Name & Date */}
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)]">
                        {session.name}
                      </h2>
                      <p className="text-xs font-semibold text-[var(--muted)] mt-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[var(--brand)]" />
                        {session.dayLabel} • {session.timeLabel} • {booking.bookingType} booking
                      </p>
                    </div>

                    {/* Detail note / price */}
                    <div className="flex items-center gap-6">
                      <div className="text-xs font-bold text-[var(--muted)]">
                        Fee: <span className="font-extrabold text-[var(--foreground)] font-mono">{formatCurrency(session.price)}</span>
                      </div>
                      {booking.note && (
                        <div className="text-xs font-semibold text-[var(--muted)]">
                          Note: <span className="text-[var(--foreground)]">{booking.note}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" size="md" className="rounded-[9px]" asChild>
                      <Link href={`/${clubSlug}/account/bookings/${booking.id}`}>Open details</Link>
                    </Button>
                    <Button
                      variant={booking.bookingStatus === "pending-payment" ? "primary" : "secondary"}
                      size="md"
                      className="rounded-[9px]"
                      asChild
                    >
                      <Link
                        href={
                          booking.bookingStatus === "pending-payment"
                            ? `/${clubSlug}/checkout`
                            : `/${clubSlug}/account/bookings/${booking.id}`
                        }
                      >
                        {booking.bookingStatus === "pending-payment"
                          ? "Finish payment"
                          : "View confirmation"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

    </div>
  );
}
