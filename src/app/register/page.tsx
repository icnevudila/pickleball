"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, User, Mail, Phone, Lock, Award } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function RegisterPage() {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    skillLevel: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulating signup redirection to account dashboard
    setTimeout(() => {
      window.location.href = "/account";
    }, 800);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <SiteHeader />
      <main className="container-shell flex-1 py-12 sm:py-16 flex items-center justify-center">
        <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
          {/* Info Side */}
          <section className="space-y-6 animate-fade-in stagger-1">
            <Badge tone="brand">Join Club</Badge>
            <h1 className="hero-title text-4xl sm:text-5xl leading-none">
              Create a player profile.
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--muted)] max-w-md">
              Sign up once, then use the same account for booking, waitlist, and player profile updates. Enjoy priority court assignments and tiered discounts.
            </p>

            <Card variant="warm" className="p-6 border border-[var(--line)] space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--brand-deep)]">
                Member Benefits
              </p>
              <div className="space-y-3">
                {[
                  "Saved profile and customizable avatar",
                  "Booking history and transaction summaries",
                  "Up to 20% discount on peak seans hours",
                  "Priority access to waiting lists",
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-[var(--muted)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Form Card */}
          <Card
            variant="surface"
            className="w-full max-w-xl p-8 sm:p-10 border border-[var(--line-strong)] animate-fade-in stagger-2 shadow-xl"
          >
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--foreground)]">
              Create Member Account
            </h2>
            <p className="mt-2 text-xs font-semibold text-[var(--muted)]">
              Register to save preferences and check out faster.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  icon={<User className="h-4 w-4" />}
                  required
                  disabled={isLoading}
                />
                <Input
                  label="Last name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  icon={<User className="h-4 w-4" />}
                  required
                  disabled={isLoading}
                />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
                disabled={isLoading}
              />

              <Input
                label="Phone"
                type="tel"
                placeholder="+90 555 123 4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                icon={<Phone className="h-4 w-4" />}
                required
                disabled={isLoading}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                required
                disabled={isLoading}
              />

              <Input
                label="Skill level"
                placeholder="3.5 (Intermediate)"
                value={formData.skillLevel}
                onChange={(e) => handleInputChange("skillLevel", e.target.value)}
                icon={<Award className="h-4 w-4" />}
                required
                disabled={isLoading}
              />

              <div className="pt-4 flex flex-col gap-3">
                <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                  Create Account
                </Button>
                <Button type="button" variant="secondary" className="w-full" asChild disabled={isLoading}>
                  <Link href="/sessions">
                    Continue as Guest <ArrowRight className="w-4 h-4 ml-1" />
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
