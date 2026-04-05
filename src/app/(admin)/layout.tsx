import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Use a more robust check for the session
  const session = await auth();

  // If the session doesn't exist or isn't an admin, kick back to login
  if (!session?.user || session.user.role !== "admin") {
    // Adding a redirect to ensure we don't show a blank screen
    redirect("/login");
  }

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
