import { db } from "@/lib/db";
import OrdersTable from "./OrdersTable";

interface Order {
  id: string;
  firstName: string;
  lastName: string;
  total: number;
  status: string;
  createdAt: Date;
  _count: {
    items: number;
  };
}

async function getOrders(): Promise<{ orders: Order[]; isMock: boolean }> {
  try {
    const orders = await db.order.findMany({
      include: {
        _count: {
          select: { items: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return { orders, isMock: false };
  } catch (error) {
    console.warn("Database fetch failed, returning mock data:", error);

    // Fallback to mock data for local testing
    const mockOrders: Order[] = [
      {
        id: "LOCAL-ORDER-1",
        firstName: "Test",
        lastName: "User",
        total: 1598,
        status: "PROCESSING",
        createdAt: new Date(),
        _count: { items: 2 }
      }
    ];
    return { orders: mockOrders, isMock: true };
  }
}

export default async function AdminOrders() {
  const { orders, isMock } = await getOrders();

  return (
    <div className="space-y-10 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
            Orders {isMock && "(Local Mock Mode)"}
          </h2>
          <p
            className={`text-[10px] font-bold uppercase tracking-widest ${isMock ? "text-red-500" : "text-neutral-400"}`}
          >
            {isMock
              ? "DATABASE NOT DETECTED. Using mock data for local testing."
              : "Track and process customer orders"}
          </p>
        </div>
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
