import { SessionCard } from "@/components/booking/session-card";
import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SurfaceCard } from "@/components/surface-card";
import { sessions } from "@/lib/mock-data";

export default function SessionsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <SurfaceCard className="p-6 sm:p-8">
            <p className="eyebrow">Public booking</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.08em] text-[color:var(--foreground)] sm:text-5xl">
              Choose a session.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
              This is the public reservation screen. Pick a session, check the seat signal, then continue to booking.
            </p>
          </SurfaceCard>

          <SurfaceCard className="p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">Three clear paths</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                ["Guest", "Fastest public booking path"],
                ["Member", "Use saved details and profile"],
                ["Waitlist", "Fallback when session is full"],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-5">
                  <p className="text-lg font-extrabold tracking-[-0.04em] text-[color:var(--foreground)]">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{copy}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
