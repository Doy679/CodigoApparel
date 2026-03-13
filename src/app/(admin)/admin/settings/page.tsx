"use client";

import { Settings, Shield, Bell, CreditCard, Globe, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettings() {
  return (
    <div className="space-y-10 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Settings</h2>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Configure your store and admin preferences</p>
        </div>
        <button className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center gap-3 w-fit">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-4">
          <nav className="flex flex-col border border-neutral-100 bg-white">
            <button className="flex items-center gap-4 px-6 py-5 border-l-4 border-black bg-neutral-50 text-[10px] font-black uppercase tracking-widest italic">
              <Globe size={16} /> General Store
            </button>
            <button className="flex items-center gap-4 px-6 py-5 border-l-4 border-transparent hover:bg-neutral-50 text-neutral-400 hover:text-black transition-all text-[10px] font-black uppercase tracking-widest italic">
              <Shield size={16} /> Security & Auth
            </button>
            <button className="flex items-center gap-4 px-6 py-5 border-l-4 border-transparent hover:bg-neutral-50 text-neutral-400 hover:text-black transition-all text-[10px] font-black uppercase tracking-widest italic">
              <Bell size={16} /> Notifications
            </button>
            <button className="flex items-center gap-4 px-6 py-5 border-l-4 border-transparent hover:bg-neutral-50 text-neutral-400 hover:text-black transition-all text-[10px] font-black uppercase tracking-widest italic">
              <CreditCard size={16} /> Payments
            </button>
          </nav>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-neutral-100 p-8 space-y-8"
          >
            <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-neutral-50 pb-4">Store Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Store Name</label>
                <input defaultValue="Codigo Street & Culture" className="w-full border-b border-neutral-200 py-3 text-sm font-bold uppercase italic focus:border-black outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Support Email</label>
                <input defaultValue="ops@codigo.ph" className="w-full border-b border-neutral-200 py-3 text-sm font-bold focus:border-black outline-none transition-colors" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Manifesto / Bio</label>
                <textarea rows={4} defaultValue="Authentic apparel for the culture. Rooted in the hustle, grounded by the street." className="w-full border border-neutral-100 p-4 text-sm font-bold uppercase tracking-tight focus:border-black outline-none transition-colors resize-none" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-neutral-100 p-8 space-y-8"
          >
            <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-neutral-50 pb-4">Regional Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Currency</label>
                <select className="w-full border-b border-neutral-200 py-3 text-sm font-black uppercase tracking-widest bg-white appearance-none cursor-pointer outline-none">
                  <option>PHP (₱)</option>
                  <option>USD ($)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Timezone</label>
                <select className="w-full border-b border-neutral-200 py-3 text-sm font-black uppercase tracking-widest bg-white appearance-none cursor-pointer outline-none">
                  <option>(GMT+08:00) Manila</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
