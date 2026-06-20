import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { people } from "@/lib/mock-data";

export default function AdminMembersPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 animate-fade-in stagger-1">
        <Badge tone="brand">Members</Badge>
        <h1 className="section-title text-3xl font-black mt-2">
          Manage registered players, skill profiles, and club memberships.
        </h1>
        <p className="text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
          View member subscription statuses, preferences, and details at a glance.
        </p>
      </div>

      <Card variant="surface" className="overflow-hidden border border-[var(--line-strong)] animate-scale-in">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-[var(--line)] px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)] bg-[var(--surface-muted)]">
          <span>Player</span>
          <span>Role / Tag</span>
          <span>Skill Level</span>
          <span>Status</span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[var(--line)]">
          {people.map((person) => {
            const isMember = person.tag === "Member";
            return (
              <div
                key={person.id}
                className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 items-center px-6 py-5 text-sm text-[var(--muted)] hover:bg-[var(--surface-soft)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={person.fullName} src={person.avatar} size="md" ring={isMember} />
                  <div>
                    <p className="font-extrabold text-[var(--foreground)] text-base md:text-sm">
                      {person.fullName}
                    </p>
                    <p className="text-[10px] font-bold text-[var(--muted)]">
                      ID: {person.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:block">
                  <span className="text-xs font-semibold text-[var(--muted)] md:hidden">Tag:</span>
                  <Badge tone={isMember ? "brand" : "slate"}>
                    {person.tag || "Player"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 md:block">
                  <span className="text-xs font-semibold text-[var(--muted)] md:hidden">Skill:</span>
                  <span className="font-bold text-[var(--foreground)] font-mono">
                    {person.skillLevel || "3.0"}
                  </span>
                </div>

                <div className="flex items-center gap-2 md:block">
                  <span className="text-xs font-semibold text-[var(--muted)] md:hidden">Status:</span>
                  <Badge tone={isMember ? "lime" : "slate"}>
                    {isMember ? "Active Subscription" : "Standard Guest"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
