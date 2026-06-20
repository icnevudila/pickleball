import { cx } from "@/lib/utils";

export function SurfaceCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-[28px] border border-[color:var(--line)] bg-white/95 shadow-[0_20px_60px_rgba(83,39,23,0.08)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
