import Link from "next/link";

import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import { bookings, currentUser } from "@/lib/mock-data";

export default function AccountPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <SurfaceCard className="p-6">
            <StatusBadge tone="cyan">Member</StatusBadge>
            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.06em] text-white">{currentUser.fullName}</h1>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Saved identity for faster booking, payment reuse, and account-based booking control.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p>Skill level: {currentUser.skillLevel}</p>
              <p>Upcoming bookings: {bookings.length}</p>
              <p>Preferred check-in lane: mobile + front desk</p>
            </div>
          </SurfaceCard>

          <div className="space-y-5">
            <SurfaceCard className="p-6">
              <p className="text-2xl font-semibold tracking-[-0.05em] text-white">Account actions</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/account/bookings" className="rounded-full bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)] px-5 py-3 text-sm font-bold text-slate-950">
                  View bookings
                </Link>
                <Link href="/sessions" className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-slate-100">
                  Book another session
                </Link>
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <p className="text-2xl font-semibold tracking-[-0.05em] text-white">Saved preferences</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {["Intermediate", "Friday evenings", "Guest invitations enabled"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/8 bg-black/15 p-4 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
