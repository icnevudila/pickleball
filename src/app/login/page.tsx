import Link from "next/link";

import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SurfaceCard } from "@/components/surface-card";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-5">
            <p className="eyebrow">Staff sign in</p>
            <h1 className="hero-title max-w-xl">This screen is for club staff only.</h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--muted)]">
              Use this route for desk operations, queue control, payments, and liveboard actions. Players should use
              booking or member signup instead.
            </p>

            <SurfaceCard className="p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">Goes to workspace</p>
              <div className="mt-4 space-y-3 text-sm text-[color:var(--foreground)]">
                <p>Queue and check-in</p>
                <p>Court assignment and timers</p>
                <p>Payments and booking review</p>
              </div>
            </SurfaceCard>
          </section>

          <SurfaceCard className="mx-auto w-full max-w-xl p-8 sm:p-10">
            <h2 className="text-3xl font-extrabold tracking-[-0.06em] text-[color:var(--foreground)]">Staff workspace login</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              Members do not log in here. This route opens the internal club workspace.
            </p>

            <div className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-[color:var(--muted)]">
                Email
                <span className="field-shell">
                  <input
                    type="email"
                    placeholder="owner@club.com"
                    className="w-full bg-transparent text-[color:var(--foreground)] outline-none placeholder:text-stone-400"
                  />
                </span>
              </label>
              <label className="grid gap-2 text-sm font-bold text-[color:var(--muted)]">
                Password
                <span className="field-shell">
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-transparent text-[color:var(--foreground)] outline-none placeholder:text-stone-400"
                  />
                </span>
              </label>
            </div>

            <div className="mt-6 grid gap-3">
              <Link href="/admin" className="btn-primary">
                Enter workspace
              </Link>
              <Link href="/sessions" className="btn-secondary">
                Go to public booking
              </Link>
            </div>
          </SurfaceCard>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
