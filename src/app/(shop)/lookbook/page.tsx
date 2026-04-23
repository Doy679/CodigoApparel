"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LookbookPage() {
  const editorials = [
    {
      id: 1,
      title: "The Concrete Code",
      subtitle: "Fall/Winter 2026",
      image: "/landing-page-bg.jpg",
      description:
        "Exploring the raw textures of the city. A collection built for the grind, featuring heavy corduroy and acid-washed essentials.",
      link: "/collections"
    },
    {
      id: 2,
      title: "Neon Nights",
      subtitle: "Spring Capsule",
      image: "/images/products/C-CB-01.jpg",
      description:
        "When the sun goes down, the streets come alive. High-contrast stitching and reflective details for the nocturnal wanderer.",
      link: "/collections"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* Header */}
      <div className="container mx-auto px-4 md:px-8 mb-16 md:mb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic mb-4">
            Editorial <br />{" "}
            <span className="text-transparent" style={{ WebkitTextStroke: "2px black" }}>
              Lookbook
            </span>
          </h1>
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-neutral-500 max-w-2xl mx-auto">
            Visual narratives. The stories behind the stitches.
          </p>
        </motion.div>
      </div>

      {/* Editorials */}
      <div className="container mx-auto px-4 md:px-8 flex flex-col gap-24 md:gap-32">
        {editorials.map((editorial, index) => (
          <motion.div
            key={editorial.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-16 items-center`}
          >
            {/* Image */}
            <div className="w-full md:w-2/3">
              <div className="relative aspect-[4/3] md:aspect-[16/9] bg-neutral-100 overflow-hidden group">
                <Image
                  src={editorial.image}
                  alt={editorial.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/3 flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-4">
                {editorial.subtitle}
              </p>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-6 leading-none">
                {editorial.title}
              </h2>
              <p className="text-sm text-neutral-600 mb-10 leading-relaxed">
                {editorial.description}
              </p>
              <Link
                href={editorial.link}
                className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] group border-b-2 border-black pb-2 w-fit hover:pr-4 transition-all"
              >
                Explore Collection
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
