"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { cx } from "@/lib/utils";

export default function AdminDashboardRadarPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";
  const clubName = clubSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // States
  const [paymentRisk, setPaymentRisk] = useState(3);
  const [priorities, setPriorities] = useState([
    { id: "p1", type: "hot", kicker: "Money risk", title: "3 split payments pending", copy: "Collect before check-in", action: "Collect" },
    { id: "p2", type: "amber", kicker: "Capacity", title: "19:00 nearly full", copy: "Add staff note", action: "Review" },
    { id: "p3", type: "green", kicker: "Ops", title: "Live Desk stable", copy: "No hardware issue", action: "Open" }
  ]);

  const [nextAction, setNextAction] = useState({
    title: "Collect pending split",
    note: "Managers should see money/risk before pretty charts.",
    resolved: false
  });

  const [slotStatus, setSlotStatus] = useState<Record<string, { title: string; sub: string; status: string }>>({
    court2: { title: "Pending split", sub: "1 unpaid", status: "warn" }
  });

  // Modal toggles
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showTvModal, setShowTvModal] = useState(false);
  const [showAddReservationModal, setShowAddReservationModal] = useState(false);

  // Modal inputs - ADM-001 (TV Config)
  const [tvSession, setTvSession] = useState("Weekly Prime Open Play");
  const [tvTimerMode, setTvTimerMode] = useState("countdown");
  const [tvTimerVisibility, setTvTimerVisibility] = useState("visible");
  const [tvMarquee, setTvMarquee] = useState("Welcome to Sunset Court Club! Live match feeds are synced in real time.");
  const [tvAnnouncementPriority, setTvAnnouncementPriority] = useState("normal");
  const [tvSponsorToggle, setTvSponsorToggle] = useState(true);
  const [tvRefreshInterval, setTvRefreshInterval] = useState(10);
  const [tvVolume, setTvVolume] = useState("medium");

  // Modal inputs - ADM-002 (Capacity Review)
  const [capacityDate, setCapacityDate] = useState("2026-06-21");
  const [capacityThreshold, setCapacityThreshold] = useState(12);

  // Modal inputs - ADM-003 (Collect Payment)
  const [paymentMethod, setPaymentMethod] = useState("POS Terminal (Beko)");
  const [unpaidShares, setUnpaidShares] = useState([
    { id: "s1", name: "Mert K.", booking: "Court 2 @ 18:00", amount: 150, due: "17:30", selected: true },
    { id: "s2", name: "Ali S.", booking: "Court 2 @ 18:00", amount: 150, due: "17:30", selected: true }
  ]);
  const [reminderChannel, setReminderChannel] = useState("SMS");
  const [deskPayReason, setDeskPayReason] = useState("Cash tender at front desk");
  const [showDeskPayConfirm, setShowDeskPayConfirm] = useState(false);

  // Modal inputs - ADM-004 (Add Reservation)
  const [reserveCourt, setReserveCourt] = useState("Court 2");
  const [reserveDate, setReserveDate] = useState("2026-06-21");
  const [reserveTime, setReserveTime] = useState("19:00");
  const [reserveDuration, setReserveDuration] = useState("60");
  const [reserveType, setReserveType] = useState("Member Booking");
  const [reserveName, setReserveName] = useState("");
  const [reserveNotes, setReserveNotes] = useState("");

  // Audit Log persistence helper
  const logAuditEvent = (actionType: string, details: string) => {
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

  const notify = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  const executeSaveTvSettings = () => {
    if (tvMarquee.length > 140) {
      notify("Could not update Lobby TV settings. Marquee exceeds 140 characters.");
      return;
    }
    if (tvRefreshInterval < 5 || tvRefreshInterval > 60) {
      notify("Could not update Lobby TV settings. Refresh interval must be 5-60 seconds.");
      return;
    }
    logAuditEvent("lobby_tv_config.updated", `Set session=${tvSession}, mode=${tvTimerMode}, interval=${tvRefreshInterval}s`);
    setShowTvModal(false);
    notify("Lobby TV settings updated. Liveboard will refresh within 5 seconds.");
  };

  const executeRefreshCapacity = () => {
    if (!capacityDate) {
      notify("Capacity data could not be loaded. Try again in a moment.");
      return;
    }
    logAuditEvent("capacity_review.viewed", `Reviewed capacity for date=${capacityDate}`);
    notify("Capacity review refreshed. Recommendations are up to date.");
  };

  const executeSendPaymentReminder = () => {
    const selectedCount = unpaidShares.filter(s => s.selected).length;
    if (selectedCount === 0) {
      notify("Could not send reminder. Check contact details and try again.");
      return;
    }
    logAuditEvent("split_payment.reminder_sent", `Sent reminder via ${reminderChannel} to ${selectedCount} players`);
    setShowCollectModal(false);
    notify("Payment reminder sent to selected players.");
  };

  const executeForcePay = () => {
    if (!deskPayReason.trim()) {
      notify("Could not mark share as paid. No payment status changed.");
      return;
    }
    setPaymentRisk(prev => Math.max(0, prev - 1));
    setSlotStatus(prev => ({
      ...prev,
      court2: { title: "Doubles split", sub: "paid · check-in ready", status: "booked" }
    }));
    setPriorities(prev => prev.filter(p => p.id !== "p1"));
    if (!nextAction.resolved) {
      setNextAction({
        title: "None pending",
        note: "All operational radar items are resolved.",
        resolved: true
      });
    }
    logAuditEvent("split_payment.force_paid", `Forced paid with reason: ${deskPayReason}`);
    setShowCollectModal(false);
    setShowDeskPayConfirm(false);
    notify("Share marked as paid. Desk cash override was logged.");
  };

  const executeCreateReservation = (isBlock = false) => {
    if (!reserveName.trim() && !isBlock) {
      notify("Reservation could not be created. Player name is required.");
      return;
    }
    
    if (reserveCourt === "Court 2" && reserveTime === "18:00") {
      notify("Reservation could not be created. Slot may no longer be available.");
      return;
    }

    const key = reserveCourt.toLowerCase().replace(" ", "");
    setSlotStatus(prev => ({
      ...prev,
      [key]: {
        title: isBlock ? "Court Blocked" : reserveName,
        sub: isBlock ? "maintenance" : "booked",
        status: isBlock ? "warn" : "booked"
      }
    }));

    logAuditEvent("booking.created_from_dashboard", `Created ${isBlock ? 'block' : 'booking'} on ${reserveCourt} at ${reserveTime}`);
    setShowAddReservationModal(false);
    notify("Reservation added. Court availability has been updated.");
  };

  const handlePriorityAction = (id: string, actionType: string) => {
    if (actionType === "Collect") {
      setShowCollectModal(true);
    } else if (actionType === "Review") {
      setShowCapacityModal(true);
    } else if (actionType === "Open") {
      setShowTvModal(true);
    }
  };

  const handleRunNextAction = () => {
    if (nextAction.resolved) {
      notify("No action pending");
      return;
    }
    setShowCollectModal(true);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* CSS Styles embedded to maintain 100% parity with admin_dashboard_radar.html */}
      <style dangerouslySetInnerHTML={{ __html: `
        .live-eyebrow {
          font-size: 11px;
          color: #9d3d25;
          text-transform: uppercase;
          letter-spacing: .07em;
          font-weight: 780;
          margin-bottom: 4px;
        }
        h1 {
          font-size: 24px;
          line-height: 1.08;
          letter-spacing: -.035em;
          margin: 0;
          color: #211b16;
          font-weight: 720;
        }
        .subline {
          color: #756a61;
          margin-top: 6px;
          font-size: 13px;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 12px;
        }
        .metric {
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 10px;
          padding: 10px 11px;
          min-width: 0;
          box-shadow: 0 1px 0 rgba(49,36,24,.04);
        }
        .metric strong {
          display: block;
          color: #211b16;
          font-size: 16px;
          letter-spacing: -.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .metric span {
          display: block;
          color: #756a61;
          font-size: 11px;
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .strip {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 9px;
          margin-bottom: 12px;
        }
        .priority {
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 14px;
          padding: 11px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          box-shadow: 0 1px 0 rgba(49,36,24,.04);
          min-width: 0;
        }
        .priority.hot {
          background: linear-gradient(180deg, #fffaf5, #fff3eb);
          border-color: #e3b197;
        }
        .priority.green {
          background: #f4fbf7;
          border-color: #bddbcc;
        }
        .priority.amber {
          background: #fff8e8;
          border-color: #e1c486;
        }
        .kicker {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .05em;
          font-weight: 800;
          color: #75675d;
          display: flex;
          gap: 6px;
          align-items: center;
          margin-bottom: 4px;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #d95b35;
          box-shadow: 0 0 0 3px rgba(217,91,53,.11);
        }
        .green .dot {
          background: #2f8066;
          box-shadow: 0 0 0 3px rgba(47,128,102,.1);
        }
        .amber .dot {
          background: #a97619;
          box-shadow: 0 0 0 3px rgba(169,118,25,.1);
        }
        .p-title {
          font-weight: 760;
          color: #211b16;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 13px;
        }
        .p-copy {
          font-size: 12px;
          color: #756a61;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .btn {
          height: 34px;
          border: 1px solid #d1bdae;
          background: #fffaf4;
          border-radius: 9px;
          padding: 0 12px;
          font-size: 12px;
          font-weight: 650;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          white-space: nowrap;
          transition: .14s ease;
        }
        .btn:hover {
          background: #fff6ef;
          border-color: #c8ae9b;
          transform: translateY(-1px);
        }
        .btn-primary {
          background: #d95b35;
          border-color: #d95b35;
          color: #fff;
        }
        .btn-primary:hover {
          background: #c94f2f;
          border-color: #c94f2f;
          color: #fff;
        }
        .btn-small {
          height: 29px;
          padding: 0 10px;
          font-size: 11px;
          font-weight: 650;
        }
        .grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
          gap: 12px;
        }
        .card {
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 14px;
          box-shadow: 0 1px 0 rgba(49,36,24,.04);
          overflow: hidden;
        }
        .card-head {
          padding: 13px;
          border-bottom: 1px solid #e2d3c4;
          background: #fffdf9;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }
        .card-title {
          font-size: 15px;
          font-weight: 780;
          color: #211b16;
          letter-spacing: -.02em;
        }
        .card-sub {
          font-size: 12px;
          color: #756a61;
          margin-top: 2px;
        }
        .card-body {
          padding: 13px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .badge, .pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 1px solid #e2d3c4;
          background: #fffdf9;
          border-radius: 999px;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 760;
          color: #514941;
          white-space: nowrap;
        }
        .badge.green {
          background: #edf6f1;
          border-color: #cbe4d9;
          color: #23624f;
        }
        .badge.amber {
          background: #fbf0d8;
          border-color: #ead59c;
          color: #755308;
        }
        .badge.orange {
          background: #fff0e8;
          border-color: #ecc0ae;
          color: #94402a;
        }
        .badge.red {
          background: #fff2ec;
          border-color: #efc2b7;
          color: #8c3125;
        }
        .mini-list {
          display: grid;
          gap: 7px;
          width: 100%;
        }
        .mini-row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 8px;
          align-items: center;
          border: 1px solid #e2d3c4;
          border-radius: 10px;
          padding: 8px;
          background: #fffdf9;
        }
        .mini-row.hot {
          background: #fff4ee;
          border-color: #e2aa93;
        }
        .mini-row.green {
          background: #f2faf6;
          border-color: #c1ddce;
        }
        .mini-row.amber {
          background: #fff8e6;
          border-color: #ddc07e;
        }
        .mini-num {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #756a61;
          font-weight: 780;
        }
        .mini-main {
          min-width: 0;
        }
        .mini-title {
          font-weight: 740;
          color: #211b16;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
        }
        .mini-sub {
          font-size: 11px;
          color: #756a61;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .progress {
          height: 9px;
          border-radius: 999px;
          background: #f2e7dc;
          overflow: hidden;
          width: 100%;
        }
        .bar {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #2f8066, #93bd5e);
        }
        .calendar {
          display: grid;
          border: 1px solid #e2d3c4;
          border-radius: 14px;
          overflow: hidden;
          background: #fffdf9;
          width: 100%;
        }
        .cal-head, .cal-row {
          display: grid;
          grid-template-columns: 76px repeat(4, minmax(160px, 1fr));
        }
        .cal-head > div {
          padding: 10px;
          border-right: 1px solid #e2d3c4;
          background: #fff7ef;
          font-weight: 800;
          color: #211b16;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cal-row > div {
          min-height: 86px;
          border-top: 1px solid #e2d3c4;
          border-right: 1px solid #e2d3c4;
          padding: 7px;
        }
        .time-cell {
          font-family: var(--font-mono);
          font-weight: 800;
          color: #756a61;
          background: #fffaf4 !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .slot {
          border: 1px solid #e2d3c4;
          border-radius: 10px;
          padding: 7px;
          background: #fffaf5;
          min-height: 64px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          height: 100%;
          width: 100%;
        }
        .slot.open {
          background: #f2faf6;
          border-color: #c1ddce;
        }
        .slot.booked {
          background: #fff4ee;
          border-color: #e2aa93;
        }
        .slot.warn {
          background: #fff8e6;
          border-color: #ddc07e;
        }
        .slot-title {
          font-weight: 800;
          color: #211b16;
          font-size: 12px;
        }
        .slot-sub {
          font-size: 11px;
          color: #756a61;
          margin-top: 2px;
        }
        .rail-card {
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 14px;
          box-shadow: 0 1px 0 rgba(49,36,24,.04);
          overflow: hidden;
          width: 100%;
        }
        .rail-head {
          padding: 13px;
          border-bottom: 1px solid #e2d3c4;
          background: #fffdf9;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }
        .rail-title {
          font-weight: 800;
          color: #211b16;
          font-size: 14px;
        }
        .rail-sub {
          font-size: 12px;
          color: #756a61;
          margin-top: 2px;
        }
        .rail-body {
          padding: 13px;
          display: grid;
          gap: 10px;
        }
        .action-panel {
          background: linear-gradient(180deg, #fffaf5, #fff1e8);
          border: 1px solid #e3b197;
          border-radius: 13px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .big-action {
          font-size: 17px;
          font-weight: 850;
          color: #211b16;
          letter-spacing: -.025em;
        }
        .action-note {
          font-size: 12px;
          color: #756a61;
          margin: 4px 0 10px;
          line-height: 1.35;
        }
        .toast {
          position: fixed;
          right: 24px;
          bottom: 22px;
          background: #211b16;
          color: white;
          border-radius: 10px;
          padding: 10px 12px;
          box-shadow: 0 14px 30px rgba(0,0,0,.16);
          font-weight: 560;
          transform: translateY(16px);
          opacity: 0;
          pointer-events: none;
          transition: .18s ease;
          z-index: 50;
        }
        .toast.show {
          transform: translateY(0);
          opacity: 1;
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
        }
        .modal-content {
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 16px;
          max-width: 440px;
          width: 90%;
          padding: 20px;
          box-shadow: 0 20px 60px rgba(33,27,22,0.18);
        }
      ` }} />

      {/* Main layout grid - 2 Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 w-full items-start">
        {/* Left Side: Overview content */}
        <div className="flex flex-col gap-3 min-w-0">
          
          {/* Page Head */}
          <section className="page-head flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 mb-2">
            <div>
              <div className="live-eyebrow">Pickle Pulse</div>
              <h1>Admin radar</h1>
              <div className="subline">Manager dashboard; not just a revenue table, but the answers to what to watch in the club today.</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-small" onClick={() => notify("Dashboard metrics refreshed")}>
                Refresh
              </button>
              <button className="btn btn-primary btn-small" onClick={() => setShowAddReservationModal(true)}>
                Add Reservation
              </button>
            </div>
          </section>

          {/* Metrics Strip */}
          <section className="metrics">
            <div className="metric">
              <strong>₺18.4k</strong>
              <span>Today</span>
            </div>
            <div className="metric">
              <strong>82%</strong>
              <span>Occupancy</span>
            </div>
            <div className="metric">
              <strong>{paymentRisk}</strong>
              <span>Payment risk</span>
            </div>
            <div className="metric">
              <strong>Online</strong>
              <span>TV</span>
            </div>
          </section>

          {/* Priority Highlights Strip */}
          <section className="strip">
            {priorities.map(p => (
              <article key={p.id} className={`priority ${p.type}`}>
                <div className="min-w-0">
                  <div className="kicker">
                    <span className="dot" />
                    {p.kicker}
                  </div>
                  <div className="p-title">{p.title}</div>
                  <div className="p-copy">{p.copy}</div>
                </div>
                <button className="btn btn-small btn-primary" onClick={() => handlePriorityAction(p.id, p.action)}>
                  {p.action}
                </button>
              </article>
            ))}
            {priorities.length === 0 && (
              <div className="col-span-3 text-center py-2 text-xs text-[#23624f] bg-[#f4fbf7] border border-[#bddbcc] rounded-[10px]">
                🎉 All alerts resolved! Club is operating at maximum flow.
              </div>
            )}
          </section>

          {/* Card Grid */}
          <section className="grid-layout">
            
            {/* Card 1: Today Radar list */}
            <article className="card">
              <div className="card-head">
                <div>
                  <div className="card-title">Today radar</div>
                  <div className="card-sub">Attention map</div>
                </div>
                <span className="badge orange">{priorities.length} items</span>
              </div>
              <div className="card-body">
                <div className="mini-list">
                  {priorities.map(p => (
                    <div key={p.id} className={`mini-row ${p.type}`}>
                      <span className="mini-num">
                        {p.action === "Collect" ? "PAY" : p.action === "Review" ? "CAP" : "OPS"}
                      </span>
                      <div className="mini-main">
                        <div className="mini-title">{p.title}</div>
                        <div className="mini-sub">{p.copy}</div>
                      </div>
                      <button className="btn btn-primary btn-small" onClick={() => handlePriorityAction(p.id, p.action)}>
                        {p.action}
                      </button>
                    </div>
                  ))}
                  {priorities.length === 0 && (
                    <div className="text-center py-4 text-xs text-[#756a61] font-semibold">
                      Radar fully clear.
                    </div>
                  )}
                </div>
              </div>
            </article>

            {/* Card 2: Revenue Pulse */}
            <article className="card justify-between">
              <div className="card-head">
                <div>
                  <div className="card-title">Revenue pulse</div>
                  <div className="card-sub">Today so far</div>
                </div>
              </div>
              <div className="card-body py-5 flex flex-col justify-center">
                <h1 className="text-3xl font-black text-[#211b16] mb-2">₺18,420</h1>
                <div className="progress mb-2">
                  <div className="bar" style={{ width: "81%" }} />
                </div>
                <p className="card-sub">81% of target before evening rush.</p>
              </div>
            </article>
          </section>

          {/* Calendar Section */}
          <div className="w-full overflow-x-auto scrollbar-thin pb-2">
            <section className="calendar min-w-[720px] mt-2">
              <div className="cal-head">
                <div>Time</div>
                <div>Court 1</div>
                <div>Court 2</div>
                <div>Court 3</div>
                <div>Court 4</div>
              </div>
              <div className="cal-row">
                <div className="time-cell">18:00</div>
                <div>
                  <div className={`slot ${slotStatus.court1?.status || "booked"}`}>
                    <div className="slot-title">{slotStatus.court1?.title || "Doubles"}</div>
                    <div className="slot-sub">{slotStatus.court1?.sub || "paid"}</div>
                  </div>
                </div>
                <div>
                  <div className={`slot ${slotStatus.court2?.status || "warn"}`}>
                    <div className="slot-title">{slotStatus.court2?.title || "Pending split"}</div>
                    <div className="slot-sub">{slotStatus.court2?.sub || "1 unpaid"}</div>
                  </div>
                </div>
                <div>
                  <div className={`slot ${slotStatus.court3?.status || "booked"}`}>
                    <div className="slot-title">{slotStatus.court3?.title || "Open play"}</div>
                    <div className="slot-sub">{slotStatus.court3?.sub || "10/12"}</div>
                  </div>
                </div>
                <div>
                  <div className={`slot ${slotStatus.court4?.status || "open"}`}>
                    <div className="slot-title">{slotStatus.court4?.title || "Open"}</div>
                    <div className="slot-sub">{slotStatus.court4?.sub || "call queue"}</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Right Side: Right Rail */}
        <div className="right-rail">
          <section className="rail-card">
            <header className="rail-head">
              <div>
                <div className="rail-title font-extrabold">Next action</div>
                <div className="rail-sub">What staff should do now</div>
              </div>
              {!nextAction.resolved ? (
                <span className="badge orange">NOW</span>
              ) : (
                <span className="badge" style={{ background: "#edf3f5", border: "1px solid #cad9df", color: "#435f6f" }}>DONE</span>
              )}
            </header>
            <div className="rail-body">
              <div className="action-panel">
                <div className="big-action font-black">{nextAction.title}</div>
                <div className="action-note font-medium text-xs">
                  {nextAction.note}
                </div>
                <div className="flex gap-2">
                  <button 
                    disabled={nextAction.resolved}
                    className="btn btn-primary btn-small flex-1" 
                    onClick={handleRunNextAction}
                  >
                    Run action
                  </button>
                  <button 
                    className="btn btn-small flex-1" 
                    onClick={() => notify(nextAction.resolved ? "No pending actions" : "Pending split details: Court 2 at 18:00")}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile Floating Action Button - ADM-004 */}
      <button 
        className="fixed bottom-6 right-6 md:hidden w-12 h-12 rounded-full bg-[#d95b35] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-40 text-2xl font-bold"
        onClick={() => setShowAddReservationModal(true)}
      >
        +
      </button>

      {/* Lobby TV Settings Modal - ADM-001 */}
      {showTvModal && (
        <div className="modal-backdrop" onClick={() => setShowTvModal(false)}>
          <div className="modal-content text-left max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-sm font-extrabold text-[#211b16]">Lobby TV Settings</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg leading-none" onClick={() => setShowTvModal(false)}>×</button>
            </div>
            <div className="space-y-3 text-[11px]">
              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Active Session</label>
                <select 
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                  value={tvSession}
                  onChange={e => setTvSession(e.target.value)}
                >
                  <option value="Weekly Prime Open Play">Weekly Prime Open Play (Court 1, 2)</option>
                  <option value="Advanced Doubles Clinic">Advanced Doubles Clinic (Coach Ken)</option>
                  <option value="Sunset Ladder Cup">Sunset Ladder Cup (Group B)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Timer Mode</label>
                  <select 
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                    value={tvTimerMode}
                    onChange={e => setTvTimerMode(e.target.value)}
                  >
                    <option value="countdown">Countdown</option>
                    <option value="elapsed">Elapsed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Timer Visibility</label>
                  <select 
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                    value={tvTimerVisibility}
                    onChange={e => setTvTimerVisibility(e.target.value)}
                  >
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Marquee Text (Max 140 chars)</label>
                <textarea 
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16] h-16 resize-none"
                  value={tvMarquee}
                  onChange={e => setTvMarquee(e.target.value)}
                />
                <span className={cx("text-[8px] block text-right mt-0.5", tvMarquee.length > 140 ? "text-[#d95b35] font-bold" : "text-[#756a61]")}>
                  {tvMarquee.length} / 140 chars
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Priority</label>
                  <select 
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                    value={tvAnnouncementPriority}
                    onChange={e => setTvAnnouncementPriority(e.target.value)}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Refresh Interval</label>
                  <input 
                    type="number"
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                    value={tvRefreshInterval}
                    onChange={e => setTvRefreshInterval(Number(e.target.value))}
                    min={5}
                    max={60}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input 
                  type="checkbox"
                  id="tvSponsor"
                  checked={tvSponsorToggle}
                  onChange={e => setTvSponsorToggle(e.target.checked)}
                  className="rounded border-[#e2d3c4]"
                />
                <label htmlFor="tvSponsor" className="text-[11px] font-bold text-[#211b16] select-none">Show Sponsor Banners</label>
              </div>

              {/* Preview Panel */}
              <div className="bg-[#0B1512] rounded-[10px] p-3 text-white border border-white/5 space-y-1">
                <div className="flex justify-between items-center text-[8px] text-white/40 uppercase font-black border-b border-white/5 pb-1">
                  <span>Lobby Preview</span>
                  <span className="text-[#9CFF00]">Active</span>
                </div>
                <div className="text-[10px] font-bold text-white/90 truncate">{tvSession}</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold">{tvTimerMode === 'countdown' ? '14:22 left' : '45:38 elapsed'}</span>
                  {tvSponsorToggle && <span className="bg-[#9CFF00]/10 text-[#9CFF00] text-[8px] px-1.5 rounded border border-[#9CFF00]/20 font-black">Sponsor On</span>}
                </div>
                <div className="bg-[#141E1A] p-1.5 rounded text-[8px] text-white/60 truncate font-mono mt-1">
                  {tvMarquee}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#e2d3c4] justify-end">
                <button type="button" className="btn btn-small" onClick={() => setShowTvModal(false)}>Cancel</button>
                <button type="button" className="btn btn-small btn-primary" onClick={executeSaveTvSettings}>Save TV Settings</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Capacity Review Modal - ADM-002 */}
      {showCapacityModal && (
        <div className="modal-backdrop" onClick={() => setShowCapacityModal(false)}>
          <div className="modal-content text-left max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-sm font-extrabold text-[#211b16]">Today&apos;s Capacity Review</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg leading-none" onClick={() => setShowCapacityModal(false)}>×</button>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Select Review Date</label>
                <input 
                  type="date"
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                  value={capacityDate}
                  onChange={e => setCapacityDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#fffdf9] border border-[#e2d3c4] p-2.5 rounded-[10px]">
                  <span className="block text-[9px] text-[#756a61] uppercase font-bold">Occupancy Rate</span>
                  <strong className="block text-sm text-[#211b16] mt-0.5">82% occupied</strong>
                </div>
                <div className="bg-[#fffdf9] border border-[#e2d3c4] p-2.5 rounded-[10px]">
                  <span className="block text-[9px] text-[#756a61] uppercase font-bold">Active Players</span>
                  <strong className="block text-sm text-[#211b16] mt-0.5">24 checked-in</strong>
                </div>
                <div className="bg-[#fffdf9] border border-[#e2d3c4] p-2.5 rounded-[10px]">
                  <span className="block text-[9px] text-[#756a61] uppercase font-bold">Idle Slots</span>
                  <strong className="block text-sm text-[#211b16] mt-0.5">2 slots open</strong>
                </div>
                <div className="bg-[#fffdf9] border border-[#e2d3c4] p-2.5 rounded-[10px]">
                  <span className="block text-[9px] text-[#756a61] uppercase font-bold">Waitlist Queue</span>
                  <strong className="block text-sm text-[#d95b35] mt-0.5">4 groups waiting</strong>
                </div>
              </div>

              <div className="bg-[#fff8e8] border border-[#e1c486] p-3 rounded-[10px] space-y-1">
                <span className="text-[10px] font-black uppercase text-[#a97619] tracking-wider block">Utilization Flags</span>
                <p className="text-[11px] text-[#756a61] leading-relaxed">
                  Peak demand detected between 18:00 - 20:00. Court 4 is idle. Recommend calling FIFO waitlist.
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#e2d3c4] justify-end">
                <button type="button" className="btn btn-small" onClick={() => setShowCapacityModal(false)}>Close</button>
                <button type="button" className="btn btn-small" onClick={() => {
                  window.location.href = `/${clubSlug}/admin/bookings`;
                }}>Open Bookings</button>
                <button type="button" className="btn btn-small btn-primary" onClick={executeRefreshCapacity}>Refresh Review</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collect Split Payments Modal - ADM-003 */}
      {showCollectModal && (
        <div className="modal-backdrop" onClick={() => setShowCollectModal(false)}>
          <div className="modal-content text-left max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-sm font-extrabold text-[#211b16]">Collect Split Payments</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg leading-none" onClick={() => setShowCollectModal(false)}>×</button>
            </div>
            
            {!showDeskPayConfirm ? (
              <div className="space-y-3 text-xs">
                <p className="text-[#756a61] font-semibold">
                  Review unpaid shares for Court 2 doubles slot at 18:00.
                </p>

                <div className="border border-[#e2d3c4] rounded-[10px] overflow-hidden bg-[#fffdf9]">
                  <div className="bg-[#fff7ef] p-2 border-b border-[#e2d3c4] flex items-center justify-between text-[9px] font-black uppercase text-[#211b16]">
                    <span>Player / Split Invoice</span>
                    <span>Amount</span>
                  </div>
                  <div className="divide-y divide-[#e2d3c4]">
                    {unpaidShares.map(share => (
                      <div key={share.id} className="p-2.5 flex items-center justify-between hover:bg-[#fffcf8]">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox"
                            checked={share.selected}
                            onChange={() => {
                              setUnpaidShares(prev => prev.map(s => s.id === share.id ? { ...s, selected: !s.selected } : s));
                            }}
                            className="rounded border-[#e2d3c4]"
                          />
                          <div>
                            <span className="font-bold text-[#211b16]">{share.name}</span>
                            <span className="block text-[9px] text-[#756a61] mt-0.5">{share.booking} · Due: {share.due}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-[#d95b35]">₺{share.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Reminder Channel</label>
                    <select 
                      className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                      value={reminderChannel}
                      onChange={e => setReminderChannel(e.target.value)}
                    >
                      <option value="SMS">SMS Message</option>
                      <option value="Email">Email Message</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Manual Method</label>
                    <select 
                      className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                    >
                      <option value="POS Terminal (Beko)">POS Terminal (Beko)</option>
                      <option value="Cash Drawer">Cash Drawer</option>
                      <option value="Prepaid Account Tab">Prepaid Account Tab</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#e2d3c4] justify-end">
                  <button type="button" className="btn btn-small" onClick={() => setShowCollectModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-small" onClick={() => setShowDeskPayConfirm(true)}>Mark Desk Paid</button>
                  <button type="button" className="btn btn-small btn-primary" onClick={executeSendPaymentReminder}>Send Reminder</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-[#fff2ec] border border-[#efc2b7] p-3 rounded-[10px] text-[#8c3125]">
                  <span className="font-black uppercase text-[9px] tracking-wider block mb-1">Desk Over-ride Payment Warning</span>
                  <p className="leading-relaxed text-[11px]">
                    This action bypasses the online checkout hold. You are marking the selected split invoice shares as **PAID** manually.
                  </p>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Reason for desk payment override</label>
                  <input 
                    type="text"
                    placeholder="e.g. Paid cash at front desk"
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                    value={deskPayReason}
                    onChange={e => setDeskPayReason(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#e2d3c4] justify-end">
                  <button type="button" className="btn btn-small" onClick={() => setShowDeskPayConfirm(false)}>Back</button>
                  <button type="button" className="btn btn-small btn-primary" onClick={executeForcePay}>Confirm Desk Paid</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Reservation Modal - ADM-004 */}
      {showAddReservationModal && (
        <div className="modal-backdrop" onClick={() => setShowAddReservationModal(false)}>
          <div className="modal-content text-left max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-sm font-extrabold text-[#211b16]">Quick Reservation / Block</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg leading-none" onClick={() => setShowAddReservationModal(false)}>×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Court</label>
                  <select 
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                    value={reserveCourt}
                    onChange={e => setReserveCourt(e.target.value)}
                  >
                    <option value="Court 1">Court 1 (West)</option>
                    <option value="Court 2">Court 2 (East)</option>
                    <option value="Court 3">Court 3 (South)</option>
                    <option value="Court 4">Court 4 (North)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Booking Type</label>
                  <select 
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                    value={reserveType}
                    onChange={e => setReserveType(e.target.value)}
                  >
                    <option value="Member Booking">Member Booking</option>
                    <option value="Guest Booking">Guest Booking</option>
                    <option value="Court Block">Court Block (Maintenance)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Date</label>
                  <input 
                    type="date"
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                    value={reserveDate}
                    onChange={e => setReserveDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Time</label>
                  <select 
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                    value={reserveTime}
                    onChange={e => setReserveTime(e.target.value)}
                  >
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                  </select>
                </div>
              </div>

              {reserveType !== "Court Block" && (
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Player / Member Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Kadir A."
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                    value={reserveName}
                    onChange={e => setReserveName(e.target.value)}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Duration (Min)</label>
                  <select 
                    className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16]"
                    value={reserveDuration}
                    onChange={e => setReserveDuration(e.target.value)}
                  >
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Override Conflict</label>
                  <select className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16] opacity-60">
                    <option value="no">Strict check</option>
                    <option value="yes">Allow override</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-[#756a61] mb-1">Internal Notes</label>
                <textarea 
                  className="w-full border border-[#e2d3c4] rounded-[8px] p-2 bg-[#fffdf9] text-xs font-medium text-[#211b16] h-12 resize-none"
                  value={reserveNotes}
                  onChange={e => setReserveNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#e2d3c4] justify-end">
                <button type="button" className="btn btn-small" onClick={() => setShowAddReservationModal(false)}>Cancel</button>
                <button type="button" className="btn btn-small btn-primary" onClick={() => executeCreateReservation(reserveType === "Court Block")}>
                  {reserveType === "Court Block" ? "Block Court" : "Create Reservation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className={cx("toast", showToast && "show")}>{toastMessage}</div>
    </div>
  );
}
