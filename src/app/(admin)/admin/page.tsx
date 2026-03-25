"use client";

import StatCard from "@/components/admin/StatCard";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  ArrowUpRight,
  Clock,
  ExternalLink,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAdminStore } from "@/store/useAdminStore";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const { products, orders, getStats } = useAdminStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const stats = getStats();
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  return (
    <div className="space-y-12 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={stats.totalRevenue}
          change="+12.5%"
          icon={TrendingUp}
          delay={0.1}
        />
        <StatCard
          label="Orders"
          value={stats.totalOrders.toString()}
          change="+8.2%"
          icon={ShoppingBag}
          delay={0.2}
        />
        <StatCard
          label="Customers"
          value={stats.totalCustomers.toString()}
          change="+5.1%"
          icon={Users}
          delay={0.3}
        />
        <StatCard
          label="Open Concerns"
          value={stats.openConcerns.toString()}
          change={stats.openConcerns > 0 ? "Action Required" : "All Clear"}
          icon={MessageSquare}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-neutral-100 p-8 space-y-8"
          >
            <div className="flex items-center justify-between border-b border-neutral-50 pb-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">Recent Transactions</h2>
              <Link
                href="/admin/orders"
                className="text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors flex items-center gap-2"
              >
                View All <ExternalLink size={12} />
              </Link>
            </div>

            <div className="space-y-6">
              {orders.slice(0, 3).map((order, i) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-neutral-50 flex items-center justify-center text-[10px] font-black group-hover:bg-black group-hover:text-white transition-all">
                      {order.id.split("-")[1]}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest">
                        {order.customer}
                      </h4>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        {order.items} items • {order.id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      ₱{order.total.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 justify-end mt-1">
                      <Clock size={10} className="text-neutral-300" />
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-400">
                        {order.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white border border-neutral-100 p-8 space-y-8"
          >
            <div className="flex items-center justify-between border-b border-neutral-50 pb-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">Customer Concerns</h2>
              <Link
                href="/admin/concerns"
                className="text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors flex items-center gap-2"
              >
                Manage All <ExternalLink size={12} />
              </Link>
            </div>

            <div className="space-y-6">
              {useAdminStore
                .getState()
                .chats.filter((c) => c.status === "open")
                .slice(0, 2)
                .map((chat) => (
                  <Link
                    href="/admin/concerns"
                    key={chat.id}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-neutral-50 flex items-center justify-center rounded-full group-hover:bg-black transition-all">
                        <MessageSquare
                          size={16}
                          className="text-neutral-400 group-hover:text-white"
                        />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest">
                          {chat.customerName}
                        </h4>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest line-clamp-1">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-400">
                        {chat.lastUpdate}
                      </span>
                    </div>
                  </Link>
                ))}
              {useAdminStore.getState().chats.filter((c) => c.status === "open").length === 0 && (
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 italic py-4">
                  No pending concerns
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black text-white p-8 space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
              Inventory Status
            </h2>
            {stats.lowStockCount > 0 && (
              <span className="bg-red-600 text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">
                {stats.lowStockCount} ALERT
              </span>
            )}
          </div>

          <div className="space-y-8">
            {products.slice(0, 4).map((product, idx) => {
              const stockPercentage = Math.min((product.stock / 20) * 100, 100);
              const isLowStock = product.stock <= 5;

              return (
                <div key={product.id} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest italic truncate max-w-[150px]">
                      {product.name.replace("C • ", "")}
                    </span>
                    <span
                      className={`text-[10px] font-bold tracking-widest ${isLowStock ? "text-red-500" : "text-neutral-500"}`}
                    >
                      {isLowStock ? `LOW STOCK (${product.stock})` : `IN STOCK (${product.stock})`}
                    </span>
                  </div>
                  <div className="h-1 bg-neutral-900 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stockPercentage}%` }}
                      transition={{ delay: 1 + idx * 0.1, duration: 1.5 }}
                      className={`h-full ${isLowStock ? "bg-red-600" : "bg-white"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/admin/products"
            className="w-full border border-neutral-800 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-900 transition-all block text-center"
          >
            Full Inventory Report
          </Link>

          {lowStockProducts.length > 0 && (
            <div className="pt-4 border-t border-neutral-900">
              <div className="flex items-start gap-4 p-4 bg-red-950/30 border border-red-900/50">
                <AlertCircle className="text-red-500 shrink-0" size={16} />
                <p className="text-[8px] font-bold uppercase tracking-widest text-red-200 leading-relaxed">
                  CRITICAL: {lowStockProducts.length} items are currently below minimum stock
                  levels. Immediate restock recommended for street-cred maintenance.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
