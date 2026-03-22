"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function SocialConnect() {
  const fbLink = "https://www.facebook.com/profile.php?id=61588231542552";

  return (
    <section className="py-12 md:py-16 bg-neutral-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
          {/* Text Content */}
          <div className="space-y-5 order-2 lg:order-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <span className="text-[8px] font-black uppercase tracking-[0.6em] text-neutral-400">
                Join The Collective
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                DECODE THE <br /> <span className="text-neutral-300">CULTURE</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[11px] md:text-xs text-neutral-600 max-w-xs mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              Stay encoded. Follow our official Facebook page for exclusive drops and community
              highlights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-1"
            >
              <Link
                href={fbLink}
                target="_blank"
                data-cursor="CONNECT"
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-black text-white text-[8px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all group"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                FOLLOW CODIGO
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* QR Code Branded Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <Link
              href={fbLink}
              target="_blank"
              data-cursor="DECODE"
              className="relative aspect-[3/4] w-full max-w-[260px] bg-black overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.05)] group cursor-pointer"
            >
              <Image
                src="/images/community/fb-qr-code.jpg"
                alt="Codigo Facebook QR"
                fill
                className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">
                  Scan to decode
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
