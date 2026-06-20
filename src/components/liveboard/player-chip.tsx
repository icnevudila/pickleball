import { initials } from "@/lib/utils";

export function PlayerChip({
  name,
  detail,
  size = "md",
}: {
  name: string;
  detail?: string;
  size?: "md" | "lg";
}) {
  const avatarSize = size === "lg" ? "h-14 w-14 rounded-2xl" : "h-11 w-11 rounded-xl";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
      <div
        className={`grid ${avatarSize} shrink-0 place-items-center bg-[linear-gradient(135deg,#d4ff5f,#36d4ff)] font-black text-slate-950`}
      >
        {initials(name)}
      </div>
      <div>
        <p className="text-sm font-semibold text-white sm:text-base">{name}</p>
        {detail ? <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{detail}</p> : null}
      </div>
    </div>
  );
}
