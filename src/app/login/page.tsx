import Link from "next/link";

import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SurfaceCard } from "@/components/surface-card";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-16">
        <SurfaceCard className="mx-auto max-w-xl p-8">
          <p className="eyebrow">Member access</p>
          <h1 className="section-title mt-3">Sign in and keep booking friction low.</h1>
          <div className="mt-8 grid gap-4">
            {["Email", "Password"].map((label) => (
              <label key={label} className="grid gap-2 text-sm text-slate-300">
                {label}
                <input
                  type={label === "Password" ? "password" : "email"}
                  className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none"
                />
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/account" className="rounded-full bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)] px-6 py-3 text-sm font-bold text-slate-950">
              Sign in
            </Link>
            <Link href="/register" className="rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-slate-100">
              Create account
            </Link>
          </div>
        </SurfaceCard>
      </main>
      <PublicFooter />
    </div>
  );
}
