"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulating login redirection
    setTimeout(() => {
      window.location.href = "/admin";
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <SiteHeader />
      <main className="container-shell flex-1 py-12 sm:py-16 flex items-center justify-center">
        <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
          {/* Info Side */}
          <section className="space-y-6 animate-fade-in stagger-1">
            <Badge tone="brand">Staff Access</Badge>
            <h1 className="hero-title text-4xl sm:text-5xl leading-none">
              This screen is for club staff only.
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--muted)] max-w-md">
              Use this route for desk operations, queue control, court timers, and liveboard adjustments. Players should use booking flows instead.
            </p>

            <Card variant="warm" className="p-6 border border-[var(--line)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--brand-deep)]">
                Internal Ops Controls
              </p>
              <div className="mt-4 space-y-3 text-xs font-bold text-[var(--muted)]">
                <p className="flex items-center gap-2">✓ Realtime queue and check-in</p>
                <p className="flex items-center gap-2">✓ Active court assignment & timers</p>
                <p className="flex items-center gap-2">✓ Payment tracking & walk-in entry</p>
              </div>
            </Card>
          </section>

          {/* Form Card */}
          <Card
            variant="surface"
            className="w-full max-w-xl p-8 sm:p-10 border border-[var(--line-strong)] animate-fade-in stagger-2 shadow-xl"
          >
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--foreground)]">
              Staff Workspace Login
            </h2>
            <p className="mt-2 text-xs font-semibold text-[var(--muted)]">
              Enter your credentials to access the Pickle Pulse command center.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="staff@picklepulse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
                disabled={isLoading}
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
              />

              <div className="pt-2 flex flex-col gap-3">
                <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                  Enter Workspace
                </Button>
                <Button type="button" variant="secondary" className="w-full" asChild disabled={isLoading}>
                  <Link href="/sessions">
                    Go to public booking <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
