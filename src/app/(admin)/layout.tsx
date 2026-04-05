import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Use server-side session check which is 100% reliable
  const session = await auth();

  // Redirect to login if user is NOT authenticated OR not an admin
  if (!session?.user || session.user.role !== "admin") {
    console.log("AdminLayout - NO SESSION OR NOT ADMIN, redirecting to /login");
    redirect("/login");
  }

  console.log("AdminLayout - Session VALID for role: admin, showing dashboard.");

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
