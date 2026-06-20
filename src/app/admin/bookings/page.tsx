import { SurfaceCard } from "@/components/surface-card";
import { bookings, getSessionById } from "@/lib/mock-data";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Bookings</p>
        <h1 className="section-title mt-3">Admin booking control with guest/member distinction built in.</h1>
      </div>

      <SurfaceCard className="overflow-hidden">
        <div className="grid grid-cols-[1.1fr_0.8fr_0.7fr_0.7fr_0.8fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.24em] text-slate-400">
          <span>Player</span>
          <span>Session</span>
          <span>Type</span>
          <span>Payment</span>
          <span>Status</span>
        </div>
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="grid grid-cols-[1.1fr_0.8fr_0.7fr_0.7fr_0.8fr] gap-4 border-b border-white/6 px-6 py-5 text-sm text-slate-300 last:border-b-0"
          >
            <span className="font-semibold text-white">{booking.player.fullName}</span>
            <span>{getSessionById(booking.sessionId).name}</span>
            <span className="capitalize">{booking.bookingType}</span>
            <span className="capitalize">{booking.paymentStatus}</span>
            <span className="capitalize">{booking.bookingStatus}</span>
          </div>
        ))}
      </SurfaceCard>
    </div>
  );
}
