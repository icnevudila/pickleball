import Link from "next/link";

import { club } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

const links = [
  { href: "/", label: "Overview" },
  { href: "/sessions", label: "Book" },
  { href: "/login", label: "Member Login" },
  { href: "/admin", label: "Staff" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-white/86 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-[18px] text-sm font-black tracking-[0.16em] text-white shadow-[0_16px_28px_rgba(240,79,42,0.22)]" style={{ background: "linear-gradient(145deg,var(--brand),#ff7654)" }}>
            {club.logo}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">{club.name}</p>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">Public booking and live club operations</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="btn-secondary px-4 py-2 text-[13px]">
              {link.label}
            </Link>
          ))}
          <StatusBadge tone="cyan">Realtime ready</StatusBadge>
        </nav>
      </div>
    </header>
  );
}
