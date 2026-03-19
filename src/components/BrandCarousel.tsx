"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BRAND_SLIDES } from "@/data/site-content";

export function BrandCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BRAND_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const next = () => setCurrent((prev) => (prev + 1) % BRAND_SLIDES.length);
  const prev = () => setCurrent((prev) => (prev - 1 + BRAND_SLIDES.length) % BRAND_SLIDES.length);

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[60vh] md:h-[80vh] bg-black overflow-hidden group"
    >
      {BRAND_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"
          }`}
        >
          <Image src={slide.image} alt={slide.title} fill className="object-cover opacity-50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div className="relative w-full flex items-center justify-center">
              {/* Large Ghost Background Text */}
              <h3 className="text-[120px] md:text-[240px] font-black italic tracking-tighter text-transparent [webkit-text-stroke:1px_rgba(255,255,255,0.05)] uppercase leading-none absolute select-none pointer-events-none whitespace-nowrap z-0">
                {slide.title}
              </h3>

              {/* Main Foreground Text */}
              <h3 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none relative z-10 animate-slide-up">
                {slide.title}
              </h3>
            </div>
            <p className="text-xs md:text-sm font-bold tracking-[0.4em] text-neutral-300 uppercase mt-4 relative z-10">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {BRAND_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-12 h-1 transition-all duration-500 ${
              index === current ? "bg-white" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
