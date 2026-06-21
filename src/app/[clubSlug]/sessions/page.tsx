import Link from "next/link";

import { TenantHeader } from "@/components/layout/tenant-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { sessions } from "@/lib/mock-data";

interface SessionsPageProps {
  params: Promise<{ clubSlug: string }>;
}

export default async function SessionsPage({ params }: SessionsPageProps) {
  const { clubSlug } = await params;

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

  // Calculate stats from mock sessions
  const totalSessions = sessions.length;
  const almostFull = sessions.filter(s => s.status === "few-spots" || s.booked >= s.capacity - 3).length;
  const levelRange = "3.0 - 4.5+";

  // Mock heatmap contributions/rhythm data
  const heatmapDays = [
    { day: "Mon", count: 3, level: "level1" },
    { day: "Tue", count: 5, level: "level2" },
    { day: "Wed", count: 8, level: "level4" },
    { day: "Thu", count: 4, level: "level2" },
    { day: "Fri", count: 9, level: "level4" },
    { day: "Sat", count: 7, level: "level3" },
    { day: "Sun", count: 5, level: "level2" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
      <TenantHeader clubSlug={clubSlug} clubName={clubTitle} clubLogo={clubLogo} />

      <main className="flex-1 max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Head */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-[var(--line)] pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-deep)]">Pickle Pulse</span>
            <h1 className="text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              Session <TypewriterText words={["Rhythm", "Pulse", "Occupancy", "Availability"]} className="text-[var(--brand)]" />
            </h1>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              Date-based Open Play / tournament / clinic sessions; a live occupancy board, not a static list.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--out-green)] animate-pulse" />
            Live sync active
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[10px] p-4 shadow-[var(--shadow-sm)]">
            <span className="font-mono text-xl font-black text-[var(--ink)]">{totalSessions}</span>
            <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mt-1">today sessions</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[10px] p-4 shadow-[var(--shadow-sm)]">
            <span className="font-mono text-xl font-black text-[var(--ink)]">{almostFull}</span>
            <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mt-1">almost full</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[10px] p-4 shadow-[var(--shadow-sm)]">
            <span className="font-mono text-xl font-black text-[var(--brand-deep)]">18:00</span>
            <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mt-1">hot slot</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[10px] p-4 shadow-[var(--shadow-sm)]">
            <span className="font-mono text-xl font-black text-[var(--ink)]">{levelRange}</span>
            <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mt-1">level range</p>
          </div>
        </section>

        {/* Session Cards Grid */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const progress = (session.booked / session.capacity) * 100;
            
            // Map values for realistic Lira prices
            const displayPrice = session.price * 30;

            const isFull = session.booked >= session.capacity;
            const isFew = session.status === "few-spots";

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
              <Card key={session.id} variant="surface" className="flex flex-col justify-between overflow-hidden bg-[var(--surface)] border border-[var(--line)] rounded-[14px] shadow-[var(--shadow)]">
                <header className="px-5 py-3.5 flex items-start justify-between gap-4 border-b border-[var(--line)] bg-[#fffdf9]">
                  <div>
                    <h3 className="font-extrabold text-[var(--ink)] tracking-tight">{session.name}</h3>
                    <p className="text-[11px] text-[var(--muted)] font-semibold mt-0.5">
                      {session.dayLabel} {session.timeLabel} · {session.booked}/{session.capacity} joined
                    </p>
                  </div>
                  <Badge tone={badgeTone} className="text-[9px] px-2 py-0.5">{badgeLabel}</Badge>
                </header>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-2xl font-black font-mono text-[var(--ink)]">
                      TRY {displayPrice}
                    </div>
                    <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                      Level {session.level} · coach on duty · court rotation included.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-[var(--surface-3)] overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull 
                              ? "bg-slate-400" 
                              : isFew 
                              ? "bg-gradient-to-r from-[var(--brand)] to-[#e09d6b]" 
                              : "bg-gradient-to-r from-[var(--green)] to-[#93bd5e]"
                          }`} 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>

                    <Button 
                      variant={isFull ? "secondary" : isFew ? "secondary" : "primary"} 
                      className="w-full text-xs font-bold py-2 rounded-[9px]"
                      asChild
                    >
                      <Link href={`/${clubSlug}/book`}>
                        {isFull ? "Queue / Waitlist" : isFew ? "Reserve Spot" : "Join Session"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        {/* Heatmap / Week Rhythm Card */}
        <Card variant="surface" className="p-5 border border-[var(--line)] rounded-[14px] bg-[var(--surface)] shadow-[var(--shadow)]">
          <header className="pb-3 border-b border-[var(--line)]">
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ink)]">Week rhythm</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">
              Pick a busy day without opening an Excel-looking calendar.
            </p>
          </header>
          
          <div className="pt-4 overflow-x-auto">
            <div className="min-w-[600px] grid grid-cols-[100px_repeat(7,1fr)] gap-2">
              <div className="bg-[#fff7ef] border border-[var(--line)] rounded-[9px] p-3 flex items-center justify-center text-xs font-black text-[var(--ink)]">
                Active Days
              </div>
              
              {heatmapDays.map((d) => {
                // github-contribution levels
                const levelColors = {
                  level1: "bg-[#edf6f1] border-[#cbe4d9]",
                  level2: "bg-[#fbf0d8] border-[#ead59c]",
                  level3: "bg-[#fff0e8] border-[#ecc0ae]",
                  level4: "bg-[#eaf8b6] border-[#d7ec7a]",
                };

                return (
                  <div 
                    key={d.day} 
                    className={`border rounded-[9px] p-3 flex flex-col items-center justify-center min-h-[54px] text-center ${
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
    </div>
  );
}
