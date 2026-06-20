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
        "rounded-[28px] border border-white/12 bg-white/8 shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
