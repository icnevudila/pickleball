"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck, UserPlus, Users } from "lucide-react";

import { TenantHeader } from "@/components/layout/tenant-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TypewriterText } from "@/components/ui/typewriter-text";

// Mock slots based on public_booking_calendar.html
// Format: [time, court, status, type, label, price]
const initialSlots = [
  { time: "08:00", court: "C1", status: "booked", type: "Open Play", label: "Full", price: 0 },
  { time: "08:00", court: "C2", status: "booked", type: "Reserved", label: "Full", price: 0 },
  { time: "08:00", court: "C3", status: "free", type: "Private", label: "Free", price: 650 },
  { time: "08:00", court: "C4", status: "free", type: "Private", label: "Free", price: 650 },
  
  { time: "09:00", court: "C1", status: "free", type: "Private", label: "Free", price: 650 },
  { time: "09:00", court: "C2", status: "hot", type: "Open Play", label: "2 spots", price: 300 },
  { time: "09:00", court: "C3", status: "booked", type: "Clinic", label: "Full", price: 0 },
  { time: "09:00", court: "C4", status: "free", type: "Private", label: "Free", price: 650 },
  
  { time: "10:00", court: "C1", status: "booked", type: "Reserved", label: "Full", price: 0 },
  { time: "10:00", court: "C2", status: "free", type: "Private", label: "Free", price: 650 },
  { time: "10:00", court: "C3", status: "free", type: "Private", label: "Free", price: 650 },
  { time: "10:00", court: "C4", status: "booked", type: "Group", label: "Full", price: 0 },
  
  { time: "11:00", court: "C1", status: "free", type: "Private", label: "Free", price: 650 },
  { time: "11:00", court: "C2", status: "booked", type: "Ladder", label: "Full", price: 0 },
  { time: "11:00", court: "C3", status: "hot", type: "Open Play", label: "1 spot", price: 300 },
  { time: "11:00", court: "C4", status: "free", type: "Private", label: "Free", price: 650 },
  
  { time: "18:00", court: "C1", status: "hot", type: "Private", label: "Peak", price: 850 },
  { time: "18:00", court: "C2", status: "booked", type: "Reserved", label: "Full", price: 0 },
  { time: "18:00", court: "C3", status: "free", type: "Private", label: "Free", price: 850 },
  { time: "18:00", court: "C4", status: "booked", type: "Doubles", label: "Full", price: 0 },
  
  { time: "19:00", court: "C1", status: "booked", type: "Open Play", label: "Full", price: 0 },
  { time: "19:00", court: "C2", status: "hot", type: "Private", label: "Peak", price: 850 },
  { time: "19:00", court: "C3", status: "booked", type: "Clinic", label: "Full", price: 0 },
  { time: "19:00", court: "C4", status: "free", type: "Private", label: "Free", price: 850 },
  
  { time: "20:00", court: "C1", status: "free", type: "Private", label: "Free", price: 850 },
  { time: "20:00", court: "C2", status: "booked", type: "Reserved", label: "Full", price: 0 },
  { time: "20:00", court: "C3", status: "hot", type: "Open Play", label: "2 spots", price: 350 },
  { time: "20:00", court: "C4", status: "free", type: "Private", label: "Free", price: 850 }
];

