"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      window.location.href = "/kadikoy/admin/live";
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />
      <main className="container-shell flex-1 py-16 sm:py-24 flex items-center justify-center">
        <div className="w-full max-w-[420px] bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-8 shadow-[var(--shadow-sm)]">
          <div className="text-center space-y-3 mb-8">
            {/* Sporty Brand Logo representation */}
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-[8px] bg-[var(--brand)] text-white font-black text-lg">
              P
            </div>
            <h1 className="text-2xl font-extrabold tracking-[-0.05em] text-[var(--foreground)]">
              Log In to Pickle Pulse
            </h1>
            <p className="text-xs text-[var(--muted)] font-semibold">
              Enter your staff credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="name@yourclub.com"
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

          <div className="mt-6 pt-6 border-t border-[var(--line)] text-center">
            <Link 
              href="/kadikoy/sessions" 
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--brand)] hover:underline"
            >
              Go to public court booking <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
