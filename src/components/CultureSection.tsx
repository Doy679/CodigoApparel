"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight">
                THE CODIGO
              </h2>
              <div className="w-16 h-1 bg-white"></div>
            </div>

            <div className="space-y-6 text-lg md:text-xl text-neutral-300 font-medium leading-relaxed pt-4">
              <p>
                &quot;Codigo Street &amp; Culture isn&apos;t just an apparel line; it’s a lifestyle
                encrypted in the streets. Born from the intersection of urban grit and cultural
                identity, we create garments for those who live by their own rules.&quot;
              </p>
              <p>
                &quot;&apos;Codigo&apos; represents the unwritten code of the city—the hustle, the
                art, and the community that keeps it alive. Our mission is to provide high-quality
                streetwear that serves as a canvas for self-expression. We don&apos;t follow trends;
                we decode them.&quot;
              </p>
            </div>

            <div className="pt-8">
              <Link
                href="/about"
                data-cursor="STORY"
                className="inline-flex items-center gap-3 group text-xs font-black uppercase tracking-[0.3em] border-b-2 border-white pb-2 hover:text-neutral-400 hover:border-neutral-400 transition-all"
              >
                OUR STORY
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="relative grid grid-cols-2 gap-4 h-[600px]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative aspect-[3/4] self-start"
            >
              <div className="absolute -inset-1 bg-white/10 blur-2xl z-0"></div>
              <Image
                src="/images/community/comm-8.jpg"
                alt="Culture Showcase 01"
                fill
                className="object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest bg-white text-black px-2 py-1">
                CODE: STREET
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative aspect-[3/4] self-end"
            >
              <div className="absolute -inset-1 bg-white/10 blur-2xl z-0"></div>
              <Image
                src="/images/community/comm-9.jpg"
                alt="Culture Showcase 02"
                fill
                className="object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-4 right-4 z-20 text-[10px] font-black uppercase tracking-widest bg-white text-black px-2 py-1">
                CODE: CULTURE
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
