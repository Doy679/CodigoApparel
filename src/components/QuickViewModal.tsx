"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Product } from "@/data/products";
import { Button } from "./ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { useState } from "react";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) return null;

  const handleAddToCart = () => {
    // Basic implementation: if sizes exist, require one to be selected.
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    addToCart(product); // In a real app, you'd pass the selected size to the cart as well
    toast.success(`${product.name} added to cart`);
    onClose();
    setIsCartOpen(true);
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white z-[101] overflow-hidden flex flex-col md:flex-row"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white text-black hover:bg-neutral-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col justify-center">
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
                <p className="text-sm text-neutral-600 mb-6">{product.description}</p>
                <ul className="list-disc pl-5 space-y-2">
                  {product.details.map((detail, index) => (
                    <li
                      key={index}
                      className="text-xs text-neutral-500 font-medium uppercase tracking-wider"
                    >
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
                        className={`w-12 h-12 flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : "bg-white text-black border border-neutral-200 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full mt-auto flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
