"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const products = [
  { id: "water", name: "Su (Water)", price: 35 },
  { id: "grip", name: "Grip Tape", price: 180 },
  { id: "racket", name: "Racket Rental", price: 250 },
  { id: "ball", name: "Pickle Ball", price: 95 },
  { id: "coffee", name: "Kahve (Coffee)", price: 75 },
  { id: "towel", name: "Havlu (Towel)", price: 120 },
];

export default function AdminPosPage() {
  const params = useParams();
  const clubSlug = params.clubSlug as string;

  const [cart, setCart] = React.useState<Array<{ name: string; price: number; qty: number }>>([
    { name: "Su (Water)", price: 35, qty: 1 },
    { name: "Grip Tape", price: 180, qty: 1 },
  ]);

  const addToCart = (product: { name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { name: product.name, price: product.price, qty: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const clearCart = () => {
    setCart([]);
  };

  const handleCharge = (type: string) => {
    if (cart.length === 0) return;
    alert(`Charged ${total} TRY via ${type}!`);
    clearCart();
  };

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Front Desk</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-[-0.08em] text-slate-100 mt-1">
          Touch POS
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Parmakla vurulacak kasa ekranı; ürünler büyük, sepet net, ödeme aksiyonu sert.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        
        {/* Products Grid */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                className="rounded-[12px] border border-slate-800 bg-slate-900/60 p-5 text-left hover:border-[var(--brand)] hover:bg-slate-850/80 transition-all duration-150 h-[100px] flex flex-col justify-between group"
                onClick={() => addToCart(product)}
              >
                <span className="font-extrabold text-sm text-slate-200 group-hover:text-white transition-colors">{product.name}</span>
                <span className="font-mono font-black text-sm text-[var(--brand)]">TRY {product.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <Card variant="surface" className="p-5 border border-slate-800 bg-slate-900/60 rounded-[12px] flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-200">Active Cart</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Ali Düvenci · wallet ready</p>
              </div>
              <Badge tone="lime">TRY 1,240</Badge>
            </div>

            <div className="space-y-2">
              {cart.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-8">Cart is empty</p>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 border border-slate-800/80 bg-slate-950/20 rounded-[8px] text-xs">
                    <span className="font-mono text-slate-500 font-bold">{item.qty}x</span>
                    <span className="font-semibold text-slate-300 flex-1 ml-2">{item.name}</span>
                    <span className="font-mono font-bold text-slate-200">TRY {item.price * item.qty}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-3">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Due</span>
              <span className="text-2xl font-black font-mono text-[var(--brand)]">TRY {total}</span>
            </div>
            
            <Button
              variant="primary"
              className="w-full rounded-[8px] py-3 text-xs font-black bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
              disabled={cart.length === 0}
              onClick={() => handleCharge("wallet")}
            >
              Charge Wallet
            </Button>
            <Button
              variant="secondary"
              className="w-full rounded-[8px] py-2 text-xs font-bold bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
              disabled={cart.length === 0}
              onClick={() => handleCharge("cash_card")}
            >
              Card / Cash
            </Button>
          </div>
        </Card>

      </div>

    </div>
  );
}
