"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, User, Mail, Phone, Users, Split, ShieldCheck, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Session } from "@/lib/types";

interface StepProps {
  session: Session;
  onNext: () => void;
  onBack: () => void;
  formData: any;
  setFormData: (data: any) => void;
}

// Step 1: Session Summary & Slot Review
export function StepSessionDetails({ session, onNext }: { session: Session; onNext: () => void }) {
  const spotsLeft = Math.max(0, session.capacity - session.booked);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-[var(--foreground)]">Review Session Slot</h3>
        <p className="text-xs font-semibold text-[var(--muted)]">
          Verify session schedules, restrictions, and slot availability before booking.
        </p>
      </div>

      <Card variant="surface" className="p-6 border border-[var(--line-strong)] space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-black">{session.name}</h4>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              {session.dayLabel} • {session.timeLabel}
            </p>
          </div>
          <Badge tone={session.status === "live" ? "live" : "brand"}>
            {session.status}
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          <div className="bg-[var(--surface-muted)] border border-[var(--line)] rounded-[16px] p-4 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Price per slot</span>
            <p className="text-2xl font-black font-mono text-[var(--foreground)] mt-1">{formatCurrency(session.price)}</p>
          </div>
          <div className="bg-[var(--surface-muted)] border border-[var(--line)] rounded-[16px] p-4 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Courts Assigned</span>
            <p className="text-2xl font-black font-mono text-[var(--foreground)] mt-1">{session.courts}</p>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-bold text-[var(--muted)]">
            <span>Availability: {spotsLeft} spots left</span>
            <span>Capacity: {session.capacity} players</span>
          </div>
          <div className="w-full bg-[var(--surface-soft)] rounded-full h-2 overflow-hidden border border-[var(--line)]">
            <div
              className="bg-[var(--brand)] h-full rounded-full"
              style={{ width: `${(session.booked / session.capacity) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      <Button variant="primary" className="w-full" onClick={onNext}>
        Continue to Checkout
      </Button>
    </div>
  );
}

// Step 2: Player details and adding guests
export function StepPlayerDetails({ session, onNext, onBack, formData, setFormData }: StepProps) {
  const [guestName, setGuestName] = React.useState("");

  const handleAddGuest = () => {
    if (!guestName.trim()) return;
    setFormData({
      ...formData,
      guests: [...formData.guests, { name: guestName.trim(), id: `g-${Date.now()}` }],
    });
    setGuestName("");
  };

  const handleRemoveGuest = (id: string) => {
    setFormData({
      ...formData,
      guests: formData.guests.filter((g: any) => g.id !== id),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-[var(--foreground)]">Player Information</h3>
        <p className="text-xs font-semibold text-[var(--muted)]">
          Provide participant email and specify extra guest spots if booking for friends.
        </p>
      </div>

      <div className="space-y-4">
        {/* Main Player Inputs */}
        <Input
          label="Your Full Name"
          placeholder="Dani Santos"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          icon={<User className="w-4 h-4" />}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="dani@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={<Mail className="w-4 h-4" />}
          required
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+90 555 123 4567"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          icon={<Phone className="w-4 h-4" />}
          required
        />

        {/* Guest Allocation */}
        <div className="pt-4 border-t border-[var(--line)]/50 space-y-4">
          <label className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)] px-1">
            Add Guest Players
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Friend's Full Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              icon={<Users className="w-4 h-4" />}
            />
            <Button type="button" variant="secondary" size="md" onClick={handleAddGuest}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {formData.guests.length > 0 && (
            <div className="space-y-2 pt-2">
              {formData.guests.map((guest: any) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between bg-[var(--surface-soft)] border border-[var(--line)] rounded-[16px] px-4 py-2.5 text-xs font-bold"
                >
                  <span className="text-[var(--foreground)]">{guest.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGuest(guest.id)}
                    className="text-[var(--red)] hover:text-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={onNext}
          disabled={!formData.fullName || !formData.email || !formData.phone}
        >
          Billing Setup
        </Button>
      </div>
    </div>
  );
}

// Step 3: Billing & Split Payments
export function StepBilling({ session, onNext, onBack, formData, setFormData }: StepProps) {
  const totalPlayers = 1 + formData.guests.length;
  const totalPrice = totalPlayers * session.price;
  const splitShare = session.price;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-[var(--foreground)]">Billing Options</h3>
        <p className="text-xs font-semibold text-[var(--muted)]">
          Decide how checkout fees are paid. You can split billing with invited guests.
        </p>
      </div>

      <Card variant="surface" className="p-6 border border-[var(--line-strong)] space-y-4">
        <div className="flex justify-between items-baseline mb-4 border-b border-[var(--line)]/50 pb-4">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">Total Slots</span>
          <span className="text-lg font-black">{totalPlayers} Players</span>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded-[20px] border border-[var(--line)] bg-[var(--surface-soft)] cursor-pointer hover:border-[var(--brand)] transition">
            <input
              type="radio"
              name="splitPayment"
              checked={!formData.splitPayment}
              onChange={() => setFormData({ ...formData, splitPayment: false })}
              className="mt-1 accent-[var(--brand)]"
            />
            <div className="space-y-1">
              <span className="text-sm font-black text-[var(--foreground)] flex items-center gap-1.5">
                Pay Full Amount
              </span>
              <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                Check out once for the entire group fee: <span className="font-extrabold text-[var(--foreground)] font-mono">{formatCurrency(totalPrice)}</span>
              </p>
            </div>
          </label>

          {formData.guests.length > 0 && (
            <label className="flex items-start gap-3 p-4 rounded-[20px] border border-[var(--line)] bg-[var(--surface-soft)] cursor-pointer hover:border-[var(--brand)] transition">
              <input
                type="radio"
                name="splitPayment"
                checked={formData.splitPayment}
                onChange={() => setFormData({ ...formData, splitPayment: true })}
                className="mt-1 accent-[var(--brand)]"
              />
              <div className="space-y-1">
                <span className="text-sm font-black text-[var(--foreground)] flex items-center gap-1.5">
                  Split Payment with Guests
                </span>
                <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                  Pay only your share: <span className="font-extrabold text-[var(--foreground)] font-mono">{formatCurrency(splitShare)}</span>. We'll email Stripe billing links to guests for their shares.
                </p>
              </div>
            </label>
          )}
        </div>
      </Card>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" className="flex-1" onClick={onNext}>
          Confirm Summary
        </Button>
      </div>
    </div>
  );
}

// Step 4: Summary & Checkout Complete
export function StepSummary({ session, onBack, formData }: { session: Session; onBack: () => void; formData: any }) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const totalPlayers = 1 + formData.guests.length;
  const priceToPay = formData.splitPayment ? session.price : session.price * totalPlayers;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-6 py-8 animate-scale-in">
        <div className="w-16 h-16 bg-[color-mix(in_srgb,var(--green)_12%,transparent)] border border-[color-mix(in_srgb,var(--green)_30%,transparent)] text-[var(--green)] rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black">Booking Confirmed!</h3>
        <p className="text-sm text-[var(--muted)] max-w-sm mx-auto leading-relaxed">
          Your slot for <strong className="text-[var(--foreground)]">{session.name}</strong> is locked. Check-in code and confirmation receipt have been sent to <strong className="text-[var(--foreground)]">{formData.email}</strong>.
        </p>

        {formData.splitPayment && (
          <div className="bg-[var(--surface-muted)] border border-[var(--line)] rounded-[20px] p-5 max-w-sm mx-auto text-left space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[var(--brand-deep)] flex items-center gap-1.5">
              <Split className="w-4 h-4" /> Split billing active
            </span>
            <p className="text-xs font-semibold text-[var(--muted)] leading-relaxed">
              We generated pay links for guests. If unpaid 2 hours before seans, slots are released.
            </p>
          </div>
        )}

        <div className="pt-4">
          <Button variant="primary" asChild className="w-full max-w-xs">
            <Link href="/account/bookings">Go to Reservations</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-[var(--foreground)]">Review Summary</h3>
        <p className="text-xs font-semibold text-[var(--muted)]">
          Confirm details and check out securely via Stripe checkout simulation.
        </p>
      </div>

      <Card variant="surface" className="p-6 border border-[var(--line-strong)] divide-y divide-[var(--line)]/50">
        <div className="pb-4 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">Session Details</span>
          <p className="text-sm font-extrabold text-[var(--foreground)]">{session.name}</p>
          <p className="text-xs text-[var(--muted)] font-semibold">{session.dayLabel} • {session.timeLabel}</p>
        </div>

        <div className="py-4 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">Participants</span>
          <p className="text-sm font-semibold text-[var(--foreground)]">{formData.fullName} (Host)</p>
          {formData.guests.map((g: any) => (
            <p key={g.id} className="text-sm font-semibold text-[var(--muted)] pl-4 border-l border-[var(--line)]">
              {g.name} (Guest)
            </p>
          ))}
        </div>

        <div className="pt-4 flex justify-between items-baseline">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">Amount to Pay Now</span>
          <span className="text-3xl font-black font-mono text-[var(--foreground)]">
            {formatCurrency(priceToPay)}
          </span>
        </div>
      </Card>

      <div className="flex gap-3 pt-2">
        {!isProcessing && (
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            Back
          </Button>
        )}
        <Button variant="primary" className="flex-1" onClick={handleCheckout} isLoading={isProcessing}>
          Secure Checkout
        </Button>
      </div>
    </div>
  );
}
