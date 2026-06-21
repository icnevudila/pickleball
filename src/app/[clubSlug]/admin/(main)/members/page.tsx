"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminMembersPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  // State Management
  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);
  const [failedCardsCount, setFailedCardsCount] = React.useState(1);
  const [mertCardStatus, setMertCardStatus] = React.useState<"FAILED" | "ACTIVE">("FAILED");
  const [guideSent, setGuideSent] = React.useState(false);

  const [memberList, setMemberList] = React.useState([
    { id: "m1", name: "Ali Düvenci", initial: "AD", email: "ali@gmail.com", phone: "+90 532 111 22 33", tier: "Gold", balance: 1250, ltv: "₺8.2k", visits: 18, notes: "Weekend Pro", status: "ACTIVE" },
    { id: "m2", name: "Mert K.", initial: "MK", email: "mert@gmail.com", phone: "+90 532 444 55 66", tier: "Silver", balance: 450, ltv: "₺3.5k", visits: 12, notes: "Regular player", status: "FAILED" },
  ]);

  const [priorities, setPriorities] = React.useState([
    { id: "p1", type: "orange", kicker: "Revenue risk", title: "1 failed card", copy: "Recover before churn", buttonText: "Recover" },
    { id: "p2", type: "green", kicker: "VIP", title: "Ali is active", copy: "Offer loyalty perk", buttonText: "Open" },
    { id: "p3", type: "amber", kicker: "Dormant", title: "24 members inactive", copy: "Launch campaign", buttonText: "Campaign" }
  ]);

  const [nextAction, setNextAction] = React.useState({
    title: "Recover failed cards",
    note: "CRM screen should create money-saving action immediately.",
    resolved: false
  });

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [addForm, setAddForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    tier: "Bronze",
    skill: "Intermediate",
    startingBalance: 0
  });

  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<any>(null);

  const [showBalanceModal, setShowBalanceModal] = React.useState(false);
  const [balanceForm, setBalanceForm] = React.useState({
    adjustType: "add",
    amount: 100,
    reason: "Prepaid credit topup"
  });

  const [showTierModal, setShowTierModal] = React.useState(false);
  const [tierForm, setTierForm] = React.useState({
    newTier: "Gold"
  });

  const logMemberAudit = (actionType: string, details: string) => {
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

  const handlePriorityAction = (id: string, actionType: string) => {
    if (actionType === "Recover") {
      setFailedCardsCount(0);
      setMertCardStatus("ACTIVE");
      setMemberList(prev => prev.map(m => m.id === "m2" ? { ...m, status: "ACTIVE" } : m));
      setPriorities(prev => prev.filter(p => p.id !== id));
      if (!nextAction.resolved) {
        setNextAction({
          title: "None pending",
          note: "All billing risks and card failures have been recovered.",
          resolved: true
        });
      }
      logMemberAudit("member.balance_adjusted", "Batch recovered billing renewals failed cards");
      triggerToast("Batch recovery executed. All cards cleared successfully!");
    } else if (actionType === "Campaign") {
      setPriorities(prev => prev.filter(p => p.id !== id));
      triggerToast("Win-back campaign launched for 24 dormant members");
    } else if (actionType === "Open") {
      const ali = memberList.find(m => m.id === "m1");
      if (ali) {
        setSelectedMember(ali);
        setShowProfileModal(true);
      }
    }
  };

  const handleFixMertCard = () => {
    if (mertCardStatus === "ACTIVE") {
      triggerToast("Mert K. is already active");
      return;
    }
    setMertCardStatus("ACTIVE");
    setMemberList(prev => prev.map(m => m.id === "m2" ? { ...m, status: "ACTIVE" } : m));
    setFailedCardsCount(prev => Math.max(0, prev - 1));
    logMemberAudit("member.balance_adjusted", "Recovered renewal failed card for Mert K.");
    triggerToast("Mert K. payment details updated & verified");
    if (failedCardsCount <= 1) {
      setPriorities(prev => prev.filter(p => p.id !== "p1"));
      setNextAction({
        title: "None pending",
        note: "All billing risks and card failures have been recovered.",
        resolved: true
      });
    }
  };

  const handleRunNextAction = () => {
    if (nextAction.resolved) {
      triggerToast("No action pending");
      return;
    }
    handlePriorityAction("p1", "Recover");
  };

  const handleSendGuide = () => {
    setGuideSent(true);
    triggerToast("Onboarding guides successfully dispatched to 12 new members");
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.phone) {
      triggerToast("Name and phone number are required");
      return;
    }
    // Check duplicates
    const isDuplicate = memberList.some(m => m.phone === addForm.phone || (addForm.email && m.email === addForm.email));
    if (isDuplicate) {
      triggerToast("Member could not be added. Check duplicate phone/email.");
      return;
    }
    
    const newMember = {
      id: `m${Date.now()}`,
      name: addForm.name,
      initial: addForm.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      email: addForm.email,
      phone: addForm.phone,
      tier: addForm.tier,
      balance: addForm.startingBalance,
      ltv: "₺0",
      visits: 0,
      notes: `${addForm.skill} skill`,
      status: "ACTIVE"
    };

    setMemberList(prev => [...prev, newMember]);
    logMemberAudit("member.created", `Created member profile for ${addForm.name} (${addForm.tier})`);
    triggerToast("Member added. Profile is ready.");
    setShowAddModal(false);
  };

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    if (balanceForm.amount <= 0) {
      triggerToast("Amount must be greater than zero");
      return;
    }
    
    const delta = balanceForm.adjustType === "add" ? balanceForm.amount : -balanceForm.amount;
    const newBalance = selectedMember.balance + delta;

    setMemberList(prev => prev.map(m => m.id === selectedMember.id ? { ...m, balance: newBalance } : m));
    setSelectedMember((prev: any) => ({ ...prev, balance: newBalance }));
    
    logMemberAudit("member.balance_adjusted", `Adjusted balance for ${selectedMember.name} by ${delta} Lira. Reason: ${balanceForm.reason}`);
    triggerToast(`Balance updated. New wallet balance is ₺${newBalance}.`);
    setShowBalanceModal(false);
  };

  const handleChangeTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    
    const targetTier = tierForm.newTier;
    setMemberList(prev => prev.map(m => m.id === selectedMember.id ? { ...m, tier: targetTier } : m));
    setSelectedMember((prev: any) => ({ ...prev, tier: targetTier }));

    const dateStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    logMemberAudit("member.tier_changed", `Changed member ${selectedMember.name} tier to ${targetTier}`);
    triggerToast(`Membership tier updated. New benefits apply from ${dateStr}.`);
    setShowTierModal(false);
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
          <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-[#211b16]">Members CRM</h1>
          <p className="text-sm text-[#756a61] mt-1.5">
            Not member list; value, churn risk, loyalty and action priority.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-semibold"
            onClick={() => triggerToast("Refreshed CRM logs")}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="h-8 bg-[#d95b35] border-[#d95b35] hover:bg-[#c94f2f] text-white rounded-[9px] text-xs font-semibold"
            onClick={() => setShowAddModal(true)}
          >
            Add Member
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
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black">1,284</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Members</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black font-mono">₺8.2k</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Top LTV</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className={`block text-base tracking-[-0.02em] font-black ${failedCardsCount > 0 ? "text-[#9f3b2d]" : "text-[#23624f]"}`}>
                {failedCardsCount}
              </strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Failed cards</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black text-[#2f8066]">12</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">New this week</span>
            </div>
          </section>

          {/* Priority Alert Strip */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {priorities.map(p => {
              let alertStyle = "bg-[#f4fbf7] border-[#bddbcc]";
              let dotColor = "bg-[#2f8066] shadow-[0_0_0_3px_rgba(47,128,102,0.1)]";
              let btnClass = "border-[#d1bdae] bg-[#fffaf4]";
              if (p.type === "orange") {
                alertStyle = "bg-gradient-to-b from-[#fffaf5] to-[#fff3eb] border-[#e3b197]";
                dotColor = "bg-[#d95b35] shadow-[0_0_0_3px_rgba(217,91,53,0.11)]";
                btnClass = "border-[#e3b197] bg-[#fff0e8] text-[#9d3d25] hover:bg-[#ffe5d9]";
              } else if (p.type === "amber") {
                alertStyle = "bg-[#fff8e8] border-[#e1c486]";
                dotColor = "bg-[#a97619] shadow-[0_0_0_3px_rgba(169,118,25,0.1)]";
              }
              return (
                <article key={p.id} className={`bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-3 flex items-start justify-between gap-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)] min-w-0 ${alertStyle}`}>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#75675d] uppercase tracking-[0.05em] font-black flex items-center gap-1.5 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                      {p.kicker}
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
                🎉 All member CRM alerts are resolved.
              </div>
            )}
          </section>

          {/* High Value Members & Segments */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* High Value Members */}
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
              <div className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9] flex items-start justify-between gap-2.5">
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#211b16] tracking-tight">High value members</h3>
                  <p className="text-xs text-[#756a61] mt-0.5">Sort by action, not alphabet</p>
                </div>
                <Badge tone="lime" className="bg-[#edf6f1] border-[#cbe4d9] text-[#23624f] px-2 py-0.5 text-[11px] font-bold rounded-full">
                  CRM
                </Badge>
              </div>
              <div className="p-3.5 space-y-2">
                {memberList.map(member => (
                  <div key={member.id} className={`grid grid-cols-[auto_minmax(0,1fr)_auto] gap-2 items-center border rounded-[10px] p-2 text-xs ${
                    member.status === "FAILED" ? "bg-[#fff8e6] border-[#ddc07e]" : "bg-[#f2faf6] border-[#c1ddce]"
                  }`}>
                    <div className="w-[38px] h-[38px] rounded-full border border-[#d8c8bb] bg-[#eef9b6] text-[#405400] flex items-center justify-center font-bold text-[11px] shrink-0 shadow-[0_0_0_2px_#fffdf9]">
                      {member.initial}
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-[#211b16] truncate">{member.name}</div>
                      <div className="text-[11px] text-[#756a61] truncate font-mono">
                        {member.tier} Tier · {member.visits} visits · ₺{member.balance} Wallet
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {member.status === "FAILED" && mertCardStatus === "FAILED" && member.id === "m2" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-[29px] bg-[#d95b35] border-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] text-[11px] font-semibold px-2.5 shrink-0"
                          onClick={handleFixMertCard}
                        >
                          Fix
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-[29px] border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-[11px] font-semibold px-2.5 shrink-0"
                        onClick={() => {
                          setSelectedMember(member);
                          setShowProfileModal(true);
                        }}
                      >
                        Open
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Segments Heatmap Grid */}
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
              <div className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9]">
                <h3 className="text-[15px] font-extrabold text-[#211b16] tracking-tight">Segments</h3>
                <p className="text-xs text-[#756a61] mt-0.5">Useful for marketing campaigns</p>
              </div>
              <div className="p-3.5">
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-bold font-sans">
                  <div className="rounded-[9px] border border-[#e2d3c4] bg-[#fff7ef] p-2 flex items-center justify-center text-[#211b16] font-extrabold">Seg</div>
                  <div className="rounded-[9px] border border-[#d7ec7a] bg-[#eaf8b6] p-2 flex items-center justify-center text-[#211b16]">VIP</div>
                  <div className="rounded-[9px] border border-[#e2d3c4] bg-[#fff8e8] p-2 flex items-center justify-center text-[#211b16]">Weekend</div>
                  <div className="rounded-[9px] border border-[#e2d3c4] bg-[#fbf0d8] p-2 flex items-center justify-center text-[#211b16]">New</div>
                  <div className="rounded-[9px] border border-[#e2d3c4] bg-[#edf6f1] p-2 flex items-center justify-center text-[#211b16]">Dormant</div>
                  <div className="rounded-[9px] border border-[#d7ec7a] bg-[#eaf8b6] p-2 flex items-center justify-center text-[#211b16]">Duel</div>
                  <div className="rounded-[9px] border border-[#e2d3c4] bg-[#fbf0d8] p-2 flex items-center justify-center text-[#211b16]">Family</div>
                  <div className="rounded-[9px] border border-[#e2d3c4] bg-[#edf6f1] p-2 flex items-center justify-center text-[#211b16]">Coach</div>
                </div>
              </div>
            </div>
          </section>

          {/* Member Pulse Grid */}
          <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
            <div className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9]">
              <h3 className="text-[15px] font-extrabold text-[#211b16] tracking-tight">Member pulse</h3>
              <p className="text-xs text-[#756a61] mt-0.5">Today's CRM actions</p>
            </div>
            <div className="p-3.5 space-y-2.5">
              {failedCardsCount > 0 ? (
                <div className="grid grid-cols-[1fr_0.8fr_0.8fr_auto] gap-3 items-center border border-[#e2d3c4] rounded-[10px] bg-[#fffdf9] p-3 text-xs">
                  <b className="text-[#211b16] font-extrabold">{failedCardsCount} cards failed</b>
                  <span className="text-[#756a61]">Membership renewals</span>
                  <span className="text-[#756a61] font-semibold font-mono">₺{failedCardsCount * 900} risk</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-[29px] border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-[11px] font-semibold px-2.5 shrink-0"
                    onClick={() => handlePriorityAction("p1", "Recover")}
                  >
                    Recover
                  </Button>
                </div>
              ) : (
                <div className="border border-[#cbe4d9] rounded-[10px] p-3.5 bg-[#f4fbf7] text-xs font-semibold text-[#23624f] text-center">
                  ✅ All card payment failures resolved.
                </div>
              )}

              <div className="grid grid-cols-[1fr_0.8fr_0.8fr_auto] gap-3 items-center border border-[#e2d3c4] rounded-[10px] bg-[#fffdf9] p-3 text-xs">
                <b className="text-[#211b16] font-extrabold">12 new members</b>
                <span className="text-[#756a61]">This week</span>
                <span className="text-[#756a61]">{guideSent ? "Guides sent" : "Onboarding"}</span>
                <Button
                  disabled={guideSent}
                  variant="secondary"
                  size="sm"
                  className="h-[29px] border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-[11px] font-semibold px-2.5 shrink-0"
                  onClick={handleSendGuide}
                >
                  {guideSent ? "Sent" : "Send guide"}
                </Button>
              </div>
            </div>
          </div>

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
                <span className="badge tone-brand bg-[#fff0e8] border-[#ecc0ae] text-[#94402a] text-[10px] font-bold px-2 py-0.5 rounded">
                  NOW
                </span>
              ) : (
                <span className="badge" style={{ background: "#edf3f5", border: "1px solid #cad9df", color: "#435f6f" }}>
                  DONE
                </span>
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
                    onClick={() => triggerToast(nextAction.resolved ? "No active card warnings" : "Showing failed card reports")}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

      {/* Add New Member Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Add New Member</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleAddMember} className="flex flex-col gap-3 text-xs text-left">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Can Yilmaz"
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={addForm.name}
                  onChange={e => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +90 532 987 65 43"
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                    value={addForm.phone}
                    onChange={e => setAddForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. can@example.com"
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                    value={addForm.email}
                    onChange={e => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Membership Tier</label>
                  <select 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                    value={addForm.tier}
                    onChange={e => setAddForm(prev => ({ ...prev, tier: e.target.value }))}
                  >
                    <option value="Bronze">Bronze Tier</option>
                    <option value="Silver">Silver Tier</option>
                    <option value="Gold">Gold Tier</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Default Skill Rating</label>
                  <select 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]"
                    value={addForm.skill}
                    onChange={e => setAddForm(prev => ({ ...prev, skill: e.target.value }))}
                  >
                    <option value="Beginner">Beginner (1.0 - 2.5)</option>
                    <option value="Intermediate">Intermediate (3.0 - 4.0)</option>
                    <option value="Advanced">Advanced (4.5+)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Starting Balance (₺)</label>
                <input 
                  type="number" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={addForm.startingBalance}
                  onChange={e => setAddForm(prev => ({ ...prev, startingBalance: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Profile Details Modal */}
      {showProfileModal && selectedMember && (
        <div className="modal-backdrop" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Member Profile</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowProfileModal(false)}>×</button>
            </div>
            
            <div className="text-left space-y-4 text-xs">
              <div className="p-3 border border-[#e2d3c4] rounded-[10px] bg-[#fffdf9] space-y-2">
                <p className="text-sm font-extrabold text-[#211b16]">{selectedMember.name}</p>
                <p><strong>Tier:</strong> <span className="font-bold text-[#9d3d25]">{selectedMember.tier}</span></p>
                <p><strong>Phone:</strong> {selectedMember.phone}</p>
                <p><strong>Email:</strong> {selectedMember.email}</p>
                <p><strong>Notes:</strong> {selectedMember.notes}</p>
                <p><strong>Wallet Balance:</strong> <span className="font-mono font-bold text-[#2f8066]">₺{selectedMember.balance}</span></p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    setBalanceForm({ adjustType: "add", amount: 100, reason: "Prepaid credit topup" });
                    setShowBalanceModal(true);
                  }}
                >
                  Adjust Balance
                </button>
                <button 
                  type="button" 
                  className="btn btn-soft" 
                  onClick={() => {
                    setTierForm({ newTier: selectedMember.tier });
                    setShowTierModal(true);
                  }}
                >
                  Change Tier
                </button>
                <button type="button" className="btn" onClick={() => setShowProfileModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {showBalanceModal && selectedMember && (
        <div className="modal-backdrop" onClick={() => setShowBalanceModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Adjust Balance</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowBalanceModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleAdjustBalance} className="flex flex-col gap-3 text-xs text-left">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Adjustment Type</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={balanceForm.adjustType}
                  onChange={e => setBalanceForm(prev => ({ ...prev, adjustType: e.target.value }))}
                >
                  <option value="add">Add Credit (₺)</option>
                  <option value="deduct">Deduct Credit (₺)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Amount (₺)</label>
                <input 
                  type="number" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={balanceForm.amount}
                  onChange={e => setBalanceForm(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Reason / Reference</label>
                <input 
                  type="text" 
                  placeholder="e.g. Desk cash payment"
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={balanceForm.reason}
                  onChange={e => setBalanceForm(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowBalanceModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Save Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Tier Modal */}
      {showTierModal && selectedMember && (
        <div className="modal-backdrop" onClick={() => setShowTierModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Change Membership Tier</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowTierModal(true)}>×</button>
            </div>
            
            <form onSubmit={handleChangeTier} className="flex flex-col gap-3 text-xs text-left">
              <div className="bg-[#fff8e6] border border-[#ead59c] rounded-[10px] p-2.5 text-[#755308] font-semibold mb-1">
                Changing tier will recalculate booking windows and pricing discount benefits.
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Select Membership Tier</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={tierForm.newTier}
                  onChange={e => setTierForm(prev => ({ ...prev, newTier: e.target.value }))}
                >
                  <option value="Bronze">Bronze Tier</option>
                  <option value="Silver">Silver Tier</option>
                  <option value="Gold">Gold Tier</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowTierModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Change Tier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