export default function BookCourtPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  // State Management
  const [selectedDate, setSelectedDate] = React.useState("Today · 21 Jun");
  const [filterKind, setFilterKind] = React.useState<"all" | "free" | "hot" | "openplay">("all");
  const [duration, setDuration] = React.useState("60 min");
  const [selectedSlot, setSelectedSlot] = React.useState({
    time: "09:00",
    court: "C4",
    type: "Private",
    status: "Free",
    price: 650,
  });
  const [playerCount, setPlayerCount] = React.useState("4 players");
  const [payMode, setPayMode] = React.useState("Split payment");
  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);
  const [selectedCourt, setSelectedCourt] = React.useState<string>("all");

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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(timer);
  };

  const handleSlotSelect = (slot: typeof initialSlots[0]) => {
    if (slot.status === "booked") return;
    setSelectedSlot({
      time: slot.time,
      court: slot.court,
      type: slot.type,
      status: slot.label,
      price: slot.price,
    });
    logAudit("booking_slot.selected", `Selected slot ${slot.court} at ${slot.time}`);
    triggerToast("Slot selected. Complete checkout to confirm it.");
  };

  const handleQuickFind = () => {
    const firstFree = initialSlots.find((s) => s.status === "free");
    if (firstFree) {
      setSelectedSlot({
        time: firstFree.time,
        court: firstFree.court,
        type: firstFree.type,
        status: firstFree.label,
        price: firstFree.price,
      });
      setFilterKind("all");
      logAudit("booking_slot.selected", `Quick matched slot ${firstFree.court} at ${firstFree.time}`);
      triggerToast("Slot selected. Complete checkout to confirm it.");
    }
  };

  const times = Array.from(new Set(initialSlots.map((s) => s.time)));
  const courts = selectedCourt === "all" ? ["C1", "C2", "C3", "C4"] : [selectedCourt];

  const getCourtName = (code: string) => {
    if (code === "C4") return "Center Court";
    return `Court ${code.slice(1)}`;
  };

  const getSlotEndTime = (startTime: string) => {
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = startHour + 1;
    return `${endHour.toString().padStart(2, "0")}:00`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased transition-colors duration-300">
      <TenantHeader clubSlug={clubSlug} clubName={clubTitle} clubLogo={clubLogo} />

      <main className="flex-1 max-w-[1580px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[var(--foreground)] text-[var(--background)] px-4 py-2.5 rounded-[12px] text-xs font-black shadow-[var(--shadow-lg)] transition-all duration-300 transform translate-y-0 opacity-100 border border-[var(--line-strong)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-ping" />
            {toastMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_390px] items-start">
          
          {/* Left Column: Calendar & Controls */}
          <section className="space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--line)] pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-deep)]">Public court availability</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                  Which court is open?
                </h1>
                <p className="text-xs text-[var(--muted)] font-semibold">
                  Hourly metrics, court columns, and clickable booking slots for external players.
                </p>
              </div>

              {/* Day Switcher */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-9 w-9 p-0 rounded-[10px] border border-[var(--line-strong)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] transition-all active:scale-95" 
                  onClick={() => triggerToast("Prev day simulation")}
                >
                  ←
                </Button>
                <div className="h-9 px-4 rounded-[10px] border border-[var(--line-strong)] bg-[var(--surface)] text-xs font-extrabold flex items-center justify-center min-w-[120px] shadow-[var(--shadow-sm)]">
                  {selectedDate}
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-9 w-9 p-0 rounded-[10px] border border-[var(--line-strong)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] transition-all active:scale-95" 
                  onClick={() => triggerToast("Next day simulation")}
                >
                  →
                </Button>
              </div>
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] border border-[var(--line)] rounded-[14px] p-4 shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300">
                <span className="text-base font-black text-[var(--brand-deep)] block">7 slots</span>
                <p className="text-[11px] text-[var(--muted)] font-bold mt-1">Today available</p>
              </div>
              <div className="bg-gradient-to-br from-[#f2faf6] to-[#e8f6ee] border border-[#bddbcc] rounded-[14px] p-4 shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300">
                <span className="text-base font-black text-[var(--out-green)] block">C4 · 09:00</span>
                <p className="text-[11px] text-[var(--muted)] font-bold mt-1">First open court</p>
              </div>
              <div className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] border border-[var(--line)] rounded-[14px] p-4 shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300">
                <span className="text-base font-black text-[var(--ink)] block">TRY 850 peak</span>
                <p className="text-[11px] text-[var(--muted)] font-bold mt-1">After 18:00 PM</p>
              </div>
              <div className="bg-gradient-to-br from-[#f2faf6] to-[#e8f6ee] border border-[#bddbcc] rounded-[14px] p-4 shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300">
                <span className="text-base font-black text-[var(--out-green)] block">Split pay</span>
                <p className="text-[11px] text-[var(--muted)] font-bold mt-1">Between 4 players</p>
              </div>
            </div>

            {/* Filter and Helper Actions Bar */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-4 flex flex-wrap items-center justify-between gap-4 shadow-[var(--shadow-sm)]">
              {/* Kind Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(["all", "free", "hot", "openplay"] as const).map((kind) => {
                  const isActive = filterKind === kind;
                  const colors = {
                    all: isActive ? "bg-[var(--foreground)] text-white border-[var(--foreground)] shadow-sm" : "text-[var(--muted)] border-transparent hover:bg-[var(--surface-soft)]",
                    free: isActive ? "bg-[var(--out-green)] text-white border-[var(--out-green)] shadow-sm" : "text-[var(--out-green)] border-[#c6e1d4] bg-[#f3fbf7] hover:bg-[#e4f5ed]",
                    hot: isActive ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-sm" : "text-[var(--brand-deep)] border-[#e4b39f] bg-[#fff2ec] hover:bg-[#ffe3d5]",
                    openplay: isActive ? "bg-[#2f8066] text-white border-[#2f8066] shadow-sm" : "text-[#435f6f] border-[#c5d5de] bg-[#f2f6f8] hover:bg-[#e4edf1]",
                  };
                  const label = kind === "all" ? "All Slots" : kind === "free" ? "Free Only" : kind === "hot" ? "Few Spots" : "Open Play";
                  return (
                    <button
                      key={kind}
                      onClick={() => setFilterKind(kind)}
                      className={`h-8 rounded-full border px-4.5 text-xs font-black tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${colors[kind]}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="h-9 px-3 rounded-[10px] border border-[var(--line-strong)] bg-white text-xs font-extrabold focus:outline-none focus:border-[var(--brand)]"
                >
                  <option>60 min</option>
                  <option>90 min</option>
                  <option>120 min</option>
                </select>
                <Button variant="primary" className="h-9 text-xs rounded-[10px] px-5 font-bold shadow-[var(--shadow-btn)] active:scale-95 transition-transform" onClick={handleQuickFind}>
                  Quick Find
                </Button>
              </div>
            </div>

            {/* Court Filter Tabs for Mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 scrollbar-none lg:hidden">
              {[
                { code: "all", label: "All Courts" },
                { code: "C1", label: "Court 1" },
                { code: "C2", label: "Court 2" },
                { code: "C3", label: "Court 3" },
                { code: "C4", label: "Center Court" },
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCourt(c.code)}
                  className={`h-8 px-4 rounded-full border text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 ${
                    selectedCourt === c.code
                      ? "bg-[var(--foreground)] text-white border-[var(--foreground)] shadow-sm"
                      : "bg-[var(--surface)] text-[var(--muted)] border-[var(--line-strong)] hover:bg-[var(--surface-soft)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Mobile Layout Helper */}
            {selectedCourt === "all" && (
              <div className="text-[11px] text-[var(--muted)] font-black tracking-wide lg:hidden pb-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
                Swipe horizontally to view all courts. Tap slot to configure checkout.
              </div>
            )}

            {/* Main Booking Grid */}
            <div className="border border-[var(--line)] rounded-[20px] overflow-hidden bg-[var(--surface)] shadow-[var(--shadow-sm)]">
              <div className="overflow-x-auto scrollbar-thin">
                <div className={selectedCourt === "all" ? "min-w-[800px] grid grid-cols-[100px_repeat(4,1fr)]" : "w-full grid grid-cols-[80px_1fr]"}>
                  
                  {/* Header Row */}
                  <div className="h-14 bg-[#fffaf5] border-b border-[var(--line)] flex items-center pl-4 text-xs font-black text-[var(--muted)] uppercase tracking-wider">
                    Time
                  </div>
                  {courts.map((court) => (
                    <div
                      key={court}
                      className="h-14 bg-[#fffaf5] border-b border-l border-[var(--line)] flex flex-col items-center justify-center"
                    >
                      <span className="text-xs font-black text-[var(--ink)]">{court}</span>
                      <span className="text-[10px] font-extrabold text-[var(--muted)]">{getCourtName(court)}</span>
                    </div>
                  ))}

                  {/* Slot Matrix Rows */}
                  {times.map((time) => {
                    return (
                      <React.Fragment key={time}>
                        {/* Time stamp cell */}
                        <div className="min-h-[96px] border-t border-[var(--line)] bg-[#fffbf7] flex items-center pl-4 font-mono font-bold text-xs text-[var(--foreground)]">
                          {time}
                        </div>
                        
                        {/* Court slot cells */}
                        {courts.map((court) => {
                          const slot = initialSlots.find((s) => s.time === time && s.court === court);
                          if (!slot) return <div key={court} className="min-h-[96px] border-t border-l border-[var(--line)] bg-slate-50" />;

                          const isSelected = selectedSlot.time === time && selectedSlot.court === court;
                          
                          // Filter matching logic
                          const isHidden = 
                            (filterKind === "free" && slot.status === "booked") || 
                            (filterKind === "hot" && slot.status !== "hot") || 
                            (filterKind === "openplay" && slot.type !== "Open Play");

                          // Dynamic styles based on status
                          const statusClasses = {
                            free: isSelected
                              ? "bg-gradient-to-b from-[#2f8066] to-[#246b55] border-[#2f8066] text-white shadow-[0_10px_20px_rgba(47,128,102,0.2)] -translate-y-1"
                              : "border-[#c6e1d4] bg-[#f3fbf7] hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(49,36,24,0.06)] hover:border-[var(--brand)]",
                            hot: isSelected
                              ? "bg-gradient-to-b from-[#f04f2a] to-[#d63d1a] border-[#f04f2a] text-white shadow-[0_10px_20px_rgba(240,79,42,0.2)] -translate-y-1"
                              : "border-[#e4b39f] bg-[#fff2ec] hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(49,36,24,0.06)] hover:border-[var(--brand)]",
                            booked: "border-[#e2cfc0] bg-[#f4ece4] opacity-50 cursor-not-allowed",
                          };

                          const badgeTones = {
                            free: "live" as const,
                            hot: "brand" as const,
                            booked: "slate" as const,
                          };

                          return (
                            <div key={court} className="min-h-[96px] border-t border-l border-[var(--line)] p-2">
                              <button
                                disabled={slot.status === "booked"}
                                onClick={() => handleSlotSelect(slot)}
                                className={`w-full h-full border rounded-[14px] p-2.5 flex flex-col justify-between text-left transition-all duration-300 ${
                                  statusClasses[slot.status as keyof typeof statusClasses]
                                } ${isHidden ? "opacity-20 grayscale-[0.4]" : ""}`}
                              >
                                <div className="flex items-center justify-between gap-1 w-full">
                                  <span className={`text-[10px] font-black uppercase tracking-wide truncate ${isSelected ? "text-white" : "text-[var(--ink)]"}`}>
                                    {slot.type}
                                  </span>
                                  <Badge
                                    tone={badgeTones[slot.status as keyof typeof badgeTones]}
                                    className={`text-[8px] px-1.5 py-0.5 rounded-[4px] shrink-0 border-none font-black ${
                                      isSelected ? "bg-white/20 text-white" : ""
                                    }`}
                                  >
                                    {slot.label}
                                  </Badge>
                                </div>

                                <div className="mt-2">
                                  <p className={`text-[10px] font-bold leading-none ${isSelected ? "text-white/80" : "text-[var(--muted)]"}`}>
                                    {time} – {getSlotEndTime(time)}
                                  </p>
                                  <div className="flex items-center justify-between mt-1">
                                    <p className={`text-xs font-black font-mono ${isSelected ? "text-white" : "text-[var(--ink)]"}`}>
                                      {slot.price > 0 ? `TRY ${slot.price}` : "Full"}
                                    </p>
                                    {slot.status === "hot" && !isSelected && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-ping" />
                                    )}
                                  </div>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Checkout Config & Rules */}
          <aside className="space-y-4 lg:sticky lg:top-[82px] animate-scale-in">
            
            {/* Dynamic Checkout config panel */}
            <Card variant="warm" className="next-action bg-gradient-to-b from-[#fffcf9] to-[#fff3eb] border border-[#e3b197] rounded-[20px] overflow-hidden p-6 space-y-6 shadow-md">
              <header className="flex items-center justify-between border-b border-[#ead7c7] pb-4">
                <div>
                  <h3 className="text-sm font-black text-[var(--ink)]">Selected slot</h3>
                  <p className="text-[11px] text-[var(--muted)] font-semibold mt-0.5">Player checkout decision.</p>
                </div>
                <Badge tone="lime" id="slotBadge" className="font-extrabold shadow-sm animate-pulse-badge">
                  {selectedSlot.status}
                </Badge>
              </header>

              <div className="space-y-5">
                <div className="text-5xl font-black font-mono tracking-[-0.08em] text-[var(--brand-deep)]">
                  {selectedSlot.court}
                </div>

                <div className="selected-line border border-[#ead7c7] bg-[#fffdfa] rounded-[14px] p-3.5 flex items-center justify-between gap-4 shadow-sm">
                  <div>
                    <h4 className="text-xs font-black text-[var(--ink)]">
                      {selectedSlot.time} – {getSlotEndTime(selectedSlot.time)}
                    </h4>
                    <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-wider mt-0.5">
                      {selectedSlot.type} · {selectedSlot.status}
                    </p>
                  </div>
                  <div className="text-sm font-black font-mono text-[var(--brand-deep)] shrink-0">
                    TRY {selectedSlot.price}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Players count</label>
                    <select
                      value={playerCount}
                      onChange={(e) => setPlayerCount(e.target.value)}
                      className="h-10 px-3 rounded-[12px] border border-[var(--line-strong)] bg-white text-xs font-extrabold focus:outline-none focus:border-[var(--brand)]"
                    >
                      <option>2 players</option>
                      <option>4 players</option>
                    </select>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Payment Mode</label>
                    <select
                      value={payMode}
                      onChange={(e) => setPayMode(e.target.value)}
                      className="h-10 px-3 rounded-[12px] border border-[var(--line-strong)] bg-white text-xs font-extrabold focus:outline-none focus:border-[var(--brand)]"
                    >
                      <option>Single payer (Full Amount)</option>
                      <option>Split payment (Divide amount)</option>
                      <option>Wallet payment (Using balance)</option>
                    </select>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  className="w-full rounded-[12px] text-xs font-extrabold py-3 shadow-[var(--shadow-btn)] transition-all hover:bg-[var(--brand-deep)] active:scale-95 duration-200" 
                  onClick={() => logAudit("booking_checkout.started", `Proceeded to checkout for ${selectedSlot.court} at ${selectedSlot.time}`)}
                  asChild
                >
                  <Link href={`/${clubSlug}/checkout?time=${selectedSlot.time}&court=${selectedSlot.court}&price=${selectedSlot.price}&payMode=${payMode}&playerCount=${playerCount}`}>
                    Continue to checkout
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Booking rules policy */}
            <Card variant="surface" className="p-5 space-y-4 border border-[var(--line)] rounded-[20px] shadow-sm">
              <header className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--ink)]">Booking rules</h3>
                  <p className="text-[10px] text-[var(--muted)] font-semibold mt-0.5">No surprises on checkout.</p>
                </div>
                <Badge tone="slate" className="font-extrabold">Policy</Badge>
              </header>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-[var(--muted)] font-bold">Cancellation limit</span>
                  <strong className="text-[var(--ink)] font-black">24 Hours</strong>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[var(--muted)] font-bold">Peak hours</span>
                  <strong className="text-[var(--ink)] font-black">18:00 - 22:00 PM</strong>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[var(--muted)] font-bold">Check-in verification</span>
                  <strong className="text-[var(--ink)] font-black">QR / PIN Code</strong>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[var(--muted)] font-bold">Liveboard alert</span>
                  <strong className="text-[var(--ink)] font-black">Announcement active</strong>
                </div>
              </div>
            </Card>

            {/* Need players? Matchmaking Duel Card */}
            <Card variant="surface" className="p-5 flex flex-col justify-between gap-4 border border-[var(--line)] rounded-[20px] shadow-sm">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--ink)]">Need players?</h3>
                <p className="text-[10px] text-[var(--muted)] font-semibold mt-0.5">Looking for missing players? Publish a Matchmaking Duel.</p>
              </div>
              <Button variant="ghost" className="w-full text-xs font-extrabold py-2 border border-[var(--line-strong)] rounded-[12px] transition-transform active:scale-95" onClick={() => triggerToast("Matchmaking Duel simulation activated")}>
                Find Players
              </Button>
            </Card>

          </aside>
        </div>
      </main>

      {/* Sticky Bottom Checkout Sheet for Mobile */}
      {selectedSlot.time && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#fffaf4] text-[#211b16] p-4 border-t border-[#e2d3c4] lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.1)] flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200 rounded-t-[18px]">
          <div className="min-w-0 pr-2">
            <span className="text-[9px] text-[var(--muted)] font-black uppercase tracking-wider">Selected Slot</span>
            <div className="font-extrabold text-[13px] text-[var(--ink)] leading-snug">
              {getCourtName(selectedSlot.court)} · {selectedSlot.time}
            </div>
            <div className="text-[11px] text-[var(--brand-deep)] font-black font-mono">
              TRY {selectedSlot.price}
            </div>
          </div>
          <Button 
            variant="primary" 
            className="h-10 text-xs font-extrabold px-6 rounded-[12px] shrink-0 shadow-[var(--shadow-btn)]" 
            onClick={() => logAudit("booking_checkout.started", `Proceeded to checkout for ${selectedSlot.court} at ${selectedSlot.time}`)}
            asChild
          >
            <Link href={`/${clubSlug}/checkout?time=${selectedSlot.time}&court=${selectedSlot.court}&price=${selectedSlot.price}&payMode=${payMode}&playerCount=${playerCount}`}>
              Continue
            </Link>
          </Button>
        </div>
      )}

      <PublicFooter clubSlug={clubSlug} />
    </div>
  );
}
