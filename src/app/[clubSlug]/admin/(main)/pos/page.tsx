"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  stock: number;
}

interface CartItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  qty: number;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  tier: string;
}

const defaultProducts: Product[] = [
  { id: "water", name: "Water", desc: "Cold bottle", price: 35, stock: 15 },
  { id: "grip", name: "Grip Tape", desc: "Black rubber", price: 180, stock: 3 },
  { id: "racket", name: "Racket Rental", desc: "Premium carbon", price: 250, stock: 5 },
  { id: "ball", name: "Pickleball Ball", desc: "Outdoor dura", price: 95, stock: 24 },
  { id: "coffee", name: "Coffee", desc: "Fresh espresso", price: 75, stock: 20 },
  { id: "towel", name: "Towel", desc: "Clean cotton", price: 120, stock: 2 },
];

const defaultMembers: Member[] = [
  { id: "m1", name: "Ali Düvenci", email: "ali@gmail.com", phone: "+90 532 111 22 33", balance: 1250, tier: "Gold" },
  { id: "m2", name: "Mert K.", email: "mert@gmail.com", phone: "+90 532 444 55 66", balance: 450, tier: "Silver" },
  { id: "m3", name: "Can Yilmaz", email: "can@example.com", phone: "+90 532 987 65 43", balance: 0, tier: "Bronze" },
];

