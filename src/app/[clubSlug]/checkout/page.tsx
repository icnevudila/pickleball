"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CreditCard, Smartphone, Wallet } from "lucide-react";

import { TenantHeader } from "@/components/layout/tenant-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TypewriterText } from "@/components/ui/typewriter-text";

export default function CheckoutSplitWalletPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);

  // Formatting club name nicely from slug
  const clubName = clubSlug
    .split("-")
    .map((word) => {
      if (word.toLowerCase() === "istanbul") return "İstanbul";
      if (word.toLowerCase() === "kadikoy") return "Kadıköy";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  const clubTitle = `${clubName} Social Club`;
  const clubLogo = clubName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "PP";

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
      <TenantHeader clubSlug={clubSlug} clubName={clubTitle} clubLogo={clubLogo} />

      <main className="flex-1 max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[var(--foreground)] text-[var(--background)] px-4 py-2.5 rounded-[10px] text-xs font-black shadow-[var(--shadow-lg)] transition-all duration-300 transform translate-y-0 opacity-100">
            {toastMessage}
          </div>
        )}

        {/* Page Head */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-[var(--line)] pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-deep)]">Pickle Pulse</span>
            <h1 className="text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              Payment <TypewriterText words={["Decision", "Options", "Gateway", "Summary"]} className="text-[var(--brand)]" />
            </h1>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              Card, wallet, and split payments on a single decision screen; clear options, no checkout panic.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)]">
            <Link href={`/${clubSlug}/book`}>Back to slots</Link>
          </Button>
        </section>

        {/* Checkout Split Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          
          {/* Booking Summary Card */}
          <Card variant="surface" className="flex flex-col overflow-hidden bg-[var(--surface)] border border-[var(--line)] rounded-[14px] shadow-[var(--shadow)]">
            <header className="px-5 py-3.5 flex items-center justify-between border-b border-[var(--line)] bg-[#fffdf9]">
              <div>
                <h3 className="font-extrabold text-[var(--ink)] tracking-tight">Booking Summary</h3>
                <p className="text-[11px] text-[var(--muted)] font-semibold mt-0.5">Court 2 · Today 19:00 - 20:00</p>
              </div>
              <Badge tone="brand">TRY 700</Badge>
            </header>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-[var(--line)] bg-[#fffdf9] rounded-[10px]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-sm text-[var(--muted)]">C2</span>
                    <div>
                      <p className="font-extrabold text-sm text-[var(--ink)]">Mixed doubles court</p>
                      <p className="text-[11px] text-[var(--muted)] font-semibold">4 players · prime slot</p>
                    </div>
                  </div>
                  <Badge tone="slate" className="bg-[#edf3f5] border-[#cad9df] text-[#435f6f]">60 min</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border border-[#bddbcc] bg-[#f4fbf7] rounded-[10px]">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-[var(--green)]" />
                    <div>
                      <p className="font-extrabold text-sm text-[var(--ink)]">Wallet balance</p>
                      <p className="text-[11px] text-[var(--muted)] font-semibold">TRY 1,240 available</p>
                    </div>
                  </div>
                  <Badge tone="live">Enough</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Method Card */}
          <Card variant="surface" className="flex flex-col overflow-hidden bg-[var(--surface)] border border-[var(--line)] rounded-[14px] shadow-[var(--shadow)]">
            <header className="px-5 py-3.5 border-b border-[var(--line)] bg-[#fffdf9]">
              <h3 className="font-extrabold text-[var(--ink)] tracking-tight">Payment Method</h3>
              <p className="text-[11px] text-[var(--muted)] font-semibold mt-0.5">Choose one clean path</p>
            </header>

            <div className="p-5 space-y-3">
              {/* Option 1: Pay from wallet */}
              <div className="flex items-center justify-between p-3 border border-[#bddbcc] bg-[#f4fbf7] rounded-[10px]">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-sm text-[var(--green)]">01</span>
                  <div>
                    <p className="font-extrabold text-sm text-[var(--ink)]">Pay from wallet</p>
                    <p className="text-[11px] text-[var(--muted)] font-semibold">No card fee, fastest checkout</p>
                  </div>
                </div>
                <Button variant="primary" size="sm" className="rounded-[8px] px-4 text-xs" onClick={() => triggerToast("Paid using wallet successfully!")}>
                  Use
                </Button>
              </div>

              {/* Option 2: Split payment */}
              <div className="flex items-center justify-between p-3 border border-[var(--line)] bg-[#fffdf9] rounded-[10px]">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-sm text-[var(--muted)]">02</span>
                  <div>
                    <p className="font-extrabold text-sm text-[var(--ink)]">Split between 4 players</p>
                    <p className="text-[11px] text-[var(--muted)] font-semibold">SMS payment links per slot</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="rounded-[8px] px-4 text-xs border-[var(--line-strong)]" onClick={() => triggerToast("Split billing links generated!")}>
                  Split
                </Button>
              </div>

              {/* Option 3: Card payment */}
              <div className="flex items-center justify-between p-3 border border-[var(--line)] bg-[#fffdf9] rounded-[10px]">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-sm text-[var(--muted)]">03</span>
                  <div>
                    <p className="font-extrabold text-sm text-[var(--ink)]">Card payment</p>
                    <p className="text-[11px] text-[var(--muted)] font-semibold">Standard Stripe checkout</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="rounded-[8px] px-4 text-xs border-[var(--line-strong)]" onClick={() => triggerToast("Stripe portal launching...")}>
                  Card
                </Button>
              </div>
            </div>
          </Card>

        </section>

        {/* Split Preview Card */}
        <Card variant="surface" className="p-5 border border-[var(--line)] rounded-[14px] bg-[var(--surface)] shadow-[var(--shadow)]">
          <header className="pb-3 border-b border-[var(--line)]">
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ink)]">Split Preview</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">
              Before sending payment links to players.
            </p>
          </header>
          
          <div className="grid grid-cols-3 gap-4 pt-4 text-center">
            <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-[10px] p-4 shadow-[var(--shadow-sm)]">
              <span className="font-mono text-lg font-black text-[var(--ink)] block">TRY 175</span>
              <p className="text-xs text-[var(--muted)] font-semibold mt-1">Per player</p>
            </div>
            <div className="bg-[#fff8e8] border border-[#e1c486] rounded-[10px] p-4 shadow-[var(--shadow-sm)]">
              <span className="font-mono text-lg font-black text-[var(--amber)] block">15 min</span>
              <p className="text-xs text-[var(--muted)] font-semibold mt-1">Payment hold</p>
            </div>
            <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-[10px] p-4 shadow-[var(--shadow-sm)]">
              <span className="font-mono text-lg font-black text-[var(--ink)] block">SMS</span>
              <p className="text-xs text-[var(--muted)] font-semibold mt-1">Delivery mode</p>
            </div>
          </div>
        </Card>

      </main>

      <PublicFooter clubSlug={clubSlug} />
    </div>
  );
}
