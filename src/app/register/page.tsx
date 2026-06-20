import Link from "next/link";

import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SurfaceCard } from "@/components/surface-card";

const benefits = [
  "Faster repeat booking with saved details",
  "Booking history and payment visibility",
  "Guest invites and waitlist promotion alerts",
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section className="space-y-6">
            <p className="eyebrow">Member onboarding</p>
            <h1 className="hero-title max-w-xl">Create your club profile before the next booking rush.</h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--muted)]">
              Keep checkout lighter, track your reservations, and move faster when new courts or open sessions go live.
            </p>

            <SurfaceCard className="p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">Why register</p>
              <div className="mt-4 space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4 text-sm font-semibold text-[color:var(--foreground)]">
                    {benefit}
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </section>

          <SurfaceCard className="p-8 sm:p-10">
            <p className="eyebrow">Join the club</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.06em] text-[color:var(--foreground)]">Set up your account</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              This account is for players and members. Staff workspace access stays on the staff login route.
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

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/account" className="btn-primary">
                Create member account
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
