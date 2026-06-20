import { SurfaceCard } from "@/components/surface-card";
import { payments } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Payments</p>
        <h1 className="section-title mt-3">Capture Stripe state, review exceptions, and keep booking linkage obvious.</h1>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <SurfaceCard key={payment.id} className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xl font-extrabold text-[color:var(--foreground)]">{payment.id}</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {payment.provider} / booking {payment.bookingId} / {formatCurrency(payment.amount, payment.currency)}
                </p>
              </div>
              <p className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[color:var(--foreground)]">
                {payment.status}
              </p>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
