"use client";

import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { products, loading } = useProducts();

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    return activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  if (loading) {
    return <div className="min-h-screen bg-white pt-32 pb-24 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to selection
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
              The Store
            </h1>
            <div className="w-16 h-1 bg-black"></div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">
              Decoding style, one piece at a time.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? "bg-black text-white"
                    : "bg-white text-black border border-neutral-100 hover:border-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-400">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
