import Link from "next/link";

import { club } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

const links = [
  { href: "/", label: "Home" },
  { href: "/sessions", label: "Sessions" },
  { href: "/account/bookings", label: "My Bookings" },
  { href: "/admin", label: "Admin" },
  { href: "/liveboard/tv/friday-open-play", label: "TV Board" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(5,11,16,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)] text-sm font-black tracking-[0.2em] text-slate-950">
            {club.logo}
          </div>
          <div>
            <p className="text-lg font-semibold tracking-[-0.04em] text-white">{club.name}</p>
            <p className="text-sm text-slate-400">Mobile booking + live operations</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <StatusBadge tone="cyan">Realtime ready</StatusBadge>
        </nav>
      </div>
    </header>
  );
}
