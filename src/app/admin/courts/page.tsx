import { SurfaceCard } from "@/components/surface-card";

const courts = [
  ["Court 1", "Playing", "Indoor hardcourt", "Operational"],
  ["Court 2", "Available", "Indoor hardcourt", "Ready for next group"],
  ["Court 3", "Ending soon", "Indoor hardcourt", "72 seconds left"],
  ["Court 4", "Maintenance", "Training lane", "Closed until 20:00"],
];

export default function AdminCourtsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Courts</p>
        <h1 className="section-title mt-3">Keep court status, turnover quality, and availability readable at a glance.</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {courts.map(([name, status, surface, note], index) => (
          <SurfaceCard key={name} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--foreground)]">{name}</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">{status}</p>
              </div>
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: index === 0 ? "var(--green)" : index === 1 ? "var(--brand)" : index === 2 ? "var(--amber)" : "var(--red)" }}
              />
            </div>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{surface} / {note}</p>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
