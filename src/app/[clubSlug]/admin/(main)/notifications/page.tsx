"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Template {
  id: string;
  name: string;
  body: string;
  placeholders: string[];
}

interface Recipient {
  name: string;
  phone: string;
  email: string;
  session: string;
}

const defaultTemplates: Template[] = [
  { id: "court-ready", name: "Court Ready (Lobby TV / Voice)", body: "Court {{court}} is ready for {{time}} slot. Please head to your court.", placeholders: ["{{court}}", "{{time}}"] },
  { id: "split-reminder", name: "Split Payment Reminder", body: "Hi, please complete your split payment share of ₺{{amount}} for {{clubName}} reservation on {{court}}.", placeholders: ["{{amount}}", "{{clubName}}", "{{court}}"] },
  { id: "cancellation", name: "Booking Cancellation", body: "Your reservation at {{clubName}} for {{court}} at {{time}} has been cancelled.", placeholders: ["{{clubName}}", "{{court}}", "{{time}}"] },
  { id: "receipt", name: "Payment Receipt", body: "Thank you! We received ₺{{amount}} for your {{clubName}} booking.", placeholders: ["{{amount}}", "{{clubName}}"] },
];

const mockRecipients: Recipient[] = [
  { name: "Ali Düvenci", phone: "+90 532 111 22 33", email: "ali@gmail.com", session: "18:00 - 19:30 Open Play" },
  { name: "Zeynep S.", phone: "+90 532 222 33 44", email: "zeynep@gmail.com", session: "18:00 - 19:30 Open Play" },
  { name: "Mert K.", phone: "+90 532 444 55 66", email: "mert@gmail.com", session: "18:00 - 19:30 Open Play" },
  { name: "Can Y.", phone: "+90 532 987 65 43", email: "can@example.com", session: "18:00 - 19:30 Open Play" },
  { name: "Ahmet T.", phone: "+90 532 333 44 55", email: "ahmet@gmail.com", session: "21:00 drills" },
];

