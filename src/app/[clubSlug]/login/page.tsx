"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Lock, Mail, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PlayerLoginPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Formatting club name nicely from slug
  const clubName = clubSlug
    .split("-")
    .map((word) => {
      if (word.toLowerCase() === "istanbul") return "İstanbul";
      if (word.toLowerCase() === "kadikoy") return "Kadıköy";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  const clubTitle = `${clubName} Social Club`;
  const clubLogo = clubName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "PP";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulating player account redirection
    setTimeout(() => {
      window.location.href = `/${clubSlug}/account`;
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
      {/* Simplified Player Auth Header */}
      <header className="border-b border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-sm)] py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href={`/${clubSlug}`} className="flex items-center gap-3 group">
            <div
              className="grid h-10 w-10 place-items-center rounded-[8px] text-xs font-black tracking-wider text-white shadow-[var(--shadow-sm)]"
              style={{ background: "linear-gradient(145deg, var(--brand), var(--brand-deep))" }}
            >
              {clubLogo}
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-[var(--foreground)] group-hover:text-[var(--brand)] transition-colors">
                {clubTitle}
              </p>
              <p className="text-[9px] font-black uppercase tracking-wider text-[var(--muted)]">
                Player Portal
              </p>
            </div>
          </Link>
          <Link
            href={`/${clubSlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Club
          </Link>
        </div>
      </header>

      <main className="flex-1 py-16 sm:py-24 flex items-center justify-center container-shell">
        <div className="w-full max-w-[420px] bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-8 shadow-[var(--shadow-sm)]">
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-2xl font-extrabold tracking-[-0.05em] text-[var(--foreground)]">
              Player Sign In
            </h1>
            <p className="text-xs text-[var(--muted)] font-semibold">
              Log in to manage bookings, track loyalty XP, and access matchmaking duels.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="dani@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
              disabled={isLoading}
              className="rounded-[12px] border-[var(--line)] focus:border-[var(--brand)] focus:ring-[var(--brand)]"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              required
              disabled={isLoading}
              className="rounded-[12px] border-[var(--line)] focus:border-[var(--brand)] focus:ring-[var(--brand)]"
            />

            <div className="pt-2">
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full justify-center rounded-[12px] font-bold text-sm"
                isLoading={isLoading}
              >
                Log In
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--line)] text-center space-y-3">
            <p className="text-xs font-semibold text-[var(--muted)]">
              New to {clubName}?{" "}
              <Link 
                href={`/${clubSlug}/register`} 
                className="text-[var(--brand)] hover:underline font-bold"
              >
                Create a player profile
              </Link>
            </p>
          </div>
        </div>
      </main>
      <PublicFooter clubSlug={clubSlug} />
    </div>
  );
}
