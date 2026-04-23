"use client";

import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import { toast } from "sonner";

export default function SocialProof() {
  const [mounted, setMounted] = useState(false);
  const { communityImages, addCommunityImage } = useAdminStore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      addCommunityImage(result);
      toast.success("Thanks for joining the collective! Your fit has been added.");
    };
    reader.readAsDataURL(file);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % communityImages.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + communityImages.length) % communityImages.length);
    }
  };

  if (!mounted) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none">
              COMMUNITY CODE
            </h2>
            <div className="w-16 h-1 bg-black mx-auto md:mx-0"></div>
          </div>
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-neutral-400">
            <Camera size={18} />
            #CODIGOSTREET
          </div>
        </div>
      </div>

      {/* Infinite Spinning Carousel - ONLY PEOPLE */}
      <div className="flex whitespace-nowrap overflow-hidden select-none border-y border-neutral-100 py-8">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 40,
            repeat: Infinity
          }}
          className="flex gap-6 pr-6 items-center"
        >
          {/* Double for seamless loop */}
          {[...communityImages, ...communityImages].map((src, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(index % communityImages.length)}
              data-cursor="VIEW FIT"
              className="relative w-[180px] md:w-[240px] aspect-[3/4] bg-neutral-100 group overflow-hidden cursor-pointer flex-shrink-0"
            >
              <Image
                src={src}
                alt="Community Collective"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 z-10 pointer-events-none">
                <Camera size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">View Post</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-zoom-out"
            />

            <div className="relative w-full max-w-5xl h-full flex items-center justify-center z-10">
              <button
                onClick={handlePrev}
                className="absolute left-0 md:-left-20 z-20 p-4 text-white hover:text-neutral-400 transition-colors"
              >
                <ChevronLeft size={48} strokeWidth={1} />
              </button>

              <motion.div
                key={communityImages[selectedIndex]}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-[75vh] md:h-[90vh] overflow-hidden"
              >
                <Image
                  src={communityImages[selectedIndex]}
                  alt="Community Zoom"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>

              <button
                onClick={handleNext}
                className="absolute right-0 md:-right-20 z-20 p-4 text-white hover:text-neutral-400 transition-colors"
              >
                <ChevronRight size={48} strokeWidth={1} />
              </button>

              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute -top-4 -right-4 md:-top-10 md:-right-10 p-3 text-white hover:text-neutral-400 transition-all"
              >
                <X size={32} strokeWidth={1} />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-8 mt-16 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-neutral-400 mb-8">
          Join the collective. Upload your fit to be featured.
        </p>

        <div className="flex flex-col items-center gap-12">
          <button
            onClick={() => document.getElementById("user-community-upload")?.click()}
            className="bg-black text-white px-12 py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-xl hover:scale-105"
          >
            Upload Your Fit
          </button>
          <input
            id="user-community-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <div className="flex items-center justify-center gap-8 w-full border-t border-neutral-100 pt-12">
            <div className="flex items-center gap-2 group cursor-pointer hover:opacity-60 transition-opacity">
              <span className="text-xs font-black uppercase tracking-[0.2em]">1.2K+ CUSTOMERS</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:opacity-60 transition-opacity border-l border-neutral-200 pl-8">
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                WORLDWIDE SHIPPING
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
