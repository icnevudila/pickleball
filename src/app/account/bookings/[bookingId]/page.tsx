import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
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
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <SurfaceCard className="p-6">
            <div className="flex flex-wrap gap-3">
              <StatusBadge tone="lime">{booking.bookingStatus}</StatusBadge>
              <StatusBadge tone="cyan">{booking.paymentStatus}</StatusBadge>
            </div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.07em] text-[color:var(--foreground)]">{session.name}</h1>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              This player view should explain state, payment outcome, and next steps without exposing operator noise.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Booking type", booking.bookingType],
                ["Booking source", booking.bookingSource],
                ["Created", booking.createdAt],
                ["Payment amount", formatCurrency(payment?.amount ?? session.price)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</p>
                  <p className="mt-2 text-sm font-extrabold text-[color:var(--foreground)]">{value}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <p className="eyebrow">What happens next</p>
            <div className="mt-5 space-y-4">
              {[
                "Check in with staff when you arrive.",
                "After check-in, your booking moves into the waiting queue.",
                "When assigned to a court, the public liveboard picks up the match state.",
              ].map((step, index) => (
                <div key={step} className="flex gap-3 rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--brand)] text-sm font-black text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-[color:var(--muted)]">{step}</p>
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
