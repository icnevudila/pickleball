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
        "rounded-[16px] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-200",
        className,
      )}
    >
      {children}
    </div>
  );
}
