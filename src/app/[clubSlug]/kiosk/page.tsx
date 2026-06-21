"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

export default function KioskPage() {
  const params = useParams();
  const clubSlug = params.clubSlug as string;

  const [pin, setPin] = React.useState<string>("");

  const handleKeyPress = (val: string) => {
    if (val === "⌫") {
      setPin((prev) => prev.slice(0, -1));
    } else if (val === "OK") {
      if (pin.length > 0) {
        alert(`Checked in with PIN: ${pin}`);
        setPin("");
      }
    } else {
      if (pin.length < 6) {
        setPin((prev) => prev + val);
      }
    }
  };

  const displayPin = () => {
    if (pin.length === 0) return "••  ••";
    return pin.split("").join(" ");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      {/* Mesh grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,128,102,0.02)_1px,transparent_1px),linear-gradient(0deg,rgba(47,128,102,0.02)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      <Card variant="surface" className="w-full max-w-[800px] p-8 border border-[var(--line-strong)] rounded-[28px] shadow-[var(--shadow-lg)] relative z-10 bg-[var(--surface)]">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-[var(--line)] pb-5 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-[10px] text-xs font-black tracking-wider text-white" style={{ background: "linear-gradient(135deg, #211b16 0%, #3a2a20 100%)" }}>
            PP
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-[var(--foreground)] leading-none">Pickle Pulse Check-in</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--muted)] mt-1">QR okut veya PIN gir · walk-in kuyruğa katıl</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Welcome Text & Metrics */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--brand)]">Fast door flow</span>
              <h2 className="text-3xl font-extrabold tracking-[-0.05em] text-[var(--foreground)] leading-tight">
                Hoş geldin.<br />Kort ritmine katıl.
              </h2>
              <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                Rezervasyonun varsa check-in yap. Walk-in isen adını yazıp Live Desk kuyruğuna düş.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-[10px] p-3">
                <span className="text-lg font-black font-mono text-[var(--foreground)]">4</span>
                <p className="text-[9px] text-[var(--muted)] font-semibold mt-0.5">courts live</p>
              </div>
              <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-[10px] p-3">
                <span className="text-lg font-black font-mono text-[var(--foreground)]">12m</span>
                <p className="text-[9px] text-[var(--muted)] font-semibold mt-0.5">next open</p>
              </div>
              <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-[10px] p-3">
                <span className="text-lg font-black font-mono text-[var(--foreground)]">6</span>
                <p className="text-[9px] text-[var(--muted)] font-semibold mt-0.5">waiting</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="primary" className="flex-1 rounded-[10px] font-extrabold py-3 bg-[var(--brand)] text-xs text-white" onClick={() => alert("QR Scanner Active...")}>
                Scan QR
              </Button>
              <Button variant="secondary" className="flex-1 rounded-[10px] font-bold py-3 bg-white border-[var(--line-strong)] text-xs text-[var(--foreground)]" onClick={() => {
                const name = prompt("Please enter your name:");
                if (name) alert(`Added ${name} to walk-in queue!`);
              }}>
                Walk-in Queue
              </Button>
            </div>
          </div>

          {/* PIN Pad checkin */}
          <Card variant="surface" className="p-4 border border-[var(--line)] bg-[var(--surface-soft)] rounded-[16px] shadow-none">
            <div className="text-center pb-3 border-b border-[var(--line)]/50 mb-4">
              <h3 className="text-xs font-black uppercase text-[var(--brand-deep)]">PIN check-in</h3>
              <p className="text-[9px] text-[var(--muted)] font-semibold mt-0.5">Last 4 digits or booking code</p>
            </div>

            <div className="rounded-[10px] bg-[#211b16] text-[#fff8f1] p-3 text-center font-mono text-2xl font-black tracking-widest mb-4">
              {displayPin()}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "OK"].map((key) => (
                <button
                  key={key}
                  className="h-12 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] font-mono text-base font-black text-[var(--foreground)] hover:bg-[var(--surface-soft)] active:scale-95 transition-all flex items-center justify-center"
                  onClick={() => handleKeyPress(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
