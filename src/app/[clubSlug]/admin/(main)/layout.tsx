import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6efe6] text-[#3a312a] font-sans antialiased">
      <AdminHeader />
      <div className="max-w-[1780px] mx-auto my-[18px] px-[22px] flex flex-col lg:flex-row gap-4 items-start">
        <AdminSidebar />
        <main className="flex-1 min-w-0 w-full">{children}</main>
      </div>
    </div>
  );
}
