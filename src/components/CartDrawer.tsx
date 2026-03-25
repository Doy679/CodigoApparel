"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, updateItemSize, cartTotal, cartCount } = useCart();

  const hasMissingSizes = cart.some(item => !item.selectedSize);

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
                <span className="text-xs font-black uppercase tracking-widest">Your Bag ({cartCount})</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} className="text-neutral-400" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Your bag is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-4 group">
                    <div className="relative w-24 aspect-[3/4] bg-neutral-100 overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[10px] font-black uppercase italic tracking-tighter">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-neutral-400 hover:text-black transition-colors cursor-pointer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        {/* Size Selection logic in Drawer */}
                        <div className="py-2">
                          {item.selectedSize ? (
                            <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Size: {item.selectedSize}</p>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">Select Size Required</p>
                              <div className="flex flex-wrap gap-1">
                                {['S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
                                  <button 
                                    key={size}
                                    onClick={() => updateItemSize(item.id, item.selectedSize, size)}
                                    className="w-7 h-7 border border-neutral-200 flex items-center justify-center text-[7px] font-black hover:border-black transition-all cursor-pointer"
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <p className="text-[10px] font-black uppercase">₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                      </div>
  
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-neutral-100">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                              className="p-1.5 hover:bg-neutral-50 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-[10px] font-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                              className="p-1.5 hover:bg-neutral-50 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
  
              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-neutral-100 space-y-4">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>₱{cartTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  {hasMissingSizes && (
                    <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest text-center">
                      Please select sizes for all items to proceed
                    </p>
                  )}

                  <p className="text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Shipping and taxes calculated at checkout</p>
                  
                  {hasMissingSizes ? (
                    <div className="w-full bg-neutral-100 text-neutral-400 py-5 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center cursor-not-allowed">
                      Checkout
                    </div>
                  ) : (
                    <Link 
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center text-center"
                    >
                      Checkout
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
}
