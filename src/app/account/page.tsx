import Link from "next/link";

import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import { bookings, currentUser } from "@/lib/mock-data";

const stats = [
  ["3.5", "skill level"],
  [String(bookings.length), "upcoming bookings"],
  ["Mobile", "check-in lane"],
];

export default function AccountPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <SurfaceCard className="p-6">
            <StatusBadge tone="cyan">Member profile</StatusBadge>
            <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.06em] text-[color:var(--foreground)]">{currentUser.fullName}</h1>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              A cleaner member area for saved identity, faster booking, payment visibility, and booking-state control.
            </p>

            <div className="mt-6 grid gap-3">
              {stats.map(([value, label]) => (
                <div key={label} className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</p>
                  <p className="mt-2 text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">{value}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <div className="space-y-5">
            <SurfaceCard className="p-6">
              <p className="eyebrow">Account actions</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.06em] text-[color:var(--foreground)]">Keep booking control close.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
                The member area should explain what happens next without leaking desk complexity. Booking status, payment state, and confirmation all stay player-readable.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/account/bookings" className="btn-primary px-5 py-3">
                  View bookings
                </Link>
                <Link href="/sessions" className="btn-secondary px-5 py-3">
                  Book another session
                </Link>
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <p className="text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">Saved preferences</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {["Intermediate player", "Friday evening sessions", "Guest invitations enabled"].map((item) => (
                  <div key={item} className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4 text-sm font-semibold text-[color:var(--foreground)]">
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
