import * as React from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanProps {
  name: string;
  price: number;
  period?: string;
  description: string;
  features: PlanFeature[] | string[];
  isCurrent?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
  badgeText?: string;
}

export function PlanCard({
  name,
  price,
  period = "/month",
  description,
  features,
  isCurrent = false,
  ctaText = "Get Started",
  onCtaClick,
  badgeText,
}: PlanProps) {
  return (
    <Card
      variant={isCurrent ? "warm" : "surface"}
      className={`p-6 sm:p-8 flex flex-col justify-between border ${
        isCurrent ? "border-[var(--brand)]" : "border-[var(--line-strong)]"
      } hover:shadow-lg transition-all duration-300`}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-black tracking-tight">{name}</h3>
          {badgeText ? (
            <Badge tone="brand">{badgeText}</Badge>
          ) : (
            isCurrent && <Badge tone="brand">Current Plan</Badge>
          )}
        </div>

        <div className="flex items-baseline">
          <span className="text-4xl font-black font-mono tracking-tight">
            ${price}
          </span>
          <span className="text-xs font-bold text-[var(--muted)] ml-1">
            {period}
          </span>
        </div>

        <p className="text-xs font-bold text-[var(--muted)] leading-relaxed">
          {description}
        </p>

        <ul className="space-y-3 pt-4 border-t border-[var(--line)]/50">
          {features.map((feature, idx) => {
            const text = typeof feature === "string" ? feature : feature.text;
            const included = typeof feature === "string" ? true : feature.included;
            return (
              <li
                key={idx}
                className={`flex items-start gap-2.5 text-xs font-bold ${
                  included ? "text-[var(--muted)]" : "text-[var(--muted)]/40 line-through"
                }`}
              >
                <Check className={`w-4 h-4 shrink-0 ${included ? "text-[var(--brand)]" : "text-[var(--muted)]/20"}`} />
                <span>{text}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8 pt-4">
        <Button
          variant={isCurrent ? "secondary" : "primary"}
          className="w-full"
          disabled={isCurrent}
          onClick={onCtaClick}
        >
          {isCurrent ? "Active Tier" : ctaText}
        </Button>
      </div>
    </Card>
  );
}
