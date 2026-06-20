export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>Built for guest-friendly bookings, fast admin control, and a public liveboard.</p>
        <p>Next.js + Supabase + Stripe starter with production-facing UI.</p>
      </div>
    </footer>
  );
}
