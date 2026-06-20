"use client";

import * as React from "react";
import { cx, initials } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  ring?: boolean;
}

export function Avatar({
  className,
  src,
  name,
  size = "md",
  ring = false,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base font-bold",
    xl: "h-18 w-18 text-lg font-black",
  };

  return (
    <div
      className={cx(
        "relative flex shrink-0 overflow-hidden rounded-full items-center justify-center font-black uppercase select-none transition-all duration-200",
        sizeClasses[size],
        ring ? "ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-[var(--background)]" : "",
        !src || hasError ? "bg-[var(--surface-soft)] text-[var(--brand-deep)] border border-[var(--line)]" : "",
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
