"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Zap, ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import QuickViewModal from "./QuickViewModal";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart, selectOnlyItem } = useCartStore();

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
    toast.success(`${product.name} added to cart.`);
    router.push("/cart");
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.sizes && product.sizes.length > 0) {
      // If it has sizes, prompt quick view instead so they can choose
      setIsQuickViewOpen(true);
      toast("Please select a size first.");
      return;
    }

    addToCart(product);
    selectOnlyItem(product.id); // Only this item for checkout
    router.push("/checkout");
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
            className={`absolute inset-0 bg-black/5 flex flex-col items-center justify-end p-4 transition-all duration-300 opacity-0 group-hover:opacity-100`}
          >
            <div className="flex gap-1.5 w-full">
              <button
                onClick={handleAddToCart}
                title="Add to Cart"
                className="flex-1 bg-white text-black py-3 text-[8px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border border-neutral-200"
              >
                <ShoppingBag size={12} />
                <span>+ Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                title="Buy Now"
                className="flex-1 bg-black text-white py-3 text-[8px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Zap size={12} className="fill-white" />
                <span>Buy Now</span>
              </button>
              <button
                onClick={handleQuickView}
                title="Quick View"
                className="bg-white text-black px-3 py-3 hover:bg-neutral-100 transition-all flex items-center justify-center cursor-pointer border border-neutral-200"
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
            <p className="text-sm font-bold tracking-tight text-neutral-900">
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
