"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Zap, Shield, Users } from "lucide-react";

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Navigation */}
        <motion.div {...fadeIn}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors mb-16"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </motion.div>

        {/* Hero Section */}
        <div className="max-w-4xl mb-24">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-8"
          >
            The Story <br /> <span className="text-neutral-300">of the Code</span>
          </motion.h1>
          <motion.p
            {...fadeIn}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl font-medium text-neutral-600 leading-relaxed italic"
          >
            &quot;Codigo Street &amp; Culture isn&apos;t just an apparel line; it’s a lifestyle
            encrypted in the streets.&quot;
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square bg-neutral-100 overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/community/comm-11.jpg"
              alt="Codigo Origin"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                Born in the Grit
              </h2>
              <p className="text-neutral-600 leading-relaxed font-medium">
                Born from the intersection of urban grit and cultural identity, we create garments
                for those who live by their own rules. &apos;Codigo&apos; represents the unwritten
                code of the city—the hustle, the art, and the community that keeps it alive.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                Beyond the Print
              </h2>
              <p className="text-neutral-600 leading-relaxed font-medium">
                We believe in permanence. That&apos;s why every piece of the code is meticulously
                stitched, never just printed. Our embroidery represents the threads that bind the
                community together—strong, steady, and built to last.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* New Craftsmanship Section with comm-12 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-8 lg:order-1 order-2"
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                The Stitched Standard
              </h2>
              <p className="text-neutral-600 leading-relaxed font-medium">
                Our quality is our signature. From the density of the corduroy to the tension of the
                thread, we obsess over the details that others ignore. Each piece is a testament to
                the culture we represent.
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="pt-4">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">
                <div className="w-12 h-px bg-neutral-200"></div>
                AUTHENTIC_CODE_STITCHED
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative aspect-[4/5] bg-neutral-100 overflow-hidden shadow-2xl lg:order-2 order-1"
          >
            <Image
              src="/images/community/comm-12.jpg"
              alt="Craftsmanship Detail"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute top-8 right-8 z-20 bg-black text-white p-4 text-[8px] font-black uppercase tracking-widest">
              QUALITY_DET_01
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-24 border-y border-neutral-100 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-full">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">
              Self Expression
            </h3>
            <p className="text-sm text-neutral-500 font-medium">
              Our mission is to provide high-quality streetwear that serves as a canvas for your
              unique voice.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-full">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">
              Uncompromised Quality
            </h3>
            <p className="text-sm text-neutral-500 font-medium">
              Premium corduroy, heavyweight cotton, and high-density stitching in every single
              piece.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-full">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">The Collective</h3>
            <p className="text-sm text-neutral-500 font-medium">
              We don&apos;t follow trends; we decode them. Join the collective of individuals living
              by the code.
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-24 bg-neutral-900 text-white"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8">
            Ready to Decode?
          </h2>
          <Link
            href="/store"
            className="inline-block px-12 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-neutral-200 transition-all"
          >
            Explore the Collection
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
