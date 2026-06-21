"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TenantHeaderProps {
  clubSlug: string;
  clubName?: string;
  clubLogo?: string;
}

export function TenantHeader({ clubSlug, clubName = "Pickle Pulse Club", clubLogo = "PP" }: TenantHeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const links = [
    { href: `/${clubSlug}`, label: "Club" },
    { href: `/${clubSlug}/book`, label: "Book Court" },
    { href: `/${clubSlug}/sessions`, label: "Sessions" },
  ];

  const isActive = (href: string) => {
    if (href === `/${clubSlug}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,250,244,0.92)] backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href={`/${clubSlug}`} className="flex min-w-0 items-center gap-3 group">
          <div
            className="grid h-11 w-11 place-items-center rounded-[10px] text-sm font-black tracking-[0.16em] text-white shadow-[var(--shadow-sm)] group-hover:scale-105 transition-transform duration-200"
            style={{ background: "linear-gradient(135deg, #211b16 0%, #3a2a20 100%)" }}
          >
            {clubLogo}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold tracking-[-0.05em] text-[var(--foreground)] group-hover:text-[var(--brand)] transition-colors">
              {clubName}
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--muted)]">
              Public booking · club rhythm
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-extrabold px-4 py-2 rounded-full transition-colors ${
                isActive(link.href)
                  ? "bg-[var(--brand-soft)] border border-[#ecc0ae] text-[var(--brand-deep)]"
                  : "text-[#62564e] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/login`}>Staff Login</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href={`/${clubSlug}/book`}>Book Now</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full lg:hidden text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[var(--surface)] border-b border-[var(--line)] shadow-lg px-4 py-6 flex flex-col gap-4 animate-scale-in">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-sm font-extrabold py-2 border-b border-[var(--line)]/50 transition-colors ${
                isActive(link.href) ? "text-[var(--brand)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-2">
            <Button variant="ghost" className="w-full" size="md" asChild onClick={() => setIsOpen(false)}>
              <Link href={`/login`}>Staff Login</Link>
            </Button>
            <Button variant="primary" className="w-full" size="md" asChild onClick={() => setIsOpen(false)}>
              <Link href={`/${clubSlug}/book`}>Book Now</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