export default function AdminNotificationsPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);

  // Stateful templates
  const [templates, setTemplates] = React.useState<Template[]>(defaultTemplates);

  // Modal / Drawer States
  const [showBlastModal, setShowBlastModal] = React.useState(false);
  const [showTemplateDrawer, setShowTemplateDrawer] = React.useState(false);

  // Blast Form State
  const [blastAudience, setBlastAudience] = React.useState("all-today");
  const [blastChannel, setBlastChannel] = React.useState<"sms" | "email">("sms");
  const [blastMessage, setBlastMessage] = React.useState("");
  const [blastRecipients, setBlastRecipients] = React.useState<Recipient[]>(mockRecipients);

  // Template Form State
  const [selectedTemplateId, setSelectedTemplateId] = React.useState("court-ready");
  const [templateBodyEdit, setTemplateBodyEdit] = React.useState("");

  // Load from localStorage or set initial
  React.useEffect(() => {
    const templatesKey = `pickle_sms_templates_${clubSlug}`;
    const stored = localStorage.getItem(templatesKey);
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch (e) {
        setTemplates(defaultTemplates);
      }
    } else {
      setTemplates(defaultTemplates);
      localStorage.setItem(templatesKey, JSON.stringify(defaultTemplates));
    }
  }, [clubSlug]);

  // Sync templates selection with edit state
  React.useEffect(() => {
    const current = templates.find((t) => t.id === selectedTemplateId);
    if (current) {
      setTemplateBodyEdit(current.body);
    }
  }, [selectedTemplateId, templates]);

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

  // Filter recipients based on audience
  React.useEffect(() => {
    if (blastAudience === "all-today") {
      setBlastRecipients(mockRecipients);
    } else if (blastAudience === "open-play") {
      setBlastRecipients(mockRecipients.filter((r) => r.session.toLowerCase().includes("open play")));
    } else if (blastAudience === "drills") {
      setBlastRecipients(mockRecipients.filter((r) => r.session.toLowerCase().includes("drills")));
    }
  }, [blastAudience]);

  // NOTIF-001: Blast SMS submit
  const handleSendBlast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blastMessage.trim()) {
      triggerToast("Broadcast message cannot be empty.");
      return;
    }
    if (blastRecipients.length === 0) {
      triggerToast("No recipients match the selected audience filter.");
      return;
    }

    logAudit("notification.blast_sent", `Sent blast ${blastChannel.toUpperCase()} to ${blastRecipients.length} players. Msg: ${blastMessage}`);
    triggerToast(`Blast sent to ${blastRecipients.length} recipients successfully.`);
    setShowBlastModal(false);
    setBlastMessage("");
  };

  // NOTIF-002: Save templates
  const handleSaveTemplates = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTemplate = templates.find((t) => t.id === selectedTemplateId);
    if (!currentTemplate) return;

    // Validation checks for required placeholder fields
    const missing = currentTemplate.placeholders.filter(
      (ph) => !templateBodyEdit.includes(ph)
    );

    if (missing.length > 0) {
      triggerToast(`Could not save. Template body is missing required placeholders: ${missing.join(", ")}`);
      return;
    }

    const updated = templates.map((t) => {
      if (t.id === selectedTemplateId) {
        return { ...t, body: templateBodyEdit };
      }
      return t;
    });

    setTemplates(updated);
    const templatesKey = `pickle_sms_templates_${clubSlug}`;
    localStorage.setItem(templatesKey, JSON.stringify(updated));

    logAudit("notification_templates.updated", `Updated template body for "${currentTemplate.name}"`);
    triggerToast("SMS templates saved. Future messages will use the new copy.");
    setShowTemplateDrawer(false);
  };

  const handleResetTemplate = () => {
    const defaultVal = defaultTemplates.find((t) => t.id === selectedTemplateId);
    if (defaultVal) {
      setTemplateBodyEdit(defaultVal.body);
      triggerToast("Template reset to original defaults.");
    }
  };

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId);

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
          max-width: 550px;
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
          max-width: 460px;
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
          <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-[#211b16]">Notification & Automations</h1>
          <p className="text-sm text-[#756a61] mt-1.5">
            Configure system message templates, test lobby TV voice announcements, and send urgent text broadcasts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-semibold"
            onClick={() => setShowTemplateDrawer(true)}
          >
            Configure SMS Templates
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="h-8 bg-[#d95b35] border-[#d95b35] hover:bg-[#c94f2f] text-white rounded-[9px] text-xs font-semibold"
            onClick={() => setShowBlastModal(true)}
          >
            Blast Alert SMS
          </Button>
        </div>
      </section>

      {/* Layout Split: Main Board (Left) & Action Rail (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 items-start text-left">
        
        {/* Left Section: Content */}
        <div className="space-y-4 min-w-0">
          
          {/* Metrics Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black">{templates.length}</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Active Templates</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black">2</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Lobby Speakers</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black text-[#2f8066]">99.8%</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">SMS Rate</span>
            </div>
            <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[10px] p-2.5 shadow-[0_1px_0_rgba(49,36,24,0.04)]">
              <strong className="block text-[#211b16] text-base tracking-[-0.02em] font-black text-[#2f8066]">0</strong>
              <span className="block text-[#756a61] text-[11px] mt-0.5 font-medium">Errors</span>
            </div>
          </section>

          {/* Core Automation Flows */}
          <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
            <div className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9] flex justify-between items-center">
              <div>
                <h3 className="text-[15px] font-extrabold text-[#211b16] tracking-tight">Active Automation Triggers</h3>
                <p className="text-xs text-[#756a61] mt-0.5">Automated events synced to the lobby TV and players</p>
              </div>
              <Badge tone="lime">ON</Badge>
            </div>
            
            <div className="p-3.5 space-y-2">
              <div className="grid grid-cols-[60px_minmax(0,1fr)_auto] gap-2.5 items-center border border-[#e2d3c4] rounded-[10px] p-2.5 bg-[#f2faf6] border-[#c1ddce] text-xs">
                <span className="font-mono text-[10px] text-[#756a61] font-black text-center bg-[#fffdf9] border border-[#e2d3c4] py-1 px-1 rounded-full shrink-0">T-24</span>
                <div className="min-w-0">
                  <div className="font-extrabold text-[#211b16]">24h Court Booking Reminder</div>
                  <div className="text-[10px] text-[#756a61]">Dispatches SMS & Email to confirmed slots 24 hours before play.</div>
                </div>
                <Badge tone="lime">ACTIVE</Badge>
              </div>

              <div className="grid grid-cols-[60px_minmax(0,1fr)_auto] gap-2.5 items-center border border-[#e2d3c4] rounded-[10px] p-2.5 bg-[#f2faf6] border-[#c1ddce] text-xs">
                <span className="font-mono text-[10px] text-[#756a61] font-black text-center bg-[#fffdf9] border border-[#e2d3c4] py-1 px-1 rounded-full shrink-0">LOBBY</span>
                <div className="min-w-0">
                  <div className="font-extrabold text-[#211b16]">TV Voice Court Call</div>
                  <div className="text-[10px] text-[#756a61]">Lobby text-to-speech speaker reads template aloud when court status changes to playing.</div>
                </div>
                <Button
                  variant="primary"
                  className="h-[29px] bg-[#d95b35] border-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] text-[11px] font-semibold px-3"
                  onClick={() => {
                    logAudit("voice.test_triggered", "Triggered test voice call template for Court 2");
                    triggerToast("Lobby speaker synthesized voice: 'Court 2 is ready.'");
                  }}
                >
                  Test Audio
                </Button>
              </div>

              <div className="grid grid-cols-[60px_minmax(0,1fr)_auto] gap-2.5 items-center border border-[#e2d3c4] rounded-[10px] p-2.5 bg-[#fff8e8] border-[#e1c486] text-xs">
                <span className="font-mono text-[10px] text-[#756a61] font-black text-center bg-[#fffdf9] border border-[#e2d3c4] py-1 px-1 rounded-full shrink-0">SPLIT</span>
                <div className="min-w-0">
                  <div className="font-extrabold text-[#211b16]">Split payment check alerts</div>
                  <div className="text-[10px] text-[#756a61]">Auto reminder sent to unpaid split shares 60 mins and 15 mins before booking starts.</div>
                </div>
                <Button
                  variant="secondary"
                  className="h-[29px] border-[#d1bdae] bg-white hover:bg-[#fff6ef] rounded-[9px] text-[11px] font-semibold px-3"
                  onClick={() => setShowTemplateDrawer(true)}
                >
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Action Rail */}
        <aside className="space-y-3 xl:sticky xl:top-[78px]">
          <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
            <header className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9]">
              <h3 className="font-extrabold text-[14px] text-[#211b16] tracking-tight">Recent Dispatch Ticker</h3>
              <p className="text-xs text-[#756a61] mt-0.5">Real-time automation outputs</p>
            </header>
            <div className="p-3.5 space-y-2.5 text-xs">
              <div className="bg-[#fffdf9] border border-[#e2d3c4] rounded-[10px] p-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold">TV Call: Court 1 Ready</div>
                  <div className="text-[10px] text-slate-500 font-mono">18:42 · Voice Engine</div>
                </div>
                <Badge tone="lime">DELIVERED</Badge>
              </div>

              <div className="bg-[#fffdf9] border border-[#e2d3c4] rounded-[10px] p-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold">SMS: Split reminder (Mert K.)</div>
                  <div className="text-[10px] text-slate-500 font-mono">18:30 · Twilio SMS</div>
                </div>
                <Badge tone="lime">DELIVERED</Badge>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* NOTIF-001: Blast Alert SMS Modal */}
      {showBlastModal && (
        <div className="modal-backdrop" onClick={() => setShowBlastModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Blast Broadcast Message</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowBlastModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSendBlast} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Select Target Audience</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={blastAudience}
                  onChange={(e) => setBlastAudience(e.target.value)}
                >
                  <option value="all-today">All Booked Players Today ({mockRecipients.length} people)</option>
                  <option value="open-play">Only Open Play Bookings today</option>
                  <option value="drills">Only Drills/Clinic Bookings today</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Delivery Channel</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="channel" 
                      checked={blastChannel === "sms"} 
                      onChange={() => setBlastChannel("sms")} 
                    />
                    <span>SMS text message</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="channel" 
                      checked={blastChannel === "email"} 
                      onChange={() => setBlastChannel("email")} 
                    />
                    <span>Email notification</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#756a61]">Broadcast Message Body</label>
                  <span className={`font-mono text-[10px] ${blastMessage.length > 160 ? "text-amber-600 font-bold" : "text-slate-500"}`}>
                    {blastMessage.length} / 160 chars
                  </span>
                </div>
                <textarea 
                  rows={4}
                  placeholder="e.g. Due to sudden court cleaning, bookings between 19:30 and 20:00 will be delayed by 15 mins. Thank you."
                  className="border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] p-3 outline-none resize-none"
                  value={blastMessage}
                  onChange={(e) => setBlastMessage(e.target.value)}
                  required
                />
                {blastMessage.length > 160 && (
                  <p className="text-[10px] text-amber-600 font-semibold mt-0.5">⚠️ Message exceeds 1 SMS segment (split charges will apply).</p>
                )}
              </div>

              {/* Recipients list preview */}
              <div className="space-y-1">
                <label className="font-bold text-[#756a61]">Recipient Preview ({blastRecipients.length})</label>
                <div className="border border-[#e2d3c4] rounded-[10px] max-h-[100px] overflow-y-auto bg-white p-2 divide-y divide-slate-100">
                  {blastRecipients.map((r, idx) => (
                    <div key={idx} className="py-1 flex justify-between text-[10px] text-slate-600">
                      <span>{r.name} ({blastChannel === "sms" ? r.phone : r.email})</span>
                      <span className="font-semibold text-slate-500 truncate max-w-[120px]">{r.session}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowBlastModal(false)}>Cancel</button>
                <button 
                  type="submit" 
                  disabled={blastRecipients.length === 0}
                  className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10 disabled:opacity-50"
                >
                  Send Blast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTIF-002: Configure SMS Templates Drawer */}
      {showTemplateDrawer && (
        <div className="drawer-backdrop" onClick={() => setShowTemplateDrawer(false)}>
          <div className="drawer-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#211b16]">Configure SMS Templates</h3>
                <p className="text-[10px] text-slate-500 font-semibold">Modify auto messaging variables</p>
              </div>
              <button 
                className="text-[#756a61] hover:text-[#211b16] font-bold text-xl"
                onClick={() => setShowTemplateDrawer(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveTemplates} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Select Template Target</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {currentTemplate && (
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#756a61]">Template Message Body</label>
                    <textarea 
                      rows={6}
                      className="border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] p-3 outline-none resize-none font-sans"
                      value={templateBodyEdit}
                      onChange={(e) => setTemplateBodyEdit(e.target.value)}
                      required
                    />
                  </div>

                  {/* Required Placeholders tags */}
                  <div className="space-y-1">
                    <label className="font-bold text-[#756a61]">Required Placeholders (Must include all)</label>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {currentTemplate.placeholders.map((ph, idx) => {
                        const included = templateBodyEdit.includes(ph);
                        return (
                          <span 
                            key={idx} 
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                              included 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : "bg-red-50 text-red-700 border-red-200 animate-pulse"
                            }`}
                          >
                            {ph} {included ? "✓" : "MISSING"}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live preview */}
                  <div className="p-3 rounded-[10px] border border-[#e2d3c4] bg-[#fffdf9] space-y-1">
                    <strong className="text-[10px] text-slate-500 uppercase tracking-wider block">Live Message Preview:</strong>
                    <p className="text-slate-700 leading-relaxed font-sans bg-white p-2 border rounded">
                      {templateBodyEdit
                        .replace("{{court}}", "Court 3")
                        .replace("{{time}}", "18:00")
                        .replace("{{clubName}}", "Pickle Pulse Kadikoy")
                        .replace("{{amount}}", "175")}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-[#e2d3c4]">
                <button type="button" className="btn flex-1" onClick={handleResetTemplate}>Reset to Default</button>
                <button type="submit" className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10">Save Templates</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
