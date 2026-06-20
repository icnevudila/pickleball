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
        <h1 className="section-title mt-3">Keep availability, status, and floor quality visible.</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {courts.map(([name, status, surface, note]) => (
          <SurfaceCard key={name} className="p-6">
            <p className="text-2xl font-semibold tracking-[-0.05em] text-white">{name}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-400">{status}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {surface} · {note}
            </p>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
