import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if the user is authenticated and is an admin
  const session = await auth();
  
  if (!session || (session.user as any)?.role !== "admin") {
    // If not authenticated or not an admin, redirect them to the login page
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <AdminSidebar />
      <div className="flex-grow ml-64">
        <AdminHeader />
        <main className="pt-20 px-10 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
