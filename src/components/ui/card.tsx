"use client";

import * as React from "react";
import { cx } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "surface" | "warm" | "elevated";
  as?: React.ElementType;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ as: Component = "div", variant = "surface", className, children, ...props }, ref) => {
    const baseStyles = "backdrop-blur transition-all duration-300";

    const variants = {
      surface: "page-panel rounded-[28px]",
      warm: "warm-panel rounded-[28px]",
      elevated: "rounded-[16px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_24px_48px_rgba(83,39,23,0.12)]",
    };

    return (
      <Component
        ref={ref}
        className={cx(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";
