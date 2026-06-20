"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cx } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/courts", label: "Courts" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/memberships", label: "Membership Plans" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/liveboard/friday-open-play", label: "Live Control" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const clubSlug = params.clubSlug as string;

  return (
    <Card variant="surface" className="p-4 border border-[var(--line-strong)] sticky top-24 self-start rounded-[16px] shadow-[var(--shadow-sm)]">
      <div className="mb-4">
        <span className="inline-flex items-center rounded-[8px] bg-[var(--brand-soft)] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--brand-deep)]">
          Staff Workspace
        </span>
        <p className="mt-2 text-xl font-extrabold tracking-[-0.05em] text-[var(--foreground)]">
          Admin Control
        </p>
      </div>
      <div className="space-y-1">
        {links.map((link) => {
          const scopedHref = clubSlug ? `/${clubSlug}${link.href}` : link.href;
          const isActive = pathname === scopedHref;
          return (
            <Link
              key={link.href}
              href={scopedHref}
              className={cx(
                "block rounded-[12px] border px-3.5 py-2.5 text-xs font-black uppercase tracking-wider transition-all",
                isActive
                  ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-deep)] shadow-[var(--shadow-sm)]"
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
