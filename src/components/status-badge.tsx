import { cx } from "@/lib/utils";

const toneClasses: Record<string, string> = {
  lime: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cyan: "border-orange-200 bg-orange-50 text-orange-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  slate: "border-stone-200 bg-stone-50 text-stone-700",
};

export function StatusBadge({
  children,
  tone = "lime",
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneClasses;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
