"use client";

import { Camera, MessageSquare } from "lucide-react";

export default function SocialProof() {
  const posts = [1, 2, 3, 4, 5, 6];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">COMMUNITY CODE</h2>
            <div className="w-16 h-1 bg-black mx-auto md:mx-0"></div>
          </div>
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-neutral-400">
            <Camera size={18} />
            #CODIGOSTEET
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {posts.map((post) => (
            <div key={post} className="relative aspect-square bg-neutral-100 group overflow-hidden cursor-pointer shadow-sm border border-neutral-100">
              <div className="absolute inset-0 z-0 bg-neutral-200">
                {/* Placeholder for social media image */}
                <div className="w-full h-full flex items-center justify-center text-neutral-400 font-black uppercase text-xl italic opacity-50">
                  #{post}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 z-10">
                <Camera size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">View Post</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm font-medium text-neutral-600 tracking-tight mb-8">Join the collective. Tag your fit to be featured.</p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 group cursor-pointer hover:opacity-60 transition-opacity">
              <span className="text-xs font-black uppercase tracking-[0.2em]">1.2K+ CUSTOMERS</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:opacity-60 transition-opacity border-l border-neutral-200 pl-8">
              <span className="text-xs font-black uppercase tracking-[0.2em]">WORLDWIDE SHIPPING</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
