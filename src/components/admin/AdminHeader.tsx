"use client";

import { Bell, Search, ShoppingBag, MessageSquare, AlertTriangle, Info } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAdminStore, Notification } from "@/store/useAdminStore";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, markAsRead, clearNotifications } = useAdminStore();
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsNotificationsOpen(false);

    // Navigate based on type
    switch (notification.type) {
      case "order":
        router.push("/admin/orders");
        break;
      case "chat":
        router.push("/admin/concerns");
        break;
      case "stock":
        router.push("/admin/products");
        break;
      default:
        break;
    }
  };

  const getPageTitle = () => {
    const parts = pathname.split("/");
    const last = parts[parts.length - 1];
    if (last === "admin") return "Dashboard Overview";
    return last.charAt(0).toUpperCase() + last.slice(1);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag size={14} className="text-blue-500" />;
      case "chat":
        return <MessageSquare size={14} className="text-green-500" />;
      case "stock":
        return <AlertTriangle size={14} className="text-amber-500" />;
      default:
        return <Info size={14} className="text-neutral-400" />;
    }
  };

  return (
    <header className="h-20 bg-white border-b border-neutral-100 flex items-center justify-between px-10 fixed top-0 right-0 left-64 z-40">
      <div>
        <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-1">
          System / {getPageTitle()}
        </h1>
        <h1 className="text-lg font-black uppercase tracking-tight italic">{getPageTitle()}</h1>
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
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="text-neutral-400 hover:text-black transition-colors relative p-2"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-neutral-100 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-neutral-50 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Notifications
                  </span>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[8px] font-bold uppercase tracking-tighter text-neutral-400 hover:text-black"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                        No new alerts
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 border-b border-neutral-50 cursor-pointer transition-colors hover:bg-neutral-50 flex gap-3 ${!notification.read ? "bg-neutral-50/50" : ""}`}
                      >
                        <div className="mt-0.5">{getIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-[10px] font-black uppercase tracking-tight">
                              {notification.title}
                            </h4>
                            <span className="text-[8px] font-bold text-neutral-400 uppercase">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-500 font-medium leading-relaxed uppercase">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 bg-neutral-50 text-center">
                    <button className="text-[8px] font-black uppercase tracking-widest hover:underline">
                      View all system logs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="h-8 w-[1px] bg-neutral-100 mx-2"></div>

          <button className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-black uppercase italic">
              AD
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
              Admin
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
