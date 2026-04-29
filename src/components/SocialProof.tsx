"use client";

import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";

export default function SocialProof() {
  const communityImages = useAdminStore((state) => state.communityImages);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const displayImages = useMemo(() => communityImages.slice(0, 12), [communityImages]);
  const marqueeImages = useMemo(() => [...displayImages, ...displayImages], [displayImages]);
  const selectedImage = selectedIndex !== null ? displayImages[selectedIndex] : null;

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null && displayImages.length > 0) {
      setSelectedIndex((selectedIndex + 1) % displayImages.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null && displayImages.length > 0) {
      setSelectedIndex((selectedIndex - 1 + displayImages.length) % displayImages.length);
    }
  };

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

      <div className="flex whitespace-nowrap overflow-hidden select-none border-y border-neutral-100 py-8">
        <div className="community-strip flex gap-6 pr-6 items-center">
          {marqueeImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              onClick={() => setSelectedIndex(index % displayImages.length)}
              data-cursor="VIEW FIT"
              className="relative w-[180px] md:w-[240px] aspect-[3/4] bg-neutral-100 group overflow-hidden cursor-pointer flex-shrink-0"
            >
              <Image
                src={src}
                alt="Community Collective"
                fill
                sizes="(min-width: 768px) 240px, 180px"
                unoptimized={src.startsWith("data:")}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 z-10 pointer-events-none">
                <Camera size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">View Post</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
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
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-[75vh] md:h-[90vh] overflow-hidden"
              >
                <Image
                  src={selectedImage}
                  alt="Community Zoom"
                  fill
                  sizes="100vw"
                  unoptimized={selectedImage.startsWith("data:")}
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
    </section>
  );
}
