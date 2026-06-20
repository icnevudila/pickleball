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
    <aside className="rounded-[28px] border border-white/10 bg-white/6 p-5">
      <p className="mb-6 text-lg font-semibold tracking-[-0.04em] text-white">Admin control</p>
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-white/10 hover:bg-white/8 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
