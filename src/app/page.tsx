"use client";

import * as React from "react";
import Link from "next/link";

export default function SimpleLandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F1] text-[#1A1614] flex flex-col items-center justify-center p-6 antialiased font-sans">
      {/* Glow Effects */}
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_50%_30%,rgba(240,79,42,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(221,167,59,0.06),transparent_40%)]" />

      <main className="max-w-xl w-full text-center space-y-8">
        {/* Brand Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F04F2A] font-black text-white text-3xl shadow-[0_8px_30px_rgba(240,79,42,0.3)]">
          PP
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#1A1614] font-heading">
            PICKLE PULSE
          </h1>
          <p className="text-sm font-semibold tracking-[0.2em] text-[#F04F2A] uppercase">
            Pickleball & Court Ops
          </p>
        </div>

        {/* Status Copy */}
        <div className="p-5 rounded-2xl border border-coral-500/10 bg-white shadow-[0_8px_30px_rgba(26,22,20,0.04)] space-y-2">
          <h2 className="font-bold text-base text-[#1A1614]">Work in Progress</h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            We are simplifying the layout. In the meantime, use the quick links below to access active control desks and displays.
          </p>
        </div>

        {/* Navigation Quick Links */}
        <div className="grid gap-3 sm:grid-cols-2 text-left">
          <Link
            href="/kadikoy/admin-live"
            className="group flex flex-col p-4 rounded-xl border border-neutral-200 bg-white transition-all hover:border-[#F04F2A] hover:shadow-[0_8px_24px_rgba(240,79,42,0.08)]"
          >
            <span className="text-sm font-black text-[#1A1614] group-hover:text-[#F04F2A] flex items-center gap-2">
              ◉ Admin Live Desk <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
            <span className="text-xs text-neutral-400 mt-1">
              Call next players, end active sets, and manage the court queue.
            </span>
          </Link>

          <Link
            href="/kadikoy/liveboard/tv/friday-open-play"
            className="group flex flex-col p-4 rounded-xl border border-neutral-200 bg-white transition-all hover:border-[#F04F2A] hover:shadow-[0_8px_24px_rgba(240,79,42,0.08)]"
          >
            <span className="text-sm font-black text-[#1A1614] group-hover:text-[#F04F2A] flex items-center gap-2">
              ↗ TV Liveboard <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
            <span className="text-xs text-neutral-400 mt-1">
              Public lobby display showing real-time court statuses and announcements.
            </span>
          </Link>
        </div>
      </main>

      <footer className="mt-16 text-center text-xs font-semibold text-neutral-400 tracking-wider">
        © 2026 PICKLE PULSE. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
