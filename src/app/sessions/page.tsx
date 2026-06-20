import { SessionCard } from "@/components/booking/session-card";
import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SurfaceCard } from "@/components/surface-card";
import { sessions } from "@/lib/mock-data";

const days = [
  { label: "Today", date: "Jun 20", active: true },
  { label: "Sun", date: "Jun 21" },
  { label: "Mon", date: "Jun 22" },
  { label: "Tue", date: "Jun 23" },
];

export default function SessionsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <SurfaceCard className="p-6 sm:p-8">
            <p className="eyebrow">Public booking link</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.08em] text-[color:var(--foreground)] sm:text-5xl">
              Book a court or reserve a seat in under a minute.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
              Choose a day, check capacity fast, then decide whether you want a full reservation, a member seat, or a waitlist spot.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {days.map((day) => (
                <div
                  key={day.date}
                  className={
                    day.active
                      ? "rounded-[20px] border px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(240,79,42,0.2)]"
                      : "rounded-[20px] border border-[color:var(--line)] bg-white px-4 py-3 text-sm font-extrabold text-[color:var(--foreground)]"
                  }
                  style={day.active ? { background: "linear-gradient(145deg,var(--brand),#ff7654)", borderColor: "var(--brand)" } : undefined}
                >
                  <p>{day.label}</p>
                  <p className={day.active ? "mt-1 text-white/90" : "mt-1 text-[color:var(--muted)]"}>{day.date}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">Reservation mode</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.06em] text-[color:var(--foreground)]">Online booking should feel obvious.</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ["Guest checkout", "Fastest path for first-time players"],
                ["Member seat", "Saved details and booking control"],
                ["Waitlist", "Clear fallback when a session fills up"],
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
