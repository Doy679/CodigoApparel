"use client";

import ProductCard from "./ProductCard";
import { products } from "@/data/products";

export default function ProductGrid({ title }: { title: string }) {
  const filteredProducts = title === "New Drops" 
    ? products.filter(p => p.isNew) 
    : products;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">{title}</h2>
            <div className="w-16 h-1 bg-black"></div>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-transparent hover:border-black transition-all pb-1">
            View All Products
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
