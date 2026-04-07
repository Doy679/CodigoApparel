"use client";

// IntroLoader v3.0 - KINETIC MONOLITH REDESIGN
import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";

const STATIC_DATA_POINTS = [...Array(15)].map(() => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`
}));

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "expo.inOut",
          onComplete: onComplete
        });
      }
    });

    // 1. Initial States
    gsap.set(".char", { y: 150, opacity: 0 });
    gsap.set(".sub-text", { opacity: 0, y: 10 });
    gsap.set(".tech-line", { scaleY: 0 });

    // 2. TIMELINE SEQUENCE
    tl.to({}, { duration: 0.5 }) // Tension hold

      // Phase A: Tech Grid Emergence
      .to(".tech-line", {
        scaleY: 1,
        opacity: 0.1,
        duration: 1,
        stagger: { amount: 0.5, from: "center" },
        ease: "power4.inOut"
      })

      // Phase B: The Snap Reveal (Tracking + Stagger)
      .to(
        ".char",
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.08,
          ease: "expo.out"
        },
        "-=0.5"
      )

      .fromTo(
        brandRef.current,
        { letterSpacing: "1em" },
        { letterSpacing: "-0.02em", duration: 2, ease: "expo.out" },
        "-=1.5"
      )

      // Phase C: Info Reveal
      .to(
        ".sub-text",
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        },
        "-=1"
      )

      .to({}, { duration: 1.5 }); // Final Hold

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-[#050505] text-white overflow-hidden font-['Montserrat',sans-serif]"
    >
      {/* Tech Grid Background */}
      <div className="absolute inset-0 flex justify-around px-10 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="tech-line w-px h-full bg-white origin-top opacity-0" />
        ))}
      </div>

      {/* Background Stardust */}
      <div className="absolute inset-0 z-0 opacity-10">
        {STATIC_DATA_POINTS.map((point, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
            style={{ left: point.left, top: point.top }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl px-4 text-center">
        <div id="brand-container" className="relative">
          <h2 className="sub-text text-[9px] tracking-[1.5em] text-white/30 mb-12 uppercase font-black">
            System Protocol 2.6
          </h2>

          <h1
            ref={brandRef}
            id="brand-name"
            className="font-bold uppercase leading-none mb-12 flex items-center justify-center text-[12vw] sm:text-7xl md:text-9xl lg:text-[13rem] select-none whitespace-nowrap"
          >
            {"CODIGO".split("").map((char, i) => (
              <span key={i} className="char inline-block">
                {char}
              </span>
            ))}
          </h1>

          <div className="sub-text flex flex-col items-center">
            <p className="text-xs md:text-sm tracking-[1.8em] text-white/90 uppercase font-black mb-6 mr-[-1.8em]">
              Street & Culture
            </p>
            <div className="flex items-center gap-8 text-[8px] md:text-[9px] tracking-[0.5em] text-white/20 uppercase font-medium">
              <span>EST. 2026</span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span>CORE ARCHIVE</span>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap');
        
        #brand-name {
          font-family: 'Syne', sans-serif;
          background: linear-gradient(to bottom, #ffffff 40%, #909090 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-font-smoothing: antialiased;
          transform: translateZ(0);
        }

        #brand-container {
          filter: drop-shadow(0 0 30px rgba(255,255,255,0.05));
        }
      `
        }}
      />
    </div>
  );
}
