"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Sparkles, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicFooter } from "@/components/layout/public-footer";

const membershipPlans = [
  {
    id: "guest",
    name: "Guest Plan",
    price: 0,
    priceLabel: "Free",
    period: "",
    description: "Standard public booking access",
    features: [
      "Book courts up to 3 days in advance",
      "Standard court pricing per slot",
      "Lobby TV queue display status",
    ],
    cta: "Current Plan",
    active: true,
  },
  {
    id: "member",
    name: "Club Member",
    price: 19,
    priceLabel: "$19",
    period: "/mo",
    description: "Our most popular tier for active players",
    features: [
      "Book courts up to 7 days in advance",
      "10% discount on all seans fees",
      "Advanced player statistics access",
      "Dedicated member-only seans access",
    ],
    cta: "Upgrade Tier",
    active: false,
  },
  {
    id: "premium",
    name: "Premium Pro",
    price: 49,
    priceLabel: "$49",
    period: "/mo",
    description: "For players looking for maximum privileges",
    features: [
      "Book courts up to 14 days in advance",
      "20% discount on all seans fees",
      "Unlimited waiting list prioritizations",
      "Bring up to 2 guests at member rates",
      "Free locker usage & complimentary grip towels",
    ],
    cta: "Go Premium",
    active: false,
  },
];

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = React.useState("guest");
  const [isUpgrading, setIsUpgrading] = React.useState(false);

  const handleUpgrade = (planId: string) => {
    setIsUpgrading(true);
    setSelectedPlan(planId);
    setTimeout(() => {
      setIsUpgrading(false);
      alert(`Success! You have switched to the ${planId} tier.`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <SiteHeader />

      <main className="container-shell flex-1 py-10">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-3 mb-8 animate-fade-in stagger-1">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)] hover:text-[var(--brand)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="section-title text-3xl font-black mt-2">Club Membership</h1>
          <p className="text-sm leading-relaxed text-[var(--muted)] max-w-2xl">
            Upgrade your membership tier, view rewards perks, tracking active balances, and upcoming invoice schedules.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-10 animate-fade-in stagger-2">
          <StatCard
            label="Current Plan"
            value={membershipPlans.find((p) => p.id === selectedPlan)?.name || "Guest Plan"}
            icon={<Star className="w-5 h-5" />}
          />
          <StatCard
            label="Credit Balance"
            value="$42.00"
            icon={<CreditCard className="w-5 h-5" />}
            trend={{ value: "+$10 this month", direction: "up" }}
          />
          <StatCard
            label="Next Renewal"
            value="July 20, 2026"
            icon={<Sparkles className="w-5 h-5" />}
          />
        </div>

        {/* Pricing Table / Tiers Grid */}
        <div className="space-y-6 animate-fade-in stagger-3">
          <div className="border-b border-[var(--line)] pb-4">
            <h2 className="text-xl font-black text-[var(--foreground)]">Choose a Tier Plan</h2>
            <p className="text-xs font-semibold text-[var(--muted)] mt-1">
              Select the option that best fits your play frequency and court scheduling habits.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 items-stretch pt-2">
            {membershipPlans.map((plan, index) => {
              const isCurrent = plan.id === selectedPlan;
              return (
                <Card
                  key={plan.id}
                  variant={isCurrent ? "warm" : "surface"}
                  className={`p-6 sm:p-8 flex flex-col justify-between border ${
                    isCurrent ? "border-[var(--brand)]" : "border-[var(--line-strong)]"
                  } hover:shadow-lg transition-all duration-300`}
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black tracking-tight">{plan.name}</h3>
                      {isCurrent && <Badge tone="brand">Active Tier</Badge>}
                    </div>

                    <div className="flex items-baseline">
                      <span className="text-4xl font-black font-mono tracking-tight">
                        {plan.priceLabel}
                      </span>
                      <span className="text-xs font-bold text-[var(--muted)] ml-1">
                        {plan.period}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[var(--muted)] leading-relaxed">
                      {plan.description}
                    </p>

                    <ul className="space-y-3 pt-4 border-t border-[var(--line)]/50">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs font-bold text-[var(--muted)]">
                          <Check className="w-4 h-4 text-[var(--brand)] shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4">
                    <Button
                      variant={isCurrent ? "secondary" : "primary"}
                      className="w-full"
                      disabled={isCurrent || isUpgrading}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {isCurrent ? "Your Current Plan" : plan.cta}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
