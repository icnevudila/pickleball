import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const courtsData = [
  { name: "Court 1", status: "Playing", surface: "Indoor hardcourt", note: "Operational", tone: "live" },
  { name: "Court 2", status: "Available", surface: "Indoor hardcourt", note: "Ready for next group", tone: "lime" },
  { name: "Court 3", status: "Ending soon", surface: "Indoor hardcourt", note: "72 seconds left", tone: "amber" },
  { name: "Court 4", status: "Maintenance", surface: "Training lane", note: "Closed until 20:00", tone: "rose" },
] as const;

export default function AdminCourtsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 animate-fade-in stagger-1">
        <Badge tone="brand">Courts</Badge>
        <h1 className="section-title text-3xl font-black mt-2">
          Keep court status, turnover quality, and availability readable at a glance.
        </h1>
        <p className="text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
          Live floor supervision dashboard. Monitor maintenance blocks and slot transitions automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {courtsData.map((item, index) => (
          <Card
            key={item.name}
            variant="surface"
            className={`p-6 border border-[var(--line-strong)] hover:shadow-md transition-all duration-300 animate-slide-up stagger-${
              (index % 2) + 1
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-2xl font-black tracking-tight text-[var(--foreground)]">
                  {item.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={item.tone}>{item.status}</Badge>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)] bg-[var(--surface-soft)] px-2 py-0.5 rounded border border-[var(--line)]">
                    {item.surface}
                  </span>
                </div>
              </div>
              <span
                className={`h-3 w-3 rounded-full ${
                  item.tone === "live"
                    ? "bg-[var(--green)] animate-pulse"
                    : item.tone === "lime"
                    ? "bg-[var(--green)]"
                    : item.tone === "amber"
                    ? "bg-[var(--amber)]"
                    : "bg-[var(--red)]"
                }`}
              />
            </div>
            <p className="mt-6 pt-4 border-t border-[var(--line)]/50 text-xs font-bold text-[var(--muted)] leading-relaxed">
              Status detail: <span className="text-[var(--foreground)]">{item.note}</span>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
