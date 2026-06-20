import * as React from "react";
import { Card } from "./card";
import { cx } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cx("p-6 flex flex-col justify-between relative overflow-hidden", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
          {label}
        </span>
        {icon && <div className="text-[var(--brand)] opacity-80">{icon}</div>}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-black font-mono tracking-tight text-[var(--foreground)]">
          {value}
        </span>
        {trend && (
          <span
            className={cx(
              "text-xs font-bold px-2 py-0.5 rounded-full border",
              trend.direction === "up"
                ? "bg-[color-mix(in_srgb,var(--green)_10%,transparent)] border-[color-mix(in_srgb,var(--green)_20%,transparent)] text-[var(--green)]"
                : trend.direction === "down"
                ? "bg-[color-mix(in_srgb,var(--red)_10%,transparent)] border-[color-mix(in_srgb,var(--red)_20%,transparent)] text-[var(--red)]"
                : "bg-[var(--surface-soft)] border-[var(--line)] text-[var(--muted)]"
            )}
          >
            {trend.direction === "up" && "↑"}
            {trend.direction === "down" && "↓"} {trend.value}
          </span>
        )}
      </div>
    </Card>
  );
}
