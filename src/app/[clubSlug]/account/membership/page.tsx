"use client";

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Check, CreditCard, Sparkles, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";

const membershipPlans = [
  {
    id: "guest",
    name: "Guest Plan",
    price: 0,
    priceLabel: "TRY 0",
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
    name: "Weekend Pro",
    price: 1250,
    priceLabel: "TRY 1,250",
    period: "/mo",
    description: "Our most popular tier for weekend warriors",
    features: [
      "Book courts up to 7 days in advance",
      "12 monthly court credits",
      "10% discount on all extra booking slots",
      "Advanced player statistics access",
    ],
    cta: "Upgrade Tier",
    active: false,
  },
  {
    id: "premium",
    name: "Unlimited Pro",
    price: 1900,
    priceLabel: "TRY 1,900",
    period: "/mo",
    description: "For players looking for maximum privileges",
    features: [
      "Book courts up to 14 days in advance",
      "Unlimited court slots (fair use)",
      "Bring up to 2 guests at member rates",
      "Free locker usage & complimentary grip towels",
    ],
    cta: "Go Unlimited",
    active: false,
  },
];

interface MembershipPageProps {
  params: Promise<{ clubSlug: string }>;
}

export default function MembershipPage({ params }: MembershipPageProps) {
  const { clubSlug } = use(params);
  const [selectedPlan, setSelectedPlan] = React.useState("member"); // Starts with active "Weekend Pro"
  const [isUpgrading, setIsUpgrading] = React.useState(false);

  const handleUpgrade = (planId: string) => {
    setIsUpgrading(true);
    setTimeout(() => {
      setSelectedPlan(planId);
      setIsUpgrading(false);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-5 animate-fade-in stagger-1">
        <Link
          href={`/${clubSlug}/account`}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)] hover:text-[var(--brand)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold tracking-[-0.06em] text-[var(--foreground)]">Membership Status</h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] font-semibold leading-relaxed">
          Monitor your remaining credits, active benefits, and monthly savings at the club.
        </p>
      </div>

      {/* Stats Grid */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-4 animate-fade-in stagger-2">
        <StatCard
          label="Weekend Pro"
          value="Active Plan"
          icon={<Star className="w-5 h-5 text-amber-500" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
        <StatCard
          label="Credits Remaining"
          value="8 credits"
          icon={<CreditCard className="w-5 h-5 text-[var(--brand)]" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
        <StatCard
          label="Estimated Savings"
          value="TRY 820"
          icon={<Sparkles className="w-5 h-5 text-[var(--out-green)]" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
        <StatCard
          label="Renewal Schedule"
          value="9 days left"
          icon={<Sparkles className="w-5 h-5 text-slate-400" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
      </section>

      {/* Priority cards row */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[16px] border border-[#bddbcc] bg-[#f4fbf7] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--green)]">
              <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
              Healthy Plan
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">8 credits left</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">No pressure to upgrade tier</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[9px] text-xs font-bold py-2 bg-white border-[var(--line-strong)]">
            Keep Plan
          </Button>
        </article>

        <article className="rounded-[16px] border border-[#e1c486] bg-[#fff8e8] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Auto Renewal
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">Card will be charged</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Renewal scheduled for next month</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[9px] text-xs font-bold py-2 bg-white border-[var(--line-strong)]">
            Manage Card
          </Button>
        </article>

        <article className="rounded-[16px] border border-[#e3b197] bg-gradient-to-b from-[#fffaf5] to-[#fff3eb] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#9d3d25]">
              <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
              Tier Recommendation
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">Unlimited may fit</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Based on weekend play logs</p>
          </div>
          <Button variant="primary" size="sm" className="w-full rounded-[9px] text-xs font-bold py-2 bg-[var(--brand)]">
            Compare Tiers
          </Button>
        </article>
      </section>

      {/* Current plan detail vs savings block */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card variant="surface" className="p-6 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)] space-y-4">
          <div className="flex justify-between items-start border-b border-[var(--line)]/50 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">Weekend Pro</h3>
              <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">Current plan · renews soon</p>
            </div>
            <Badge tone="lime">Active</Badge>
          </div>

          <div className="space-y-2">
            <span className="text-3xl font-black font-mono text-[var(--foreground)]">8 / 12</span>
            <p className="text-xs text-[var(--muted)] font-semibold">monthly court credits remaining</p>
            <div className="w-full bg-[var(--surface-soft)] rounded-md h-2 border border-[var(--line)] overflow-hidden">
              <div className="h-full bg-[var(--brand)]" style={{ width: "66%" }} />
            </div>
          </div>
        </Card>

        <Card variant="surface" className="p-6 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)] space-y-4">
          <div className="flex justify-between items-start border-b border-[var(--line)]/50 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">Plan value</h3>
              <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">What you saved this month</p>
            </div>
            <Badge tone="brand">TRY 820</Badge>
          </div>

          {/* Terminal format */}
          <div className="rounded-[12px] bg-[#211b16] text-[#fff8f1] p-4 font-mono text-xs space-y-2">
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span>Court discount</span>
              <span className="font-extrabold text-[var(--brand)]">TRY 520</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span>Open play benefits</span>
              <span className="font-extrabold text-[var(--brand)]">TRY 210</span>
            </div>
            <div className="flex justify-between">
              <span>Cafe POS perks</span>
              <span className="font-extrabold text-[var(--brand)]">TRY 90</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Plan action buttons */}
      <section className="grid gap-4 grid-cols-3">
        <Card variant="surface" className="p-5 border border-[var(--line-strong)] rounded-[14px] text-center space-y-3">
          <h4 className="text-sm font-extrabold">Freeze Plan</h4>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed font-semibold">Pause your tier credits up to 7 days.</p>
          <Button variant="secondary" size="sm" className="w-full text-xs font-semibold py-1 rounded-[8px]">Request freeze</Button>
        </Card>
        <Card variant="surface" className="p-5 border border-[var(--line-strong)] rounded-[14px] text-center space-y-3">
          <h4 className="text-sm font-extrabold">Upgrade Plan</h4>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed font-semibold">Move to Unlimited Pro tier instantly.</p>
          <Button variant="primary" size="sm" className="w-full text-xs font-semibold py-1 rounded-[8px] bg-[var(--brand)]">Upgrade now</Button>
        </Card>
        <Card variant="surface" className="p-5 border border-[var(--line-strong)] rounded-[14px] text-center space-y-3">
          <h4 className="text-sm font-extrabold">Plan Policies</h4>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed font-semibold">Cancellation rules and booking limits.</p>
          <Button variant="secondary" size="sm" className="w-full text-xs font-semibold py-1 rounded-[8px]">Read policy</Button>
        </Card>
      </section>

      {/* Choose a tier plan details */}
      <section className="space-y-6 pt-6">
        <div className="border-b border-[var(--line)] pb-4">
          <h2 className="text-xl font-black text-[var(--foreground)]">Upgrade Options</h2>
          <p className="text-xs font-semibold text-[var(--muted)] mt-1">
            Choose a plan that fits your court scheduling habits and play frequency.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {membershipPlans.map((plan) => {
            const isCurrent = plan.id === selectedPlan;
            return (
              <Card
                key={plan.id}
                variant={isCurrent ? "surface" : "surface"}
                className={`p-6 flex flex-col justify-between border ${
                  isCurrent ? "border-[var(--brand)] ring-1 ring-[var(--brand)]" : "border-[var(--line-strong)]"
                } hover:shadow-md transition-all duration-300 rounded-[16px]`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black tracking-tight">{plan.name}</h3>
                    {isCurrent && <Badge tone="brand">Current Tier</Badge>}
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-3xl font-black font-mono tracking-tight">
                      {plan.priceLabel}
                    </span>
                    <span className="text-xs font-bold text-[var(--muted)] ml-1">
                      {plan.period}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[var(--muted)] leading-relaxed">
                    {plan.description}
                  </p>

                  <ul className="space-y-2.5 pt-4 border-t border-[var(--line)]/50">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-[var(--muted)]">
                        <Check className="w-4 h-4 text-[var(--brand)] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-2">
                  <Button
                    variant={isCurrent ? "secondary" : "primary"}
                    className="w-full rounded-[9px] text-xs font-bold py-2 bg-[var(--brand)]"
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
      </section>
    </div>
  );
}
