import Link from "next/link";
import { CheckCircle2, MessageSquareShare, MonitorPlay } from "lucide-react";

import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";

export default function BookingConfirmPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-16">
        <SurfaceCard className="mx-auto max-w-3xl p-8 text-center sm:p-12">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)]">
            <CheckCircle2 className="h-9 w-9 text-slate-950" />
          </div>
          <StatusBadge tone="lime">Confirmed</StatusBadge>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl">
            Your booking is live and ready for check-in.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            Payment succeeded, the booking is stored, and the session can now show you on player-facing and admin-facing views.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SurfaceCard className="border-white/8 bg-black/15 p-5">
              <p className="font-semibold text-white">Booking</p>
              <p className="mt-2 text-sm text-slate-300">Stored and visible in the account area.</p>
            </SurfaceCard>
            <SurfaceCard className="border-white/8 bg-black/15 p-5">
              <p className="font-semibold text-white">Check-in</p>
              <p className="mt-2 text-sm text-slate-300">Staff can move you from arrival to queue in one click.</p>
            </SurfaceCard>
            <SurfaceCard className="border-white/8 bg-black/15 p-5">
              <p className="font-semibold text-white">Liveboard</p>
              <p className="mt-2 text-sm text-slate-300">When you play, the public screen picks up the assignment.</p>
            </SurfaceCard>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/account/bookings"
              className="rounded-full bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)] px-6 py-3 text-sm font-bold text-slate-950"
            >
              View my bookings
            </Link>
            <Link
              href="/liveboard/tv/friday-open-play"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-slate-100"
            >
              <MonitorPlay className="h-4 w-4" />
              Open liveboard
            </Link>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-100"
            >
              <MessageSquareShare className="h-4 w-4" />
              Review admin booking control
            </Link>
          </div>
        </SurfaceCard>
      </main>
      <PublicFooter />
    </div>
  );
}
