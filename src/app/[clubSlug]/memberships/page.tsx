import Link from "next/link";
import { Check } from "lucide-react";

import { TenantHeader } from "@/components/layout/tenant-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TypewriterText } from "@/components/ui/typewriter-text";

interface MembershipsPageProps {
  params: Promise<{ clubSlug: string }>;
}

export default async function MembershipsPage({ params }: MembershipsPageProps) {
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

  const comparisonRows = [
    { feature: "Booking credits", starter: "4 credits", weekend: "12 credits", unlimited: "Unlimited fair-use" },
    { feature: "POS discount", starter: "—", weekend: "5% discount", unlimited: "10% discount" },
    { feature: "Cancel flexibility", starter: "24 Hours", weekend: "12 Hours", unlimited: "6 Hours" },
    { feature: "Priority booking", starter: "Standard", weekend: "2 days early", unlimited: "7 days early" },
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
              Choose Your Membership
            </h1>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              Membership plans: clearly showing what you get, who it fits, and what it includes.
            </p>
          </div>
        </section>

        {/* Pricing Plan Grid */}
        <section className="grid gap-4 md:grid-cols-3">
          
          {/* Starter Plan */}
          <div className="border border-[var(--line)] bg-[#fffdf9] rounded-[14px] p-6 flex flex-col justify-between gap-6 shadow-[var(--shadow-sm)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[var(--ink)] tracking-tight">Starter</h3>
                  <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mt-0.5">4 court credits / mo</p>
                </div>
                <Badge tone="slate" className="bg-[#edf3f5] border-[#cad9df] text-[#435f6f]">TRY 1,200</Badge>
              </div>

              <div className="space-y-2">
                <span className="text-2xl font-black text-[var(--ink)]">Once a week</span>
                <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                  Perfect for beginner, regular but light players. Get started with essential booking perks.
                </p>
              </div>
            </div>
            
            <Button variant="secondary" className="w-full text-xs font-bold py-2 border-[var(--line-strong)] rounded-[9px]" asChild>
              <Link href={`/${clubSlug}/checkout`}>Choose Starter</Link>
            </Button>
          </div>

          {/* Weekend Pro Plan */}
          <div className="border border-[#e3b197] bg-gradient-to-b from-[#fffaf5] to-[#fff1e8] rounded-[14px] p-6 flex flex-col justify-between gap-6 shadow-[0_12px_30px_rgba(49,36,24,0.075)] relative overflow-hidden">
            <div className="absolute right-[-40px] top-[-40px] w-[120px] h-[120px] rounded-full bg-[rgba(223,255,114,0.22)] pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[var(--ink)] tracking-tight">Weekend Pro</h3>
                  <p className="text-[10px] text-[var(--brand-deep)] font-bold uppercase tracking-wider mt-0.5">12 court credits / mo</p>
                </div>
                <Badge tone="brand">Popular</Badge>
              </div>

              <div className="space-y-2">
                <span className="text-2xl font-black text-[var(--ink)]">TRY 2,900</span>
                <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                  Weekend warriors who love split payments, open play, and social court coordination.
                </p>
              </div>
            </div>
            
            <Button variant="primary" className="w-full text-xs font-bold py-2 rounded-[9px] relative z-10" asChild>
              <Link href={`/${clubSlug}/checkout`}>Choose Weekend Pro</Link>
            </Button>
          </div>

          {/* Unlimited Club Plan */}
          <div className="border border-[var(--line)] bg-[#fffdf9] rounded-[14px] p-6 flex flex-col justify-between gap-6 shadow-[var(--shadow-sm)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[var(--ink)] tracking-tight">Unlimited Club</h3>
                  <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mt-0.5">Fair-use premium</p>
                </div>
                <Badge tone="live">Pro</Badge>
              </div>

              <div className="space-y-2">
                <span className="text-2xl font-black text-[var(--ink)]">TRY 4,900</span>
                <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                  High-frequency players demanding prime court slots, priority booking, and best savings.
                </p>
              </div>
            </div>
            
            <Button variant="secondary" className="w-full text-xs font-bold py-2 border-[var(--line-strong)] rounded-[9px]" asChild>
              <Link href={`/${clubSlug}/checkout`}>Apply Now</Link>
            </Button>
          </div>

        </section>

        {/* Plan Comparison Feature Matrix */}
        <Card variant="surface" className="p-5 border border-[var(--line)] rounded-[14px] bg-[var(--surface)] shadow-[var(--shadow)]">
          <header className="pb-3 border-b border-[var(--line)]">
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ink)]">Plan Comparison Matrix</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">
              Full feature outline for each membership tier.
            </p>
          </header>

          <div className="pt-4 overflow-x-auto">
            <div className="min-w-[700px] divide-y divide-[var(--line)]/50">
              {/* Table Header */}
              <div className="grid grid-cols-[200px_repeat(3,1fr)] py-3 text-xs font-black text-[var(--muted)] uppercase tracking-wider">
                <div>Feature</div>
                <div className="text-center">Starter</div>
                <div className="text-center text-[var(--brand-deep)]">Weekend Pro</div>
                <div className="text-center">Unlimited Club</div>
              </div>
              
              {/* Table Rows */}
              {comparisonRows.map((r) => (
                <div key={r.feature} className="grid grid-cols-[200px_repeat(3,1fr)] py-3.5 text-xs items-center hover:bg-[var(--surface-soft)]/40 transition-colors">
                  <div className="font-extrabold text-[var(--ink)]">{r.feature}</div>
                  <div className="text-center text-[var(--muted)] font-semibold">{r.starter}</div>
                  <div className="text-center text-[var(--brand-deep)] font-extrabold">{r.weekend}</div>
                  <div className="text-center text-[var(--ink)] font-black">{r.unlimited}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </main>

      <PublicFooter clubSlug={clubSlug} />
    </div>
  );
}
