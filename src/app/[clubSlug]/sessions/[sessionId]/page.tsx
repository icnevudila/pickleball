import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, CreditCard, ShieldCheck, Users } from "lucide-react";

import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/surface-card";
import { club, getSessionById } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = getSessionById(sessionId);

  if (!session) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <StatusBadge tone={session.status === "waitlist" ? "rose" : session.status === "few-spots" ? "amber" : "cyan"}>
              {session.status}
            </StatusBadge>
            <div className="space-y-4">
              <h1 className="hero-title">{session.name}</h1>
              <p className="text-lg leading-8 text-slate-600">{session.hero}</p>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                {session.dayLabel} / {session.dateLabel} / {session.timeLabel} / {session.level}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <SurfaceCard className="p-5">
                <p className="text-3xl font-black tracking-[-0.07em] text-slate-950">
                  {session.booked}/{session.capacity}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Booked</p>
              </SurfaceCard>
              <SurfaceCard className="p-5">
                <p className="text-3xl font-black tracking-[-0.07em] text-slate-950">{session.courts}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Courts</p>
              </SurfaceCard>
              <SurfaceCard className="p-5">
                <p className="text-3xl font-black tracking-[-0.07em] text-slate-950">{formatCurrency(session.price)}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Seat price</p>
              </SurfaceCard>
            </div>

            <SurfaceCard className="p-6">
              <p className="text-2xl font-semibold tracking-[-0.05em] text-slate-950">Session rules</p>
              <div className="mt-5 space-y-3">
                {session.rules.map((rule) => (
                  <div key={rule} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-700" />
                    <p className="text-sm leading-7 text-slate-600">{rule}</p>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>

          <div className="space-y-5">
            <SurfaceCard className="p-6">
              <p className="text-2xl font-semibold tracking-[-0.05em] text-slate-950">Reserve your spot</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Choose a member-fast path or a guest-first path. Both share the same checkout, payment hold, and booking status timeline.
              </p>

              <div className="mt-5 space-y-4">
                <SurfaceCard className="bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Users className="mt-1 h-4 w-4 text-teal-700" />
                    <div>
                      <p className="font-semibold text-slate-950">Member booking</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">
                        Prefilled profile, saved contact details, and faster rebooking inside your account.
                      </p>
                    </div>
                  </div>
                </SurfaceCard>
                <SurfaceCard className="bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-4 w-4 text-emerald-700" />
                    <div>
                      <p className="font-semibold text-slate-950">Guest booking</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">
                        No account wall before payment. Staff can convert the booking into a member profile later.
                      </p>
                    </div>
                  </div>
                </SurfaceCard>
                <SurfaceCard className="bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="mt-1 h-4 w-4 text-amber-700" />
                    <div>
                      <p className="font-semibold text-slate-950">Stripe checkout</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">
                        Capacity is held for 15 minutes while payment is pending.
                      </p>
                    </div>
                  </div>
                </SurfaceCard>
              </div>

              <div className="mt-6 grid gap-3">
                <Link
                  href="/checkout/bkg-1002"
                  className="rounded-full bg-teal-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-teal-700"
                >
                  Continue as guest
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                >
                  Member login
                </Link>
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <p className="text-2xl font-semibold tracking-[-0.05em] text-slate-950">Need help?</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Front desk can assist with guest conversion, walk-ins, and payment exceptions.
              </p>
              <div className="mt-4 text-sm leading-7 text-slate-600">
                <p>{club.phone}</p>
                <p>{club.email}</p>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
