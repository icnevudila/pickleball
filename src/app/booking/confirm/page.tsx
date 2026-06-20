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
        <SurfaceCard className="mx-auto max-w-4xl p-8 text-center sm:p-12">
          <div
            className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] text-white"
            style={{ background: "linear-gradient(145deg,var(--brand),#ff7654)" }}
          >
            <CheckCircle2 className="h-9 w-9 text-white" />
          </div>
          <div className="mt-5">
            <StatusBadge tone="lime">Confirmed</StatusBadge>
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.07em] text-[color:var(--foreground)] sm:text-5xl">
            Your reservation is live and ready for check-in.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
            Payment succeeded, the booking is stored, and the session can now flow into player-facing, admin-facing, and liveboard-facing states.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Booking", "Stored and visible in the account area."],
              ["Check-in", "Staff can move you from arrival to queue in one click."],
              ["Liveboard", "When you play, the public screen picks up the assignment."],
            ].map(([title, copy]) => (
              <SurfaceCard key={title} className="bg-[color:var(--surface-muted)] p-5 shadow-none">
                <p className="font-extrabold text-[color:var(--foreground)]">{title}</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{copy}</p>
              </SurfaceCard>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/account/bookings" className="btn-primary">
              View my bookings
            </Link>
            <Link href="/liveboard/tv/friday-open-play" className="btn-secondary">
              <MonitorPlay className="h-4 w-4" />
              Open liveboard
            </Link>
            <Link href="/admin/bookings" className="btn-secondary">
              <MessageSquareShare className="h-4 w-4" />
              Review booking control
            </Link>
          </div>
        </SurfaceCard>
      </main>
      <PublicFooter />
    </div>
  );
}
