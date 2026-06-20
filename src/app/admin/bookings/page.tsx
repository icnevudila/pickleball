import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bookings, getSessionById } from "@/lib/mock-data";

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

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 animate-fade-in stagger-1">
        <Badge tone="brand">Bookings</Badge>
        <h1 className="section-title text-3xl font-black mt-2">
          Reservation control with guest/member distinction and payment visibility.
        </h1>
        <p className="text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
          List and monitor player checkout status, stripe billing receipts, and court assignment slots.
        </p>
      </div>

      <Card variant="surface" className="overflow-hidden border border-[var(--line-strong)] animate-scale-in">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-[var(--line)] px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)] bg-[var(--surface-muted)]">
          <span>Player</span>
          <span>Session</span>
          <span>Type</span>
          <span>Payment</span>
          <span>Status</span>
        </div>
        {/* Table Body */}
        <div className="divide-y divide-[var(--line)]">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 items-center px-6 py-5 text-sm text-[var(--muted)] hover:bg-[var(--surface-soft)] transition-colors"
            >
              <div className="flex flex-col gap-1">
                <span className="font-extrabold text-[var(--foreground)] text-base md:text-sm">
                  {booking.player.fullName}
                </span>
                <span className="text-[10px] font-bold text-[var(--muted)] md:hidden">
                  ID: {booking.id}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-[var(--foreground)] md:text-[var(--muted)] md:font-normal">
                  {getSessionById(booking.sessionId).name}
                </span>
              </div>
              <div className="flex items-center gap-2 md:block">
                <span className="text-xs font-semibold text-[var(--muted)] md:hidden">Type:</span>
                <Badge tone={booking.bookingType === "member" ? "brand" : "slate"}>
                  {booking.bookingType}
                </Badge>
              </div>
              <div className="flex items-center gap-2 md:block">
                <span className="text-xs font-semibold text-[var(--muted)] md:hidden">Payment:</span>
                <Badge tone={paymentStatusTones[booking.paymentStatus] || "slate"}>
                  {booking.paymentStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-2 md:block">
                <span className="text-xs font-semibold text-[var(--muted)] md:hidden">Status:</span>
                <Badge tone={bookingStatusTones[booking.bookingStatus] || "slate"}>
                  {booking.bookingStatus}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
