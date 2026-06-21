"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/membership/plan-card";

interface Plan {
  id: string;
  name: string;
  price: number;
  activeMembers: number;
  description: string;
  features: string[];
  bookingWindow: number; // in days
  peakDiscount: number; // percentage
  offPeakDiscount: number; // percentage
  colorTheme: string;
  status: "ACTIVE" | "ARCHIVED";
}

const defaultPlans: Plan[] = [
  {
    id: "guest",
    name: "Guest Plan",
    price: 0,
    activeMembers: 154,
    description: "Standard public booking access",
    features: [
      "Book courts up to 3 days in advance",
      "Standard court pricing per slot",
      "Lobby TV queue display status",
    ],
    bookingWindow: 3,
    peakDiscount: 0,
    offPeakDiscount: 0,
    colorTheme: "slate",
    status: "ACTIVE",
  },
  {
    id: "member",
    name: "Club Member",
    price: 19,
    activeMembers: 82,
    description: "Our most popular tier for active players",
    features: [
      "Book courts up to 7 days in advance",
      "10% discount on all seans fees",
      "Advanced player statistics access",
      "Dedicated member-only seans access",
    ],
    bookingWindow: 7,
    peakDiscount: 10,
    offPeakDiscount: 10,
    colorTheme: "brand",
    status: "ACTIVE",
  },
  {
    id: "premium",
    name: "Premium Pro",
    price: 49,
    activeMembers: 34,
    description: "For players looking for maximum privileges",
    features: [
      "Book courts up to 14 days in advance",
      "20% discount on all seans fees",
      "Unlimited waiting list prioritizations",
      "Bring up to 2 guests at member rates",
      "Free locker usage & complimentary grip towels",
    ],
    bookingWindow: 14,
    peakDiscount: 20,
    offPeakDiscount: 20,
    colorTheme: "lime",
    status: "ACTIVE",
  },
];

