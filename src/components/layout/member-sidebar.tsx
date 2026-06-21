"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Calendar, 
  CreditCard, 
  Wallet, 
  Swords, 
  Award 
} from "lucide-react";

interface MemberSidebarProps {
  clubSlug: string;
}

export function MemberSidebar({ clubSlug }: MemberSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: `/${clubSlug}/account`, label: "Account", index: "01", icon: User },
    { href: `/${clubSlug}/account/bookings`, label: "Bookings", index: "02", icon: Calendar },
    { href: `/${clubSlug}/account/membership`, label: "Membership", index: "03", icon: CreditCard },
    { href: `/${clubSlug}/account/wallet`, label: "Wallet", index: "04", icon: Wallet },
    { href: `/${clubSlug}/account/matchmaking`, label: "Duels", index: "05", icon: Swords },
    { href: `/${clubSlug}/account/loyalty`, label: "Loyalty", index: "06", icon: Award },
  ];

  const isActive = (href: string) => {
    if (href === `/${clubSlug}/account`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full lg:w-[240px] shrink-0 space-y-4">
      {/* Sidebar Navigation */}
      <nav className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-2 sm:p-2.5 shadow-[var(--shadow-sm)] flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible scrollbar-none shrink-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`h-10 rounded-[9px] flex items-center justify-between px-3 text-xs font-black transition-colors shrink-0 ${
                active
                  ? "bg-[#2a231e] text-white"
                  : "text-[#6d625a] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </span>
              <span className={`hidden lg:inline font-mono text-[10px] ${active ? "text-white/60" : "opacity-60"} ml-3`}>
                {item.index}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Info Card */}
      <div className="hidden lg:block bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-4 shadow-[var(--shadow-sm)]">
        <h4 className="text-xs font-black text-[var(--ink)] tracking-tight">Live Desk quality bar</h4>
        <p className="text-[11px] text-[var(--muted)] font-semibold leading-relaxed mt-1.5">
          These screens mirror the active pacing, high readability, and clean details of the Live Desk layout, adapted for player actions.
        </p>
      </div>
    </aside>
  );
}
