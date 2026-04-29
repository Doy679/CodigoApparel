"use client";

import { MARQUEE_PHRASE } from "@/data/site-content";

export default function TextMarquee() {
  return (
    <section className="bg-black text-white py-4 md:py-6 border-y border-white/5 overflow-hidden">
      <div className="flex whitespace-nowrap overflow-hidden select-none">
        <div className="flex animate-marquee gap-6 items-center pr-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center gap-6">
              <span className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter text-white">
                {MARQUEE_PHRASE}
              </span>
              <span
                className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter text-transparent"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}
              >
                {MARQUEE_PHRASE}
              </span>
            </div>
          ))}
        </div>
        <div className="flex animate-marquee gap-6 items-center pr-6" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <div key={`clone-${i}`} className="flex items-center gap-6">
              <span className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter text-white">
                {MARQUEE_PHRASE}
              </span>
              <span
                className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter text-transparent"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}
              >
                {MARQUEE_PHRASE}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}