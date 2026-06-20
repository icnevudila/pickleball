import { SurfaceCard } from "@/components/surface-card";
import { payments } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Payments</p>
        <h1 className="section-title mt-3">Stripe state, manual review, and booking linkage in one ledger view.</h1>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <SurfaceCard key={payment.id} className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xl font-semibold text-white">{payment.id}</p>
                <p className="mt-2 text-sm text-slate-300">
                  {payment.provider} · booking {payment.bookingId} · {formatCurrency(payment.amount, payment.currency)}
                </p>
              </div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{payment.status}</p>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
