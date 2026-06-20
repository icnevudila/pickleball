import * as React from "react";
import { Award, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface LoyaltyProgressProps {
  currentPoints: number;
  pointsNeeded: number;
  tierName: string;
  nextTierName: string;
  className?: string;
}

export function LoyaltyProgress({
  currentPoints,
  pointsNeeded,
  tierName,
  nextTierName,
  className,
}: LoyaltyProgressProps) {
  const percentage = Math.min(100, Math.round((currentPoints / pointsNeeded) * 100));

  return (
    <Card variant="surface" className={`p-6 border border-[var(--line-strong)] ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-4 border-b border-[var(--line)]/50 pb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[var(--brand)]" />
          <h3 className="text-lg font-black tracking-tight text-[var(--foreground)]">
            Loyalty Level: {tierName}
          </h3>
        </div>
        <Badge tone="brand">Pulse Points</Badge>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-black font-mono tracking-tight text-[var(--foreground)]">
            {currentPoints}
            <span className="text-xs font-bold text-[var(--muted)] font-sans"> / {pointsNeeded} PTS</span>
          </span>
          <span className="text-xs font-semibold text-[var(--muted)]">
            {pointsNeeded - currentPoints} pts to {nextTierName}
          </span>
        </div>

        <div className="w-full bg-[var(--surface-soft)] rounded-full h-3 border border-[var(--line)] overflow-hidden">
          <div
            className="bg-gradient-to-r from-[var(--brand)] to-[#ff7654] h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex gap-3 items-start bg-[var(--surface-muted)] border border-[var(--line)] rounded-[16px] p-4.5 mt-2">
          <Gift className="w-5 h-5 text-[var(--brand)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--foreground)]">
              Next Reward Unlocks
            </h4>
            <p className="text-[11px] font-semibold text-[var(--muted)] leading-relaxed">
              Earn {pointsNeeded - currentPoints} more points to get a free 1-hour session reservation credit!
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
