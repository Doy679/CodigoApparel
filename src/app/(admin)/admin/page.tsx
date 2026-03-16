"use client";

import StatCard from "@/components/admin/StatCard";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowUpRight,
  Clock,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const recentOrders = [
    { id: "#CDG-8921", customer: "Miguel R.", items: 2, total: "₱1,598.00", status: "Processing", time: "2 mins ago" },
    { id: "#CDG-8920", customer: "Sofia L.", items: 1, total: "₱799.00", status: "Shipped", time: "45 mins ago" },
    { id: "#CDG-8919", customer: "Andre C.", items: 3, total: "₱2,397.00", status: "Delivered", time: "2 hours ago" },
  ];

  return (
    <div className="space-y-12 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value="₱128,450" 
          change="+12.5%" 
          icon={TrendingUp} 
          delay={0.1}
        />
        <StatCard 
          label="Orders" 
          value="156" 
          change="+8.2%" 
          icon={ShoppingBag} 
          delay={0.2}
        />
        <StatCard 
          label="Customers" 
          value="1,240" 
          change="+5.1%" 
          icon={Users} 
          delay={0.3}
        />
        <StatCard 
          label="Avg Order" 
          value="₱823" 
          change="-2.4%" 
          icon={ArrowUpRight} 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white border border-neutral-100 p-8 space-y-8"
        >
          <div className="flex items-center justify-between border-b border-neutral-50 pb-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em]">Recent Transactions</h2>
            <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors flex items-center gap-2">
              View All <ExternalLink size={12} />
            </Link>
          </div>

          <div className="space-y-6">
            {recentOrders.map((order, i) => (
              <div key={order.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-neutral-50 flex items-center justify-center text-[10px] font-black group-hover:bg-black group-hover:text-white transition-all">
                    {order.id.split("-")[1]}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">{order.customer}</h4>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{order.items} items • {order.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest">{order.total}</p>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <Clock size={10} className="text-neutral-300" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-400">{order.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black text-white p-8 space-y-8"
        >
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">Inventory Status</h2>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest italic">Corduroy Black 01</span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-500">LOW STOCK (4)</span>
              </div>
              <div className="h-1 bg-neutral-900 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "20%" }}
                  transition={{ delay: 1, duration: 1.5 }}
                  className="h-full bg-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest italic">Acid Wash 01</span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-500">IN STOCK (12)</span>
              </div>
              <div className="h-1 bg-neutral-900 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ delay: 1.2, duration: 1.5 }}
                  className="h-full bg-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest italic">Corduroy White 02</span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-500">IN STOCK (8)</span>
              </div>
              <div className="h-1 bg-neutral-900 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "40%" }}
                  transition={{ delay: 1.4, duration: 1.5 }}
                  className="h-full bg-white"
                />
              </div>
            </div>
          </div>

          <button className="w-full border border-neutral-800 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-900 transition-all">
            Full Inventory Report
          </button>
        </motion.div>
      </div>
    </div>
  );
}
