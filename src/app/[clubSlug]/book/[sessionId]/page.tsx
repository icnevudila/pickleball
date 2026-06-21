"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/surface-card";
import {
  StepSessionDetails,
  StepPlayerDetails,
  StepBilling,
  StepSummary,
} from "@/components/booking/wizard-steps";
import { club, getSessionById } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function BookSessionPage({
  params,
}: {
  params: React.ComponentProps<any>["params"];
}) {
  const resolvedParams = React.use<{ clubSlug: string; sessionId: string }>(params);
  const session = getSessionById(resolvedParams.sessionId);

  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    guests: [] as Array<{ name: string; id: string }>,
    splitPayment: false,
  });

  const guestCount = formData.guests.length;
  const basePrice = session?.price || 0;
  const totalPrice = basePrice + (guestCount * 10); // Assume $10 guest fee for simulation

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans antialiased">
      {/* Standalone Simple Header */}
      <header className="border-b border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-sm)] sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href={`/${resolvedParams.clubSlug}/sessions`} className="flex items-center gap-3 group">
            <div
              className="grid h-10 w-10 place-items-center rounded-[8px] text-xs font-black tracking-wider text-white shadow-[var(--shadow-sm)]"
              style={{ background: "linear-gradient(145deg, var(--brand), var(--brand-deep))" }}
            >
              {club.logo}
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-[var(--foreground)] group-hover:text-[var(--brand)] transition-colors">
                {club.name}
              </p>
              <p className="text-[9px] font-black uppercase tracking-wider text-[var(--muted)]">
                Checkout Portal
              </p>
            </div>
          </Link>
          <Link
            href={`/${resolvedParams.clubSlug}/sessions`}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Club
          </Link>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="flex-1 container-shell py-8 sm:py-12 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          
          {/* Left Column: Progress & Active Step Panel */}
          <div className="space-y-6">
            {/* Progress indicators with clean alignment */}
            <div className="flex items-center justify-between px-2">
              {[1, 2, 3, 4].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all duration-300 ${
                      s === step
                        ? "border-[var(--brand)] bg-[var(--brand)] text-white scale-105"
                        : s < step
                        ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                        : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                        s < step ? "bg-[var(--brand)]" : "bg-[var(--line)]"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step Panel Card */}
            <Card
              variant="surface"
              className="p-6 sm:p-8 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)]"
            >
              {step === 1 && (
                <StepSessionDetails session={session} onNext={() => setStep(2)} />
              )}
              {step === 2 && (
                <StepPlayerDetails
                  session={session}
                  formData={formData}
                  setFormData={setFormData}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <StepBilling
                  session={session}
                  formData={formData}
                  setFormData={setFormData}
                  onNext={() => setStep(4)}
                  onBack={() => setStep(2)}
                />
              )}
              {step === 4 && (
                <StepSummary
                  session={session}
                  formData={formData}
                  onBack={() => setStep(3)}
                  clubSlug={resolvedParams.clubSlug}
                />
              )}
            </Card>
          </div>

          {/* Right Column: Sticky Session Summary (Checkout Sidebar style) */}
          <div className="sticky top-28 space-y-4">
            <SurfaceCard className="p-5 space-y-4 rounded-[16px]">
              <div className="border-b border-[var(--line)] pb-3">
                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[var(--brand)]">
                  Reservation Summary
                </span>
                <h3 className="text-lg font-extrabold tracking-tight mt-1 text-[var(--foreground)]">
                  {session?.name}
                </h3>
                <p className="text-xs text-[var(--muted)] font-semibold mt-1">
                  {session?.dayLabel} • {session?.timeLabel}
                </p>
              </div>

              {/* Dynamic details showing customer entries in real time */}
              <div className="space-y-3 text-xs font-bold text-[var(--muted)] border-b border-[var(--line)] pb-4">
                {formData.fullName && (
                  <div className="flex justify-between">
                    <span>Player:</span>
                    <span className="text-[var(--foreground)] uppercase">{formData.fullName}</span>
                  </div>
                )}
                {guestCount > 0 && (
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span className="text-[var(--foreground)]">{guestCount} added</span>
                  </div>
                )}
                {formData.splitPayment && (
                  <div className="flex justify-between items-center text-[var(--brand-deep)] bg-[var(--brand-soft)] px-2 py-0.5 rounded-[4px]">
                    <span>Payment Rotations:</span>
                    <span>Split Enabled</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs font-semibold text-[var(--muted)]">
                <div className="flex justify-between">
                  <span>Standard Slot Fee:</span>
                  <span className="font-mono text-[var(--foreground)]">{formatCurrency(basePrice)}</span>
                </div>
                {guestCount > 0 && (
                  <div className="flex justify-between">
                    <span>Guest Surcharges:</span>
                    <span className="font-mono text-[var(--foreground)]">+ {formatCurrency(guestCount * 10)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-[var(--foreground)] border-t border-[var(--line)] pt-3">
                  <span>Total Amount:</span>
                  <span className="font-mono text-base text-[var(--brand)]">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[10px] text-[var(--muted)] font-semibold justify-center border-t border-[var(--line)]/50">
                <ShieldCheck className="w-4.5 h-4.5 text-[var(--out-green)]" />
                Secure checkout encrypted
              </div>
            </SurfaceCard>

            <div className="text-center text-[9px] font-black uppercase tracking-widest text-[var(--muted)] flex items-center justify-center gap-1.5">
              <span>Powered by</span>
              <span className="text-[var(--brand)] font-black">Pickle Pulse</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
