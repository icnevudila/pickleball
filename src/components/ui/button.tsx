"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      isLoading = false,
      icon,
      iconRight,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const baseStyles =
      "inline-flex items-center justify-center rounded-[12px] font-extrabold transition-all duration-200 active:scale-98 disabled:pointer-events-none disabled:opacity-50 gap-2";

    const variants = {
      primary:
        "text-white shadow-[0_16px_26px_rgba(240,79,42,0.24)] hover:shadow-[0_12px_20px_rgba(240,79,42,0.3)] hover:-translate-y-0.5",
      secondary:
        "border border-[var(--line)] bg-[rgba(255,255,255,0.92)] text-[var(--foreground)] hover:border-[color-mix(in_srgb,var(--brand)_26%,white)] hover:bg-[color-mix(in_srgb,var(--brand-soft)_56%,white)] hover:text-[var(--brand-deep)]",
      ghost:
        "bg-transparent text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]",
      danger:
        "bg-[var(--red)] text-white shadow-[0_8px_16px_rgba(192,57,43,0.2)] hover:bg-[color-mix(in_srgb,var(--red)_90%,black)] hover:-translate-y-0.5",
    };

    const variantClasses = {
      primary: "btn-primary",
      secondary: "",
      ghost: "",
      danger: "",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {!isLoading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
      </>
    );

    return (
      <Comp
        className={cx(
          baseStyles,
          variants[variant],
          variantClasses[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {asChild ? children : content}
      </Comp>
    );
  }
);

Button.displayName = "Button";
