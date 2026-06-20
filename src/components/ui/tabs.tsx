"use client";

import * as React from "react";
import { cx } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTabId, onChange, className }: TabsProps) {
  return (
    <div className={cx("flex border-b border-[var(--line)] overflow-x-auto", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cx(
              "flex items-center gap-2 py-3 px-4 text-sm font-extrabold border-b-2 transition-all relative whitespace-nowrap focus:outline-none",
              isActive
                ? "border-[var(--brand)] text-[var(--brand-deep)] font-black"
                : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--line-strong)]"
            )}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
