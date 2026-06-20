import { SurfaceCard } from "@/components/surface-card";
import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/status-badge";
import { getBookingById, getPaymentForBooking, getSessionById } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default async function AccountBookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = getBookingById(bookingId);
  const session = getSessionById(booking.sessionId);
  const payment = getPaymentForBooking(booking.id);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <SurfaceCard className="p-6">
            <div className="flex flex-wrap gap-3">
              <StatusBadge tone="lime">{booking.bookingStatus}</StatusBadge>
              <StatusBadge tone="cyan">{booking.paymentStatus}</StatusBadge>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.07em] text-white">{session.name}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              This view is where the player checks status, checkout result, and what the club expects next.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Booking type", booking.bookingType],
                ["Booking source", booking.bookingSource],
                ["Created", booking.createdAt],
                ["Payment amount", formatCurrency(payment?.amount ?? session.price)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-black/15 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
                  <p className="mt-2 text-sm text-white">{value}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <p className="text-2xl font-semibold tracking-[-0.05em] text-white">What happens next</p>
            <div className="mt-5 space-y-4">
              {[
                "Check in with staff on arrival.",
                "When checked in, you move into the waiting queue.",
                "When assigned to a court, you appear on the public TV board.",
              ].map((step, index) => (
                <div key={step} className="flex gap-3 rounded-2xl border border-white/8 bg-black/15 p-4">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
