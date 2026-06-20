"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  StepSessionDetails,
  StepPlayerDetails,
  StepBilling,
  StepSummary,
} from "@/components/booking/wizard-steps";
import { club, getSessionById } from "@/lib/mock-data";

export default function BookSessionPage({
  params,
}: {
  params: React.ComponentProps<any>["params"];
}) {
  // Resolve params using React.use()
  const resolvedParams = React.use<{ sessionId: string }>(params);
  const session = getSessionById(resolvedParams.sessionId);

  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    guests: [] as Array<{ name: string; id: string }>,
    splitPayment: false,
  });

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Standalone Simple Header */}
      <header className="border-b border-[var(--line)] bg-[rgba(255,255,255,0.86)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-[12px] text-xs font-black tracking-wider text-white"
              style={{ background: "linear-gradient(145deg, var(--brand), #ff7654)" }}
            >
              {club.logo}
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-[var(--foreground)]">
                {club.name}
              </p>
              <p className="text-[9px] font-black uppercase tracking-wider text-[var(--muted)]">
                Checkout Widget
              </p>
            </div>
          </Link>
          <Link
            href="/sessions"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Club
          </Link>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="flex-1 flex items-center justify-center p-4 py-10 sm:py-16">
        <div className="w-full max-w-lg flex flex-col gap-6">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between px-4">
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

          {/* Centered Step panel */}
          <Card
            variant="surface"
            className="p-6 sm:p-8 border border-[var(--line-strong)] shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--brand-soft)] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

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
              />
            )}
          </Card>

          {/* Simple widget copyright */}
          <div className="text-center text-[9px] font-black uppercase tracking-widest text-[var(--muted)] flex items-center justify-center gap-1.5">
            <span>Powered by</span>
            <span className="text-[var(--brand)] font-black">Pickle Pulse</span>
          </div>
        </div>
      </main>
    </div>
  );
}
