"use client";

import { Bell, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    const parts = pathname.split("/");
    const last = parts[parts.length - 1];
    if (last === "admin") return "Dashboard Overview";
    return last.charAt(0).toUpperCase() + last.slice(1);
  };

  return (
    <header className="h-20 bg-white border-b border-neutral-100 flex items-center justify-between px-10 fixed top-0 right-0 left-64 z-40">
      <div>
        <h1 className="text-xl font-black uppercase italic tracking-tighter">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search commands..." 
            className="bg-neutral-50 border-none py-2 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest w-64 focus:ring-1 focus:ring-black outline-none transition-all"
          />
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>

        <div className="flex items-center gap-6">
          <button className="text-neutral-400 hover:text-black transition-colors relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-[1px] bg-neutral-100 mx-2"></div>
          <button className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-black uppercase italic">
              AD
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
