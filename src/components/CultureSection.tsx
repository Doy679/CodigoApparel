"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CultureSection() {
  return (
    <section className="py-24 bg-black text-white overflow-hidden relative">
      {/* Background decoration - grungy typography */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
        <div className="text-[20vw] font-black uppercase italic leading-none absolute -left-10 -top-10 rotate-12">
          CODIGO
        </div>
        <div className="text-[15vw] font-black uppercase italic leading-none absolute -right-10 -bottom-10 -rotate-12">
          STREET
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight">THE CODIGO</h2>
            <div className="w-16 h-1 bg-white mx-auto"></div>
          </div>
          
          <div className="space-y-6 text-lg md:text-xl text-neutral-300 font-medium leading-relaxed max-w-3xl mx-auto pt-4">
            <p>
              "Codigo Street & Culture isn't just an apparel line; it’s a lifestyle encrypted in the streets. Born from the intersection of urban grit and cultural identity, we create garments for those who live by their own rules."
            </p>
            <p>
              "'Codigo' represents the unwritten code of the city—the hustle, the art, and the community that keeps it alive. Our mission is to provide high-quality streetwear that serves as a canvas for self-expression. We don't follow trends; we decode them."
            </p>
          </div>

          <div className="pt-8">
            <Link 
              href="/about" 
              className="inline-flex items-center gap-3 group text-xs font-black uppercase tracking-[0.3em] border-b-2 border-white pb-2 hover:text-neutral-400 hover:border-neutral-400 transition-all"
            >
              OUR STORY
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