export default function AdminPosPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);

  // Stateful Products and Cart
  const [inventory, setInventory] = React.useState<Product[]>(defaultProducts);
  const [cart, setCart] = React.useState<CartItem[]>([
    { id: "water", name: "Water", desc: "Cold bottle", price: 35, qty: 1 },
    { id: "grip", name: "Grip Tape", desc: "Black rubber", price: 180, qty: 1 },
  ]);

  // Modal States
  const [showCashModal, setShowCashModal] = React.useState(false);
  const [showChargeModal, setShowChargeModal] = React.useState(false);
  const [showSplitModal, setShowSplitModal] = React.useState(false);
  const [showOverrideModal, setShowOverrideModal] = React.useState(false);

  // Form States
  const [amountTendered, setAmountTendered] = React.useState<number>(0);
  const [cashierNote, setCashierNote] = React.useState("");
  const [printReceipt, setPrintReceipt] = React.useState(true);

  const [members, setMembers] = React.useState<Member[]>(defaultMembers);
  const [searchMemberQuery, setSearchMemberQuery] = React.useState("");
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [allowNegativeBalance, setAllowNegativeBalance] = React.useState(false);
  const [managerOverrideChecked, setManagerOverrideChecked] = React.useState(false);

  // Split States
  const [splitMethod, setSplitMethod] = React.useState<"equal" | "custom">("equal");
  const [splitPayers, setSplitPayers] = React.useState<Array<{ name: string; contact: string; amount: number }>>([
    { name: "Payer 1", contact: "", amount: 0 },
    { name: "Payer 2", contact: "", amount: 0 },
  ]);
  const [sendLinks, setSendLinks] = React.useState(true);

  // Pending item for inventory override
  const [pendingProduct, setPendingProduct] = React.useState<Product | null>(null);

  // Load members from CRM if available
  React.useEffect(() => {
    // Check if CRM has updated members
    // We can fallback to defaultMembers
  }, [clubSlug]);

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

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addToCart = (product: Product, overrideStock = false) => {
    // Inventory Guard
    const existingCartItem = cart.find((item) => item.id === product.id);
    const currentQtyInCart = existingCartItem ? existingCartItem.qty : 0;

    if (product.stock <= currentQtyInCart && !overrideStock) {
      setPendingProduct(product);
      setShowOverrideModal(true);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });

    logAudit("pos.cart_item_added", `Added ${product.name} to cashier cart`);
    triggerToast(`Added ${product.name} to cart.`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    triggerToast("Item removed from cart.");
  };

  const adjustQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // POS-002: Cash Checkout
  const handleCashCheckoutOpen = () => {
    if (cart.length === 0) return;
    setAmountTendered(total);
    setCashierNote("");
    setShowCashModal(true);
  };

  const handleCompleteCashSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountTendered < total) {
      triggerToast("Amount tendered must be equal to or greater than total due.");
      return;
    }

    // Decrement stock
    const updatedInventory = inventory.map((prod) => {
      const cartItem = cart.find((item) => item.id === prod.id);
      if (cartItem) {
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.qty) };
      }
      return prod;
    });

    setInventory(updatedInventory);
    logAudit("pos.cash_checkout_completed", `Cash checkout completed for ₺${total}. Note: ${cashierNote}`);
    triggerToast("Cash payment recorded. Receipt saved.");
    setCart([]);
    setShowCashModal(false);
  };

  // POS-003: Charge Account
  const handleChargeAccountOpen = () => {
    if (cart.length === 0) return;
    setSelectedMember(null);
    setSearchMemberQuery("");
    setAllowNegativeBalance(false);
    setManagerOverrideChecked(false);
    setShowChargeModal(true);
  };

  const handleChargeAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) {
      triggerToast("Please select a member.");
      return;
    }

    const hasSufficient = selectedMember.balance >= total;
    if (!hasSufficient && !managerOverrideChecked) {
      triggerToast("Member has insufficient balance. Manager override check is required.");
      return;
    }

    // Process charging
    const newBalance = selectedMember.balance - total;
    const updatedMembers = members.map((m) =>
      m.id === selectedMember.id ? { ...m, balance: newBalance } : m
    );

    setMembers(updatedMembers);

    // Decrement stock
    const updatedInventory = inventory.map((prod) => {
      const cartItem = cart.find((item) => item.id === prod.id);
      if (cartItem) {
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.qty) };
      }
      return prod;
    });

    setInventory(updatedInventory);
    logAudit(
      "pos.account_charged",
      `Charged ₺${total} to member ${selectedMember.name}. Remaining balance: ₺${newBalance}`
    );
    triggerToast(`Charged to member account. New balance is ₺${newBalance}.`);
    setCart([]);
    setShowChargeModal(false);
  };

  // POS-004: Split Splitter
  const handleSplitOpen = () => {
    if (cart.length === 0) return;
    const equalShare = parseFloat((total / 2).toFixed(2));
    setSplitPayers([
      { name: "Payer 1 (Ali)", contact: "+90 532 111 22 33", amount: equalShare },
      { name: "Payer 2 (Guest)", contact: "", amount: equalShare },
    ]);
    setSplitMethod("equal");
    setShowSplitModal(true);
  };

  const handleAddSplitPayer = () => {
    const nextIndex = splitPayers.length + 1;
    const updated = [...splitPayers, { name: `Payer ${nextIndex}`, contact: "", amount: 0 }];
    recalculateShares(updated, splitMethod);
  };

  const handleRemoveSplitPayer = (index: number) => {
    if (splitPayers.length <= 2) {
      triggerToast("Minimum 2 split payers required.");
      return;
    }
    const updated = splitPayers.filter((_, idx) => idx !== index);
    recalculateShares(updated, splitMethod);
  };

  const recalculateShares = (
    payers: typeof splitPayers,
    method: "equal" | "custom"
  ) => {
    if (method === "equal") {
      const share = parseFloat((total / payers.length).toFixed(2));
      const updated = payers.map((p, idx) => {
        // adjust last share for rounding
        if (idx === payers.length - 1) {
          const sumPrior = payers.slice(0, -1).reduce((sum, item) => sum + share, 0);
          return { ...p, amount: parseFloat((total - sumPrior).toFixed(2)) };
        }
        return { ...p, amount: share };
      });
      setSplitPayers(updated);
    } else {
      setSplitPayers(payers);
    }
  };

  const handleSplitPayerChange = (
    index: number,
    field: "name" | "contact" | "amount",
    value: string | number
  ) => {
    const updated = splitPayers.map((p, idx) => {
      if (idx === index) {
        return { ...p, [field]: value };
      }
      return p;
    });

    if (field === "amount") {
      setSplitPayers(updated);
    } else {
      recalculateShares(updated, splitMethod);
    }
  };

  const handleConfirmSplits = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (splitPayers.some((p) => !p.name.trim() || !p.contact.trim())) {
      triggerToast("All payers must have a name and contact detail (email or phone).");
      return;
    }

    const sum = splitPayers.reduce((acc, p) => acc + p.amount, 0);
    if (Math.abs(sum - total) > 0.05) {
      triggerToast(`Total of shares (₺${sum}) must equal cart total (₺${total}).`);
      return;
    }

    // Decrement stock
    const updatedInventory = inventory.map((prod) => {
      const cartItem = cart.find((item) => item.id === prod.id);
      if (cartItem) {
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.qty) };
      }
      return prod;
    });
    setInventory(updatedInventory);

    // Save split details to invoice shares database / localStorage if desired
    // For now, log audit and toast
    logAudit(
      "pos.split_invoices_created",
      `Created split invoices for cart total ₺${total} among ${splitPayers.length} payers.`
    );
    triggerToast("Split invoices created. Payment links are ready.");
    setCart([]);
    setShowSplitModal(false);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
      m.phone.includes(searchMemberQuery)
  );

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
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-[#e2d3c4] pb-5 mb-4">
        <div className="space-y-1 text-left">
          <div className="text-[11px] text-[#9d3d25] uppercase tracking-[0.07em] font-extrabold">Front desk</div>
          <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-[#211b16]">Touch POS</h1>
          <p className="text-sm text-[#756a61] mt-1.5">
            Cash register; large product selectors, inventory warnings, checkouts, and splitters.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-semibold"
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            Clear Cart
          </Button>
        </div>
      </section>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 items-start">
        
        {/* Left Side: Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {inventory.map((product) => {
            const outOfStock = product.stock <= 0;
            return (
              <button
                key={product.id}
                className={`bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] p-4 text-left shadow-[0_1px_0_rgba(49,36,24,0.04)] hover:bg-[#fff6ef] hover:border-[#c8ae9b] transition-all duration-150 flex flex-col justify-between min-h-[110px] group ${
                  outOfStock ? "opacity-60 border-dashed" : ""
                }`}
                onClick={() => addToCart(product)}
              >
                <div>
                  <h3 className="font-extrabold text-[15px] text-[#211b16] tracking-tight">
                    {product.name}
                  </h3>
                  <div className="text-[10px] text-slate-500 font-semibold mt-1">
                    Stock: {product.stock} units
                  </div>
                </div>
                <div className="flex justify-between items-baseline w-full mt-2">
                  <span className="text-[11px] text-[#756a61] font-semibold">{product.desc}</span>
                  <span className="font-mono text-base font-black text-[#d95b35]">₺{product.price}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Cart Sidebar */}
        <aside className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden text-left">
          <header className="p-3.5 border-b border-[#e2d3c4] bg-[#fffdf9] flex justify-between gap-2.5 items-center">
            <div>
              <h3 className="font-extrabold text-[14px] text-[#211b16] tracking-tight">Cart</h3>
              <p className="text-xs text-[#756a61] mt-0.5 font-semibold">Ready for desk checkout</p>
            </div>
            <Badge tone="brand" className="px-2.5 py-0.5 text-[11px] font-black">
              {cart.reduce((sum, item) => sum + item.qty, 0)} Items
            </Badge>
          </header>
          
          <div className="p-4 space-y-4">
            {/* Cart Items List */}
            <div className="space-y-2">
              {cart.length === 0 ? (
                <p className="text-xs text-[#756a61] italic text-center py-6">Cart is empty</p>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-2.5 items-center border border-[#e2d3c4] rounded-[10px] p-2 bg-[#fffdf9] text-xs">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        type="button" 
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
                        onClick={() => adjustQty(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="font-mono text-[11px] text-[#211b16] font-bold w-4 text-center">{item.qty}</span>
                      <button 
                        type="button" 
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
                        onClick={() => {
                          const prod = inventory.find((p) => p.id === item.id);
                          if (prod) addToCart(prod);
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-[#211b16] truncate">{item.name}</div>
                      <div className="text-[10px] text-[#756a61] truncate font-semibold">₺{item.price} each</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <b className="font-mono font-black text-[#211b16]">₺{item.price * item.qty}</b>
                      <button 
                        type="button" 
                        className="text-red-500 hover:text-red-700 font-bold text-[14px]"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total Section */}
            <div className="border-t border-[#e2d3c4] pt-4 mt-2">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-xs font-bold text-[#756a61] uppercase tracking-wide">Total Due</span>
                <span className="font-mono text-2xl font-black text-[#211b16]">₺{total}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  variant="primary"
                  className="w-full h-12 bg-[#d95b35] border-[#d95b35] hover:bg-[#c94f2f] text-white rounded-[9px] text-xs font-extrabold"
                  disabled={cart.length === 0}
                  onClick={handleChargeAccountOpen}
                >
                  Charge Member Account
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    className="h-10 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-bold"
                    disabled={cart.length === 0}
                    onClick={handleCashCheckoutOpen}
                  >
                    Cash Checkout
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-10 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-bold"
                    disabled={cart.length === 0}
                    onClick={handleSplitOpen}
                  >
                    Split Splitter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Cash Checkout Modal */}
      {showCashModal && (
        <div className="modal-backdrop" onClick={() => setShowCashModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Cash Checkout Payment</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowCashModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCompleteCashSale} className="space-y-4 text-xs">
              <div className="p-3 bg-[#f2faf6] border border-[#c1ddce] rounded-[10px] text-xs text-[#23624f]">
                <strong>Total Sale Due:</strong> <span className="font-mono font-bold">₺{total}</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Amount Tendered (Cash Received)</label>
                <input 
                  type="number" 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 font-mono text-base outline-none focus:border-[#d95b35]"
                  value={amountTendered}
                  onChange={(e) => setAmountTendered(parseInt(e.target.value) || 0)}
                  min={total}
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 border rounded-[10px] flex justify-between items-center text-xs">
                <span>Change Due:</span>
                <span className="font-mono text-lg font-black text-emerald-700">
                  ₺{Math.max(0, amountTendered - total)}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Cashier Sale Note</label>
                <input 
                  type="text" 
                  placeholder="e.g. Paid in desk cash drawer"
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={cashierNote}
                  onChange={(e) => setCashierNote(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="printReceipt" 
                  checked={printReceipt} 
                  onChange={(e) => setPrintReceipt(e.target.checked)}
                />
                <label htmlFor="printReceipt" className="font-bold text-[#756a61] cursor-pointer">Print receipt and log to transaction database</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowCashModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10">Complete Cash Sale</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Charge to Account Modal */}
      {showChargeModal && (
        <div className="modal-backdrop" onClick={() => setShowChargeModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Charge Member Account</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowChargeModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleChargeAccount} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Look Up Member (Name / Phone)</label>
                <input 
                  type="text" 
                  placeholder="Search member..."
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={searchMemberQuery}
                  onChange={(e) => setSearchMemberQuery(e.target.value)}
                />
              </div>

              {/* Members Selection List */}
              <div className="border border-[#e2d3c4] rounded-[10px] max-h-[150px] overflow-y-auto bg-white p-2 divide-y divide-slate-100">
                {filteredMembers.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`w-full text-left p-2 hover:bg-slate-50 flex justify-between items-center rounded ${
                      selectedMember?.id === m.id ? "bg-[#fff0e8]" : ""
                    }`}
                    onClick={() => setSelectedMember(m)}
                  >
                    <div>
                      <div className="font-bold">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.phone} · {m.tier} Tier</div>
                    </div>
                    <span className="font-mono font-bold text-slate-700">₺{m.balance}</span>
                  </button>
                ))}
                {filteredMembers.length === 0 && (
                  <div className="text-center py-4 text-slate-400 italic">No members found matching query</div>
                )}
              </div>

              {selectedMember && (
                <div className="p-3 rounded-[10px] border border-[#e2d3c4] bg-[#fffdf9] space-y-1">
                  <div className="font-bold text-slate-800">Selected: {selectedMember.name}</div>
                  <div className="flex justify-between">
                    <span>Wallet balance:</span>
                    <span className="font-mono font-bold text-emerald-700">₺{selectedMember.balance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total due:</span>
                    <span className="font-mono font-bold text-red-600">-₺{total}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-dashed">
                    <span>Projected balance:</span>
                    <span className={`font-mono font-bold ${selectedMember.balance - total >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                      ₺{selectedMember.balance - total}
                    </span>
                  </div>
                </div>
              )}

              {/* Insufficient Balance Override Guard */}
              {selectedMember && selectedMember.balance - total < 0 && (
                <div className="p-3 bg-[#fff8e6] border border-[#ead59c] rounded-[10px] space-y-2">
                  <p className="font-semibold text-[#755308]">
                    ⚠️ Wallet balance is insufficient. Charging this will result in a negative balance.
                  </p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="overrideCheck" 
                      checked={managerOverrideChecked}
                      onChange={(e) => setManagerOverrideChecked(e.target.checked)}
                    />
                    <label htmlFor="overrideCheck" className="font-bold text-red-800 cursor-pointer">Allow negative balance with manager override</label>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowChargeModal(false)}>Cancel</button>
                <button 
                  type="submit" 
                  disabled={!selectedMember || (selectedMember.balance - total < 0 && !managerOverrideChecked)}
                  className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10 disabled:opacity-50"
                >
                  Charge Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Split Splitter Modal */}
      {showSplitModal && (
        <div className="modal-backdrop" onClick={() => setShowSplitModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Split Splitter Group Invoices</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowSplitModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleConfirmSplits} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border rounded-[10px] flex justify-between items-center">
                <span>Total Cart Value:</span>
                <span className="font-mono text-base font-black text-slate-800">₺{total}</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Split Method</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={splitMethod}
                  onChange={(e) => {
                    const method = e.target.value as "equal" | "custom";
                    setSplitMethod(method);
                    recalculateShares(splitPayers, method);
                  }}
                >
                  <option value="equal">Split Equally</option>
                  <option value="custom">Split Custom Amounts</option>
                </select>
              </div>

              {/* Payers List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#756a61]">Payer List</label>
                  <button 
                    type="button" 
                    className="text-[#d95b35] hover:text-[#c94f2f] font-bold text-[11px]"
                    onClick={handleAddSplitPayer}
                  >
                    + Add Payer
                  </button>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {splitPayers.map((payer, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-[#fffdf9] p-2 border border-[#e2d3c4] rounded-[10px]">
                      <div className="flex-1 space-y-1.5">
                        <input 
                          type="text" 
                          placeholder={`Payer name ${idx + 1}`}
                          className="w-full h-8 border border-[#e2d3c4] rounded-md px-2 outline-none"
                          value={payer.name}
                          onChange={(e) => handleSplitPayerChange(idx, "name", e.target.value)}
                          required
                        />
                        <input 
                          type="text" 
                          placeholder="Phone / Email"
                          className="w-full h-8 border border-[#e2d3c4] rounded-md px-2 outline-none"
                          value={payer.contact}
                          onChange={(e) => handleSplitPayerChange(idx, "contact", e.target.value)}
                          required
                        />
                      </div>
                      <div className="w-[80px] shrink-0">
                        <input 
                          type="number" 
                          placeholder="Amount"
                          className="w-full h-8 border border-[#e2d3c4] rounded-md px-2 outline-none font-mono text-center"
                          value={payer.amount}
                          onChange={(e) => handleSplitPayerChange(idx, "amount", parseFloat(e.target.value) || 0)}
                          disabled={splitMethod === "equal"}
                          required
                        />
                      </div>
                      {splitPayers.length > 2 && (
                        <button 
                          type="button" 
                          className="text-red-500 hover:text-red-700 font-bold"
                          onClick={() => handleRemoveSplitPayer(idx)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="sendLinks" 
                  checked={sendLinks} 
                  onChange={(e) => setSendLinks(e.target.checked)}
                />
                <label htmlFor="sendLinks" className="font-bold text-[#756a61] cursor-pointer">Dispatch Stripe payment link notifications instantly</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowSplitModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10">Create Splits</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Override Warning Modal */}
      {showOverrideModal && pendingProduct && (
        <div className="modal-backdrop" onClick={() => setShowOverrideModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Inventory Warning</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowOverrideModal(false)}>×</button>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="bg-[#fff8e6] border border-[#ead59c] rounded-[10px] p-3 text-[#755308] font-semibold">
                ⚠️ Danger: "{pendingProduct.name}" is currently out of stock. Standard inventory tracking is active.
              </div>
              <p>
                Would you like to perform a cashier inventory override to add this item to the cart anyway? This action will be logged in the system audit logs.
              </p>
              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => { setPendingProduct(null); setShowOverrideModal(false); }}>Cancel</button>
                <button 
                  type="button" 
                  className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10"
                  onClick={() => {
                    if (pendingProduct) {
                      addToCart(pendingProduct, true);
                      setPendingProduct(null);
                    }
                    setShowOverrideModal(false);
                  }}
                >
                  Override and Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
