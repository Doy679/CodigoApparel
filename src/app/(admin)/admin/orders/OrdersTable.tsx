"use client";

import { Search, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Order {
  id: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
  total: number;
  status: string;
  _count: {
    items: number;
  };
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return "text-blue-600 bg-blue-50";
      case "SHIPPED":
        return "text-orange-600 bg-orange-50";
      case "DELIVERED":
        return "text-green-600 bg-green-50";
      case "CANCELLED":
        return "text-red-600 bg-red-50";
      default:
        return "text-neutral-600 bg-neutral-50";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP"
    }).format(amount);
  };

  return (
    <div className="bg-white border border-neutral-100 overflow-hidden">
      <div className="p-6 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Filter orders..."
            className="bg-neutral-50 border-none py-3 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest w-full md:w-80 outline-none focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-50">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Order ID
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Date
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Customer
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Total
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Status
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-8 py-12 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order, i) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={order.id}
                  className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase tracking-widest italic">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest">
                        {order.firstName} {order.lastName}
                      </h4>
                      <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
                        {order._count.items} items
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {formatCurrency(order.total)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <ChevronRight
                      size={16}
                      className="text-neutral-300 group-hover:text-black transition-colors inline"
                    />
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
