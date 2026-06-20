import { cx } from "@/lib/utils";

const toneClasses: Record<string, string> = {
  lime: "border-lime-300/25 bg-lime-300/10 text-lime-100",
  cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
  amber: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  rose: "border-rose-300/25 bg-rose-300/10 text-rose-100",
  slate: "border-white/15 bg-white/7 text-slate-100",
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
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
