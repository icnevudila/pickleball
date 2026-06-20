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
      surface: "page-panel rounded-[16px] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
      warm: "warm-panel rounded-[16px] bg-[var(--surface-soft)] shadow-[var(--shadow-sm)]",
      elevated: "rounded-[16px] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-lg)]",
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
