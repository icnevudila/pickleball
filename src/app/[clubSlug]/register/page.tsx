"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle2, User, Mail, Phone, Lock, Award, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PlayerRegisterPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    skillLevel: "",
  });
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

      <main className="container-shell flex-1 py-12 sm:py-16 flex items-center justify-center">
        <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
          {/* Info Side */}
          <section className="space-y-6 animate-fade-in stagger-1">
            <Badge tone="brand">Join Club</Badge>
            <h1 className="hero-title text-4xl sm:text-5xl leading-none">
              Create a player profile.
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--muted)] max-w-md">
              Register at {clubTitle} to save preferences, keep track of match results, book courts, and start climbing the leaderboard.
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
              Create Player Account
            </h2>
            <p className="mt-2 text-xs font-semibold text-[var(--muted)]">
              Enter details below to set up your profile.
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
                <Button type="submit" variant="primary" className="w-full justify-center" isLoading={isLoading}>
                  Create Account
                </Button>
                <div className="text-center pt-2">
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    Already have an account?{" "}
                    <Link 
                      href={`/${clubSlug}/login`} 
                      className="text-[var(--brand)] hover:underline font-bold"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </main>
      <PublicFooter clubSlug={clubSlug} />
    </div>
  );
}
