"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SplitShare {
  id: string;
  name: string;
  contact: string;
  amount: number;
  status: "PAID" | "PENDING";
  paymentMethod?: string;
  paymentTime?: string;
}

interface Invoice {
  id: string;
  court: string;
  timeSlot: string;
  total: number;
  status: "PAID" | "PARTIALLY_PAID" | "UNPAID";
  shares: SplitShare[];
  createdTime: string;
}

const defaultInvoices: Invoice[] = [
  {
    id: "inv-1001",
    court: "Court 2",
    timeSlot: "18:00 - 19:30",
    total: 700,
    status: "PARTIALLY_PAID",
    createdTime: "2026-06-21 17:30",
    shares: [
      { id: "share-1", name: "Ali Düvenci", contact: "+90 532 111 22 33", amount: 175, status: "PAID", paymentMethod: "Wallet Balance", paymentTime: "2026-06-21 17:35" },
      { id: "share-2", name: "Zeynep S.", contact: "zeynep@gmail.com", amount: 175, status: "PAID", paymentMethod: "Card (Stripe)", paymentTime: "2026-06-21 17:40" },
      { id: "share-3", name: "Can Y.", contact: "+90 532 987 65 43", amount: 175, status: "PAID", paymentMethod: "Card (Stripe)", paymentTime: "2026-06-21 17:42" },
      { id: "share-4", name: "Mert K.", contact: "mert@gmail.com", amount: 175, status: "PENDING" },
    ],
  },
  {
    id: "inv-1002",
    court: "Court 1",
    timeSlot: "19:30 - 21:00",
    total: 350,
    status: "PAID",
    createdTime: "2026-06-21 16:00",
    shares: [
      { id: "share-5", name: "Burak E.", contact: "burak@gmail.com", amount: 175, status: "PAID", paymentMethod: "Cash Override", paymentTime: "2026-06-21 16:15" },
      { id: "share-6", name: "Selin O.", contact: "+90 532 222 33 44", amount: 175, status: "PAID", paymentMethod: "Card (Stripe)", paymentTime: "2026-06-21 16:05" },
    ],
  },
  {
    id: "inv-1003",
    court: "Court 3",
    timeSlot: "21:00 - 22:30",
    total: 350,
    status: "UNPAID",
    createdTime: "2026-06-21 19:00",
    shares: [
      { id: "share-7", name: "Ahmet T.", contact: "ahmet@gmail.com", amount: 175, status: "PENDING" },
      { id: "share-8", name: "Eren B.", contact: "+90 532 333 44 55", amount: 175, status: "PENDING" },
    ],
  },
];

