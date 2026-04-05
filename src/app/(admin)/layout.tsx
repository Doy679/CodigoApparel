import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Redirection is now handled by the 'authorized' callback in src/auth.ts
  // This prevents layout vs middleware redirect loops.

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <AdminSidebar />
      <div className="flex-grow ml-64">
        <AdminHeader />
        <main className="pt-20 px-10 pb-12">{children}</main>
      </div>
    </div>
  );
}
