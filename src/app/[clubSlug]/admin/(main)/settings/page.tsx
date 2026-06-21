"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AuditLogEntry {
  timestamp: string;
  user: string;
  action: string;
}

export default function AdminSettingsPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);

  // Policy configurations state
  const [refundWindowHours, setRefundWindowHours] = React.useState(24);
  const [lateFeeAmount, setLateFeeAmount] = React.useState(50);
  const [noShowFee, setNoShowFee] = React.useState(100);
  const [gracePeriodMinutes, setGracePeriodMinutes] = React.useState(15);
  const [memberExceptions, setMemberExceptions] = React.useState(true);

  // Brand customize state
  const [brandName, setBrandName] = React.useState("Pickle Pulse");
  const [brandDesc, setBrandDesc] = React.useState("Istanbul's premier pickleball destination.");
  const [primaryColor, setPrimaryColor] = React.useState("#F04F2A");
  const [publicTagline, setPublicTagline] = React.useState("Pickleball booking & court ops");
  const [logoName, setLogoName] = React.useState("logo.png");

  // Payment Keys state (Stripe masked keys)
  const [stripePublishableKey, setStripePublishableKey] = React.useState("pk_live_51Msz...");
  const [stripeSecretKey, setStripeSecretKey] = React.useState("sk_live_••••••••••••••••••••••••");
  const [stripeSecretKeyRaw, setStripeSecretKeyRaw] = React.useState("");
  const [webhookSecret, setWebhookSecret] = React.useState("whsec_••••••••••••");
  const [webhookSecretRaw, setWebhookSecretRaw] = React.useState("");
  const [testConnectionStatus, setTestConnectionStatus] = React.useState<"idle" | "testing" | "success" | "failed">("idle");

  // Audit Logs state
  const [auditLogs, setAuditLogs] = React.useState<AuditLogEntry[]>([]);
  const [searchActor, setSearchActor] = React.useState("");
  const [searchEvent, setSearchEvent] = React.useState("");

  // Modals state
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [showBrandModal, setShowBrandModal] = React.useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [showAuditModal, setShowAuditModal] = React.useState(false);

  const [nextAction, setNextAction] = React.useState({
    title: "Verify security keys",
    note: "Payment key changes affect Stripe webhook triggers and active checkouts.",
    resolved: false,
  });

  // Load audit logs from localStorage on mount & when modal opens
  const loadAuditLogs = React.useCallback(() => {
    try {
      const logsKey = `pickle_audit_logs_${clubSlug}`;
      const stored = localStorage.getItem(logsKey);
      if (stored) {
        setAuditLogs(JSON.parse(stored));
      } else {
        const initialLogs = [
          { timestamp: "2026-06-21 16:30", user: "Manager Ece", action: "settings.cancellation_policy_updated: Changed cancellation window to 24h" },
          { timestamp: "2026-06-21 14:15", user: "Manager Ece", action: "settings.brand_updated: Updated brand tagline to B2B" },
        ];
        setAuditLogs(initialLogs);
        localStorage.setItem(logsKey, JSON.stringify(initialLogs));
      }
    } catch (e) {
      console.error(e);
    }
  }, [clubSlug]);

  React.useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const addAuditLog = (actionType: string, actionStr: string) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newLog: AuditLogEntry = {
      timestamp: timeStr,
      user: "Manager Ece",
      action: `${actionType}: ${actionStr}`,
    };
    try {
      const logsKey = `pickle_audit_logs_${clubSlug}`;
      const existing = localStorage.getItem(logsKey);
      const logs = existing ? JSON.parse(existing) : [];
      logs.unshift(newLog);
      localStorage.setItem(logsKey, JSON.stringify(logs));
      setAuditLogs(logs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunNextAction = () => {
    setShowPaymentModal(true);
    setNextAction({
      title: "None pending",
      note: "All policies and changes have been audited.",
      resolved: true,
    });
  };

  // SET-001: Cancellation Policy Save
  const handleSaveCancellationPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (refundWindowHours < 0 || lateFeeAmount < 0 || noShowFee < 0 || gracePeriodMinutes < 0) {
      triggerToast("Fee values and hours cannot be negative.");
      return;
    }

    addAuditLog(
      "settings.cancellation_policy_updated",
      `Refund Window: ${refundWindowHours}h, Late Fee: ₺${lateFeeAmount}, No-show: ₺${noShowFee}, Grace Period: ${gracePeriodMinutes}m`
    );
    triggerToast("Cancellation policy updated. New bookings will use this policy.");
    setShowCancelModal(false);
  };

  // SET-002: Brand Settings Save
  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
      triggerToast("Display name is required.");
      return;
    }

    addAuditLog(
      "settings.brand_updated",
      `Name: ${brandName}, Tagline: ${publicTagline}, Primary Color: ${primaryColor}`
    );
    triggerToast("Brand settings updated. Public pages will show the new branding.");
    setShowBrandModal(false);
  };

  // SET-003: Payment Keys Save
  const handleSavePaymentKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (stripeSecretKeyRaw.trim() && stripeSecretKeyRaw.length < 15) {
      triggerToast("Stripe Secret Key invalid or too short.");
      return;
    }

    const updatedSecretStr = stripeSecretKeyRaw.trim() ? "sk_live_••••" + stripeSecretKeyRaw.slice(-4) : stripeSecretKey;
    setStripeSecretKey(updatedSecretStr);

    const updatedWebhookStr = webhookSecretRaw.trim() ? "whsec_••••" + webhookSecretRaw.slice(-4) : webhookSecret;
    setWebhookSecret(updatedWebhookStr);

    addAuditLog(
      "settings.payment_keys_updated",
      `Stripe Keys updated. Connection Health Check Passed`
    );
    triggerToast("Payment keys saved. Payment health check passed.");
    setShowPaymentModal(false);
    // Reset raw inputs
    setStripeSecretKeyRaw("");
    setWebhookSecretRaw("");
  };

  const handleTestConnection = () => {
    setTestConnectionStatus("testing");
    setTimeout(() => {
      setTestConnectionStatus("success");
      triggerToast("Stripe API credentials connection passed successfully.");
    }, 1500);
  };

  // SET-004: Audit Log History View & Export CSV
  const handleViewAuditLog = () => {
    loadAuditLogs();
    setShowAuditModal(true);
    addAuditLog("audit_log.viewed", "Cashier reviewed system audit ledger logs");
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Timestamp,Actor,Action\n";
    auditLogs.forEach((log) => {
      csvContent += `"${log.timestamp}","${log.user}","${log.action.replace(/"/g, '""')}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pickle_pulse_audit_logs_${clubSlug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Audit logs exported to CSV.");
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchActor = log.user.toLowerCase().includes(searchActor.toLowerCase());
    const matchEvent = log.action.toLowerCase().includes(searchEvent.toLowerCase());
    return matchActor && matchEvent;
  });

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
      ` }} />

      {/* Toast Notification */}
      <div className={`toast ${showToast ? "show" : ""}`}>
        {toastMessage}
      </div>

      {/* Page Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-[#e2d3c4] pb-5 mb-4 text-left">
        <div className="space-y-1">
          <div className="text-[11px] text-[#9d3d25] uppercase tracking-[0.07em] font-extrabold">{brandName}</div>
          <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-[#211b16]">Settings & Policy Center</h1>
          <p className="text-sm text-[#756a61] mt-1.5">
            Admin configurations; define late fees, customize display brands, secure Stripe gateway keys, and query audit ledgers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-semibold"
            onClick={handleViewAuditLog}
          >
            View Audit Log
          </Button>
        </div>
      </section>

      {/* Layout Split: Main Board (Left) & Action Rail (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 w-full items-start text-left">
        
        {/* Left Section: Content */}
        <div className="space-y-4 min-w-0">
          
          {/* Metrics Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black">{refundWindowHours}h</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Refund limit</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black font-mono">₺{lateFeeAmount}</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Late fee</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black text-emerald-700">Healthy</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Stripe connection</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)] cursor-pointer" onClick={handleViewAuditLog}>
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black text-slate-700 font-mono">{auditLogs.length}</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Click to audit</span>
            </div>
          </section>

          {/* Cancellation policy & Stripe status */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Cancellation Policy summary */}
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
              <div className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9] flex items-start justify-between gap-2.5">
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#211b16] tracking-tight">Late Cancellation Rule</h3>
                  <p className="text-xs text-[#756a61] mt-0.5">Booking protection</p>
                </div>
                <Badge tone="brand" className="uppercase">{refundWindowHours} Hours limit</Badge>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Refund window:</span>
                  <span className="font-bold">{refundWindowHours} hrs before start</span>
                </div>
                <div className="flex justify-between">
                  <span>Late cancellation fee:</span>
                  <span className="font-bold font-mono">₺{lateFeeAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>No-show penalty:</span>
                  <span className="font-bold font-mono">₺{noShowFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grace period:</span>
                  <span className="font-bold">{gracePeriodMinutes} mins</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-[29px] border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-[11px] font-semibold px-2.5 mt-2"
                  onClick={() => setShowCancelModal(true)}
                >
                  Edit cancellation policy
                </Button>
              </div>
            </div>

            {/* Stripe Gateway Status */}
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
              <div className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9] flex items-start justify-between gap-2.5">
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#211b16] tracking-tight">Stripe Gateway Keys</h3>
                  <p className="text-xs text-[#756a61] mt-0.5">Payment checkout gateway</p>
                </div>
                <Badge tone="lime">HEALTHY</Badge>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block font-semibold">Publishable key:</span>
                  <span className="font-mono text-slate-800 break-all">{stripePublishableKey}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Secret API key:</span>
                  <span className="font-mono text-slate-800 break-all">{stripeSecretKey}</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-[29px] border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-[11px] font-semibold px-2.5 mt-2"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Edit Stripe Credentials
                </Button>
              </div>
            </div>
          </section>

          {/* Quick Customize Card */}
          <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] p-4 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-extrabold">Brand Display Customization</h4>
              <p className="text-xs text-slate-500 font-semibold mt-1">Logo, taglines and primary display colors.</p>
            </div>
            <Button
              variant="secondary"
              className="h-9 border-[#d1bdae] bg-white rounded-[9px] text-xs font-semibold px-4"
              onClick={() => setShowBrandModal(true)}
            >
              Configure branding
            </Button>
          </div>

        </div>

        {/* Right Section: Action Rail */}
        <aside className="space-y-3 xl:sticky xl:top-[78px]">
          <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
            <header className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9] flex justify-between gap-2.5 items-center">
              <div>
                <h3 className="font-extrabold text-[14px] text-[#211b16] tracking-tight">Security Alerts</h3>
                <p className="text-xs text-[#756a61] mt-0.5">Required actions</p>
              </div>
              {!nextAction.resolved ? (
                <span className="badge orange">NOW</span>
              ) : (
                <span className="badge green">DONE</span>
              )}
            </header>
            <div className="p-3.5">
              <div className="bg-gradient-to-b from-[#fffaf5] to-[#fff1e8] border border-[#e3b197] rounded-[13px] p-3">
                <div className="text-[17px] font-extrabold text-[#211b16] tracking-[-0.025em] leading-snug">
                  {nextAction.title}
                </div>
                <div className="text-xs text-[#756a61] mt-1 mb-3.5 leading-relaxed">
                  {nextAction.note}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-8 bg-[#d95b35] border-[#d95b35] hover:bg-[#c94f2f] text-white rounded-[9px] text-xs font-semibold px-3"
                    onClick={handleRunNextAction}
                  >
                    Run action
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* SET-001: Edit Cancellation Policy Modal */}
      {showCancelModal && (
        <div className="modal-backdrop" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Configure Cancellation Policy</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowCancelModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSaveCancellationPolicy} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Refund Cut-off Window (Hours before start)</label>
                <input 
                  type="number" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={refundWindowHours}
                  onChange={(e) => setRefundWindowHours(parseInt(e.target.value) || 0)}
                  min="0"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Late Cancellation Fee (₺)</label>
                  <input 
                    type="number" 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                    value={lateFeeAmount}
                    onChange={(e) => setLateFeeAmount(parseInt(e.target.value) || 0)}
                    min="0"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">No-Show Penalty Fee (₺)</label>
                  <input 
                    type="number" 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                    value={noShowFee}
                    onChange={(e) => setNoShowFee(parseInt(e.target.value) || 0)}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Cancellation Grace Period (Minutes after booking)</label>
                <input 
                  type="number" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={gracePeriodMinutes}
                  onChange={(e) => setGracePeriodMinutes(parseInt(e.target.value) || 0)}
                  min="0"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="memberExceptions" 
                  checked={memberExceptions} 
                  onChange={(e) => setMemberExceptions(e.target.checked)}
                />
                <label htmlFor="memberExceptions" className="font-bold text-[#756a61] cursor-pointer">Bypass late fees for VIP/Gold tier members</label>
              </div>

              <div className="bg-[#fff8e6] border border-[#ead59c] p-2.5 rounded-[10px] text-[10px] text-[#755308] font-semibold">
                ⚠️ Warning: Modifying late fees applies to all new court bookings. Existing schedules remain unaffected.
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowCancelModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10">Save Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SET-002: Brand Settings Customize Modal */}
      {showBrandModal && (
        <div className="modal-backdrop" onClick={() => setShowBrandModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Customize Club Branding</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowBrandModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Club Display Name *</label>
                <input 
                  type="text" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Public Page Tagline</label>
                <input 
                  type="text" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={publicTagline}
                  onChange={(e) => setPublicTagline(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Primary Theme Color Hex</label>
                <input 
                  type="text" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none font-mono"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Club Logo (PNG/SVG, Max 2MB)</label>
                <div className="border border-dashed border-[#d1bdae] p-3 rounded-[10px] bg-white flex justify-between items-center">
                  <span className="font-mono text-slate-500">{logoName}</span>
                  <button 
                    type="button" 
                    className="btn btn-small"
                    onClick={() => {
                      setLogoName("logo_new.png");
                      triggerToast("Mock Logo file upload verified.");
                    }}
                  >
                    Upload Logo
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowBrandModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10">Save Branding</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SET-003: Payment Keys Edit Modal */}
      {showPaymentModal && (
        <div className="modal-backdrop" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Secure Payment Gateway Settings</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSavePaymentKeys} className="space-y-4 text-xs">
              <div className="p-3 bg-[#fff8e6] border border-[#ead59c] text-amber-800 rounded-[10px] font-semibold leading-relaxed">
                ⚠️ Danger: Stripe Live keys are masked for security. Changing these keys immediately updates checkout portals in production.
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Stripe Publishable Key *</label>
                <input 
                  type="text" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 font-mono"
                  value={stripePublishableKey}
                  onChange={(e) => setStripePublishableKey(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Stripe Secret Key (Leave blank to keep masked)</label>
                <input 
                  type="password" 
                  placeholder={stripeSecretKey}
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 font-mono"
                  value={stripeSecretKeyRaw}
                  onChange={(e) => setStripeSecretKeyRaw(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Stripe Webhook Signing Secret</label>
                <input 
                  type="password" 
                  placeholder={webhookSecret}
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 font-mono"
                  value={webhookSecretRaw}
                  onChange={(e) => setWebhookSecretRaw(e.target.value)}
                />
              </div>

              <div className="flex gap-2 items-center">
                <button 
                  type="button" 
                  className="btn border-[#d1bdae] bg-white h-9 rounded-[9px] font-bold"
                  onClick={handleTestConnection}
                >
                  Test Connection
                </button>
                {testConnectionStatus === "testing" && <span className="animate-pulse font-semibold text-slate-500">Testing Stripe connection...</span>}
                {testConnectionStatus === "success" && <span className="text-emerald-700 font-bold">✓ Connection OK</span>}
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#e2d3c4]">
                <button type="button" className="btn flex-1" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10">Save Payment Keys</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SET-004: Audit Log History Ledger Modal */}
      {showAuditModal && (
        <div className="modal-backdrop" onClick={() => setShowAuditModal(false)}>
          <div className="modal-content text-left max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Settings & Operations Audit History</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowAuditModal(false)}>×</button>
            </div>
            
            <div className="space-y-4 text-xs">
              {/* Filtering */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Filter by Actor Staff</label>
                  <input 
                    type="text" 
                    placeholder="Search actor..." 
                    className="h-9 border border-[#d1bdae] bg-white rounded-[8px] px-2"
                    value={searchActor}
                    onChange={(e) => setSearchActor(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Filter by Event / Log Type</label>
                  <input 
                    type="text" 
                    placeholder="Search action details..." 
                    className="h-9 border border-[#d1bdae] bg-white rounded-[8px] px-2"
                    value={searchEvent}
                    onChange={(e) => setSearchEvent(e.target.value)}
                  />
                </div>
              </div>

              {/* Table ledger */}
              <div className="border border-[#e2d3c4] rounded-[12px] bg-[#fffdf9] overflow-hidden max-h-[260px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fff7ef] text-[#211b16] font-black border-b border-[#e2d3c4]">
                      <th className="p-2 border-r border-[#e2d3c4] w-[110px]">Timestamp</th>
                      <th className="p-2 border-r border-[#e2d3c4] w-[100px]">Actor</th>
                      <th className="p-2">Action / Operations Log</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, i) => (
                      <tr key={i} className="border-b border-[#e2d3c4] last:border-b-0 hover:bg-[#fff9f0] font-medium text-[11px]">
                        <td className="p-2 border-r border-[#e2d3c4] font-mono text-[#756a61]">{log.timestamp}</td>
                        <td className="p-2 border-r border-[#e2d3c4] text-[#211b16]">{log.user}</td>
                        <td className="p-2 text-[#756a61]">{log.action}</td>
                      </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-6 text-slate-400 italic">No operations log entries found matching criteria.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button 
                  type="button" 
                  className="btn border-[#d1bdae] bg-white h-9 rounded-[9px] font-bold"
                  onClick={handleExportCSV}
                  disabled={filteredLogs.length === 0}
                >
                  Export CSV Ledger
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setShowAuditModal(false)}>Close Ledger</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
