"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminAnalyticsPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";
  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  return (
    <div className="w-full text-[#3a312a]">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211b16] text-[#fffaf4] px-4 py-2.5 rounded-[10px] text-xs font-semibold shadow-[0_14px_30px_rgba(0,0,0,0.16)] animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-[#e2d3c4] pb-5 mb-4">
        <div className="space-y-1">
          <div className="text-[11px] color-[#9d3d25] uppercase tracking-[0.07em] font-extrabold">Pickle Pulse</div>
          <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-[#211b16]">Analytics war room</h1>
          <p className="text-sm text-[#756a61] mt-1.5">
            Not a graph dumpster; the answer to which day, which court, and which member brings money.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-semibold"
            onClick={() => triggerToast("Telemetry report updated")}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="h-8 bg-[#d95b35] border-[#d95b35] hover:bg-[#c94f2f] text-white rounded-[9px] text-xs font-semibold"
            onClick={() => triggerToast("Downloading PDF analytical executive report")}
          >
            Primary action
          </Button>
        </div>
      </section>

      {/* Layout Split: Main Board (Left) & Action Rail (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 items-start">
        
        {/* Left Section: Content */}
        <div className="space-y-4 min-w-0">
          
          {/* Metrics Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black font-mono">₺126k</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Month</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black">82%</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Prime fill</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black">41%</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Cohort</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black text-[#9f3b2d]">24</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Churn risk</span>
            </div>
          </section>

          {/* Priority Alert Strip */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {/* Alert 1 */}
            <article className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-3 flex items-start justify-between gap-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)] min-w-0 bg-gradient-to-b from-[#fffaf5] to-[#fff3eb] border-[#e3b197]">
              <div className="min-w-0">
                <div className="text-[10px] text-[#75675d] uppercase tracking-[0.05em] font-black flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d95b35] shadow-[0_0_0_3px_rgba(217,91,53,0.11)]" />
                  Pricing
                </div>
                <h3 className="font-extrabold text-[#211b16] text-[13px] truncate">Friday C2 underpriced</h3>
                <p className="text-[12px] text-[#756a61] mt-0.5 truncate">Consider prime uplift</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="h-[29px] border-[#e3b197] bg-[#fff0e8] hover:bg-[#ffe5d9] text-[#9d3d25] rounded-[9px] text-[11px] font-semibold px-2.5 shrink-0"
                onClick={() => triggerToast("Simulating pricing model uplift")}
              >
                Model
              </Button>
            </article>

            {/* Alert 2 */}
            <article className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-3 flex items-start justify-between gap-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)] min-w-0 bg-[#f4fbf7] border-[#bddbcc]">
              <div className="min-w-0">
                <div className="text-[10px] text-[#75675d] uppercase tracking-[0.05em] font-black flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2f8066] shadow-[0_0_0_3px_rgba(47,128,102,0.1)]" />
                  Cohort
                </div>
                <h3 className="font-extrabold text-[#211b16] text-[13px] truncate">May cohort healthy</h3>
                <p className="text-[12px] text-[#756a61] mt-0.5 truncate">Double onboarding flow</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="h-[29px] border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-[11px] font-semibold px-2.5 shrink-0"
                onClick={() => triggerToast("Viewing May cohort details")}
              >
                View
              </Button>
            </article>

            {/* Alert 3 */}
            <article className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-3 flex items-start justify-between gap-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)] min-w-0 bg-[#fff8e8] border-[#e1c486]">
              <div className="min-w-0">
                <div className="text-[10px] text-[#75675d] uppercase tracking-[0.05em] font-black flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a97619] shadow-[0_0_0_3px_rgba(169,118,25,0.1)]" />
                  Churn
                </div>
                <h3 className="font-extrabold text-[#211b16] text-[13px] truncate">24 members inactive</h3>
                <p className="text-[12px] text-[#756a61] mt-0.5 truncate">Launch win-back</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="h-[29px] border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-[11px] font-semibold px-2.5 shrink-0"
                onClick={() => triggerToast("Win-back campaign generated")}
              >
                Campaign
              </Button>
            </article>
          </section>

          {/* Heatmap and Cohort signal cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Heatmap Card */}
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
              <div className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9] flex items-start justify-between gap-2.5">
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#211b16] tracking-tight">Court revenue heatmap</h3>
                  <p className="text-xs text-[#756a61] mt-0.5">Prime slots exposed</p>
                </div>
                <Badge tone="brand" className="bg-[#fff0e8] border-[#ecc0ae] text-[#94402a] px-2 py-0.5 text-[11px] font-bold rounded-full">
                  LIVE
                </Badge>
              </div>
              <div className="p-3.5">
                {/* 8-col grid matching heatmap */}
                <div className="grid grid-cols-8 gap-1.5 text-center text-[10px] font-bold">
                  <div className="bg-[#fff7ef] text-[#211b16] rounded border border-[#e2d3c4] p-1.5 flex items-center justify-center font-extrabold">Day</div>
                  <div className="bg-[#fff7ef] text-[#211b16] rounded border border-[#e2d3c4] p-1.5 flex items-center justify-center font-extrabold">Mon</div>
                  <div className="bg-[#fff7ef] text-[#211b16] rounded border border-[#e2d3c4] p-1.5 flex items-center justify-center font-extrabold">Tue</div>
                  <div className="bg-[#fff7ef] text-[#211b16] rounded border border-[#e2d3c4] p-1.5 flex items-center justify-center font-extrabold">Wed</div>
                  <div className="bg-[#fff7ef] text-[#211b16] rounded border border-[#e2d3c4] p-1.5 flex items-center justify-center font-extrabold">Thu</div>
                  <div className="bg-[#fff7ef] text-[#211b16] rounded border border-[#e2d3c4] p-1.5 flex items-center justify-center font-extrabold">Fri</div>
                  <div className="bg-[#fff7ef] text-[#211b16] rounded border border-[#e2d3c4] p-1.5 flex items-center justify-center font-extrabold">Sat</div>
                  <div className="bg-[#fff7ef] text-[#211b16] rounded border border-[#e2d3c4] p-1.5 flex items-center justify-center font-extrabold">Sun</div>

                  <div className="bg-[#fff7ef] text-[#211b16] rounded border border-[#e2d3c4] p-1.5 flex items-center justify-center font-extrabold">C1</div>
                  <div className="bg-[#fbf0d8] border border-[#ead59c] text-[#755308] rounded p-1.5">₺3k</div>
                  <div className="bg-[#fff0e8] border border-[#ecc0ae] text-[#94402a] rounded p-1.5">₺4k</div>
                  <div className="bg-[#eaf8b6] border border-[#d7ec7a] text-[#253000] rounded p-1.5">₺6k</div>
                  <div className="bg-[#fbf0d8] border border-[#ead59c] text-[#755308] rounded p-1.5">₺3k</div>
                  <div className="bg-[#eaf8b6] border border-[#d7ec7a] text-[#253000] rounded p-1.5 font-bold">₺7k</div>
                  <div className="bg-[#fff0e8] border border-[#ecc0ae] text-[#94402a] rounded p-1.5">₺5k</div>
                  <div className="bg-[#fbf0d8] border border-[#ead59c] text-[#755308] rounded p-1.5">₺3k</div>

                  <div className="bg-[#fff7ef] text-[#211b16] rounded border border-[#e2d3c4] p-1.5 flex items-center justify-center font-extrabold">C2</div>
                  <div className="bg-[#edf6f1] border border-[#cbe4d9] text-[#23624f] rounded p-1.5">₺2k</div>
                  <div className="bg-[#fbf0d8] border border-[#ead59c] text-[#755308] rounded p-1.5">₺3k</div>
                  <div className="bg-[#fff0e8] border border-[#ecc0ae] text-[#94402a] rounded p-1.5">₺4k</div>
                  <div className="bg-[#eaf8b6] border border-[#d7ec7a] text-[#253000] rounded p-1.5 font-bold">₺7k</div>
                  <div className="bg-[#eaf8b6] border border-[#d7ec7a] text-[#253000] rounded p-1.5 font-black ring-1 ring-[#d95b35]">₺8k</div>
                  <div className="bg-[#fff0e8] border border-[#ecc0ae] text-[#94402a] rounded p-1.5">₺5k</div>
                  <div className="bg-[#fbf0d8] border border-[#ead59c] text-[#755308] rounded p-1.5">₺3k</div>
                </div>
              </div>
            </div>

            {/* Cohort Signal Card */}
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden flex flex-col justify-between">
              <div className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9]">
                <h3 className="text-[15px] font-extrabold text-[#211b16] tracking-tight">Cohort signal</h3>
                <p className="text-xs text-[#756a61] mt-0.5">Members who joined in May</p>
              </div>
              <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-center">
                <h1 className="text-4xl font-black text-[#211b16] font-mono leading-none">41%</h1>
                <p className="text-xs text-[#756a61] font-semibold">returned 3+ times in first month</p>
                <div className="h-2.5 bg-[#f2e7dc] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#d95b35] to-[#e09d6b] rounded-full" style={{ width: "41%" }} />
                </div>
              </div>
            </div>
          </section>

          {/* Quick Info Grid-3 */}
          <section className="grid grid-cols-3 gap-3">
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-3.5 shadow-[0_1px_0_rgba(49,36,24,0.04)] text-center">
              <h4 className="text-[11px] text-[#756a61] font-bold uppercase tracking-wide truncate">Best court</h4>
              <h2 className="text-2xl font-black text-[#211b16] mt-1.5">C2</h2>
              <p className="text-[10px] text-[#756a61] font-semibold mt-1">₺8k Friday</p>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-3.5 shadow-[0_1px_0_rgba(49,36,24,0.04)] text-center">
              <h4 className="text-[11px] text-[#756a61] font-bold uppercase tracking-wide truncate">Best member</h4>
              <h2 className="text-2xl font-black text-[#211b16] mt-1.5 font-mono">₺8.2k</h2>
              <p className="text-[10px] text-[#756a61] font-semibold mt-1">LTV leader</p>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-3.5 shadow-[0_1px_0_rgba(49,36,24,0.04)] text-center">
              <h4 className="text-[11px] text-[#756a61] font-bold uppercase tracking-wide truncate">Churn risk</h4>
              <h2 className="text-2xl font-black text-[#211b16] mt-1.5">24</h2>
              <p className="text-[10px] text-[#756a61] font-semibold mt-1">No visit 30d</p>
            </div>
          </section>

        </div>

        {/* Right Section: Action Rail */}
        <aside className="space-y-3 xl:sticky xl:top-[78px]">
          <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
            <header className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9] flex justify-between gap-2.5 items-center">
              <div>
                <h3 className="font-extrabold text-[14px] text-[#211b16] tracking-tight">Next action</h3>
                <p className="text-xs text-[#756a61] mt-0.5">What staff should do now</p>
              </div>
              <Badge tone="brand" className="bg-[#fff0e8] border-[#ecc0ae] text-[#94402a] text-[10px] font-bold px-2 py-0.5 rounded">
                NOW
              </Badge>
            </header>
            <div className="p-3.5">
              <div className="bg-gradient-to-b from-[#fffaf5] to-[#fff1e8] border border-[#e3b197] rounded-[13px] p-3">
                <div className="text-[17px] font-extrabold text-[#211b16] tracking-[-0.025em] leading-snug">
                  Friday Court 2 is the money slot
                </div>
                <div className="text-xs text-[#756a61] mt-1 mb-3.5 leading-relaxed">
                  Analytics should produce pricing/session decisions, not just charts.
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-8 bg-[#d95b35] border-[#d95b35] hover:bg-[#c94f2f] text-white rounded-[9px] text-xs font-semibold px-3"
                    onClick={() => triggerToast("Adjusting Friday Court 2 slots tariffs")}
                  >
                    Run action
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-semibold px-3"
                    onClick={() => triggerToast("Opening full revenue timeline logs")}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
