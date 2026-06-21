import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { payments } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const paymentStatusTones = {
  pending: "amber",
  paid: "lime",
  failed: "rose",
  refunded: "slate",
  "manual-review": "amber",
} as const;

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 animate-fade-in stagger-1">
        <Badge tone="brand">Payments</Badge>
        <h1 className="section-title text-3xl font-black mt-2">
          Capture Stripe state, review exceptions, and keep booking linkage obvious.
        </h1>
        <p className="text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
          Audit transaction logs, confirm webhooks, and manage player payment states.
        </p>
      </div>

      <div className="grid gap-4">
        {payments.map((payment, index) => (
          <Card
            key={payment.id}
            variant="surface"
            className={`p-6 border border-[var(--line-strong)] hover:shadow-md transition-all duration-300 animate-slide-up stagger-${
              (index % 3) + 1
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-lg font-black text-[var(--foreground)]">{payment.id}</p>
                <p className="text-xs font-semibold text-[var(--muted)]">
                  Stripe Checkout • Booking: <span className="font-extrabold text-[var(--foreground)]">{payment.bookingId}</span> • Amount: <span className="font-extrabold text-[var(--foreground)] font-mono">{formatCurrency(payment.amount, payment.currency)}</span>
                </p>
              </div>
              <div className="shrink-0">
                <Badge tone={paymentStatusTones[payment.status] || "slate"}>
                  {payment.status}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