export default function AdminPaymentsPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  const [invoices, setInvoices] = React.useState<Invoice[]>(defaultInvoices);
  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);

  // Modal / Drawer States
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = React.useState(false);

  const [selectedShare, setSelectedShare] = React.useState<{ invoiceId: string; share: SplitShare } | null>(null);
  const [showForcePayModal, setShowForcePayModal] = React.useState(false);
  const [showSendLinkModal, setShowSendLinkModal] = React.useState(false);

  // Form States for Force Pay
  const [forcePayMethod, setForcePayMethod] = React.useState("Cash");
  const [forcePayAmount, setForcePayAmount] = React.useState<number>(175);
  const [forcePayReason, setForcePayReason] = React.useState("");
  const [cashierPin, setCashierPin] = React.useState("");

  // Form States for Send Link
  const [sendChannel, setSendChannel] = React.useState<"email" | "sms">("email");
  const [reminderNote, setReminderNote] = React.useState("Please complete your court split payment share.");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const logAudit = (actionType: string, details: string) => {
    const newLog = {
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      user: "Manager Ece",
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

  // PAY-001: View Invoice
  const handleViewInvoice = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setShowDetailDrawer(true);
    logAudit("invoice.viewed", `Viewed details for invoice #${inv.id} (${inv.court})`);
  };

  // Force Pay Share triggers
  const handleForcePayOpen = (invoiceId: string, share: SplitShare) => {
    setSelectedShare({ invoiceId, share });
    setForcePayAmount(share.amount);
    setForcePayReason("Guest paid desk cashier directly");
    setForcePayMethod("Cash");
    setCashierPin("");
    setShowForcePayModal(true);
  };

  const handleConfirmForcePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShare) return;
    if (!forcePayReason.trim()) {
      triggerToast("Override reason is required.");
      return;
    }
    if (!cashierPin.trim()) {
      triggerToast("Staff PIN is required.");
      return;
    }

    const { invoiceId, share } = selectedShare;

    // Update in-memory state
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === invoiceId) {
        const updatedShares = inv.shares.map((sh) => {
          if (sh.id === share.id) {
            return {
              ...sh,
              status: "PAID" as const,
              paymentMethod: `Cashier Override (${forcePayMethod})`,
              paymentTime: new Date().toISOString().replace("T", " ").slice(0, 16),
            };
          }
          return sh;
        });

        // Recalculate invoice overall status
        const allPaid = updatedShares.every((sh) => sh.status === "PAID");
        const somePaid = updatedShares.some((sh) => sh.status === "PAID");
        const newStatus = allPaid ? ("PAID" as const) : somePaid ? ("PARTIALLY_PAID" as const) : ("UNPAID" as const);

        const updatedInv = { ...inv, shares: updatedShares, status: newStatus };
        if (selectedInvoice && selectedInvoice.id === invoiceId) {
          setSelectedInvoice(updatedInv);
        }
        return updatedInv;
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    logAudit(
      "invoice.share_force_paid",
      `Force paid share ${share.name} for invoice #${invoiceId}. Reason: ${forcePayReason}`
    );
    triggerToast("Share marked as paid. Desk cash override was logged.");
    setShowForcePayModal(false);
  };

  // Send Stripe Link triggers
  const handleSendLinkOpen = (invoiceId: string, share: SplitShare) => {
    setSelectedShare({ invoiceId, share });
    setSendChannel(share.contact.includes("@") ? "email" : "sms");
    setReminderNote(`Hi ${share.name}, please complete your split booking share of ₺${share.amount} for ${selectedInvoice?.court || "court reservation"}.`);
    setShowSendLinkModal(true);
  };

  const handleConfirmSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShare) return;

    const { invoiceId, share } = selectedShare;
    logAudit(
      "invoice.stripe_link_sent",
      `Dispatched Stripe payment reminder link to ${share.name} via ${sendChannel}`
    );
    triggerToast("Stripe payment link sent.");
    setShowSendLinkModal(false);
  };

  const pendingAmount = invoices.reduce((sum, inv) => {
    return sum + inv.shares.filter((s) => s.status === "PENDING").reduce((acc, s) => acc + s.amount, 0);
  }, 0);

  const collectedAmount = invoices.reduce((sum, inv) => {
    return sum + inv.shares.filter((s) => s.status === "PAID").reduce((acc, s) => acc + s.amount, 0);
  }, 0);

  const unpaidSharesCount = invoices.reduce((sum, inv) => {
    return sum + inv.shares.filter((s) => s.status === "PENDING").length;
  }, 0);

  return (
    <div className="w-full text-[#3a312a]">
      <style dangerouslySetInnerHTML={{ __html: `
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 100;
          background: #211b16;
          color: #fffaf4;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.2s ease;
          pointer-events: none;
        }
        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(33, 27, 22, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 16px;
        }
        .modal-content {
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          box-shadow: 0 20px 60px rgba(33,27,22,0.18);
        }
        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(33, 27, 22, 0.3);
          backdrop-filter: blur(2px);
          display: flex;
          justify-content: flex-end;
          z-index: 90;
        }
        .drawer-content {
          background: #fffaf4;
          border-left: 1px solid #e2d3c4;
          max-width: 440px;
          width: 100%;
          height: 100vh;
          overflow-y: auto;
          padding: 24px;
          box-shadow: -10px 0 40px rgba(33,27,22,0.1);
          animation: slide-in 0.2s ease-out;
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      ` }} />

      {/* Toast Notification */}
      <div className={`toast ${showToast ? "show" : ""}`}>
        {toastMessage}
      </div>

      {/* Page Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-[#e2d3c4] pb-5 mb-4 text-left">
        <div className="space-y-1">
          <div className="text-[11px] text-[#9d3d25] uppercase tracking-[0.07em] font-extrabold">Pickle Pulse</div>
          <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-[#211b16]">Split Payment & Invoices</h1>
          <p className="text-sm text-[#756a61] mt-1.5">
            Monitor real-time split booking logs, verify desk payment collections, and send automated billing reminders.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-semibold"
            onClick={() => triggerToast("Refreshed transaction state")}
          >
            Refresh
          </Button>
        </div>
      </section>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 items-start text-left">
        
        {/* Left Section: Content */}
        <div className="space-y-4 min-w-0">
          
          {/* Metrics Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black font-mono">₺{collectedAmount}</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Collected</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black text-[#a97619] font-mono">₺{pendingAmount}</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Pending</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-base tracking-[-0.02em] font-black text-[#9f3b2d]">
                {unpaidSharesCount}
              </strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Unpaid shares</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black text-[#2f8066] font-mono">
                {invoices.length}
              </strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Total Splits</span>
            </div>
          </section>

          {/* Invoices List Card */}
          <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
            <div className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9]">
              <h3 className="text-[15px] font-extrabold text-[#211b16] tracking-tight">Active Split Invoices</h3>
              <p className="text-xs text-[#756a61] mt-0.5">Click any invoice row to view share details and desk tools</p>
            </div>
            
            <div className="p-3.5 divide-y divide-[#e2d3c4]">
              {invoices.map((inv) => {
                const pendingShares = inv.shares.filter((s) => s.status === "PENDING");
                return (
                  <div
                    key={inv.id}
                    className="py-3 flex justify-between items-center hover:bg-slate-50/50 cursor-pointer px-2 rounded-[8px] transition-all"
                    onClick={() => handleViewInvoice(inv)}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-800">{inv.court} · {inv.timeSlot}</div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        Invoice ID: {inv.id} · Created {inv.createdTime}
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        {inv.shares.map((sh, idx) => (
                          <span
                            key={idx}
                            className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md border ${
                              sh.status === "PAID"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                            }`}
                          >
                            {sh.name.split(" ")[0]} ({sh.status})
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1 shrink-0">
                      <span className="font-mono text-base font-black text-slate-800">₺{inv.total}</span>
                      {inv.status === "PAID" && <Badge tone="lime">PAID</Badge>}
                      {inv.status === "PARTIALLY_PAID" && <Badge tone="amber">PARTIAL ({pendingShares.length} left)</Badge>}
                      {inv.status === "UNPAID" && <Badge tone="brand">UNPAID</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Section: Action Rail */}
        <aside className="space-y-3 xl:sticky xl:top-[78px]">
          <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
            <header className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9] flex justify-between gap-2.5 items-center">
              <div>
                <h3 className="font-extrabold text-[14px] text-[#211b16] tracking-tight">CRM Billing Alerts</h3>
                <p className="text-xs text-[#756a61] mt-0.5">Urgent desk attention required</p>
              </div>
              <Badge tone="brand" className="bg-[#fff0e8] border-[#ecc0ae] text-[#94402a] text-[10px] font-bold px-2 py-0.5 rounded">
                CRITICAL
              </Badge>
            </header>
            <div className="p-3.5">
              <div className="bg-gradient-to-b from-[#fffaf5] to-[#fff1e8] border border-[#e3b197] rounded-[13px] p-3">
                <div className="text-[15px] font-extrabold text-[#211b16] tracking-[-0.025em] leading-snug">
                  Mert K. has 1 unpaid share
                </div>
                <div className="text-xs text-[#756a61] mt-1 mb-3.5 leading-relaxed">
                  Mert K. has a pending invoice share of ₺175 for Court 2 slot at 18:00.
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-8 bg-[#d95b35] border-[#d95b35] hover:bg-[#c94f2f] text-white rounded-[9px] text-xs font-semibold px-3"
                    onClick={() => {
                      const mertInvoice = invoices.find((inv) => inv.id === "inv-1001");
                      if (mertInvoice) {
                        handleViewInvoice(mertInvoice);
                      }
                    }}
                  >
                    Open Drawer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* PAY-001: Invoice Detail Drawer */}
      {showDetailDrawer && selectedInvoice && (
        <div className="drawer-backdrop" onClick={() => setShowDetailDrawer(false)}>
          <div className="drawer-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#211b16]">Invoice: {selectedInvoice.id}</h3>
                <p className="text-[10px] text-slate-500 font-semibold">{selectedInvoice.court} · {selectedInvoice.timeSlot}</p>
              </div>
              <button 
                className="text-[#756a61] hover:text-[#211b16] font-bold text-xl"
                onClick={() => setShowDetailDrawer(false)}
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 flex justify-between items-center">
                <span className="font-bold">Total Bill:</span>
                <span className="font-mono text-lg font-black">₺{selectedInvoice.total}</span>
              </div>

              {/* Shares list */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-700">Split Invoice Shares</h4>
                {selectedInvoice.shares.map((share) => (
                  <div 
                    key={share.id}
                    className={`p-3 rounded-[10px] border flex flex-col gap-2 ${
                      share.status === "PAID"
                        ? "bg-[#f2faf6] border-[#c1ddce]"
                        : "bg-[#fff8e6] border-[#ddc07e]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-800">{share.name}</div>
                        <div className="text-[10px] text-slate-500">{share.contact}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold">₺{share.amount}</div>
                        <span className={`text-[9px] font-bold ${share.status === "PAID" ? "text-emerald-700" : "text-amber-700"}`}>
                          {share.status}
                        </span>
                      </div>
                    </div>

                    {share.status === "PAID" ? (
                      <div className="text-[10px] text-slate-500 bg-white/50 p-1.5 rounded">
                        Paid via {share.paymentMethod} at {share.paymentTime}
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          className="flex-1 h-8 rounded-md bg-[#d95b35] text-white font-bold hover:bg-[#c94f2f] transition"
                          onClick={() => handleForcePayOpen(selectedInvoice.id, share)}
                        >
                          Collect Desk cash
                        </button>
                        <button
                          type="button"
                          className="flex-1 h-8 rounded-md bg-white border border-[#d1bdae] hover:bg-slate-50 font-bold transition"
                          onClick={() => handleSendLinkOpen(selectedInvoice.id, share)}
                        >
                          Send Stripe Link
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Receipt actions */}
              <div className="pt-4 border-t border-[#e2d3c4] space-y-2">
                <Button 
                  variant="secondary"
                  className="w-full border-[#d1bdae] bg-[#fffaf4] text-[#3a312a] rounded-[9px] text-xs font-semibold h-9"
                  onClick={() => triggerToast("Invoice receipt PDF generated")}
                >
                  Download Print Receipt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAY-002: Force Pay Cashier Override Modal */}
      {showForcePayModal && selectedShare && (
        <div className="modal-backdrop" onClick={() => setShowForcePayModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Force Pay Cashier Override</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowForcePayModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleConfirmForcePay} className="space-y-4 text-xs">
              <div className="p-3 bg-[#fff8e6] border border-[#ead59c] text-amber-800 rounded-[10px] font-semibold leading-relaxed">
                ⚠️ Warning: This bypasses Stripe payment gateway. Cashier confirms cash/card payment was collected at front desk.
              </div>

              <div className="p-3 bg-slate-50 border rounded-[10px] flex justify-between items-center">
                <span>Payer Share:</span>
                <span className="font-bold">{selectedShare.share.name} (₺{selectedShare.share.amount})</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Desk Collection Method</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={forcePayMethod}
                  onChange={(e) => setForcePayMethod(e.target.value)}
                >
                  <option value="Cash">Cash Drawer</option>
                  <option value="Card Terminal">Manual Desk Card Terminal</option>
                  <option value="Prepaid Credit">Prepaid Wallet Adjustment</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Amount Received (₺)</label>
                <input 
                  type="number" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={forcePayAmount}
                  onChange={(e) => setForcePayAmount(parseInt(e.target.value) || 0)}
                  min={selectedShare.share.amount}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Override Reason *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Paid cash at desk to Manager Ece"
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={forcePayReason}
                  onChange={(e) => setForcePayReason(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Staff Override PIN *</label>
                <input 
                  type="password" 
                  placeholder="Enter staff cashier PIN"
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none font-mono"
                  value={cashierPin}
                  onChange={(e) => setCashierPin(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowForcePayModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10">Mark Paid</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAY-003: Send Stripe Link Reminder Modal */}
      {showSendLinkModal && selectedShare && (
        <div className="modal-backdrop" onClick={() => setShowSendLinkModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Dispatch Stripe Payment Link</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowSendLinkModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleConfirmSendLink} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border rounded-[10px] space-y-1">
                <div><strong>Recipient Payer:</strong> {selectedShare.share.name}</div>
                <div><strong>Destination Contact:</strong> {selectedShare.share.contact}</div>
                <div><strong>Outstanding Balance:</strong> ₺{selectedShare.share.amount}</div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Delivery Channel</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={sendChannel}
                  onChange={(e) => setSendChannel(e.target.value as any)}
                >
                  <option value="email">Email Notification</option>
                  <option value="sms">SMS Text Alert</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Reminder Note Message Body</label>
                <textarea 
                  rows={3}
                  className="border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] p-3 outline-none resize-none"
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowSendLinkModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10">Send Link</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
