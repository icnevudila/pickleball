import { SessionCard } from "@/components/booking/session-card";
import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SurfaceCard } from "@/components/surface-card";
import { sessions } from "@/lib/mock-data";

export default async function SessionsPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;

  // Capitalize clubSlug for presentation if necessary
  const clubName = clubSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />
      <main className="container-shell py-10 sm:py-14 space-y-8 flex-1">
        {/* Dynamic header simulating the dentist project layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-[var(--line)] pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand)]">
              {clubName} Public Portal
            </span>
            <h1 className="text-4xl font-extrabold tracking-[-0.08em] text-[var(--foreground)]">
              Court Schedule & Bookings
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--out-green)] animate-pulse" />
            Showing available rounds today
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <SurfaceCard className="p-6 sm:p-8 flex flex-col justify-center space-y-4">
            <span className="inline-flex w-fit items-center rounded-[8px] bg-[var(--brand-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)]">
              Active sessions
            </span>
            <h2 className="text-3xl font-extrabold tracking-[-0.07em] text-[var(--foreground)]">
              Choose a round.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--muted)] font-semibold">
              Select a scheduling block from the feed below. Check active capacity signals and available court counts before proceeding to the checkout wizard.
            </p>
          </SurfaceCard>

          <SurfaceCard className="p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">Core operations routing</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                ["Guest Checkout", "Fastest split-payment route for walk-ins."],
                ["Member Pass", "Use saved membership details and points."],
                ["Waitlist Queue", "Fallback reservation when court slots are full."],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-muted)] p-5">
                  <p className="text-base font-extrabold tracking-tight text-[var(--foreground)]">{title}</p>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--muted)] font-semibold">{copy}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 pt-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} clubSlug={clubSlug} />
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
