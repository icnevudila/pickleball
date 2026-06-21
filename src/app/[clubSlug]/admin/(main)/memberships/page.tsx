"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/membership/plan-card";

const activePlansData = [
  {
    id: "guest",
    name: "Guest Plan",
    price: 0,
    activeMembers: 154,
    description: "Standard public booking access",
    features: [
      "Book courts up to 3 days in advance",
      "Standard court pricing per slot",
      "Lobby TV queue display status",
    ],
  },
  {
    id: "member",
    name: "Club Member",
    price: 19,
    activeMembers: 82,
    description: "Our most popular tier for active players",
    features: [
      "Book courts up to 7 days in advance",
      "10% discount on all seans fees",
      "Advanced player statistics access",
      "Dedicated member-only seans access",
    ],
  },
  {
    id: "premium",
    name: "Premium Pro",
    price: 49,
    activeMembers: 34,
    description: "For players looking for maximum privileges",
    features: [
      "Book courts up to 14 days in advance",
      "20% discount on all seans fees",
      "Unlimited waiting list prioritizations",
      "Bring up to 2 guests at member rates",
      "Free locker usage & complimentary grip towels",
    ],
  },
];

export default function AdminMembershipsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between animate-fade-in stagger-1">
        <div className="space-y-2">
          <Badge tone="brand">Membership Plans</Badge>
          <h1 className="section-title text-3xl font-black mt-2">
            Configure club tiers, pricing parameters, and perk inclusions.
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
            Edit active subscription pricing models and review tier distributions across the active player base.
          </p>
        </div>
        <Button variant="primary" size="sm" className="shrink-0">
          Create New Plan
        </Button>
      </div>

      {/* Tiers Distribution overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        {activePlansData.map((plan) => (
          <Card key={plan.id} variant="surface" className="p-6 border border-[var(--line-strong)]">
            <p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{plan.name}</p>
            <p className="text-3xl font-black font-mono tracking-tight text-[var(--foreground)] mt-2">
              {plan.activeMembers}
              <span className="text-xs font-bold text-[var(--muted)] font-sans"> active</span>
            </p>
            <div className="mt-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
              Revenue: ${plan.activeMembers * plan.price}/mo
            </div>
          </Card>
        ))}
      </div>

      {/* Plan Details Grid */}
      <div className="space-y-6">
        <div className="border-b border-[var(--line)] pb-4">
          <h2 className="text-xl font-black text-[var(--foreground)]">Plan Perks & Settings</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
          {activePlansData.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              ctaText="Edit Parameters"
              onCtaClick={() => alert(`Editing parameters for ${plan.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
