"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { club } from "@/lib/mock-data";

const links = [
  { href: "/", label: "Home" },
  { href: "/sessions", label: "Sessions" },
  { href: "/account/membership", label: "Membership" },
  { href: "/login", label: "Sign In" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,255,255,0.86)] backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex min-w-0 items-center gap-3 group">
          <div
            className="grid h-11 w-11 place-items-center rounded-[12px] text-sm font-black tracking-[0.16em] text-white shadow-[var(--shadow-sm)] group-hover:scale-105 transition-transform duration-200"
            style={{ background: "linear-gradient(145deg, var(--brand), var(--brand-deep))" }}
          >
            {club.logo}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold tracking-[-0.05em] text-[var(--foreground)] group-hover:text-[var(--brand-deep)] transition-colors">
              {club.name}
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--muted)]">
              Pickleball booking & court ops
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-extrabold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-3 py-2"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="primary" size="sm" asChild>
            <Link href="/sessions">Book Now</Link>
          </Button>
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
              className="text-sm font-extrabold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors py-2 border-b border-[var(--line)]/50"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="primary" className="w-full mt-2" size="md" asChild onClick={() => setIsOpen(false)}>
            <Link href="/sessions">Book Now</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
