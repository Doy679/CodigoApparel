"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const tshirtPathRef = useRef<SVGPathElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tshirtPath = tshirtPathRef.current;
    if (!tshirtPath) return;

    // 1. Setup SVG Path Drawing
    const pathLength = tshirtPath.getTotalLength();

    // Initialize SVG properties for drawing
    tshirtPath.style.strokeDasharray = `${pathLength}`;
    tshirtPath.style.strokeDashoffset = `${pathLength}`;

    // 2. Setup GSAP Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the entire loader after the animation sequence
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete();
          }
        });
      }
    });

    // Draw the T-Shirt smoothly
    tl.to(
      tshirtPath,
      {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power4.inOut"
      },
      0
    );

    // High-speed Counter
    const counter = { value: 0 };
    tl.to(
      counter,
      {
        value: 100,
        duration: 2.5,
        ease: "power4.inOut",
        onUpdate: () => {
          setProgress(Math.round(counter.value));
        }
      },
      0
    )

      // T-shirt glows up
      .add(() => {
        tshirtPath.classList.add("filled-tshirt");
      }, "-=0.3")

      // Extremely snappy counter exit
      .to(
        "#progress-counter",
        {
          opacity: 0,
          y: -40,
          scale: 0.8,
          duration: 0.4,
          ease: "back.in(2)"
        },
        "+=0.1"
      )

      // Cinematic, high-impact reveal of "CODIGO"
      .to(
        "#brand-name",
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          letterSpacing: "0.08em",
          duration: 1.5,
          ease: "expo.out"
        },
        "-=0.1"
      )

      // Reveal "Street & Culture" wrapping lines dynamically
      .to(
        "#brand-sub",
        {
          opacity: 1,
          y: -10,
          duration: 0.5,
          ease: "power2.out"
        },
        "-=1.0"
      )
      .to(
        ["#line-left", "#line-right"],
        {
          width: "2.5rem", // dynamic expansion
          duration: 1,
          ease: "expo.out"
        },
        "-=0.8"
      )

      // Reveal Site Tagline cleanly
      .to(
        "#site-tagline",
        {
          opacity: 1,
          y: -5,
          duration: 1.2,
          ease: "power2.out"
        },
        "-=0.6"
      );

    // Add an extra delay before fading the whole screen out to let the user see the result
    tl.to({}, { duration: 1.5 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#050505] text-white overflow-hidden font-['Montserrat',sans-serif]"
    >
      {/* Cinematic noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[45]"
        style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.03%22/%3E%3C/svg%3E')`
        }}
      />

      <div className="relative z-10 flex flex-col items-center mt-8">
        {/* Dynamic T-Shirt Vector */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 mb-6 sm:mb-8">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl relative z-10">
            <path
              ref={tshirtPathRef}
              className="fill-transparent stroke-white stroke-[1.5] transition-[stroke-width,filter] duration-400 ease-out"
              strokeLinejoin="round"
              strokeLinecap="round"
              d="M 35 15 
                 Q 50 28 65 15 
                 L 85 20 
                 L 98 40 
                 L 78 48 
                 L 78 90 
                 L 22 90 
                 L 22 48 
                 L 2 40 
                 L 15 20 Z"
            />
          </svg>
        </div>

        {/* Progress Counter */}
        <div className="text-center overflow-hidden h-10 sm:h-12 flex items-center justify-center mb-4 sm:mb-6">
          <h2
            id="progress-counter"
            className="font-['Oswald',sans-serif] text-3xl sm:text-4xl md:text-6xl font-bold tracking-widest text-white"
          >
            {progress}%
          </h2>
        </div>

        {/* Brand Reveal */}
        <div className="text-center flex flex-col items-center px-4 w-full">
          <h1
            id="brand-name"
            className="font-['Oswald',sans-serif] text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold uppercase opacity-0 text-white"
            style={{ letterSpacing: "0.5em", transform: "scale(1.5)", filter: "blur(10px)" }}
          >
            CODIGO
          </h1>

          <div
            className="flex flex-col items-center mt-4 sm:mt-6 opacity-0 w-full max-w-[100vw] overflow-hidden"
            id="brand-sub"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-6 w-full">
              <div className="h-[1px] w-0 bg-gray-500" id="line-left"></div>
              <p className="text-[8px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.8em] text-white uppercase font-bold whitespace-nowrap">
                Street & Culture
              </p>
              <div className="h-[1px] w-0 bg-gray-500" id="line-right"></div>
            </div>
            {/* Site Tagline */}
            <p
              id="site-tagline"
              className="text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.1em] sm:tracking-[0.3em] text-gray-500 uppercase mt-6 sm:mt-8 opacity-0 font-medium text-center"
            >
              Redefining style for the modern individual.
            </p>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .filled-tshirt {
          stroke-width: 2.5px !important;
          filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.6));
        }
      `
        }}
      />
    </div>
  );
}
