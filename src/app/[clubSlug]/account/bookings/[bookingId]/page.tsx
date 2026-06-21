import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBookingById, getPaymentForBooking, getSessionById } from "@/lib/mock-data";
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

interface BookingDetailPageProps {
  params: Promise<{ clubSlug: string; bookingId: string }>;
}

export default async function AccountBookingDetailPage({ params }: BookingDetailPageProps) {
  const { clubSlug, bookingId } = await params;
  const booking = getBookingById(bookingId);
  
  if (!booking) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-black">Booking not found</h1>
        <Button variant="primary" asChild>
          <Link href={`/${clubSlug}/account/bookings`}>Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  const session = getSessionById(booking.sessionId);
  const payment = getPaymentForBooking(booking.id);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="space-y-2 border-b border-[var(--line)] pb-5">
        <Link
          href={`/${clubSlug}/account/bookings`}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)] hover:text-[var(--brand)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Reservations
        </Link>
        <h1 className="text-3xl font-extrabold tracking-[-0.06em] text-[var(--foreground)]">Reservation details</h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] font-semibold leading-relaxed">
          Detailed telemetry, status updates, and transaction confirmation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Details Card */}
        <Card variant="surface" className="p-6 border border-[var(--line-strong)] rounded-[16px] space-y-6">
          <div className="flex flex-wrap gap-2.5">
            <Badge tone={bookingStatusTones[booking.bookingStatus] || "slate"}>
              Booking: {booking.bookingStatus}
            </Badge>
            <Badge tone={paymentStatusTones[booking.paymentStatus] || "slate"}>
              Payment: {booking.paymentStatus}
            </Badge>
          </div>

          <div>
            <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)] leading-none">{session.name}</h2>
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted)] font-semibold">
              This player view explains reservation state, payment outcomes, and court schedules without leaking admin operations noise.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Booking Type", booking.bookingType],
              ["Booking Source", booking.bookingSource],
              ["Created Timestamp", booking.createdAt],
              ["Paid Value", formatCurrency(payment?.amount ?? session.price)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[14px] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
                <p className="mt-1.5 text-sm font-extrabold text-[var(--foreground)]">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Steps Card */}
        <Card variant="surface" className="p-6 border border-[var(--line-strong)] rounded-[16px] space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)]">What happens next</h3>
          <div className="space-y-4 pt-2">
            {[
              "Check in with staff at the front desk when you arrive.",
              "After check-in, your slot moves to the active queue board.",
              "The TV display board picks up your court allocation automatically.",
            ].map((step, index) => (
              <div key={step} className="flex gap-3 items-start">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-[var(--brand)] text-[11px] font-black text-white shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-xs leading-relaxed text-[var(--muted)] font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
