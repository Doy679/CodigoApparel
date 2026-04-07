"use client";

import React from "react";
import { useCartStore, useCartTotal, useCartCount } from "@/store/useCartStore";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCartStore();
  const cartTotal = useCartTotal();
  const cartCount = useCartCount();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Quick Bag ({cartCount})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-1 bg-neutral-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} className="text-neutral-200" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300">
                    Your bag is empty
                  </p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-4 group">
                    <div className="relative w-20 aspect-[3/4] bg-neutral-100 overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[9px] font-black uppercase italic tracking-tighter">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="text-neutral-300 hover:text-black transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
                          {item.selectedSize ? `Size: ${item.selectedSize}` : "No size selected"}
                        </p>

                        <p className="text-[9px] font-black uppercase">
                          ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-neutral-100">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1, item.selectedSize)
                            }
                            className="p-1 hover:bg-neutral-50 transition-colors"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-6 text-center text-[9px] font-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1, item.selectedSize)
                            }
                            className="p-1 hover:bg-neutral-50 transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-100 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span>Subtotal</span>
                <span>₱{cartTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
              </div>

              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
              >
                View Full Cart <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
