import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/courts", label: "Courts" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/liveboard/friday-open-play", label: "Live Control" },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-[28px] border border-[color:var(--line)] bg-white/95 p-5 shadow-[0_20px_60px_rgba(83,39,23,0.08)]">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">Staff workspace</p>
      <p className="mb-6 text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">Admin control</p>
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-[18px] border border-transparent px-4 py-3 text-sm font-bold text-[color:var(--muted)] transition hover:border-[color:var(--line)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--brand-deep)]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
