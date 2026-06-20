import Link from "next/link";
import {
  Calendar,
  Compass,
  Award,
  BookOpen,
  ArrowRight,
  UserCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StatCard } from "@/components/ui/stat-card";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { bookings, currentUser } from "@/lib/mock-data";

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <SiteHeader />

      <main className="container-shell flex-1 py-10">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr] items-start">
          {/* Profile Card (Left Panel) */}
          <Card variant="surface" className="p-6 border border-[var(--line-strong)]">
            <div className="flex flex-col items-center text-center pb-6 border-b border-[var(--line)]">
              <Avatar
                name={currentUser.fullName}
                size="xl"
                ring={true}
                src={currentUser.avatar}
                className="mb-4"
              />
              <Badge tone="brand" className="mb-2">
                Member Profile
              </Badge>
              <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)]">
                {currentUser.fullName}
              </h1>
              <p className="text-xs text-[var(--muted)] font-semibold mt-1">
                ID: {currentUser.id} • {currentUser.role}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-6 space-y-4">
              <StatCard
                label="Skill Level"
                value={currentUser.skillLevel || "3.5"}
                icon={<Award className="w-5 h-5" />}
                className="shadow-none border border-[var(--line)] bg-[var(--surface-muted)]"
              />
              <StatCard
                label="Upcoming Bookings"
                value={bookings.length}
                icon={<Calendar className="w-5 h-5" />}
                className="shadow-none border border-[var(--line)] bg-[var(--surface-muted)]"
              />
              <StatCard
                label="Check-In Lane"
                value="Lane A"
                icon={<UserCheck className="w-5 h-5" />}
                className="shadow-none border border-[var(--line)] bg-[var(--surface-muted)]"
              />
            </div>
          </Card>

          {/* Account Actions & Preferences (Right Panel) */}
          <div className="space-y-6">
            {/* Control Panel */}
            <Card variant="surface" className="p-8 border border-[var(--line-strong)]">
              <Badge tone="slate" className="mb-4">
                Operations
              </Badge>
              <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
                Keep booking control close.
              </h2>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
                The member area explains what happens next without leaking desk complexity. Booking status, payment state, and court assignment confirmation all stay player-readable.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="primary" asChild>
                  <Link href="/account/bookings" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> View My Bookings
                  </Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/sessions" className="flex items-center gap-2">
                    Book Another Session <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Preferences Grid */}
            <Card variant="surface" className="p-8 border border-[var(--line-strong)]">
              <h3 className="text-lg font-black text-[var(--foreground)] mb-6">
                Saved Preferences & Toggles
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Intermediate Player", detail: "Suggested level matching: 3.0 - 4.0" },
                  { title: "Friday Evening Play", detail: "Favorite time slots automatically highligted" },
                  { title: "Guests Auto-Pay", detail: "Split billing payments configured via Stripe" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-muted)] p-5 text-sm font-semibold flex flex-col justify-between"
                  >
                    <span className="text-[var(--foreground)] font-black text-sm">{item.title}</span>
                    <span className="text-[var(--muted)] text-xs font-medium mt-2 leading-relaxed">
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
