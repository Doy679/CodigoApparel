"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronRight,
  Camera,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Community", href: "/admin/community", icon: Camera },
  { label: "Concerns", href: "/admin/concerns", icon: MessageSquare },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Settings", href: "/admin/settings", icon: Settings }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-black text-white h-screen fixed left-0 top-0 z-50 flex flex-col border-r border-neutral-800">
      <div className="p-8">
        <Link
          href="/"
          className="text-3xl font-black tracking-tighter uppercase italic leading-none block"
        >
          Codigo
          <span className="block text-[8px] font-bold tracking-[0.5em] mt-1 text-neutral-500 not-italic">
            ADMIN PANEL
          </span>
        </Link>
      </div>

      <nav className="flex-grow mt-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-8 py-4 transition-all duration-300 group ${
                isActive ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon
                  size={18}
                  className={isActive ? "text-white" : "text-neutral-500 group-hover:text-white"}
                />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">
                  {item.label}
                </span>
              </div>
              {isActive && (
                <motion.div layoutId="activeNav" className="text-white">
                  <ChevronRight size={14} />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 mt-auto border-t border-neutral-900">
        <button className="flex items-center gap-4 text-neutral-500 hover:text-white transition-colors w-full group">
          <LogOut size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">
            Exit Admin
          </span>
        </button>
      </div>
    </aside>
  );
}