export default function AdminMembershipsPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);

  // Modal States
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showArchiveModal, setShowArchiveModal] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null);

  // Form States
  const [addForm, setAddForm] = React.useState({
    name: "",
    description: "",
    price: 0,
    bookingWindow: 7,
    peakDiscount: 10,
    offPeakDiscount: 15,
    featuresText: "",
    colorTheme: "brand",
  });

  const [editForm, setEditForm] = React.useState({
    name: "",
    description: "",
    price: 0,
    bookingWindow: 7,
    peakDiscount: 10,
    offPeakDiscount: 15,
    featuresText: "",
    colorTheme: "brand",
  });

  // Load from localStorage
  React.useEffect(() => {
    const plansKey = `pickle_membership_plans_${clubSlug}`;
    const stored = localStorage.getItem(plansKey);
    if (stored) {
      try {
        setPlans(JSON.parse(stored));
      } catch (e) {
        setPlans(defaultPlans);
      }
    } else {
      setPlans(defaultPlans);
      localStorage.setItem(plansKey, JSON.stringify(defaultPlans));
    }
  }, [clubSlug]);

  const savePlans = (updated: Plan[]) => {
    setPlans(updated);
    const plansKey = `pickle_membership_plans_${clubSlug}`;
    localStorage.setItem(plansKey, JSON.stringify(updated));
  };

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

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, description, price, bookingWindow, peakDiscount, offPeakDiscount, featuresText, colorTheme } = addForm;

    if (!name.trim()) {
      triggerToast("Plan name is required.");
      return;
    }
    if (price < 0) {
      triggerToast("Price cannot be negative.");
      return;
    }
    if (peakDiscount < 0 || peakDiscount > 100 || offPeakDiscount < 0 || offPeakDiscount > 100) {
      triggerToast("Discounts must be between 0% and 100%.");
      return;
    }
    const isDuplicate = plans.some((p) => p.name.toLowerCase() === name.toLowerCase() && p.status === "ACTIVE");
    if (isDuplicate) {
      triggerToast("A plan with this name already exists.");
      return;
    }

    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      name,
      price,
      activeMembers: 0,
      description,
      features: features.length > 0 ? features : ["Custom benefits"],
      bookingWindow,
      peakDiscount,
      offPeakDiscount,
      colorTheme,
      status: "ACTIVE",
    };

    const updated = [...plans, newPlan];
    savePlans(updated);
    logAudit("membership_plan.created", `Created membership plan "${name}" for ₺${price}/mo`);
    triggerToast("Membership plan created. You can assign it to members now.");
    setShowAddModal(false);
    // Reset form
    setAddForm({
      name: "",
      description: "",
      price: 0,
      bookingWindow: 7,
      peakDiscount: 10,
      offPeakDiscount: 15,
      featuresText: "",
      colorTheme: "brand",
    });
  };

  const handleEditClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setEditForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      bookingWindow: plan.bookingWindow,
      peakDiscount: plan.peakDiscount,
      offPeakDiscount: plan.offPeakDiscount,
      featuresText: plan.features.join("\n"),
      colorTheme: plan.colorTheme,
    });
    setShowEditModal(true);
  };

  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const { name, description, price, bookingWindow, peakDiscount, offPeakDiscount, featuresText, colorTheme } = editForm;

    if (!name.trim()) {
      triggerToast("Plan name is required.");
      return;
    }
    if (price < 0) {
      triggerToast("Price cannot be negative.");
      return;
    }
    if (peakDiscount < 0 || peakDiscount > 100 || offPeakDiscount < 0 || offPeakDiscount > 100) {
      triggerToast("Discounts must be between 0% and 100%.");
      return;
    }

    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const updated = plans.map((p) => {
      if (p.id === selectedPlan.id) {
        return {
          ...p,
          name,
          description,
          price,
          bookingWindow,
          peakDiscount,
          offPeakDiscount,
          features: features.length > 0 ? features : ["Custom benefits"],
          colorTheme,
        };
      }
      return p;
    });

    savePlans(updated);
    logAudit("membership_plan.updated", `Updated membership plan "${name}" rules`);
    triggerToast("Plan updated. Existing member rules were recalculated.");
    setShowEditModal(false);
  };

  const handleArchiveClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowArchiveModal(true);
  };

  const handleConfirmArchive = () => {
    if (!selectedPlan) return;

    // Check if the plan is default or has active members
    if (selectedPlan.activeMembers > 0) {
      triggerToast(`Cannot archive: this plan has ${selectedPlan.activeMembers} active members.`);
      return;
    }

    const updated = plans.map((p) => {
      if (p.id === selectedPlan.id) {
        return { ...p, status: "ARCHIVED" as const };
      }
      return p;
    });

    savePlans(updated);
    logAudit("membership_plan.archived", `Archived membership plan "${selectedPlan.name}"`);
    triggerToast("Plan archived. No future signups allowed.");
    setShowArchiveModal(false);
  };

  const activePlans = plans.filter((p) => p.status === "ACTIVE");

  return (
    <div className="space-y-6 text-[#3a312a]">
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

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between animate-fade-in stagger-1">
        <div className="space-y-2">
          <Badge tone="brand">Membership Plans</Badge>
          <h1 className="section-title text-3xl font-black mt-2">
            Configure club tiers, pricing parameters, and perk inclusions.
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
            Edit active subscription pricing models and review tier distributions across the active player base.
          </p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          className="shrink-0 h-9 bg-[#d95b35] border-[#d95b35] hover:bg-[#c94f2f] text-white rounded-[9px] text-xs font-semibold"
          onClick={() => setShowAddModal(true)}
        >
          Create New Plan
        </Button>
      </div>

      {/* Tiers Distribution overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        {activePlans.map((plan) => (
          <Card key={plan.id} variant="surface" className="p-6 border border-[#e2d3c4] bg-[#fffaf4]">
            <p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{plan.name}</p>
            <p className="text-3xl font-black font-mono tracking-tight text-[var(--foreground)] mt-2">
              {plan.activeMembers}
              <span className="text-xs font-bold text-[var(--muted)] font-sans"> active</span>
            </p>
            <div className="mt-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
              Revenue: ₺{plan.activeMembers * plan.price}/mo
            </div>
          </Card>
        ))}
      </div>

      {/* Plan Details Grid */}
      <div className="space-y-6">
        <div className="border-b border-[#e2d3c4] pb-4">
          <h2 className="text-xl font-black text-[var(--foreground)]">Plan Perks & Settings</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
          {activePlans.map((plan) => (
            <div key={plan.id} className="relative flex flex-col justify-between border border-[#e2d3c4] bg-[#fffaf4] rounded-[16px] p-6 hover:shadow-lg transition-all duration-300">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black tracking-tight">{plan.name}</h3>
                  <Badge tone={plan.colorTheme as any}>{plan.name}</Badge>
                </div>

                <div className="flex items-baseline">
                  <span className="text-4xl font-black font-mono tracking-tight">
                    ₺{plan.price}
                  </span>
                  <span className="text-xs font-bold text-[var(--muted)] ml-1">
                    /month
                  </span>
                </div>

                <p className="text-xs font-bold text-[var(--muted)] leading-relaxed">
                  {plan.description}
                </p>

                <div className="border-t border-[#e2d3c4] pt-4 space-y-2 text-xs">
                  <div>
                    <strong>Booking Window:</strong> {plan.bookingWindow} days in advance
                  </div>
                  <div>
                    <strong>Discounts:</strong> {plan.peakDiscount}% Peak / {plan.offPeakDiscount}% Off-Peak
                  </div>
                </div>

                <ul className="space-y-2 pt-4 border-t border-[#e2d3c4]">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-[var(--muted)]">
                      <span className="text-[#d95b35]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-semibold"
                  onClick={() => handleEditClick(plan)}
                >
                  Edit Parameters
                </Button>
                {plan.id !== "guest" && (
                  <Button
                    variant="secondary"
                    className="border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-[9px] text-xs font-semibold px-3"
                    onClick={() => handleArchiveClick(plan)}
                  >
                    Archive
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Plan Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Create New Membership Plan</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Plan Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Platinum Plus"
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={addForm.name}
                  onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Description</label>
                <input 
                  type="text" 
                  placeholder="Brief description of the plan"
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={addForm.description}
                  onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Monthly Price (₺)</label>
                  <input 
                    type="number" 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                    value={addForm.price}
                    onChange={(e) => setAddForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Booking Window (Days)</label>
                  <input 
                    type="number" 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                    value={addForm.bookingWindow}
                    onChange={(e) => setAddForm(prev => ({ ...prev, bookingWindow: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Peak Court Discount (%)</label>
                  <input 
                    type="number" 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                    value={addForm.peakDiscount}
                    onChange={(e) => setAddForm(prev => ({ ...prev, peakDiscount: parseInt(e.target.value) || 0 }))}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Off-Peak Court Discount (%)</label>
                  <input 
                    type="number" 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                    value={addForm.offPeakDiscount}
                    onChange={(e) => setAddForm(prev => ({ ...prev, offPeakDiscount: parseInt(e.target.value) || 0 }))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Theme Color / Badge Style</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={addForm.colorTheme}
                  onChange={(e) => setAddForm(prev => ({ ...prev, colorTheme: e.target.value }))}
                >
                  <option value="brand">Sunset (Orange)</option>
                  <option value="lime">Green (Lime)</option>
                  <option value="slate">Slate (Default)</option>
                  <option value="gold">Gold</option>
                  <option value="violet">Purple</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Features list (one perk per line)</label>
                <textarea 
                  rows={4}
                  placeholder="e.g. Free locker access&#10;Complimentary water&#10;Priority waitlist access"
                  className="border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] p-3 outline-none focus:border-[#d95b35] resize-none"
                  value={addForm.featuresText}
                  onChange={(e) => setAddForm(prev => ({ ...prev, featuresText: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10">Create Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && selectedPlan && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Edit Plan Parameters</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            
            <div className="bg-[#fff8e6] border border-[#ead59c] rounded-[10px] p-3 text-[#755308] font-semibold mb-4">
              ⚠️ Warning: Modifying this plan impacts {selectedPlan.activeMembers} active member accounts immediately.
            </div>

            <form onSubmit={handleUpdatePlan} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Plan Name *</label>
                <input 
                  type="text" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Description</label>
                <input 
                  type="text" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Monthly Price (₺)</label>
                  <input 
                    type="number" 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Booking Window (Days)</label>
                  <input 
                    type="number" 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                    value={editForm.bookingWindow}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bookingWindow: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Peak Court Discount (%)</label>
                  <input 
                    type="number" 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                    value={editForm.peakDiscount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, peakDiscount: parseInt(e.target.value) || 0 }))}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#756a61]">Off-Peak Court Discount (%)</label>
                  <input 
                    type="number" 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                    value={editForm.offPeakDiscount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, offPeakDiscount: parseInt(e.target.value) || 0 }))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Theme Color / Badge Style</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={editForm.colorTheme}
                  onChange={(e) => setEditForm(prev => ({ ...prev, colorTheme: e.target.value }))}
                >
                  <option value="brand">Sunset (Orange)</option>
                  <option value="lime">Green (Lime)</option>
                  <option value="slate">Slate (Default)</option>
                  <option value="gold">Gold</option>
                  <option value="violet">Purple</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Features list (one perk per line)</label>
                <textarea 
                  rows={4}
                  className="border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] p-3 outline-none focus:border-[#d95b35] resize-none"
                  value={editForm.featuresText}
                  onChange={(e) => setEditForm(prev => ({ ...prev, featuresText: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveModal && selectedPlan && (
        <div className="modal-backdrop" onClick={() => setShowArchiveModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Archive Membership Plan</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowArchiveModal(false)}>×</button>
            </div>
            
            <div className="space-y-4 text-xs">
              <p className="text-sm font-semibold">
                Are you sure you want to archive <span className="font-bold text-red-600">"{selectedPlan.name}"</span>?
              </p>
              <p className="text-[var(--muted)] leading-relaxed">
                Archiving a plan blocks future sales/signups immediately. Current active members will not be kicked, but no new members can select this plan.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 text-red-800 font-semibold">
                ⚠️ Warning: Active members of this tier: {selectedPlan.activeMembers}. Reassign them first to delete entirely.
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowArchiveModal(false)}>Cancel</button>
                <button 
                  type="button" 
                  className="btn btn-primary flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 rounded-[9px] font-semibold h-10"
                  onClick={handleConfirmArchive}
                >
                  Archive Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
