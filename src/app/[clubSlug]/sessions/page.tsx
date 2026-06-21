"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ChevronRight,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  HelpCircle,
  Users
} from "lucide-react";

import { TenantHeader } from "@/components/layout/tenant-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { sessions as initialSessions } from "@/lib/mock-data";
import { Session } from "@/lib/types";

interface SessionsPageProps {
  params: Promise<{ clubSlug: string }>;
}

export default function SessionsPage({ params }: SessionsPageProps) {
  const { clubSlug } = React.use(params);
  
  // Stateful sessions to dynamically update spot counts upon registration
  const [sessions, setSessions] = React.useState<Session[]>(initialSessions);
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);

  // Form states
  const [rsvpName, setRsvpName] = React.useState("Dani Santos");
  const [rsvpContact, setRsvpContact] = React.useState("");
  const [rsvpSkill, setRsvpSkill] = React.useState("3.5");
  const [rsvpGuests, setRsvpGuests] = React.useState(0);
  const [rsvpNotes, setRsvpNotes] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Toast states
  const [toastMessage, setToastMessage] = React.useState("");
  const [toastType, setToastType] = React.useState<"success" | "error" | "info">("success");
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

  // Calculate stats from state
  const totalSessions = sessions.length;
  const almostFull = sessions.filter(s => s.status === "few-spots" || s.booked >= s.capacity - 3).length;
  const levelRange = "3.0 - 4.5+";

  // Heatmap data
  const heatmapDays = [
    { day: "Mon", count: 3, level: "level1" },
    { day: "Tue", count: 5, level: "level2" },
    { day: "Wed", count: 8, level: "level4" },
    { day: "Thu", count: 4, level: "level2" },
    { day: "Fri", count: 9, level: "level4" },
    { day: "Sat", count: 7, level: "level3" },
    { day: "Sun", count: 5, level: "level2" },
  ];

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const logAudit = (actionType: string, details: string) => {
    if (typeof window === "undefined") return;
    const newLog = {
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      user: rsvpName || "Player (B2C)",
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

  const handleOpenRsvp = (session: Session) => {
    setSelectedSession(session);
    setRsvpContact("");
    setRsvpGuests(0);
    setRsvpNotes("");
    setFormError("");
  };

  // Perform a soft check if player's skill matches the session skill level description
  const getSkillWarning = () => {
    if (!selectedSession) return null;
    const selectedVal = parseFloat(rsvpSkill);
    const sessionLevelLower = selectedSession.level.toLowerCase();

    if (sessionLevelLower.includes("advanced")) {
      if (selectedVal < 4.0) {
        return "Warning: This session is for Advanced players. Recommended level is 4.0+.";
      }
    } else if (sessionLevelLower.includes("intermediate")) {
      if (selectedVal < 3.0) {
        return "Warning: Recommended level for Intermediate is 3.0 - 4.0.";
      }
      if (selectedVal > 4.2) {
        return "Note: This is an Intermediate play session. It might feel slow for you.";
      }
    } else if (sessionLevelLower.includes("beginner") || sessionLevelLower.includes("friendly")) {
      if (selectedVal > 3.8) {
        return "Note: This is beginner friendly. Please keep it accessible for newer players.";
      }
    }
    return null;
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    if (!rsvpContact.trim()) {
      setFormError("Contact email or phone is required.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    setTimeout(() => {
      const isWaitlist = selectedSession.booked >= selectedSession.capacity;
      const totalClaimedSpots = 1 + rsvpGuests;

      if (isWaitlist) {
        // Log waitlist audit
        logAudit("session_waitlist.created", `Joined waitlist for ${selectedSession.name} (${rsvpGuests} guests)`);
        triggerToast("Added to waitlist. We will notify you if a spot opens.", "info");
      } else {
        // Optimistically update capacity count in our local state
        setSessions(prev =>
          prev.map(s =>
            s.id === selectedSession.id
              ? { ...s, booked: Math.min(s.capacity, s.booked + totalClaimedSpots) }
              : s
          )
        );

        // Log reservation audit
        logAudit("session_rsvp.created", `Reserved spot in ${selectedSession.name} for ${rsvpName} (${rsvpGuests} guests)`);
        triggerToast("Spot reserved. We sent your session details.", "success");
      }

      setIsSubmitting(false);
      setSelectedSession(null);
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased relative transition-colors duration-300">
      
      {/* Toast Notification Container */}
      {showToast && (
        <div className="fixed top-5 right-5 z-[100] max-w-sm rounded-[12px] border border-[#ead7c7] bg-white p-4 shadow-xl flex gap-3 items-center animate-slide-up transform translate-y-0 transition-transform">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
            toastType === "success" 
              ? "bg-emerald-50 text-emerald-600" 
              : toastType === "info" 
              ? "bg-amber-50 text-amber-600" 
              : "bg-red-50 text-red-600"
          }`}>
            {toastType === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          </div>
          <div className="text-xs font-black text-[var(--ink)]">
            {toastMessage}
          </div>
          <button 
            onClick={() => setShowToast(false)} 
            className="text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <TenantHeader clubSlug={clubSlug} clubName={clubTitle} clubLogo={clubLogo} />

      <main className="flex-1 max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
        
        {/* Page Head */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-[var(--line)] pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-deep)]">Pickle Pulse</span>
            <h1 className="text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              Session Rhythm
            </h1>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              Date-based Open Play / tournament / clinic sessions; a live occupancy board, not a static list.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--out-green)] animate-pulse" />
            Live sync active
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] border border-[var(--line)] rounded-[14px] p-4 shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300">
            <span className="font-mono text-xl font-black text-[var(--ink)]">{totalSessions}</span>
            <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-wider mt-1">today sessions</p>
          </div>
          <div className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] border border-[var(--line)] rounded-[14px] p-4 shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300">
            <span className="font-mono text-xl font-black text-[var(--ink)]">{almostFull}</span>
            <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-wider mt-1">almost full</p>
          </div>
          <div className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] border border-[var(--line)] rounded-[14px] p-4 shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300">
            <span className="font-mono text-xl font-black text-[var(--brand-deep)]">18:00</span>
            <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-wider mt-1">hot slot</p>
          </div>
          <div className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] border border-[var(--line)] rounded-[14px] p-4 shadow-[var(--shadow-sm)] hover:shadow-md transition-all duration-300">
            <span className="font-mono text-xl font-black text-[var(--ink)]">{levelRange}</span>
            <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-wider mt-1">level range</p>
          </div>
        </section>

        {/* Session Cards Grid */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const progress = (session.booked / session.capacity) * 100;
            const displayPrice = session.price * 30; // Turkish Lira scaling
            const isFull = session.booked >= session.capacity;
            const isFew = !isFull && session.booked >= session.capacity - 3;

            const badgeTone = isFull
              ? ("slate" as const)
              : isFew
              ? ("brand" as const)
              : ("live" as const);

            const badgeLabel = isFull
              ? "Full"
              : isFew
              ? `${session.capacity - session.booked} spots`
              : "Open";

            return (
              <Card key={session.id} variant="surface" className="flex flex-col justify-between overflow-hidden bg-[var(--surface)] border border-[var(--line)] rounded-[20px] shadow-[var(--shadow)] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <header className="px-5 py-4 flex items-start justify-between gap-4 border-b border-[var(--line)] bg-[#fffbf7]">
                  <div>
                    <h3 className="font-extrabold text-[var(--ink)] tracking-tight">{session.name}</h3>
                    <p className="text-[11px] text-[var(--muted)] font-semibold mt-0.5">
                      {session.dayLabel} {session.timeLabel} · {session.booked}/{session.capacity} joined
                    </p>
                  </div>
                  <Badge tone={badgeTone} className="text-[9px] px-2 py-0.5 font-black">{badgeLabel}</Badge>
                </header>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-2xl font-black font-mono text-[var(--brand-deep)]">
                      TRY {displayPrice}
                    </div>
                    <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                      Level {session.level} · coach on duty · court rotation included.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-[var(--surface-soft)] overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull 
                              ? "bg-slate-400" 
                              : isFew 
                              ? "bg-gradient-to-r from-[var(--brand)] to-[#e09d6b]" 
                              : "bg-gradient-to-r from-[var(--out-green)] to-[#93bd5e]"
                          }`} 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleOpenRsvp(session)}
                      variant={isFull ? "secondary" : isFew ? "secondary" : "primary"} 
                      className="w-full text-xs font-extrabold py-2.5 rounded-[12px] shadow-sm transition-transform active:scale-[0.98]"
                    >
                      RSVP
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        {/* Heatmap / Week Rhythm Card */}
        <Card variant="surface" className="p-5 border border-[var(--line)] rounded-[20px] bg-[var(--surface)] shadow-[var(--shadow)]">
          <header className="pb-3 border-b border-[var(--line)]">
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ink)]">Week rhythm</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">
              Pick a busy day without opening an Excel-looking calendar.
            </p>
          </header>
          
          <div className="pt-4 overflow-x-auto">
            <div className="min-w-[600px] grid grid-cols-[100px_repeat(7,1fr)] gap-2">
              <div className="bg-[#fff7ef] border border-[var(--line)] rounded-[12px] p-3 flex items-center justify-center text-xs font-black text-[var(--ink)] shadow-sm">
                Active Days
              </div>
              
              {heatmapDays.map((d) => {
                const levelColors = {
                  level1: "bg-[#edf6f1] border-[#cbe4d9]",
                  level2: "bg-[#fbf0d8] border-[#ead59c]",
                  level3: "bg-[#fff0e8] border-[#ecc0ae]",
                  level4: "bg-[#eaf8b6] border-[#d7ec7a]",
                };

                return (
                  <div 
                    key={d.day} 
                    className={`border rounded-[12px] p-3 flex flex-col items-center justify-center min-h-[54px] text-center shadow-sm hover:-translate-y-0.5 transition-transform ${
                      levelColors[d.level as keyof typeof levelColors]
                    }`}
                  >
                    <span className="text-xs font-black text-[var(--ink)]">{d.day}</span>
                    <span className="text-[10px] font-extrabold text-[var(--muted)] mt-1 font-mono">{d.count} sessions</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

      </main>

      <PublicFooter clubSlug={clubSlug} />

      {/* RSVP Registration Drawer Modal Overlay */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/45 backdrop-blur-sm transition-all duration-300">
          <div 
            className="w-full max-w-md h-full bg-white border-l border-[var(--line)] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-scale-in relative rounded-l-[24px]"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[var(--line)] pb-4 mb-5">
                <div>
                  <Badge tone={selectedSession.booked >= selectedSession.capacity ? "slate" : "live"} className="text-[9px] uppercase tracking-wider mb-1 font-black">
                    {selectedSession.booked >= selectedSession.capacity ? "Waitlist Open" : "RSVP Registration"}
                  </Badge>
                  <h2 className="text-xl font-extrabold text-[var(--ink)] tracking-tight">
                    {selectedSession.name}
                  </h2>
                  <p className="text-xs text-[var(--muted)] font-semibold mt-1">
                    {selectedSession.dayLabel} · {selectedSession.timeLabel}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                
                {/* Player Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--muted)]">Player Name</label>
                  <input
                    type="text"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    required
                    className="w-full rounded-[12px] border border-[var(--line-strong)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all font-semibold"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email / Phone Contact */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--muted)]">Email or Phone Number</label>
                  <input
                    type="text"
                    value={rsvpContact}
                    onChange={(e) => setRsvpContact(e.target.value)}
                    required
                    className="w-full rounded-[12px] border border-[var(--line-strong)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all font-semibold"
                    placeholder="e.g., player@domain.com or +90..."
                  />
                </div>

                {/* Skill Level Selection & Warning */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--muted)] flex items-center gap-1">
                    Your Skill Level (USAPA)
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </label>
                  <select
                    value={rsvpSkill}
                    onChange={(e) => setRsvpSkill(e.target.value)}
                    className="w-full rounded-[12px] border border-[var(--line-strong)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] transition-all font-semibold"
                  >
                    <option value="2.5">2.5 (Beginner)</option>
                    <option value="3.0">3.0 (Advanced Beginner)</option>
                    <option value="3.5">3.5 (Intermediate)</option>
                    <option value="4.0">4.0 (Advanced)</option>
                    <option value="4.5">4.5+ (Pro/Tournament)</option>
                  </select>

                  {/* Dynamic warning badge when skill range warns */}
                  {getSkillWarning() && (
                    <div className="mt-1.5 p-2.5 rounded-[8px] border border-amber-200 bg-amber-50 text-[10px] font-bold text-amber-700 flex gap-2 items-start leading-relaxed">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                      <span>{getSkillWarning()}</span>
                    </div>
                  )}
                </div>

                {/* Guest Spots Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--muted)]">Bring Guests (+ spots)</label>
                  <select
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(parseInt(e.target.value))}
                    className="w-full rounded-[12px] border border-[var(--line-strong)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] transition-all font-semibold"
                  >
                    <option value="0">No guests (just me)</option>
                    <option value="1">+1 Guest</option>
                    <option value="2">+2 Guests</option>
                    <option value="3">+3 Guests</option>
                  </select>
                </div>

                {/* Personal Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--muted)]">Booking Notes (Optional)</label>
                  <textarea
                    value={rsvpNotes}
                    onChange={(e) => setRsvpNotes(e.target.value)}
                    rows={2}
                    className="w-full rounded-[12px] border border-[var(--line-strong)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] transition-all resize-none font-semibold"
                    placeholder="e.g. need paddle rental"
                  />
                </div>

                {formError && (
                  <p className="text-xs font-semibold text-red-500">{formError}</p>
                )}

              </form>
            </div>

            {/* Sticky bottom checkout drawer summary */}
            <div className="border-t border-[var(--line)] pt-4 mt-6 space-y-4">
              <div className="flex justify-between items-center bg-[#fffdf9] p-3.5 rounded-[14px] border border-[var(--line-strong)] shadow-sm">
                <div>
                  <p className="text-[10px] font-black uppercase text-[var(--muted)]">Invoice Summary</p>
                  <p className="text-xs font-black text-[var(--ink)] mt-0.5">
                    {1 + rsvpGuests} spots ({selectedSession.name})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--muted)] font-bold line-through">
                    TRY {selectedSession.price * 30 * (1 + rsvpGuests)}
                  </p>
                  <p className="text-base font-mono font-black text-[var(--brand-deep)]">
                    TRY {selectedSession.price * 30 * (1 + rsvpGuests)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => setSelectedSession(null)}
                  variant="secondary" 
                  className="flex-1 py-2.5 text-xs font-black border-[var(--line-strong)] rounded-[12px] active:scale-95"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleRsvpSubmit}
                  disabled={isSubmitting}
                  variant="primary" 
                  className="flex-[2] py-2.5 text-xs font-black uppercase tracking-wider bg-[#211b16] text-white hover:bg-[#332b25] rounded-[12px] shadow-sm active:scale-[0.98] transition-transform"
                >
                  {isSubmitting 
                    ? "Processing..." 
                    : selectedSession.booked >= selectedSession.capacity 
                    ? "Join Waitlist" 
                    : "Reserve Spot"
                  }
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
