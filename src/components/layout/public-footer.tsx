import Link from "next/link";
import { club } from "@/lib/mock-data";

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface-muted)] py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Column 1: Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                className="grid h-8 w-8 place-items-center rounded-[10px] text-xs font-black tracking-wider text-white"
                style={{ background: "linear-gradient(145deg, var(--brand), #ff7654)" }}
              >
                {club.logo}
              </div>
              <span className="text-base font-black tracking-tight text-[var(--foreground)]">
                {club.name}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xs">
              Pickleball court operations and online booking engine. Powering modern club rotation and queue systems.
            </p>
            <div className="mt-2 text-xs font-bold text-[var(--muted)] flex flex-col gap-1">
              <span>Tel: {club.phone}</span>
              <span>Email: {club.email}</span>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--foreground)]">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Home
              </Link>
              <Link href="/sessions" className="text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Sessions
              </Link>
              <Link href="/account/membership" className="text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Membership
              </Link>
              <Link href="/login" className="text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Staff Login
              </Link>
              <Link href="/register" className="text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                Member Sign Up
              </Link>
            </nav>
          </div>

          {/* Column 3: Venue Details */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--foreground)]">
              Venue
            </h4>
            <div className="text-xs text-[var(--muted)] flex flex-col gap-2 leading-relaxed">
              <p>
                <strong>Address:</strong><br />
                Acıbadem Cd. No:42, Kadıköy<br />
                Istanbul, Turkey
              </p>
              <p>
                <strong>Hours:</strong><br />
                Daily: 07:00 AM - 11:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-[var(--line)]/50 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
          <p>© {new Date().getFullYear()} {club.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Powered by <span className="text-[var(--brand)] font-black">Pickle Pulse</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
