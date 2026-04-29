"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { products } = useProducts();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return products.filter((p) => {
      const haystack = `${p.name} ${p.category} ${p.description}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [products, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-white flex flex-col"
        >
          <div className="container mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col h-full max-w-6xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-400">
                Search The Collective
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 transition-colors rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Compact Search Input */}
            <div className="relative mb-12">
              <input
                ref={inputRef}
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-b-2 border-black py-4 md:py-6 text-2xl md:text-4xl font-black uppercase italic tracking-tighter placeholder:text-neutral-100 focus:outline-none transition-all"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-200">
                <Search size={24} className="md:w-8 md:h-8" />
              </div>
            </div>

            {/* Results Section */}
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
              {query && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : query ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 italic">
                    No decodes found for &quot;{query}&quot;
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                    Trending Keywords
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["CORDUROY", "ACID WASH", "TOPS", "BEST SELLERS", "NEW DROPS"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-5 py-2.5 border border-neutral-200 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
