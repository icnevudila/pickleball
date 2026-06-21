"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminCourtsPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  // State Management
  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);
  const [needsCheck, setNeedsCheck] = React.useState(1);
  const [blockedSlots, setBlockedSlots] = React.useState(2);
  const [court3Status, setCourt3Status] = React.useState<"WATCH" | "HEALTHY">("WATCH");

  const [courts, setCourts] = React.useState([
    { id: "court1", name: "Court 1", type: "Center", status: "HEALTHY", utilization: "84%", notes: "Surface excellent" },
    { id: "court2", name: "Court 2", type: "Standard", status: "HEALTHY", utilization: "76%", notes: "Device online" },
    { id: "court3", name: "Court 3", type: "Standard", status: "WATCH", utilization: "62%", notes: "Net tension note" },
    { id: "court4", name: "Court 4", type: "Standard", status: "HEALTHY", utilization: "58%", notes: "Fast hold available" },
  ]);

  const [priorities, setPriorities] = React.useState([
    { id: "p1", court: "Court 3", kicker: "Court 3", title: "Net tension note", copy: "Schedule before prime slot", buttonText: "Schedule", type: "amber" },
    { id: "p2", court: "Court 1", kicker: "Court 1", title: "Healthy and busy", copy: "No action", buttonText: "View", type: "green" },
    { id: "p3", court: "Maintenance", kicker: "Maintenance", title: "2 blocked slots", copy: "Protect public calendar", buttonText: "Block", type: "orange" }
  ]);

  const [nextAction, setNextAction] = React.useState({
    title: "Schedule Court 3 check",
    note: "Court health should connect directly to blocking slots and notifying staff.",
    resolved: false
  });

  const [showMaintenanceModal, setShowMaintenanceModal] = React.useState(false);
  const [selectedCourt, setSelectedCourt] = React.useState<any>(null);
  const [maintenanceForm, setMaintenanceForm] = React.useState({
    issueType: "Net tension",
    severity: "Minor",
    notes: ""
  });

  const [showToggleModal, setShowToggleModal] = React.useState(false);
  const [toggleForm, setToggleForm] = React.useState({
    offlineReason: "Surface repair",
    expectedReturn: "Tomorrow 09:00"
  });

  const logCourtAudit = (actionType: string, details: string) => {
    const newLog = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: "Manager Ece",
      action: `${actionType}: ${details}`
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
    setTimeout(() => setShowToast(false), 1800);
  };

  const handleLogMaintenanceClick = (court: any) => {
    setSelectedCourt(court);
    setMaintenanceForm({ issueType: "Net tension", severity: "Minor", notes: "" });
    setShowMaintenanceModal(true);
  };

  const handleConfirmMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourt) return;
    setBlockedSlots(prev => prev + 1);
    logCourtAudit("court.maintenance_logged", `Logged ${maintenanceForm.severity} maintenance (${maintenanceForm.issueType}) for ${selectedCourt.name}`);
    triggerToast("Maintenance logged. Court availability has been updated.");
    setShowMaintenanceModal(false);
  };

  const handleToggleStatusClick = (court: any) => {
    setSelectedCourt(court);
    if (court.status === "OFFLINE") {
      setCourts(prev => prev.map(c => c.id === court.id ? { ...c, status: "HEALTHY" } : c));
      logCourtAudit("court.status_changed", `Reactivated ${court.name} (HEALTHY)`);
      triggerToast("Court status updated. Queue and bookings were rechecked.");
    } else {
      setToggleForm({ offlineReason: "Surface repair", expectedReturn: "Tomorrow 09:00" });
      setShowToggleModal(true);
    }
  };

  const handleConfirmOffline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourt) return;
    setCourts(prev => prev.map(c => c.id === selectedCourt.id ? { ...c, status: "OFFLINE" } : c));
    logCourtAudit("court.status_changed", `Set ${selectedCourt.name} OFFLINE. Reason: ${toggleForm.offlineReason}, return: ${toggleForm.expectedReturn}`);
    triggerToast("Court status updated. Queue and bookings were rechecked.");
    setShowToggleModal(false);
  };

  const handlePriorityAction = (id: string, actionType: string) => {
    if (actionType === "Schedule") {
      setCourt3Status("HEALTHY");
      setCourts(prev => prev.map(c => c.id === "court3" ? { ...c, status: "HEALTHY" } : c));
      setNeedsCheck(0);
      setPriorities(prev => prev.filter(p => p.id !== id));
      if (!nextAction.resolved) {
        setNextAction({
          title: "None pending",
          note: "All courts are healthy and devices are synced.",
          resolved: true
        });
      }
      logCourtAudit("court.status_changed", "Resolved tension check for Court 3");
      triggerToast("Court 3 net tension checked and balanced");
    } else if (actionType === "Block") {
      handleLogMaintenanceClick(courts[0]);
    } else if (actionType === "View") {
      triggerToast("Showing Court 1 live stats");
    }
  };

  const handleRunNextAction = () => {
    if (nextAction.resolved) {
      triggerToast("No action pending");
      return;
    }
    const target = priorities.find(p => p.buttonText === "Schedule");
    if (target) {
      handlePriorityAction(target.id, "Schedule");
    } else {
      setNeedsCheck(0);
      setCourt3Status("HEALTHY");
      setCourts(prev => prev.map(c => c.id === "court3" ? { ...c, status: "HEALTHY" } : c));
      setNextAction({
        title: "None pending",
        note: "All courts are healthy and devices are synced.",
        resolved: true
      });
      logCourtAudit("court.status_changed", "Resolved tension check for Court 3");
      triggerToast("Court 3 net tension checked and balanced");
    }
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
          <div className="text-[11px] text-[#9d3d25] uppercase tracking-[0.07em] font-extrabold">Pickle Pulse</div>
          <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-[#211b16]">Court health</h1>
          <p className="text-sm text-[#756a61] mt-1.5">
            Not court CRUD; court health, maintenance, utilization and device sync.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-semibold"
            onClick={() => triggerToast("Refreshed telemetry")}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="h-8 bg-[#d95b35] border-[#d95b35] hover:bg-[#c94f2f] text-white rounded-[9px] text-xs font-semibold"
            onClick={() => handlePriorityAction("p3", "Block")}
          >
            Block Court
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
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black">4</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Courts</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className={`block text-base tracking-[-0.02em] font-black ${needsCheck > 0 ? "text-[#a97619]" : "text-[#23624f]"}`}>
                {needsCheck}
              </strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Needs check</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black">{blockedSlots}</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Blocked slots</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black text-[#2f8066]">84%</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Best utilization</span>
            </div>
          </section>

          {/* Priority Alert Strip */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {priorities.map(p => {
              let alertStyle = "bg-[#f4fbf7] border-[#bddbcc]"; // default green
              let dotColor = "bg-[#2f8066] shadow-[0_0_0_3px_rgba(47,128,102,0.1)]";
              let btnClass = "border-[#d1bdae] bg-[#fffaf4]";
              if (p.type === "amber") {
                alertStyle = "bg-gradient-to-b from-[#fff8e8] to-[#fff8e8] border-[#e1c486]";
                dotColor = "bg-[#a97619] shadow-[0_0_0_3px_rgba(169,118,25,0.1)]";
              } else if (p.type === "orange") {
                alertStyle = "bg-gradient-to-b from-[#fffaf5] to-[#fff3eb] border-[#e3b197]";
                dotColor = "bg-[#d95b35] shadow-[0_0_0_3px_rgba(217,91,53,0.11)]";
                btnClass = "border-[#e3b197] bg-[#fff0e8] text-[#9d3d25] hover:bg-[#ffe5d9]";
              }
              return (
                <article key={p.id} className={`bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-3 flex items-start justify-between gap-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)] min-w-0 ${alertStyle}`}>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#75675d] uppercase tracking-[0.05em] font-black flex items-center gap-1.5 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                      {p.court}
                    </div>
                    <h3 className="font-extrabold text-[#211b16] text-[13px] truncate">{p.title}</h3>
                    <p className="text-[12px] text-[#756a61] mt-0.5 truncate">{p.copy}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className={`h-[29px] rounded-[9px] text-[11px] font-semibold px-2.5 shrink-0 ${btnClass}`}
                    onClick={() => handlePriorityAction(p.id, p.buttonText)}
                  >
                    {p.buttonText}
                  </Button>
                </article>
              );
            })}
            {priorities.length === 0 && (
              <div className="col-span-3 text-center py-2.5 text-xs text-[#23624f] bg-[#f4fbf7] border border-[#bddbcc] rounded-[14px]">
                🎉 All alerts resolved! All courts are in perfect operating status.
              </div>
            )}
          </section>

          {/* Detailed Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {courts.map(court => (
              <div key={court.id} className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
                <div className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9] flex items-start justify-between gap-2.5">
                  <div>
                    <h3 className="text-[15px] font-extrabold text-[#211b16] tracking-tight">{court.name} · {court.type}</h3>
                    <p className="text-xs text-[#756a61] mt-0.5">{court.notes} · {court.utilization} utilization</p>
                  </div>
                  <Badge 
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                      court.status === "HEALTHY" ? "bg-[#edf6f1] border-[#cbe4d9] text-[#23624f]" :
                      court.status === "WATCH" ? "bg-[#fbf0d8] border-[#ead59c] text-[#755308]" :
                      "bg-[#fff2ec] border-[#efc2b7] text-[#8c3125]"
                    }`}
                  >
                    {court.status}
                  </Badge>
                </div>
                <div className="p-3.5 space-y-3">
                  <div className="h-2.5 bg-[#f2e7dc] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#2f8066] to-[#93bd5e] rounded-full" style={{ width: court.utilization }} />
                  </div>
                  <div className="flex gap-2 pt-1" style={{ display: "flex", gap: "8px" }}>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="h-7 border-[#d1bdae] bg-[#fffaf4] text-[11px] font-bold rounded-[8px] flex-1"
                      onClick={() => handleLogMaintenanceClick(court)}
                    >
                      Log Maint.
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="h-7 border-[#d1bdae] bg-[#fffaf4] text-[11px] font-bold rounded-[8px] flex-1"
                      onClick={() => handleToggleStatusClick(court)}
                    >
                      {court.status === "OFFLINE" ? "Reactivate" : "Set Offline"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Quick Info Grid-3 */}
          <section className="grid grid-cols-3 gap-3">
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-3.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <h4 className="text-xs text-[#756a61] font-semibold truncate">Court 2 device</h4>
              <h2 className="text-xl font-bold text-[#211b16] mt-1.5 leading-none">Online</h2>
              <Badge tone="lime" className="bg-[#edf6f1] border-[#cbe4d9] text-[#23624f] text-[10px] font-bold rounded-full px-2 py-0.5 mt-2">
                TV sync
              </Badge>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-3.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <h4 className="text-xs text-[#756a61] font-semibold truncate">Court 4 revenue</h4>
              <h2 className="text-xl font-bold text-[#211b16] mt-1.5 leading-none font-mono">₺4.2k</h2>
              <Badge tone="slate" className="bg-[#edf3f5] border-[#cad9df] text-[#435f6f] text-[10px] font-bold rounded-full px-2 py-0.5 mt-2">
                Today
              </Badge>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-3.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <h4 className="text-xs text-[#756a61] font-semibold truncate">Blocked slots</h4>
              <h2 className="text-xl font-bold text-[#211b16] mt-1.5 leading-none">{blockedSlots}</h2>
              <Badge tone="amber" className="bg-[#fbf0d8] border-[#ead59c] text-[#755308] text-[10px] font-bold rounded-full px-2 py-0.5 mt-2">
                Maintenance
              </Badge>
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
              {!nextAction.resolved ? (
                <span className="badge orange">NOW</span>
              ) : (
                <span className="badge" style={{ background: "#edf3f5", border: "1px solid #cad9df", color: "#435f6f" }}>DONE</span>
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
                <div className="flex gap-2" style={{ display: "flex", gap: "8px" }}>
                  <button
                    disabled={nextAction.resolved}
                    className="btn btn-primary btn-small"
                    style={{ flex: 1 }}
                    onClick={handleRunNextAction}
                  >
                    Run action
                  </button>
                  <button
                    className="btn btn-secondary btn-small"
                    style={{ flex: 1 }}
                    onClick={() => triggerToast(nextAction.resolved ? "No check diagnostic report" : "Showing Court 3 telemetry report")}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

      {/* Log Maintenance Modal */}
      {showMaintenanceModal && selectedCourt && (
        <div className="modal-backdrop" onClick={() => setShowMaintenanceModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Log Maintenance</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowMaintenanceModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleConfirmMaintenance} className="flex flex-col gap-3 text-xs text-left">
              <div className="bg-[#fff8e8] border border-[#e1c486] rounded-[10px] p-2.5 text-[#755308] mb-1 font-semibold">
                ⚠️ Warning: Logging maintenance blocks slot calendar availability for {selectedCourt.name}.
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Court</label>
                <input 
                  type="text" 
                  disabled
                  className="h-10 border border-[#d1bdae] bg-[#f0e7dd] rounded-[10px] px-3 text-xs outline-none"
                  value={selectedCourt.name}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Issue Type</label>
                  <select 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]"
                    value={maintenanceForm.issueType}
                    onChange={e => setMaintenanceForm(prev => ({ ...prev, issueType: e.target.value }))}
                  >
                    <option value="Net tension">Net tension</option>
                    <option value="Line repainting">Line repainting</option>
                    <option value="Surface crack">Surface crack</option>
                    <option value="Light replacement">Light replacement</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Severity</label>
                  <select 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]"
                    value={maintenanceForm.severity}
                    onChange={e => setMaintenanceForm(prev => ({ ...prev, severity: e.target.value }))}
                  >
                    <option value="Minor">Minor Check</option>
                    <option value="Moderate">Moderate Rest</option>
                    <option value="Critical">Critical Block</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Notes / Instructions</label>
                <textarea 
                  placeholder="Describe the issue..."
                  className="h-20 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] p-2 text-xs outline-none focus:border-[#d95b35]"
                  value={maintenanceForm.notes}
                  onChange={e => setMaintenanceForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowMaintenanceModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Confirm Maintenance</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Status Offline Modal */}
      {showToggleModal && selectedCourt && (
        <div className="modal-backdrop" onClick={() => setShowToggleModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Set Court Offline</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowToggleModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleConfirmOffline} className="flex flex-col gap-3 text-xs text-left">
              <div className="bg-[#fff1ec] border border-[#efc2b7] text-[#8c3125] rounded-[10px] p-2.5 mb-1 font-bold">
                ⚠️ Critical: Setting {selectedCourt.name} offline displaces active bookings and removes court from auto-queue matching!
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Reason for Offline</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]"
                  value={toggleForm.offlineReason}
                  onChange={e => setToggleForm(prev => ({ ...prev, offlineReason: e.target.value }))}
                >
                  <option value="Surface repair">Surface repair</option>
                  <option value="Weather block">Weather block (Rain/Wind)</option>
                  <option value="Tournament lock">Tournament lock</option>
                  <option value="Safety hazard">Safety hazard</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Expected Return Time</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tomorrow 09:00"
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]"
                  value={toggleForm.expectedReturn}
                  onChange={e => setToggleForm(prev => ({ ...prev, expectedReturn: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowToggleModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" style={{ background: "#9f3b2d", borderColor: "#9f3b2d" }}>Set Offline</button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
