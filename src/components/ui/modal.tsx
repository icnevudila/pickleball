"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Card } from "./card";
import { cx } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (overlayRef.current === e.target) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out animate-fade-in"
    >
      <Card
        ref={contentRef}
        className={cx(
          "relative w-full max-w-lg p-6 sm:p-8 animate-scale-in flex flex-col gap-4 overflow-hidden border border-[var(--line-strong)]",
          className
        )}
        variant="surface"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {(title || description) && (
          <div className="flex flex-col gap-1 pr-6">
            {title && (
              <h2 className="text-xl font-black tracking-[-0.05em] text-[var(--foreground)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm font-semibold text-[var(--muted)]">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="flex-1 text-sm text-[var(--foreground)]">{children}</div>
      </Card>
    </div>
  );
}
