import type { ReactNode } from "react";
import { TenantHeader } from "@/components/layout/tenant-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { MemberSidebar } from "@/components/layout/member-sidebar";

interface AccountLayoutProps {
  children: ReactNode;
  params: Promise<{ clubSlug: string }>;
}

export default async function AccountLayout({ children, params }: AccountLayoutProps) {
  const { clubSlug } = await params;
  
  // Format club name nicely from slug
  const clubName = clubSlug
    .split("-")
    .map((word) => {
      if (word.toLowerCase() === "istanbul") return "İstanbul";
      if (word.toLowerCase() === "kadikoy") return "Kadıköy";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
  const clubTitle = `${clubName} Social Club`;
  const clubLogo = clubName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "PP";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <TenantHeader clubSlug={clubSlug} clubName={clubTitle} clubLogo={clubLogo} />
      <div className="flex-1 w-full max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <MemberSidebar clubSlug={clubSlug} />
          <main className="flex-1 min-w-0 space-y-6">
            {children}
          </main>
        </div>
      </div>
      <PublicFooter clubSlug={clubSlug} />
    </div>
  );
}
