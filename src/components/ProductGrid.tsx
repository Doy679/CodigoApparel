"use client";

import Link from "next/link";
import { useMemo } from "react";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function ProductGrid({ title }: { title: string }) {
  const { products, loading, error } = useProducts();
  const filteredProducts = useMemo(() => {
    if (title === "New Drops") return products.filter((p) => p.isNew);
    return products;
  }, [products, title]);

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="aspect-[3/4] bg-neutral-100 animate-pulse" />
                <div className="h-3 w-1/2 bg-neutral-100 animate-pulse" />
                <div className="h-4 w-3/4 bg-neutral-100 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
              {title}
            </h2>
            <div className="w-16 h-1 bg-black"></div>
          </div>
          <Link
            href="/store"
            className="text-[10px] font-black uppercase tracking-widest border-b-2 border-transparent hover:border-black transition-all pb-1"
          >
            View All Products
          </Link>
        </div>

        {error && (
          <p className="mb-8 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Live catalog unavailable. Showing saved products.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-neutral-400">
              No products available right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
