"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CollectionShowcase() {
  const [flipIndex, setFlipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlipIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4000); // Flip every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const showcases = [
    {
      images: ["/images/community/comm-8.jpg", "/images/community/comm-11.jpg"],
      label: "Street 01",
      title: "Core Identity",
      align: "start"
    },
    {
      images: ["/images/community/comm-10.jpg"],
      label: "Street 02",
      title: "Urban Flux",
      align: "center"
    },
    {
      images: ["/images/community/comm-9.jpg", "/images/community/comm-12.jpg"],
      label: "Street 03",
      title: "Cultural Flow",
      align: "end"
    }
  ];

  return (
    <section className="py-32 bg-[#0a0a0a] text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-24 space-y-6">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            className="text-[10px] font-black uppercase tracking-[0.6em]"
          >
            Curated Selection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none"
          >
            THE CULTURE <br /> <span className="text-neutral-600 italic">COLLECTIVE</span>
          </motion.h2>
          <div className="w-12 h-px bg-white/20"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-12">
          {showcases.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col gap-6 ${
                index === 1 ? "md:mt-12" : index === 2 ? "md:mt-24" : ""
              }`}
            >
              <div className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={item.images.length > 1 ? item.images[flipIndex] : item.images[0]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={item.images.length > 1 ? item.images[flipIndex] : item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">{item.label}</span>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black uppercase italic tracking-tighter">{item.title}</h3>
                  <div className="w-6 h-px bg-white/10 group-hover:w-12 transition-all"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 flex justify-center">
          <Link 
            href="/store"
            className="px-12 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-neutral-200 transition-all flex items-center gap-3"
          >
            EXPLORE THE VAULT
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
