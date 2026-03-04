"use client";

import { useState, useEffect } from "react";

export default function LimitedDropCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set a dummy target date - 7 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(20, 0, 0, 0); // 8:00 PM

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-neutral-100 border-y border-neutral-200">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <div className="space-y-4 mb-16">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-neutral-400">Next Release</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic italic-none">THE CODE DROP</h2>
          <div className="w-16 h-1 bg-black mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto font-mono">
          <div className="flex flex-col items-center justify-center p-8 bg-white border border-neutral-200 shadow-sm relative overflow-hidden group">
            <span className="text-4xl md:text-6xl font-black text-black z-10">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-2 z-10">Days</span>
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none text-xs font-black select-none">0100</div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 bg-white border border-neutral-200 shadow-sm relative overflow-hidden group">
            <span className="text-4xl md:text-6xl font-black text-black z-10">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-2 z-10">Hours</span>
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none text-xs font-black select-none">1011</div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 bg-white border border-neutral-200 shadow-sm relative overflow-hidden group">
            <span className="text-4xl md:text-6xl font-black text-black z-10">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-2 z-10">Minutes</span>
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none text-xs font-black select-none">0010</div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 bg-white border border-neutral-200 shadow-sm relative overflow-hidden group">
            <span className="text-4xl md:text-6xl font-black text-black z-10">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-2 z-10">Seconds</span>
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none text-xs font-black select-none">1101</div>
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-neutral-600 max-w-md mx-auto italic tracking-tight uppercase">Limited availability. Only 50 pieces per item. Don't let the code expire.</p>
          <button className="px-10 py-4 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors">
            NOTIFY ME
          </button>
        </div>
      </div>
    </section>
  );
}
