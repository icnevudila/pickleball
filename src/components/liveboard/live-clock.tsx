"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [time, setTime] = useState(() =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date()),
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()),
      );
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return <span>{time}</span>;
}
