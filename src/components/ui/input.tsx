"use client";

import * as React from "react";
import { cx } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, icon, disabled, id, style, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)] px-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 text-[var(--muted)] pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cx(
              "field-shell w-full text-sm font-semibold transition-all duration-200 outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] disabled:opacity-50",
              error ? "border-[var(--red)] focus:border-[var(--red)] focus:ring-[var(--red)]/10" : "",
              className
            )}
            disabled={disabled}
            ref={ref}
            {...props}
            style={{
              paddingLeft: icon ? "2.75rem" : "1rem",
              ...style
            }}
          />
        </div>
        {error && (
          <p className="text-xs font-semibold text-[var(--red)] px-1 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
