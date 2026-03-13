"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  delay?: number;
}

export default function StatCard({ label, value, change, icon: Icon, delay = 0 }: StatCardProps) {
  const isPositive = change.startsWith("+");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-8 border border-neutral-100 hover:border-black transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-50 group-hover:bg-black group-hover:text-white transition-colors">
              <Icon size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
              {label}
            </span>
          </div>
          <h3 className="text-4xl font-black uppercase italic tracking-tighter">
            {value}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-widest ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {change}
            </span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              vs last month
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
