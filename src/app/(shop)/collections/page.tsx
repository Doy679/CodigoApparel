"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const collections = [
  {
    id: "corduroy",
    title: "The Corduroy Code",
    description:
      "Premium textures for the street. A study in earth tones and high-density stitching.",
    image: "/images/products/C-CBR-03.jpg", // Using existing product image as collection cover
    year: "FW24"
  },
  {
    id: "acid-wash",
    title: "Acid Wash Series",
    description: "A little toxic. Hand-finished textures meets the signature code.",
    image: "/images/products/C-AW-01.jpg",
    year: "SS25"
  }
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to origin
        </Link>

        <div className="mb-24">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-6">
            Collections
          </h1>
          <div className="w-24 h-1 bg-black mb-6"></div>
          <p className="text-sm md:text-base font-bold uppercase tracking-widest text-neutral-400 max-w-md">
            The archive. Every drop tells a story.
          </p>
        </div>

        <div className="flex flex-col gap-32">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-12 items-center`}
            >
              <div className="w-full md:w-3/5">
                <Link
                  href={`/store?collection=${collection.id}`}
                  className="block relative aspect-[4/5] overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-500" />
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
                  />
                </Link>
              </div>

              <div className="w-full md:w-2/5 space-y-6">
                <span className="inline-block border border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                  {collection.year}
                </span>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  {collection.title}
                </h2>
                <p className="text-neutral-600 text-sm leading-relaxed max-w-md">
                  {collection.description}
                </p>
                <Link
                  href={`/store`}
                  className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest border-b-2 border-transparent hover:border-black transition-all pb-1 mt-4"
                >
                  Explore Drop
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
