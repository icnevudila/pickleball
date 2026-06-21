"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { cx } from "@/lib/utils";

interface SlotItem {
  title: string;
  sub: string;
  status: string;
}

interface CalendarRow {
  time: string;
  court1: SlotItem;
  court2: SlotItem;
  court3: SlotItem;
  court4: SlotItem;
}

export default function AdminBookingsPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  const router = useRouter();
  const searchParams = useSearchParams();
  const filterStatus = searchParams?.get("status") || "active";

  const logBookAudit = (actionType: string, details: string) => {
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

  const handleFilterStatusChange = (status: string) => {
    logBookAudit("calendar.filter_changed", `Filter status changed to ${status}`);
    router.push(`/${clubSlug}/admin/bookings?status=${status}`);
  };

  // State Management
  const [slots, setSlots] = React.useState<CalendarRow[]>([]);
  const [priorities, setPriorities] = React.useState([
    { id: "p1", type: "hot", kicker: "Payment risk", title: "Court 2 split pending", copy: "Collect before check-in", buttonText: "Collect" },
    { id: "p2", type: "green", kicker: "Open slot", title: "Court 4 is available", copy: "Use for walk-in hold", buttonText: "Hold" },
    { id: "p3", type: "amber", kicker: "Deposit", title: "Corporate group missing deposit", copy: "Call contact", buttonText: "Call" }
  ]);
  const [nextAction, setNextAction] = React.useState<any>({
    title: "Collect Court 2 split",
    note: "Selected booking should expose payment, check-in, move, cancel, and TV announcement actions."
  });

  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);
  
  // Modals state
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showCollectModal, setShowCollectModal] = React.useState(false);
  const [showCallModal, setShowCallModal] = React.useState(false);
  const [showHoldModal, setShowHoldModal] = React.useState(false);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null);

  const [formData, setFormData] = React.useState({
    hostName: "",
    time: "20:00",
    court: "court4",
    type: "Private lesson",
    status: "booked", 
    subText: "paid"
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  // Initializing slots and merging localStorage bookings
  const loadSlotsData = () => {
    if (filterStatus === "cancelled") {
      const baseCancelled = [
        { time: "18:00", court1: { title: "Open", sub: "available", status: "open" }, court2: { title: "Open", sub: "available", status: "open" }, court3: { title: "Open", sub: "available", status: "open" }, court4: { title: "Open", sub: "available", status: "open" } },
        { time: "19:00", court1: { title: "Open", sub: "available", status: "open" }, court2: { title: "Open", sub: "available", status: "open" }, court3: { title: "Open", sub: "available", status: "open" }, court4: { title: "Open", sub: "available", status: "open" } },
        { time: "20:00", court1: { title: "Open", sub: "available", status: "open" }, court2: { title: "Open", sub: "available", status: "open" }, court3: { title: "Open", sub: "available", status: "open" }, court4: { title: "Open", sub: "available", status: "open" } },
      ];
      if (typeof window !== "undefined") {
        const cancelledKey = `pickle_cancelled_bookings_${clubSlug}`;
        const saved = localStorage.getItem(cancelledKey);
        if (saved) {
          try {
            const list = JSON.parse(saved);
            list.forEach((c: any) => {
              const row = baseCancelled.find(r => r.time === c.time);
              if (row) {
                const key = c.court as keyof typeof row;
                if (row[key]) {
                  (row[key] as any) = {
                    title: `${c.hostName} (Cancelled)`,
                    sub: "cancelled · refund ready",
                    status: "warn"
                  };
                }
              }
            });
          } catch (e) {
            console.error(e);
          }
        }
      }
      setSlots(baseCancelled);
      return;
    }

    const base = [
      { time: "18:00", court1: { title: "Alex / Daniel", sub: "paid · checked-in", status: "booked" }, court2: { title: "Ali / Mert", sub: "split pending", status: "warn" }, court3: { title: "Open Play", sub: "10/12 booked", status: "booked" }, court4: { title: "Open", sub: "walk-in hold available", status: "open" } },
      { time: "19:00", court1: { title: "Corporate group", sub: "deposit missing", status: "warn" }, court2: { title: "Mixed doubles", sub: "paid", status: "booked" }, court3: { title: "Open", sub: "best slot", status: "open" }, court4: { title: "Private lesson", sub: "coach Ece", status: "booked" } },
      { time: "20:00", court1: { title: "Open", sub: "available", status: "open" }, court2: { title: "Open Play", sub: "8/12 booked", status: "booked" }, court3: { title: "Open", sub: "available", status: "open" }, court4: { title: "Open", sub: "available", status: "open" } },
    ];

    if (typeof window !== "undefined") {
      const bookingsKey = `pickle_bookings_${clubSlug}`;
      const saved = localStorage.getItem(bookingsKey);
      if (saved) {
        try {
          const bookingsList = JSON.parse(saved);
          bookingsList.forEach((b: any) => {
            const timeVal = b.timeLabel ? b.timeLabel.split(" ")[0] : "20:00";
            let courtKey = "court4";
            if (b.courtCode) {
              const num = b.courtCode.replace(/\D/g, "");
              courtKey = `court${num}`;
            } else if (b.court) {
              const num = b.court.replace(/\D/g, "");
              courtKey = `court${num}`;
            }

            const row = base.find(r => r.time === timeVal);
            if (row) {
              const key = courtKey as keyof typeof row;
              if (row[key] && typeof row[key] === "object") {
                (row[key] as any) = {
                  title: b.hostName || "Online Player",
                  sub: b.paymentMode ? `paid · ${b.paymentMode.toLowerCase()}` : "paid · online",
                  status: "booked"
                };
              }
            }
          });
        } catch (e) {
          console.error("Error loading localStorage bookings", e);
        }
      }
    }
    setSlots(base);
  };

  React.useEffect(() => {
    loadSlotsData();
  }, [clubSlug, filterStatus]);

  // Priority Actions
  const executeCollect = () => {
    setSlots(prev => prev.map(row => {
      if (row.time === "18:00") {
        return {
          ...row,
          court2: { title: "Ali / Mert", sub: "paid · split resolved", status: "booked" }
        };
      }
      return row;
    }));
    setPriorities(prev => prev.filter(p => p.id !== "p1"));
    if (nextAction && nextAction.title.includes("Court 2")) {
      setNextAction({
        title: "None pending",
        note: "All operational check-ins and payments are clear.",
        resolved: true
      });
    }
    setShowCollectModal(false);
    logBookAudit("split_payment.force_paid", "Forced pay on Court 2 split payment");
    triggerToast("Payment split collected for Court 2");
  };

  const executeCall = () => {
    setSlots(prev => prev.map(row => {
      if (row.time === "19:00") {
        return {
          ...row,
          court1: { title: "Corporate group", sub: "deposit paid", status: "booked" }
        };
      }
      return row;
    }));
    setPriorities(prev => prev.filter(p => p.id !== "p3"));
    setShowCallModal(false);
    logBookAudit("booking.deposit_confirmed", "Corporate group deposit confirmed via manual desk call");
    triggerToast("Deposit confirmed for Corporate group");
  };

  const executeHold = () => {
    setSlots(prev => prev.map(row => {
      if (row.time === "18:00") {
        return {
          ...row,
          court4: { title: "Walk-in Hold", sub: "walk-in ready", status: "booked" }
        };
      }
      return row;
    }));
    setPriorities(prev => prev.filter(p => p.id !== "p2"));
    setShowHoldModal(false);
    logBookAudit("calendar.slot_action", "Created 30-min hold block on Court 4 at 18:00");
    triggerToast("Court 4 block created");
  };

  const handlePriorityAction = (id: string, actionType: string) => {
    if (actionType === "Collect") {
      setShowCollectModal(true);
    } else if (actionType === "Call") {
      setShowCallModal(true);
    } else if (actionType === "Hold") {
      setShowHoldModal(true);
    }
  };

  const handleRunNextAction = () => {
    if (nextAction.resolved) {
      triggerToast("No action pending");
      return;
    }
    setShowCollectModal(true);
  };

  const handleSlotClick = (time: string, court: string, slot: SlotItem) => {
    logBookAudit("calendar.slot_action", `Clicked slot: ${slot.title} on ${court} at ${time}`);
    if (slot.status === "open") {
      setFormData({
        hostName: "",
        time,
        court,
        type: "Private lesson",
        status: "booked",
        subText: "paid"
      });
      setShowAddModal(true);
    } else {
      setSelectedBooking({
        time,
        court,
        title: slot.title,
        sub: slot.sub,
        status: slot.status
      });
      setShowDetailsModal(true);
    }
  };

  const handleCheckIn = () => {
    if (!selectedBooking) return;
    setSlots(prev => prev.map(row => {
      if (row.time === selectedBooking.time) {
        const courtKey = selectedBooking.court as keyof CalendarRow;
        const currentSlot = row[courtKey] as SlotItem;
        return {
          ...row,
          [selectedBooking.court]: {
            ...currentSlot,
            sub: currentSlot.sub.includes("checked-in") ? currentSlot.sub : `${currentSlot.sub} · checked-in`
          }
        };
      }
      return row;
    }));
    logBookAudit("booking.checked_in", `Checked in player: ${selectedBooking.title} on ${selectedBooking.court} at ${selectedBooking.time}`);
    triggerToast("Player checked in.");
    setShowDetailsModal(false);
  };

  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    setSlots(prev => prev.map(row => {
      if (row.time === selectedBooking.time) {
        return {
          ...row,
          [selectedBooking.court]: {
            title: "Open",
            sub: "available",
            status: "open"
          }
        };
      }
      return row;
    }));

    if (typeof window !== "undefined") {
      const cancelledKey = `pickle_cancelled_bookings_${clubSlug}`;
      const saved = localStorage.getItem(cancelledKey);
      const currentList = saved ? JSON.parse(saved) : [];
      currentList.push({
        id: `bkg-${Date.now().toString().slice(-4)}`,
        hostName: selectedBooking.title,
        time: selectedBooking.time,
        court: selectedBooking.court,
        cancelledAt: new Date().toISOString()
      });
      localStorage.setItem(cancelledKey, JSON.stringify(currentList));
    }

    logBookAudit("booking.cancelled", `Cancelled booking: ${selectedBooking.title} on ${selectedBooking.court} at ${selectedBooking.time}`);
    triggerToast("Booking cancelled.");
    setShowDetailsModal(false);
  };

  const handleTvAnnounce = () => {
    if (!selectedBooking) return;
    logBookAudit("booking.tv_announced", `Announced booking: ${selectedBooking.title} on TV for ${selectedBooking.court} at ${selectedBooking.time}`);
    triggerToast("Announcement sent to Lobby TV.");
    setShowDetailsModal(false);
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hostName) {
      triggerToast("Host name is required");
      return;
    }

    setSlots(prev => prev.map(row => {
      if (row.time === formData.time) {
        return {
          ...row,
          [formData.court]: {
            title: formData.hostName,
            sub: formData.status === "warn" ? "split pending" : formData.subText || "paid",
            status: formData.status
          }
        };
      }
      return row;
    }));

    if (typeof window !== "undefined") {
      const bookingsKey = `pickle_bookings_${clubSlug}`;
      const saved = localStorage.getItem(bookingsKey);
      const currentList = saved ? JSON.parse(saved) : [];
      
      let courtCode = "C4";
      if (formData.court === "court1") courtCode = "C1";
      if (formData.court === "court2") courtCode = "C2";
      if (formData.court === "court3") courtCode = "C3";

      currentList.push({
        id: `bkg-${Date.now().toString().slice(-4)}`,
        hostName: formData.hostName,
        timeLabel: `${formData.time} – ${parseInt(formData.time) + 1}:00`,
        courtCode: courtCode,
        paymentMode: formData.status === "warn" ? "Split payment" : "Single payer",
        status: formData.status === "warn" ? "pending" : "confirmed"
      });
      localStorage.setItem(bookingsKey, JSON.stringify(currentList));
      window.dispatchEvent(new Event("storage"));
    }

    logBookAudit("booking.manual_created", `Created manual booking for ${formData.hostName} on ${formData.court} at ${formData.time}`);
    setShowAddModal(false);
    setFormData({
      hostName: "",
      time: "20:00",
      court: "court4",
      type: "Private lesson",
      status: "booked",
      subText: "paid"
    });
    triggerToast("Booking created. Confirmation is ready to send.");
  };

  const totalSlotsCount = slots.length * 4;
  const bookedSlotsCount = slots.reduce((acc, row) => {
    let count = 0;
    if (row.court1?.status === "booked" || row.court1?.status === "warn") count++;
    if (row.court2?.status === "booked" || row.court2?.status === "warn") count++;
    if (row.court3?.status === "booked" || row.court3?.status === "warn") count++;
    if (row.court4?.status === "booked" || row.court4?.status === "warn") count++;
    return acc + count;
  }, 0);
  const occupancyRate = totalSlotsCount ? Math.round((bookedSlotsCount / totalSlotsCount) * 100) : 0;
  const paymentRiskCount = priorities.filter(p => p.kicker === "Payment risk" || p.kicker === "Deposit").length;
  const walkInsCount = slots.reduce((acc, row) => {
    let count = 0;
    if (row.court1?.title === "Walk-in Hold") count++;
    if (row.court2?.title === "Walk-in Hold") count++;
    if (row.court3?.title === "Walk-in Hold") count++;
    if (row.court4?.title === "Walk-in Hold") count++;
    return acc + count;
  }, 4);

  return (
    <div className="flex flex-col gap-4 w-full">
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
        .btn-soft {
          background: #fff0e8;
          border-color: #ecc0ae;
          color: #9d3d25;
        }
        .btn-small {
          height: 29px;
          padding: 0 10px;
          font-size: 11px;
        }
        .calendar {
          display: grid;
          border: 1px solid #e2d3c4;
          border-radius: 14px;
          overflow: hidden;
          background: #fffdf9;
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
          width: 100%;
          height: 100%;
        }
        .slot.open {
          background: #f2faf6;
          border-color: #c1ddce;
          cursor: pointer;
        }
        .slot.open:hover {
          border-color: #2f8066;
          background: #ebf6f0;
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
        .grid-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
          gap: 12px;
          margin-top: 12px;
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
        }
        .mini-list {
          display: grid;
          gap: 7px;
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
        .mini-row.amber {
          background: #fff8e6;
          border-color: #ddc07e;
        }
        .mini-num {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #756a61;
          font-weight: 800;
          border: 1px solid #e2d3c4;
          border-radius: 4px;
          padding: 1px 4px;
          background: #fffaf4;
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
        }
        .mini-sub {
          font-size: 11px;
          color: #756a61;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
        .badge {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 800;
          line-height: 1;
          text-transform: uppercase;
        }
        .badge.orange {
          background: #fff0e8;
          border: 1px solid #ecc0ae;
          color: #d95b35;
        }
        .badge.red {
          background: #fff2ec;
          border: 1px solid #efc2b7;
          color: #8c3125;
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

      {/* Toast Notification */}
      <div className={`toast ${showToast ? "show" : ""}`}>
        {toastMessage}
      </div>

      {/* Main layout grid - 2 Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 w-full items-start">
        
        {/* Left Side: Calendar Board */}
        <div className="flex flex-col gap-3 min-w-0">
          
          {/* Page Head */}
          <section className="page-head flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 mb-2">
            <div>
              <div className="live-eyebrow">Pickle Pulse</div>
              <h1>Bookings calendar</h1>
              <div className="subline">Admin bookings board; calendar/court board, payment risk tracker, and guest check-in dashboard.</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-small" onClick={() => { loadSlotsData(); triggerToast("Calendar refreshed"); }}>
                Refresh
              </button>
              <button className="btn btn-primary btn-small" onClick={() => setShowAddModal(true)}>
                Add booking
              </button>
            </div>
          </section>

          {/* Metrics Strip */}
          <section className="metrics">
            <div className="metric">
              <strong>{32 + (bookedSlotsCount - 6)}</strong>
              <span>Bookings</span>
            </div>
            <div className="metric">
              <strong>{paymentRiskCount}</strong>
              <span>Payment risk</span>
            </div>
            <div className="metric">
              <strong>{walkInsCount}</strong>
              <span>Walk-ins</span>
            </div>
            <div className="metric">
              <strong>{occupancyRate}%</strong>
              <span>Occupancy</span>
            </div>
          </section>

          {/* Priority Alert Strip */}
          <section className="strip">
            {priorities.map(p => (
              <article key={p.id} className={`priority ${p.type}`}>
                <div style={{ minWidth: 0 }}>
                  <div className="kicker">
                    <span className="dot"></span>
                    {p.kicker}
                  </div>
                  <div className="p-title">{p.title}</div>
                  <div className="p-copy">{p.copy}</div>
                </div>
                <button
                  className={`btn btn-small ${p.type === "hot" ? "btn-primary" : ""}`}
                  onClick={() => handlePriorityAction(p.id, p.buttonText)}
                >
                  {p.buttonText}
                </button>
              </article>
            ))}
            {priorities.length === 0 && (
              <div className="col-span-3 text-center py-2 text-xs text-[#756a61] bg-[#f4fbf7] border border-[#bddbcc] rounded-[10px]">
                🎉 All priority alerts resolved!
              </div>
            )}
          </section>

          {/* Filter Tabs */}
          <div className="flex border-b border-[#e2d3c4] mb-1 gap-4">
            <button 
              className={cx("pb-2 px-1 font-bold text-xs border-b-2 transition-all", filterStatus === "active" ? "border-[#d95b35] text-[#d95b35]" : "border-transparent text-[#756a61] hover:text-[#211b16]")}
              onClick={() => handleFilterStatusChange("active")}
            >
              Active Bookings
            </button>
            <button 
              className={cx("pb-2 px-1 font-bold text-xs border-b-2 transition-all", filterStatus === "cancelled" ? "border-[#d95b35] text-[#d95b35]" : "border-transparent text-[#756a61] hover:text-[#211b16]")}
              onClick={() => handleFilterStatusChange("cancelled")}
            >
              Cancelled Bookings
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="w-full overflow-x-auto scrollbar-thin pb-2">
            <section className="calendar min-w-[720px]">
              <div className="cal-head">
                <div>Time</div>
                <div>Court 1</div>
                <div>Court 2</div>
                <div>Court 3</div>
                <div>Court 4</div>
              </div>
              
              {slots.map(row => (
                <div key={row.time} className="cal-row">
                  <div className="time-cell">{row.time}</div>
                  
                  {/* Court 1 */}
                  <div>
                    <button 
                      className={`slot ${row.court1.status}`}
                      onClick={() => handleSlotClick(row.time, "court1", row.court1)}
                    >
                      <div className="slot-title">{row.court1.title}</div>
                      <div className="slot-sub">{row.court1.sub}</div>
                    </button>
                  </div>

                  {/* Court 2 */}
                  <div>
                    <button 
                      className={`slot ${row.court2.status}`}
                      onClick={() => handleSlotClick(row.time, "court2", row.court2)}
                    >
                      <div className="slot-title">{row.court2.title}</div>
                      <div className="slot-sub">{row.court2.sub}</div>
                    </button>
                  </div>

                  {/* Court 3 */}
                  <div>
                    <button 
                      className={`slot ${row.court3.status}`}
                      onClick={() => handleSlotClick(row.time, "court3", row.court3)}
                    >
                      <div className="slot-title">{row.court3.title}</div>
                      <div className="slot-sub">{row.court3.sub}</div>
                    </button>
                  </div>

                  {/* Court 4 */}
                  <div>
                    <button 
                      className={`slot ${row.court4.status}`}
                      onClick={() => handleSlotClick(row.time, "court4", row.court4)}
                    >
                      <div className="slot-title">{row.court4.title}</div>
                      <div className="slot-sub">{row.court4.sub}</div>
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* Sub Grid Cards */}
          <section className="grid-cards">
            
            {/* Conflict Watch Card */}
            <article className="card">
              <div className="card-head">
                <div>
                  <div className="card-title">Conflict watch</div>
                  <div className="card-sub">Problem hunting, not table browsing</div>
                </div>
                {paymentRiskCount > 0 ? (
                  <span className="badge red">{paymentRiskCount}</span>
                ) : (
                  <span className="badge" style={{ background: "#edf6f1", border: "1px solid #bddbcc", color: "#23624f" }}>OK</span>
                )}
              </div>
              <div className="card-body">
                <div className="mini-list">
                  {priorities.filter(p => p.kicker === "Payment risk" || p.kicker === "Deposit").map(p => (
                    <div key={p.id} className={`mini-row ${p.type}`}>
                      <span className="mini-num">{p.kicker === "Payment risk" ? "PAY" : "DEP"}</span>
                      <div className="mini-main">
                        <div className="mini-title">{p.title}</div>
                        <div className="mini-sub">{p.copy}</div>
                      </div>
                      <button 
                        className="btn btn-small btn-primary" 
                        onClick={() => handlePriorityAction(p.id, p.buttonText)}
                      >
                        {p.buttonText}
                      </button>
                    </div>
                  ))}
                  {paymentRiskCount === 0 && (
                    <div className="text-center py-4 text-xs text-[#756a61] font-semibold">
                      No conflicts detected.
                    </div>
                  )}
                </div>
              </div>
            </article>

            {/* Walk-in hold fast card */}
            <article className="card">
              <div className="card-head">
                <div>
                  <div className="card-title">Walk-in hold</div>
                  <div className="card-sub">Fast add without breaking calendar</div>
                </div>
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p className="text-xs text-[#756a61] leading-relaxed font-semibold">
                  Quickly block Court 4 for walk-in players who are waiting in the lobby.
                </p>
                <button 
                  className="btn btn-primary" 
                  style={{ width: "100%" }}
                  onClick={() => setShowHoldModal(true)}
                >
                  Create 30-min hold on Court 4
                </button>
              </div>
            </article>

          </section>

        </div>

        {/* Right Side: Next Action Rail */}
        <aside className="w-full xl:w-[360px] sticky top-[80px]">
          <section className="rail-card">
            <div className="rail-head">
              <div>
                <div className="rail-title">Next action</div>
                <div className="rail-sub">What staff should do now</div>
              </div>
              {!nextAction.resolved ? (
                <span className="badge orange">NOW</span>
              ) : (
                <span className="badge" style={{ background: "#edf3f5", border: "1px solid #cad9df", color: "#435f6f" }}>DONE</span>
              )}
            </div>
            <div className="rail-body">
              <div className="action-panel">
                <div className="big-action">{nextAction.title}</div>
                <div className="action-note">{nextAction.note}</div>
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
                    className="btn btn-small" 
                    style={{ flex: 1 }}
                    onClick={() => triggerToast(nextAction.resolved ? "No details" : "Showing Court 2 booking details")}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </section>
        </aside>

      </div>

      {/* Add Booking Modal Dialog */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">New booking</h3>
              <button 
                className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" 
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddBooking} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-[#756a61]">Host Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tufan Y." 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]"
                  value={formData.hostName}
                  onChange={e => setFormData(prev => ({ ...prev, hostName: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#756a61]">Time</label>
                  <select 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]"
                    value={formData.time}
                    onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  >
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#756a61]">Court</label>
                  <select 
                    className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]"
                    value={formData.court}
                    onChange={e => setFormData(prev => ({ ...prev, court: e.target.value }))}
                  >
                    <option value="court1">Court 1</option>
                    <option value="court2">Court 2</option>
                    <option value="court3">Court 3</option>
                    <option value="court4">Court 4</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-[#756a61]">Booking Status</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]"
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="booked">Paid / Confirmed (Green)</option>
                  <option value="warn">Pending Split / Deposit (Amber)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-[#756a61]">Booking Subtitle</label>
                <input 
                  type="text" 
                  placeholder="e.g. paid · online" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]"
                  value={formData.subText}
                  onChange={e => setFormData(prev => ({ ...prev, subText: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  className="btn flex-1" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex-1"
                >
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Split Modal Dialog */}
      {showCollectModal && (
        <div className="modal-backdrop" onClick={() => setShowCollectModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Collect Split Payment</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowCollectModal(false)}>×</button>
            </div>
            <div className="text-left space-y-4 text-xs">
              <div className="bg-[#fff8e6] border border-[#ddc07e] rounded-[10px] p-3 text-[#755308]">
                <strong>Ali / Mert</strong> split reservation pending on <strong>Court 2 at 18:00</strong>.
              </div>
              <div className="flex justify-between border-b border-[#e2d3c4] pb-2">
                <span>Total Amount:</span>
                <span className="font-bold text-sm">₺600</span>
              </div>
              <div className="flex justify-between border-b border-[#e2d3c4] pb-2">
                <span>Remaining Split Balance:</span>
                <span className="font-bold text-sm text-[#9d3d25]">₺300 (1 player unpaid)</span>
              </div>
              
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="font-bold text-[#756a61]">Payment Method</label>
                <select className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]">
                  <option>POS Terminal (Beko)</option>
                  <option>Cash (Lira Box)</option>
                  <option>Player Wallet Balance</option>
                </select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button type="button" className="btn flex-1" onClick={() => setShowCollectModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary flex-1" onClick={executeCollect}>Confirm Payment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Organizer Modal Dialog */}
      {showCallModal && (
        <div className="modal-backdrop" onClick={() => setShowCallModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Contact Client</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowCallModal(false)}>×</button>
            </div>
            <div className="text-left space-y-4 text-xs">
              <div className="p-3 border border-[#e2d3c4] rounded-[10px] bg-[#fffdf9] space-y-2">
                <p><strong>Booking:</strong> Corporate group (Court 1 · 19:00)</p>
                <p><strong>Organizer Name:</strong> Ece Demir</p>
                <p><strong>Contact Phone:</strong> <span className="font-mono font-bold text-sm text-[#d95b35]">+90 532 987 65 43</span></p>
                <p className="text-[#756a61]">Alert: Deposit of ₺500 is missing for weekend corporate event block.</p>
              </div>

              <div className="bg-[#fff8e8] border border-[#e1c486] rounded-[10px] p-2.5 text-[#755308]">
                If you have called the organizer or received payment manually, you can confirm it below.
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowCallModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary flex-1" onClick={executeCall}>Mark Deposit Paid</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Walk-in Hold Modal Dialog */}
      {showHoldModal && (
        <div className="modal-backdrop" onClick={() => setShowHoldModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Create Walk-in Block</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowHoldModal(false)}>×</button>
            </div>
            <div className="text-left space-y-4 text-xs">
              <p className="text-[#756a61]">This creates a fast block on the calendar for reception walk-ins.</p>
              <div className="p-3 border border-[#e2d3c4] rounded-[10px] bg-[#f4fbf7] text-[#23624f]">
                <strong>Fast Hold:</strong> Court 4 at 18:00
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#756a61]">Duration</label>
                <select className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 text-xs outline-none focus:border-[#d95b35]">
                  <option>30 Minutes (Quick play)</option>
                  <option>60 Minutes (Standard slot)</option>
                  <option>90 Minutes (Peak duel)</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowHoldModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary flex-1" onClick={executeHold}>Confirm Block</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Sticky Bottom Bar for Mobile Next Action */}
      {!nextAction.resolved && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#211b16] text-[#fffaf4] p-3 flex items-center justify-between border-t border-[#d95b35] xl:hidden shadow-[0_-8px_20px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-2 duration-200">
          <div className="min-w-0 pr-2">
            <span className="text-[9px] text-[#ecc0ae] font-bold uppercase tracking-wider">Next Action</span>
            <div className="font-extrabold text-[12px] truncate">{nextAction.title}</div>
          </div>
          <button 
            className="btn btn-primary btn-small shrink-0"
            onClick={handleRunNextAction}
          >
            Run
          </button>
        </div>
      )}

      {/* Booking Details Modal Dialog */}
      {showDetailsModal && selectedBooking && (
        <div className="modal-backdrop" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Booking Details</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            <div className="text-left space-y-4 text-xs">
              <div className="p-3 border border-[#e2d3c4] rounded-[10px] bg-[#fffdf9] space-y-2">
                <p><strong>Host:</strong> {selectedBooking.title}</p>
                <p><strong>Time:</strong> {selectedBooking.time}</p>
                <p><strong>Court:</strong> {selectedBooking.court === "court1" ? "Court 1" : selectedBooking.court === "court2" ? "Court 2" : selectedBooking.court === "court3" ? "Court 3" : "Court 4"}</p>
                <p><strong>Details:</strong> {selectedBooking.sub}</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button type="button" className="btn btn-primary" onClick={handleCheckIn}>
                  Check In Player
                </button>
                <button type="button" className="btn btn-soft" onClick={handleTvAnnounce}>
                  TV Announcement
                </button>
                <button type="button" className="btn" style={{ borderColor: "#efc2b7", color: "#8c3125", background: "#fff2ec" }} onClick={handleCancelBooking}>
                  Cancel Booking
                </button>
                <button type="button" className="btn" onClick={() => setShowDetailsModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
