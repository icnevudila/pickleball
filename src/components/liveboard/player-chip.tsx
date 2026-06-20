import Image from "next/image";

import { initials } from "@/lib/utils";

export function PlayerChip({
  name,
  detail,
  avatarUrl,
  size = "md",
}: {
  name: string;
  detail?: string;
  avatarUrl?: string;
  size?: "md" | "lg";
}) {
  const avatarSize = size === "lg" ? "h-14 w-14 rounded-2xl" : "h-11 w-11 rounded-xl";

  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          className={`${avatarSize} shrink-0 border border-[color:var(--line)] object-cover`}
          width={56}
          height={56}
        />
      ) : (
        <div
          className={`grid ${avatarSize} shrink-0 place-items-center font-black text-white`}
          style={{ background: "linear-gradient(145deg,var(--brand),#ff7654)" }}
        >
          {initials(name)}
        </div>
      )}
      <div>
        <p className="text-sm font-extrabold text-[color:var(--foreground)] sm:text-base">{name}</p>
        {detail ? <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">{detail}</p> : null}
      </div>
    </div>
  );
}
