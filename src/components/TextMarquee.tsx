"use client";

export default function TextMarquee() {
  return (
    <section className="bg-black text-white py-4 md:py-6 border-y border-white/5 overflow-hidden">
      <div className="flex whitespace-nowrap overflow-hidden select-none group">
        <div className="flex animate-marquee gap-12 items-center pr-12">
          <span className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter">Street & Culture</span>
          <span className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter text-outline">Street & Culture</span>
          <span className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter">Street & Culture</span>
          <span className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter text-outline">Street & Culture</span>
        </div>
        <div className="flex animate-marquee gap-12 items-center pr-12" aria-hidden="true">
          <span className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter">Street & Culture</span>
          <span className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter text-outline">Street & Culture</span>
          <span className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter">Street & Culture</span>
          <span className="text-4xl md:text-5xl lg:text-[4rem] font-black uppercase italic tracking-tighter text-outline">Street & Culture</span>
        </div>
      </div>

      <style jsx>{`
        .text-outline {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
      `}</style>
    </section>
  );
}
