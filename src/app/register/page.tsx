import Link from "next/link";

import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SurfaceCard } from "@/components/surface-card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-5">
            <p className="eyebrow">Member sign up</p>
            <h1 className="hero-title max-w-xl">Create a player profile.</h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--muted)]">
              This route is only for players and members. It should make repeat booking easier, not open the staff
              workspace.
            </p>

            <SurfaceCard className="p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">Member benefits</p>
              <div className="mt-4 space-y-3 text-sm text-[color:var(--foreground)]">
                <p>Saved profile and avatar</p>
                <p>Booking history and payment visibility</p>
                <p>Faster repeat checkout</p>
              </div>
            </SurfaceCard>
          </section>

          <SurfaceCard className="p-8 sm:p-10">
            <h2 className="text-3xl font-extrabold tracking-[-0.06em] text-[color:var(--foreground)]">Create member account</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              Sign up once, then use the same account for booking, waitlist, and player profile updates.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["First name", "Last name", "Email", "Phone", "Password", "Skill level"].map((label) => (
                <label key={label} className="grid gap-2 text-sm font-bold text-[color:var(--muted)]">
                  {label}
                  <span className="field-shell">
                    <input className="w-full bg-transparent text-[color:var(--foreground)] outline-none placeholder:text-stone-400" />
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              <Link href="/account" className="btn-primary">
                Create account
              </Link>
              <Link href="/sessions" className="btn-secondary">
                Continue as guest
              </Link>
            </div>
          </SurfaceCard>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
