"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.sizes && product.sizes.length > 0) {
      // If it has sizes, prompt quick view instead so they can choose
      setIsQuickViewOpen(true);
      toast("Please select a size first.");
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="group relative flex flex-col gap-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/product/${product.id}`}
          data-cursor="DECODE"
          className="relative aspect-[3/4] overflow-hidden bg-neutral-100 transition-all duration-500 ease-in-out block"
        >
          {/* Main Image */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isHovered && product.hoverImage ? "opacity-0" : "opacity-100"}`}
          >
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>

          {/* Hover Image */}
          {product.hoverImage && (
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-neutral-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={product.hoverImage}
                alt={`${product.name} - Hover View`}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Labels */}
          {product.isNew && (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5">
                New Drop
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black/5 flex flex-col items-center justify-end p-6 transition-all duration-300 opacity-0 group-hover:opacity-100`}
          >
            <div className="flex gap-2 w-full">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white text-black py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={14} />
                Add to Cart
              </button>
              <button
                onClick={handleQuickView}
                className="bg-white text-black p-3 hover:bg-black hover:text-white transition-all flex items-center justify-center cursor-pointer"
              >
                <Eye size={14} />
              </button>
            </div>
          </div>
        </Link>

        <div className="flex flex-col gap-1 px-1">
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
            {product.category}
          </p>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-black uppercase tracking-tighter hover:opacity-60 transition-opacity italic">
              <Link href={`/product/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="text-sm font-bold tracking-tight">
              ₱{product.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </motion.div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
