"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import CollectionShowcase from "@/components/CollectionShowcase";
import ProductGrid from "@/components/ProductGrid";
import CultureSection from "@/components/CultureSection";
import TextMarquee from "@/components/TextMarquee";
import SocialProof from "@/components/SocialProof";
import SocialConnect from "@/components/SocialConnect";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-black" />; // Blank black screen during hydration
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10px" }}
        className="glitch-reveal"
      >
        <CollectionShowcase />
      </motion.div>

      <ProductGrid title="New Drops" />

      <TextMarquee />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10px" }}
        className="glitch-reveal"
      >
        <CultureSection />
      </motion.div>

      <ProductGrid title="Best Sellers" />

      <SocialConnect />

      <SocialProof />
    </div>
  );
}
