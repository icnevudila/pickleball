import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SiteHeader } from "@/components/layout/site-header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container-shell grid gap-6 py-10 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
