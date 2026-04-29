"use client";

import { useState } from "react";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/landing-page-bg.jpeg"
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/landing-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
      </div>

      {/* Mute/Unmute Toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-10 right-8 md:right-12 z-20 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full border border-white/10 transition-all text-white/70 hover:text-white"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center pt-16">
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase opacity-80"
          >
            New Collection Drop
          </motion.p>

          <div className="relative inline-block mb-4">
            {/* Shadow Layer (Outline) */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 0.2, y: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter uppercase italic leading-none absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 text-transparent [webkit-text-stroke:1px_white] select-none pointer-events-none"
            >
              Street <br /> & Culture
            </motion.h1>
            {/* Main Text Layer */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter uppercase italic leading-none relative z-10"
            >
              Street <br /> & Culture
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm md:text-lg text-neutral-300 max-w-xl mx-auto font-medium tracking-wide"
          >
            Authentic apparel for the culture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-12 bg-white/40"></div>
      </motion.div>
    </section>
  );
}
