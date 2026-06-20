import Link from "next/link";

import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SurfaceCard } from "@/components/surface-card";

const metrics = [
  ["6", "courts configured"],
  ["124", "bookings this week"],
  ["92%", "online payment rate"],
];

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <section className="space-y-6">
            <p className="eyebrow">Staff access</p>
            <h1 className="hero-title max-w-xl">One login. Every court.</h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--muted)]">
              Sign in to the club workspace for liveboard control, bookings, queue calls, payments, and floor operations.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map(([value, label], index) => (
                <SurfaceCard key={label} className="p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{
                        background:
                          index === 0 ? "var(--brand)" : index === 1 ? "var(--green)" : "var(--amber)",
                      }}
                    />
                    <p className="text-3xl font-extrabold tracking-[-0.06em] text-[color:var(--foreground)]">{value}</p>
                  </div>
                  <p className="mt-3 text-sm font-bold text-[color:var(--muted)]">{label}</p>
                </SurfaceCard>
              ))}
            </div>
          </section>

          <SurfaceCard className="mx-auto w-full max-w-xl p-8 sm:p-10">
            <p className="eyebrow">Club workspace</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.06em] text-[color:var(--foreground)]">Welcome back</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              Use your staff account to manage live operations. Member booking access lives separately.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                { label: "Email address", type: "email", placeholder: "owner@club.com" },
                { label: "Password", type: "password", placeholder: "••••••••" },
              ].map((field) => (
                <label key={field.label} className="grid gap-2 text-sm font-bold text-[color:var(--muted)]">
                  {field.label}
                  <span className="field-shell">
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full bg-transparent text-[color:var(--foreground)] outline-none placeholder:text-stone-400"
                    />
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              <Link href="/admin" className="btn-primary">
                Continue to staff workspace
              </Link>
              <Link href="/sessions" className="btn-secondary">
                Continue to public booking
              </Link>
            </div>

            <div className="mt-6 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">Member account</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                Players should not land in staff login by mistake. Use the member account path for saved bookings and faster checkout.
              </p>
              <Link href="/register" className="mt-4 inline-flex text-sm font-extrabold text-[color:var(--brand-deep)]">
                Create a member account
              </Link>
            </div>
          </SurfaceCard>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
