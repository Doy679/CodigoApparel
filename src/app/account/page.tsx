import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, LogOut, ShoppingBag, Package, LayoutDashboard } from "lucide-react";
import { db } from "@/lib/db";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orders = await db.order.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      items: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true }
  });

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-neutral-100 pb-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
              The Code
            </h1>
            <div className="w-16 h-1 bg-black"></div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">
              Welcome back, {session.user.name}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            {session.user.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            )}

            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
                <LogOut size={14} />
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="bg-neutral-50 p-8 border border-neutral-100">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-3 mb-6">
                <ShoppingBag size={16} /> Order History
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    You haven&apos;t placed any orders yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-neutral-100 p-6 space-y-4"
                    >
                      <div className="flex justify-between items-start border-b border-neutral-50 pb-4">
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                            Order ID
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-tighter italic">
                            #{order.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                            Status
                          </p>
                          <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-neutral-100">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-[10px]"
                          >
                            <div className="flex items-center gap-2">
                              <Package size={12} className="text-neutral-400" />
                              <span className="font-bold uppercase tracking-tight">
                                {item.name} {item.size && `(${item.size})`} x {item.quantity}
                              </span>
                            </div>
                            <span className="font-black">
                              ₱{item.price.toLocaleString("en-PH")}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-neutral-50 flex justify-between items-center">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs font-black uppercase tracking-tight italic">
                          Total: ₱{order.total.toLocaleString("en-PH")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="border border-neutral-100 p-8">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-3 mb-6 border-b border-neutral-50 pb-4">
                <User size={16} /> Profile Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                    Name
                  </p>
                  <p className="text-xs font-black uppercase tracking-tight">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                    Email
                  </p>
                  <p className="text-xs font-black tracking-tight">{session.user.email}</p>
                </div>

                <div className="pt-6 border-t border-neutral-50">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                    Culture Credits
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black uppercase tracking-tight italic">
                      ₱{(user?.credits || 0).toLocaleString()}
                    </p>
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black italic">
                      C
                    </div>
                  </div>
                  <p className="text-[7px] font-medium text-neutral-400 uppercase tracking-widest mt-2">
                    Earn 5% credits on every order.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
