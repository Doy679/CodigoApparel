"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/landing-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center pt-16">
        <div className="space-y-6">
          <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase opacity-80 animate-fade-in">
            New Collection Drop
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter uppercase italic leading-none animate-slide-up">
            Street <br /> & Culture
          </h1>
          <p className="text-sm md:text-lg text-neutral-300 max-w-xl mx-auto font-medium tracking-wide">
            Authentic apparel for the culture.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <Link 
              href="/store" 
              className="px-10 py-4 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-2 group"
            >
              SHOP THE DROP
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/about" 
              className="px-10 py-4 border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              OUR STORY
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-12 bg-white/40"></div>
      </div>
    </section>
  );
}
