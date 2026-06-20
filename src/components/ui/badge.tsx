import * as React from "react";
import { cx } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "brand" | "lime" | "amber" | "rose" | "slate" | "live";
}

export function Badge({ className, tone = "slate", children, ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] border transition-colors";

  const tones = {
    brand: "bg-[var(--brand-soft)] border-[color-mix(in_srgb,var(--brand)_16%,transparent)] text-[var(--brand-deep)]",
    lime: "bg-[color-mix(in_srgb,var(--accent-lime)_15%,transparent)] border-[color-mix(in_srgb,var(--accent-lime)_30%,transparent)] text-[color-mix(in_srgb,var(--accent-lime)_80%,black)]",
    amber: "bg-[color-mix(in_srgb,var(--accent-amber)_15%,transparent)] border-[color-mix(in_srgb,var(--accent-amber)_30%,transparent)] text-[color-mix(in_srgb,var(--accent-amber)_80%,black)]",
    rose: "bg-[color-mix(in_srgb,var(--accent-rose)_15%,transparent)] border-[color-mix(in_srgb,var(--accent-rose)_30%,transparent)] text-[var(--red)]",
    slate: "bg-[var(--surface-soft)] border-[var(--line)] text-[var(--muted)]",
    live: "bg-[color-mix(in_srgb,var(--green)_12%,transparent)] border-[color-mix(in_srgb,var(--green)_24%,transparent)] text-[var(--green)]",
  };

  return (
    <div className={cx(baseStyles, tones[tone], className)} {...props}>
      {tone === "live" && (
        <span className="mr-1.5 flex h-1.5 w-1.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--green)]"></span>
        </span>
      )}
      {children}
    </div>
  );
}
