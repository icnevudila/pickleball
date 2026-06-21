"use client";

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Wallet, AlertCircle, CheckCircle2, DollarSign, Download, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";

interface WalletPageProps {
  params: Promise<{ clubSlug: string }>;
}

export default function WalletPage({ params }: WalletPageProps) {
  const { clubSlug } = use(params);
  const [balance, setBalance] = React.useState(1240);
  const [autoTopUp, setAutoTopUp] = React.useState(false);

  const handleTopUp = () => {
    setBalance((prev) => prev + 500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-5 animate-fade-in stagger-1">
        <Link
          href={`/${clubSlug}/account`}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)] hover:text-[var(--brand)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold tracking-[-0.06em] text-[var(--foreground)]">Wallet vault</h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] font-semibold leading-relaxed">
          Manage your club credits, view recent cafe POS charges, and configure threshold guards.
        </p>
      </div>

      {/* Metrics Row */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-4 animate-fade-in stagger-2">
        <StatCard
          label="Wallet Balance"
          value={`TRY ${balance.toLocaleString()}`}
          icon={<Wallet className="w-5 h-5 text-[var(--brand)]" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
        <StatCard
          label="Last Cafe POS Purchase"
          value="TRY 145"
          icon={<DollarSign className="w-5 h-5 text-amber-500" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
        <StatCard
          label="Auto Top-up Guard"
          value="TRY 250"
          icon={<AlertCircle className="w-5 h-5 text-slate-400" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
        <StatCard
          label="Recent Transactions"
          value="3 tx"
          icon={<CheckCircle2 className="w-5 h-5 text-[var(--out-green)]" />}
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px]"
        />
      </section>

      {/* Priority Cards Row */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[16px] border border-[#bddbcc] bg-[#f4fbf7] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--green)]">
              <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
              Wallet Ready
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">Enough for tonight</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">No payment friction during check-in</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[9px] text-xs font-bold py-2 bg-white border-[var(--line-strong)]">
            Use credits
          </Button>
        </article>

        <article className="rounded-[16px] border border-[#e1c486] bg-[#fff8e8] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Auto top-up off
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">Could fail later</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Suggest enabling threshold guard</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="w-full rounded-[9px] text-xs font-bold py-2 bg-white border-[var(--line-strong)]"
            onClick={() => setAutoTopUp(!autoTopUp)}
          >
            {autoTopUp ? "Disable guard" : "Enable guard"}
          </Button>
        </article>

        <article className="rounded-[16px] border border-[#e3b197] bg-gradient-to-b from-[#fffaf5] to-[#fff3eb] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#9d3d25]">
              <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
              Receipt center
            </div>
            <h3 className="font-extrabold text-[var(--foreground)] text-base">Last POS receipt ready</h3>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">Support-safe invoice ledger</p>
          </div>
          <Button variant="secondary" size="sm" className="w-full rounded-[9px] text-xs font-bold py-2 bg-white border-[var(--line-strong)] flex items-center justify-center gap-1">
            <Download className="w-3.5 h-3.5" /> Download PDF
          </Button>
        </article>
      </section>

      {/* Spend Guard & Balance Details */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card variant="surface" className="p-6 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)] flex flex-col justify-between min-h-[200px]">
          <div className="flex justify-between items-start border-b border-[var(--line)]/50 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">Club balance</h3>
              <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">Wallet credits for bookings and quick cafe payments</p>
            </div>
            <Badge tone="lime">Ready</Badge>
          </div>

          <div className="space-y-1 pt-4">
            <span className="text-3xl font-black font-mono text-[var(--foreground)]">TRY {balance.toLocaleString()}</span>
            <p className="text-xs text-[var(--muted)] font-semibold">available immediately</p>
          </div>

          <div className="flex gap-2 pt-6">
            <Button variant="primary" className="rounded-[9px] text-xs font-bold px-4 py-2 bg-[var(--brand)] flex items-center gap-1" onClick={handleTopUp}>
              <Plus className="w-4 h-4" /> Top up TRY 500
            </Button>
            <Button
              variant="secondary"
              className="rounded-[9px] text-xs font-bold px-4 py-2 bg-white border-[var(--line-strong)]"
              onClick={() => setAutoTopUp(!autoTopUp)}
            >
              Auto top-up
            </Button>
          </div>
        </Card>

        <Card variant="surface" className="p-6 border border-[var(--line-strong)] rounded-[16px] shadow-[var(--shadow-sm)] flex flex-col justify-between min-h-[200px]">
          <div className="flex justify-between items-start border-b border-[var(--line)]/50 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[var(--ink)] tracking-tight">Spend guard</h3>
              <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">Prevent silent booking payment failures</p>
            </div>
          </div>

          <div className="p-4 border border-[var(--line)] bg-[var(--surface-soft)] rounded-[12px] flex justify-between items-center">
            <div>
              <p className="font-extrabold text-sm text-[var(--foreground)]">Auto top-up threshold</p>
              <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">Add TRY 500 when balance falls below TRY 250</p>
            </div>
            <Badge tone={autoTopUp ? "lime" : "slate"}>
              {autoTopUp ? "ON" : "OFF"}
            </Badge>
          </div>
        </Card>
      </section>

      {/* Ledger transaction logs */}
      <section className="space-y-4">
        <div className="border-b border-[var(--line)] pb-4">
          <h2 className="text-xl font-black text-[var(--foreground)]">Ledger Activity</h2>
          <p className="text-xs font-semibold text-[var(--muted)] mt-1">
            Clear transaction history, audit-ready for support or verification queries.
          </p>
        </div>

        <Card variant="surface" className="overflow-hidden border border-[var(--line-strong)] rounded-[16px]">
          <div className="divide-y divide-[var(--line)]">
            {[
              { desc: "POS · Cafe Water + grip tape", date: "Today 18:02", value: "-TRY 145", type: "Done", tone: "lime" as const },
              { desc: "Top-up balance load", date: "Jun 20, 2026", value: "+TRY 1,000", type: "Card", tone: "brand" as const },
              { desc: "Court 2 booking slots split", date: "Jun 19, 2026", value: "-TRY 350", type: "Split", tone: "slate" as const },
            ].map((tx, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--surface-soft)] transition-colors">
                <div className="space-y-0.5">
                  <p className="font-extrabold text-sm text-[var(--foreground)]">{tx.desc}</p>
                  <p className="text-[10px] text-[var(--muted)]">{tx.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-sm font-black ${tx.value.startsWith("+") ? "text-[var(--out-green)]" : "text-[var(--foreground)]"}`}>{tx.value}</span>
                  <Badge tone={tx.tone}>{tx.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
