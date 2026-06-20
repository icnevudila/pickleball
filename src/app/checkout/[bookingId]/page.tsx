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
            <div className="space-y-4">
              <p className="eyebrow">Checkout</p>
              <h1 className="section-title">Finish the booking without losing the mobile pace.</h1>
              <p className="text-sm leading-7 text-slate-300">
                This screen is shaped for guest conversion, but it keeps a clear path for member login and profile linking.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <SurfaceCard className="border-white/8 bg-black/15 p-5">
                <div className="flex items-start gap-3">
                  <UserRoundPlus className="mt-1 h-5 w-5 text-cyan-100" />
                  <div>
                    <p className="font-semibold text-white">Player details</p>
                    <div className="mt-4 grid gap-3">
                      {["Full name", "Email", "Phone", "Skill level"].map((label, index) => (
                        <label key={label} className="grid gap-2 text-sm text-slate-300">
                          {label}
                          <input
                            defaultValue={index === 0 ? booking.player.fullName : ""}
                            className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none transition focus:border-cyan-300/40"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </SurfaceCard>

              <SurfaceCard className="border-white/8 bg-black/15 p-5">
                <div className="flex items-start gap-3">
                  <Lock className="mt-1 h-5 w-5 text-lime-200" />
                  <div>
                    <p className="font-semibold text-white">Payment</p>
                    <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-black/15 p-4">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Session seat</span>
                        <span>{formatCurrency(session.price)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Booking type</span>
                        <span className="capitalize">{booking.bookingType}</span>
                      </div>
                      <div className="border-t border-white/8 pt-3 text-sm text-slate-300">
                        Stripe checkout and webhook confirmation are wired through route handlers. If keys are missing, demo mode stays local.
                      </div>
                    </div>
                  </div>
                </div>
              </SurfaceCard>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/booking/confirm?bookingId=${booking.id}`}
                className="rounded-full bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)] px-6 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.01]"
              >
                Pay and confirm
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Already a member? Log in
              </Link>
            </div>
          </SurfaceCard>

          <div className="space-y-5">
            <SurfaceCard className="p-6">
              <StatusBadge tone="amber">Capacity hold</StatusBadge>
              <p className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">{payment?.status ?? "pending"}</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Your slot stays reserved while the checkout session is active.
              </p>
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/8 bg-black/15 p-4">
                <TimerReset className="mt-1 h-5 w-5 text-amber-100" />
                <div>
                  <p className="font-semibold text-white">Hold expires</p>
                  <p className="mt-1 text-sm text-slate-300">{booking.holdExpiresAt ?? "Configured by session policy"}</p>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <p className="text-2xl font-semibold tracking-[-0.05em] text-white">Booking summary</p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Session</span>
                  <span className="text-white">{session.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>When</span>
                  <span className="text-white">{session.timeLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Skill level</span>
                  <span className="text-white">{session.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="text-white">{formatCurrency(session.price)}</span>
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
