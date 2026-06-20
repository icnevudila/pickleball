"use client";

import { useEffect, useState } from "react";

export function CountdownTimer({
  initialSeconds,
  compact = false,
}: {
  initialSeconds?: number;
  compact?: boolean;
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds ?? 0);

  useEffect(() => {
    if (!initialSeconds) return;

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [initialSeconds]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div
      className={compact ? "text-3xl font-extrabold tracking-[-0.08em] text-[color:var(--foreground)]" : "text-5xl font-extrabold tracking-[-0.08em] text-[color:var(--foreground)] sm:text-6xl"}
    >
      {minutes}:{seconds}
    </div>
  );
}
