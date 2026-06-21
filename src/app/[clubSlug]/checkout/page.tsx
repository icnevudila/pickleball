"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { CreditCard, Smartphone, Wallet, Users, Trash2 } from "lucide-react";

import { TenantHeader } from "@/components/layout/tenant-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TypewriterText } from "@/components/ui/typewriter-text";

interface Guest {
  name: string;
  contact: string;
}

export default function CheckoutSplitWalletPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  // Query Parameters fallback to defaults
  const paramTime = searchParams?.get("time") || "19:00";
  const paramCourt = searchParams?.get("court") || "C2";
  const paramPrice = parseInt(searchParams?.get("price") || "700");
  const paramSplit = searchParams?.get("payMode")?.toLowerCase().includes("split") || false;

  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);

  // Stateful checkout details
  const [court, setCourt] = React.useState(paramCourt);
  const [time, setTime] = React.useState(paramTime);
  const [totalPrice, setTotalPrice] = React.useState(paramPrice);

  const [isSplitBilling, setIsSplitBilling] = React.useState(paramSplit);
  const [guests, setGuests] = React.useState<Guest[]>([]);
  const [hostName, setHostName] = React.useState("Ali Düvenci");
  const [hostContact, setHostContact] = React.useState("+90 532 111 22 33");

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
    setTimeout(() => setShowToast(false), 3000);
  };

  const logAudit = (actionType: string, details: string) => {
    const newLog = {
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      user: "Player Portal",
      action: `${actionType}: ${details}`,
    };
    try {
      const logsKey = `pickle_audit_logs_${clubSlug}`;
      const existing = localStorage.getItem(logsKey);
      const logs = existing ? JSON.parse(existing) : [];
      logs.unshift(newLog);
      localStorage.setItem(logsKey, JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  };

  // CHECK-001: Add Guest Spot
  const handleAddGuest = () => {
    if (guests.length >= 3) {
      triggerToast("Cannot exceed maximum court capacity of 4 players.");
      return;
    }
    const newGuest: Guest = { name: "", contact: "" };
    const updated = [...guests, newGuest];
    setGuests(updated);
    logAudit("checkout.guest_added", `Added guest spot. Total players: ${updated.length + 1}`);
    triggerToast("Guest spot added. Price updated.");
  };

  const handleRemoveGuest = (index: number) => {
    const updated = guests.filter((_, idx) => idx !== index);
    setGuests(updated);
    triggerToast("Guest spot removed.");
  };

  const handleGuestChange = (index: number, field: "name" | "contact", value: string) => {
    const updated = guests.map((g, idx) => {
      if (idx === index) {
        return { ...g, [field]: value };
      }
      return g;
    });
    setGuests(updated);
  };

  // CHECK-002: Split Billing Checkbox
  const handleToggleSplit = (checked: boolean) => {
    setIsSplitBilling(checked);
    logAudit("checkout.split_billing_toggled", `Split billing enabled: ${checked}`);
    triggerToast(
      checked
        ? "Split billing enabled. Each player will get their own payment share."
        : "Pay full price enabled. Single host payer will cover total balance."
    );
  };

  // CHECK-003: Stripe Checkout redirection simulation
  const handlePaySecurely = (method: "stripe" | "wallet") => {
    // Validations
    if (!hostName.trim() || !hostContact.trim()) {
      triggerToast("Host player name and contact details are required.");
      return;
    }

    if (guests.some((g) => !g.name.trim())) {
      triggerToast("All added guests must have a valid name filled out.");
      return;
    }

    if (isSplitBilling && guests.some((g) => !g.contact.trim())) {
      triggerToast("All split billing players must have a contact email/phone.");
      return;
    }

    logAudit("payment.checkout_created", `Stripe checkout session initialized for ${hostName} (${method})`);
    triggerToast("Redirecting to secure checkout gateway...");

    setTimeout(() => {
      // Simulate booking save to localStorage calendar state
      try {
        const calendarKey = `pickle_calendar_bookings_${clubSlug}`;
        const existing = localStorage.getItem(calendarKey);
        const bookings = existing ? JSON.parse(existing) : [];
        const newBooking = {
          id: `bkg-${Date.now().toString().slice(-4)}`,
          player: hostName,
          phone: hostContact,
          court: court === "C2" ? "Court 2" : court === "C1" ? "Court 1" : court === "C3" ? "Court 3" : "Center Court",
          time,
          status: "CONFIRMED",
          type: "Booking",
          price: totalPrice,
          split: isSplitBilling,
        };
        bookings.unshift(newBooking);
        localStorage.setItem(calendarKey, JSON.stringify(bookings));
      } catch (e) {
        console.error(e);
      }

      window.location.href = `/${clubSlug}/book`;
    }, 2000);
  };

  const payerCount = guests.length + 1;
  const sharePrice = parseFloat((totalPrice / payerCount).toFixed(2));

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased text-left transition-colors duration-300">
      <TenantHeader clubSlug={clubSlug} clubName={clubTitle} clubLogo={clubLogo} />

      <main className="flex-1 max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
        
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#211b16] text-[#fffaf4] px-4 py-2.5 rounded-[12px] text-xs font-black shadow-[0_14px_30px_rgba(0,0,0,0.16)] flex items-center gap-2 border border-[#3e342c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-ping" />
            {toastMessage}
          </div>
        )}

        {/* Page Head */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-[var(--line)] pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-deep)]">Pickle Pulse</span>
            <h1 className="text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              Payment Summary
            </h1>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              Configure guest details, choose checkout channels, and divide split booking balances securely.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs font-black text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--line-strong)] rounded-[10px] transition-transform active:scale-95">
            <Link href={`/${clubSlug}/book`}>Back to slots</Link>
          </Button>
        </section>

        {/* Checkout Split Grid */}
        <section className="grid gap-6 md:grid-cols-2 items-start">
          
          {/* Left Side: Host Details & Guest inputs */}
          <div className="space-y-4">
            <Card variant="surface" className="p-5 space-y-4 border border-[var(--line)] rounded-[20px] shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-wider text-[var(--ink)]">1. Host & Party Details</h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[var(--muted)]">Host Full Name *</label>
                  <input
                    type="text"
                    className="h-10 border border-[var(--line-strong)] bg-white rounded-[12px] px-3 outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all font-semibold"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[var(--muted)]">Host Phone/Email *</label>
                  <input
                    type="text"
                    className="h-10 border border-[var(--line-strong)] bg-white rounded-[12px] px-3 outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all font-semibold"
                    value={hostContact}
                    onChange={(e) => setHostContact(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Guests listing fields */}
              <div className="space-y-3 pt-3 border-t border-[var(--line)]">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-[var(--muted)]">Guests List ({guests.length} Added)</h4>
                  {guests.length < 3 && (
                    <button
                      type="button"
                      className="text-[11px] font-black text-[var(--brand)] hover:text-[var(--brand-deep)] hover:underline flex items-center gap-0.5"
                      onClick={handleAddGuest}
                    >
                      + Add Guest Spot
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {guests.map((g, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-[#fffdf9] p-3 border border-[var(--line-strong)] rounded-[14px] animate-scale-in transition-all">
                      <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          placeholder="Guest name *"
                          className="h-9 border border-[var(--line-strong)] bg-white rounded-[8px] px-2.5 outline-none focus:border-[var(--brand)] font-semibold"
                          value={g.name}
                          onChange={(e) => handleGuestChange(idx, "name", e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder={isSplitBilling ? "Email/Phone required *" : "Email/Phone optional"}
                          className="h-9 border border-[var(--line-strong)] bg-white rounded-[8px] px-2.5 outline-none focus:border-[var(--brand)] font-semibold"
                          value={g.contact}
                          onChange={(e) => handleGuestChange(idx, "contact", e.target.value)}
                          required={isSplitBilling}
                        />
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-full transition-colors"
                        onClick={() => handleRemoveGuest(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {guests.length === 0 && (
                    <p className="text-xs text-[var(--muted)] italic py-1 font-semibold">No guest spots added. Playing singles or host covers all.</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Split billing setting */}
            <Card variant="surface" className="p-5 flex items-center justify-between border border-[var(--line)] rounded-[20px] shadow-sm">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[var(--ink)]">2. Split Bill With Partners</h4>
                <p className="text-[10px] text-[var(--muted)] font-semibold mt-1">
                  Divide the total booking fee equally and email/SMS invoice links.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isSplitBilling}
                disabled={guests.length === 0}
                onChange={(e) => handleToggleSplit(e.target.checked)}
                className="w-5 h-5 accent-[var(--brand)] cursor-pointer disabled:opacity-50 transition-all rounded-[6px]"
              />
            </Card>
          </div>

          {/* Right Side: Order Summary & Gateway Checkout triggers */}
          <div className="space-y-4">
            {/* Booking Summary Card */}
            <Card variant="surface" className="flex flex-col overflow-hidden bg-[var(--surface)] border border-[var(--line)] rounded-[20px] shadow-[var(--shadow-md)]">
              <header className="px-5 py-4 flex items-center justify-between border-b border-[var(--line)] bg-[#fffbf7]">
                <div>
                  <h3 className="font-extrabold text-[var(--ink)] tracking-tight text-sm">Booking Summary</h3>
                  <p className="text-[11px] text-[var(--muted)] font-semibold mt-0.5">
                    {court === "C2" ? "Court 2" : court === "C1" ? "Court 1" : court === "C3" ? "Court 3" : "Center Court"} · Time slot: {time}
                  </p>
                </div>
                <Badge tone="brand" className="font-black">TRY {totalPrice}</Badge>
              </header>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between p-3.5 border border-[var(--line)] bg-[#fffdf9] rounded-[14px] text-xs shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-[var(--brand-deep)] bg-[var(--brand-soft)] w-10 h-10 rounded-[10px] flex items-center justify-center">{court}</span>
                    <div>
                      <p className="font-black text-sm text-[var(--ink)]">Pickleball Court Reservation</p>
                      <p className="text-[11px] text-[var(--muted)] font-bold">{payerCount} players total</p>
                    </div>
                  </div>
                  <Badge tone="slate" className="font-extrabold">60 min</Badge>
                </div>

                <div className="flex items-center justify-between p-3.5 border border-[#bddbcc] bg-[#f4fbf7] rounded-[14px] text-xs shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#e2f5ec] w-10 h-10 rounded-[10px] flex items-center justify-center text-[var(--out-green)]">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-[var(--ink)]">Prepaid Wallet Credit</p>
                      <p className="text-[11px] text-[var(--muted)] font-bold">TRY 1,240 balance available</p>
                    </div>
                  </div>
                  <Badge tone="live" className="font-black">Ready</Badge>
                </div>
              </div>
            </Card>

            {/* Split Price Display */}
            {isSplitBilling && (
              <Card variant="surface" className="p-5 border border-[var(--line)] rounded-[20px] bg-[var(--surface)] shadow-[var(--shadow-md)] text-xs animate-scale-in">
                <header className="pb-3 border-b border-[var(--line)]">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--ink)]">Split Share Allocation</h3>
                </header>
                
                <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                  <div className="bg-[#fffbf7] border border-[var(--line)] rounded-[14px] p-3 shadow-sm">
                    <span className="font-mono text-base font-black text-[var(--brand-deep)] block">TRY {sharePrice}</span>
                    <p className="text-[10px] text-[var(--muted)] font-bold mt-1">Per player share</p>
                  </div>
                  <div className="bg-[#fff8e8] border border-[#e1c486] rounded-[14px] p-3 shadow-sm">
                    <span className="font-mono text-base font-black text-[var(--accent-amber)] block">15 min</span>
                    <p className="text-[10px] text-[var(--muted)] font-bold mt-1">Payment hold</p>
                  </div>
                  <div className="bg-[#fffbf7] border border-[var(--line)] rounded-[14px] p-3 shadow-sm">
                    <span className="font-mono text-[13px] font-black text-[var(--ink)] block uppercase tracking-tight">Email/SMS</span>
                    <p className="text-[10px] text-[var(--muted)] font-bold mt-1">Reminders</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Checkout decision triggers */}
            <Card variant="surface" className="p-5 space-y-4 border border-[var(--line)] rounded-[20px] shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--ink)]">3. Select Checkout Method</h3>
              
              <div className="space-y-2.5 text-xs">
                <Button
                  variant="primary"
                  className="w-full h-11 bg-[#2f8066] border-[#2f8066] hover:bg-[#246b55] text-white rounded-[12px] font-extrabold shadow-[var(--shadow-btn)] transition-all active:scale-[0.98]"
                  onClick={() => handlePaySecurely("wallet")}
                >
                  Pay with Wallet Balance (TRY {isSplitBilling ? sharePrice : totalPrice})
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full h-11 border-[var(--line-strong)] bg-white hover:bg-slate-50 text-[var(--ink)] rounded-[12px] font-extrabold shadow-sm transition-all active:scale-[0.98] hover:border-[var(--brand)]"
                  onClick={() => handlePaySecurely("stripe")}
                >
                  Redirect to Stripe Card Checkout
                </Button>
              </div>
            </Card>
          </div>

        </section>
      </main>

      <PublicFooter clubSlug={clubSlug} />
    </div>
  );
}
