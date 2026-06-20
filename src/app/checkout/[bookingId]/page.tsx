import Link from "next/link";
import { Lock, TimerReset, UserRoundPlus } from "lucide-react";

import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import { getBookingById, getPaymentForBooking, getSessionById } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default async function CheckoutPage({
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
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <SurfaceCard className="p-6 sm:p-8">
            <p className="eyebrow">Reservation checkout</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.08em] text-[color:var(--foreground)] sm:text-5xl">
              Finish the reservation before the hold expires.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
              The public path stays quick for guest conversion, but members can still branch into their saved account flow before payment.
            </p>

            <div className="mt-6 flex gap-2">
              {[1, 2, 3, 4].map((step, index) => (
                <span
                  key={step}
                  className="h-2 flex-1 rounded-full"
                  style={{ background: index < 2 ? "var(--brand)" : "var(--brand-soft)" }}
                />
              ))}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <SurfaceCard className="border-[color:var(--line)] bg-[color:var(--surface-muted)] p-5 shadow-none">
                <div className="flex items-start gap-3">
                  <UserRoundPlus className="mt-1 h-5 w-5 text-[color:var(--brand-deep)]" />
                  <div className="w-full">
                    <p className="font-extrabold text-[color:var(--foreground)]">Player details</p>
                    <div className="mt-4 grid gap-3">
                      {["Full name", "Email", "Phone", "Skill level"].map((label, index) => (
                        <label key={label} className="grid gap-2 text-sm font-bold text-[color:var(--muted)]">
                          {label}
                          <span className="field-shell">
                            <input
                              defaultValue={index === 0 ? booking.player.fullName : ""}
                              className="w-full bg-transparent text-[color:var(--foreground)] outline-none placeholder:text-stone-400"
                            />
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </SurfaceCard>

              <SurfaceCard className="border-[color:var(--line)] bg-[color:var(--surface-muted)] p-5 shadow-none">
                <div className="flex items-start gap-3">
                  <Lock className="mt-1 h-5 w-5 text-[color:var(--green)]" />
                  <div className="w-full">
                    <p className="font-extrabold text-[color:var(--foreground)]">Payment and seat hold</p>
                    <div className="mt-4 space-y-3 rounded-[22px] border border-[color:var(--line)] bg-white p-4">
                      <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
                        <span>Session seat</span>
                        <span className="font-extrabold text-[color:var(--foreground)]">{formatCurrency(session.price)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
                        <span>Booking type</span>
                        <span className="capitalize font-bold text-[color:var(--foreground)]">{booking.bookingType}</span>
                      </div>
                      <div className="border-t border-[color:var(--line)] pt-3 text-sm text-[color:var(--muted)]">
                        Stripe checkout and webhook confirmation are already scaffolded. Until live keys are added, the flow stays local-demo safe.
                      </div>
                    </div>
                  </div>
                </div>
              </SurfaceCard>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/booking/confirm?bookingId=${booking.id}`} className="btn-primary">
                Reserve and pay
              </Link>
              <Link href="/login" className="btn-secondary">
                Member login instead
              </Link>
            </div>
          </SurfaceCard>

          <div className="space-y-5">
            <SurfaceCard className="p-6">
              <StatusBadge tone="amber">Capacity hold</StatusBadge>
              <p className="mt-4 text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">{payment?.status ?? "pending"}</p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">Your slot stays reserved while the checkout session is active.</p>
              <div className="mt-5 flex items-start gap-3 rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                <TimerReset className="mt-1 h-5 w-5 text-[color:var(--amber)]" />
                <div>
                  <p className="font-extrabold text-[color:var(--foreground)]">Hold expires</p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">{booking.holdExpiresAt ?? "Configured by session policy"}</p>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <p className="text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">Reservation summary</p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
                <div className="flex items-center justify-between">
                  <span>Session</span>
                  <span className="font-extrabold text-[color:var(--foreground)]">{session.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>When</span>
                  <span className="font-extrabold text-[color:var(--foreground)]">{session.timeLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Skill level</span>
                  <span className="font-extrabold text-[color:var(--foreground)]">{session.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="font-extrabold text-[color:var(--foreground)]">{formatCurrency(session.price)}</span>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
