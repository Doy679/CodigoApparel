"use client";

// IntroLoader v2.2 - NUKED Scramble Effect (Broken Lines) for Clean Reveal
import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";

// Generate stable random positions outside component to strictly satisfy React purity rules
const STATIC_DATA_POINTS = [...Array(20)].map(() => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`
}));

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          clipPath: "inset(50% 0 50% 0)",
          duration: 1.2,
          ease: "expo.inOut",
          onComplete: onComplete
        });
      }
    });

    // 1. Initial State
    gsap.set("#brand-name", { opacity: 0, scale: 0.9, rotateX: 45, z: -200 });
    gsap.set(".sub-text", { y: 20, opacity: 0 });

    // 2. TIMELINE SEQUENCE
    tl.set(".data-point", { opacity: 0, scale: 0 })
      .set("#brand-container", { perspective: 1000 })

      // Phase A: The Hold (Building Tension)
      .to({}, { duration: 1 })

      // Phase B: Brand Emergence (Ultra-Smooth)
      .to("#brand-name", {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        z: 0,
        duration: 2,
        ease: "expo.out"
      })
      .to(
        ".data-point",
        {
          opacity: 0.4,
          scale: 1,
          stagger: { amount: 0.6, from: "center" },
          duration: 1,
          ease: "power2.out"
        },
        "-=1.5"
      )

      // Phase C: Sub-elements
      .to(
        ".sub-text",
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out"
        },
        "-=0.8"
      )

      .to({}, { duration: 2 }); // Final Hold for Brand Impression

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-[#050505] text-white overflow-hidden font-['Montserrat',sans-serif]"
    >
      {/* Background FX - Subtle Stardust */}
      <div className="absolute inset-0 z-0 opacity-20">
        {STATIC_DATA_POINTS.map((point, i) => (
          <div
            key={i}
            className="data-point absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: point.left,
              top: point.top
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-6 text-center">
        <div id="brand-container" className="text-center">
          <h2 className="text-[10px] tracking-[1.5em] text-white/20 mb-12 uppercase font-black">
            System Initializing
          </h2>

          <h1
            id="brand-name"
            className="font-bold uppercase tracking-[-0.02em] leading-none mb-12 flex items-center justify-center text-8xl md:text-9xl lg:text-[12rem] select-none"
          >
            CODIGO
          </h1>

          <div className="overflow-hidden">
            <div className="sub-text flex flex-col items-center">
              <p className="text-xs md:text-sm tracking-[1.5em] text-white/90 uppercase font-black mb-6">
                Street & Culture
              </p>
              <div className="flex items-center gap-6 text-[8px] md:text-[10px] tracking-[0.4em] text-white/20 uppercase font-medium">
                <span>EST. 2026</span>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span>PH • CORE</span>
              </div>
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
          letter-spacing: -0.05em;
          text-shadow: 0 0 60px rgba(255,255,255,0.1);
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.2));
          background: linear-gradient(to bottom, #ffffff 0%, #808080 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .data-point {
          box-shadow: 0 0 10px white;
        }
      `
        }}
      />
    </div>
  );
}
