"use client";

import { ShoppingBag, Search, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminOrders() {
  const orders = [
    { id: "CDG-8921", date: "Mar 26, 2026", customer: "Miguel Rodriguez", total: "₱1,598.00", status: "Processing", items: 2 },
    { id: "CDG-8920", date: "Mar 26, 2026", customer: "Sofia Lopez", total: "₱799.00", status: "Shipped", items: 1 },
    { id: "CDG-8919", date: "Mar 25, 2026", customer: "Andre Castro", total: "₱2,397.00", status: "Delivered", items: 3 },
    { id: "CDG-8918", date: "Mar 25, 2026", customer: "Elena Cruz", total: "₱799.00", status: "Delivered", items: 1 },
    { id: "CDG-8917", date: "Mar 24, 2026", customer: "Marco Diaz", total: "₱1,598.00", status: "Cancelled", items: 2 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "text-blue-600 bg-blue-50";
      case "Shipped": return "text-orange-600 bg-orange-50";
      case "Delivered": return "text-green-600 bg-green-50";
      case "Cancelled": return "text-red-600 bg-red-50";
      default: return "text-neutral-600 bg-neutral-50";
    }
  };

  return (
    <div className="space-y-10 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Orders</h2>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Track and process customer orders</p>
        </div>
      </div>

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
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Order ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Total</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={order.id} 
                  className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase tracking-widest italic">#{order.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{order.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest">{order.customer}</h4>
                      <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">{order.items} items</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase tracking-widest">{order.total}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <ChevronRight size={16} className="text-neutral-300 group-hover:text-black transition-colors inline" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
