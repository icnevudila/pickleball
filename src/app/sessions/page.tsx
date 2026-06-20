import { SessionCard } from "@/components/booking/session-card";
import { PublicFooter } from "@/components/layout/public-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { sessions } from "@/lib/mock-data";

export default function SessionsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-10">
        <div className="max-w-3xl space-y-4">
          <p className="eyebrow">Find a session</p>
          <h1 className="hero-title">Book as a member, book as a guest, or join the waitlist.</h1>
          <p className="text-lg leading-8 text-slate-300">
            These cards are mobile-first and built for conversion. Capacity, pricing, and booking state stay obvious before
            the player commits to checkout.
          </p>
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
