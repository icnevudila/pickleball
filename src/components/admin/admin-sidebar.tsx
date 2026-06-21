"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useState } from "react";
import { cx } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", num: "01" },
  { href: "/admin/live", label: "Live desk", num: "02" },
  { href: "/admin/bookings", label: "Calendar", num: "03" },
  { href: "/admin/sessions", label: "Reservations", num: "04" }, // Map reservations to sessions list
  { href: "/admin/courts", label: "Courts", num: "05" },
  { href: "/admin/members", label: "Members", num: "06" },
  { href: "/admin/payments", label: "Payments", num: "07" },
  { href: "/admin/player-access", label: "Player access", num: "08" },
  { href: "/admin/settings", label: "Settings", num: "09" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";
  const [quietOps, setQuietOps] = useState(false);

  return (
    <aside className="w-full lg:w-[208px] shrink-0 lg:sticky lg:top-[78px] flex flex-col gap-3">
      {/* Navigation Group */}
      <nav className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[12px] p-1.5 shadow-[0_1px_0_rgba(49,36,24,0.04)] grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col gap-[2px]">
        {links.map((link) => {
          const scopedHref = clubSlug ? `/${clubSlug}${link.href}` : link.href;
          const isActive = pathname === scopedHref;
          
          return (
            <Link
              key={link.href}
              href={scopedHref}
              className={cx(
                "h-[34px] rounded-[8px] flex items-center justify-between px-2.5 text-xs font-semibold transition-all",
                isActive
                  ? "bg-[#2a231e] text-white font-bold"
                  : "text-[#6d625a] hover:bg-[#fbf3ea] hover:text-[#211b16]"
              )}
            >
              <span>{link.label}</span>
              <span className="font-mono text-[10px] opacity-60">{link.num}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quiet Ops Mode Card */}
      <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[12px] p-3 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-[#211b16] text-[12px]">Quiet ops mode</span>
          <button
            onClick={() => setQuietOps(!quietOps)}
            className={cx(
              "w-8 h-4 rounded-full relative transition-all duration-200 border",
              quietOps ? "bg-[#dfff72] border-[#c0d64d]" : "bg-[#f2e7dc] border-[#d1bdae]"
            )}
          >
            <span
              className={cx(
                "w-3.5 h-3.5 rounded-full bg-white absolute top-[0.5px] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.15)]",
                quietOps ? "left-[13.5px]" : "left-[0.5px]"
              )}
            />
          </button>
        </div>
        <p className="text-[#756a61] text-[11px] leading-[1.4]">
          Global queue + court pinning work together. Clear goal: waiting list is visible, screen alerts when time is near.
        </p>
      </div>
    </aside>
  );
}
