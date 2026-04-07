"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const router = useRouter();
  const { addToCart, selectOnlyItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) return null;

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    addToCart(product, selectedSize || undefined);
    toast.success(`${product.name} added to cart.`);
    onClose();
    router.push("/cart");
  };

  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    addToCart(product, selectedSize || undefined);
    selectOnlyItem(product.id, selectedSize || undefined); // Only this item for checkout
    onClose();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white z-[101] overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white text-black hover:bg-neutral-100 transition-colors border border-neutral-200"
            >
              <X size={20} />
            </button>

            <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
              <div className="mb-auto">
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2">
                  {product.category}
                </p>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none mb-4">
                  {product.name}
                </h2>
                <p className="text-xl font-bold tracking-tight mb-8">
                  ₱{product.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>

                <div className="mb-8">
                  <p className="text-sm text-neutral-600 mb-6 font-medium leading-relaxed">
                    {product.description}
                  </p>
                  <ul className="space-y-2">
                    {product.details.map((detail, index) => (
                      <li
                        key={index}
                        className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.1em] flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-black" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3">
                      Select Size
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-2 ${
                            selectedSize === size
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border-neutral-100 hover:border-black"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-neutral-100">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-black text-black py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap size={16} className="fill-white" />
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
