"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/courts", label: "Courts" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/liveboard/friday-open-play", label: "Live Control" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Card variant="surface" className="p-5 border border-[var(--line-strong)] sticky top-24 self-start">
      <Badge tone="brand" className="mb-2">
        Staff Workspace
      </Badge>
      <p className="mb-6 text-2xl font-black tracking-tight text-[var(--foreground)]">
        Admin Control
      </p>
      <div className="space-y-1.5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cx(
                "block rounded-[18px] border px-4 py-3 text-xs font-black uppercase tracking-wider transition-all",
                isActive
                  ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                  : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
