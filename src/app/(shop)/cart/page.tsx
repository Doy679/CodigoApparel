"use client";

import React from "react";
import { useCartStore, useCartTotal, useSelectedCount } from "@/store/useCartStore";
import { ShoppingBag, ArrowLeft, Trash2, ArrowRight, Plus, Minus, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateItemSize,
    toggleSelectItem,
    toggleSelectAll
  } = useCartStore();
  const selectedCount = useSelectedCount();
  const cartTotal = useCartTotal();
  const router = useRouter();

  const selectedItems = cart.filter((item) => item.selected);
  const hasMissingSizes = selectedItems.some((item) => !item.selectedSize);
  const allSelected = cart.length > 0 && cart.every((item) => item.selected);

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Continue Shopping
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ShoppingBag size={32} className="text-black" />
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                Your Cart
              </h1>
            </div>
            <div className="w-16 h-1 bg-black"></div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">
              Select items to proceed to checkout.
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center space-y-8">
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-300 italic">
              Your cart is currently empty.
            </p>
            <Link
              href="/store"
              className="inline-block bg-black text-white px-12 py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all"
            >
              Shop Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-2 space-y-8">
              {/* Select All Bar */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <button
                  onClick={() => toggleSelectAll(!allSelected)}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${allSelected ? "bg-black border-black" : "border-neutral-300 group-hover:border-black"}`}
                  >
                    {allSelected && <Check size={12} className="text-white" strokeWidth={4} />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {allSelected ? "Deselect All" : "Select All Items"} ({cart.length})
                  </span>
                </button>
              </div>

              {cart.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={`${item.id}-${item.selectedSize}`}
                  className={`flex flex-col sm:flex-row gap-8 border-b border-neutral-100 pb-8 group transition-opacity ${!item.selected ? "opacity-60" : "opacity-100"}`}
                >
                  {/* Selection Checkbox */}
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleSelectItem(item.id, item.selectedSize)}
                      className={`w-6 h-6 border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${item.selected ? "bg-black border-black" : "border-neutral-200 hover:border-black"}`}
                    >
                      {item.selected && <Check size={14} className="text-white" strokeWidth={4} />}
                    </button>
                  </div>

                  <div className="relative w-full sm:w-48 aspect-[3/4] bg-neutral-100 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-grow flex flex-col justify-between py-2">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">
                            {item.category}
                          </p>
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                            {item.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="text-neutral-300 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest">
                        <span className="bg-neutral-50 px-3 py-1 border border-neutral-100">
                          PRICE: ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </span>
                        {item.selectedSize ? (
                          <span className="bg-black text-white px-3 py-1">
                            SIZE: {item.selectedSize}
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-red-500 mr-2 animate-pulse">SELECT SIZE:</span>
                            {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                              <button
                                key={size}
                                onClick={() => updateItemSize(item.id, item.selectedSize, size)}
                                className="w-8 h-8 border border-neutral-200 flex items-center justify-center text-[8px] font-black hover:border-black transition-all"
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-neutral-500 font-medium leading-relaxed max-w-md">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 mt-8">
                      <div className="flex items-center border-2 border-black">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1, item.selectedSize)
                          }
                          className="p-3 hover:bg-neutral-50 transition-colors border-r border-black"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-12 text-center text-xs font-black">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1, item.selectedSize)
                          }
                          className="p-3 hover:bg-neutral-50 transition-colors border-l border-black"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <p className="text-sm font-black">
                        ITEM TOTAL: ₱
                        {(item.price * item.quantity).toLocaleString("en-PH", {
                          minimumFractionDigits: 2
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-neutral-50 p-8 md:p-12 space-y-8 h-fit lg:sticky lg:top-32 border border-neutral-100">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-neutral-200 pb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-neutral-400">Selected Items</span>
                  <span className="text-black">{selectedCount}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-neutral-400">Shipping</span>
                  <span className="text-black">Calculated at Checkout</span>
                </div>
                <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest">
                    Total Selection
                  </span>
                  <span className="text-xl font-black italic tracking-tighter">
                    ₱{cartTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {selectedCount === 0 && (
                <div className="bg-orange-50 p-4 border border-orange-100">
                  <p className="text-[9px] text-orange-600 font-black uppercase tracking-widest text-center">
                    Please select at least one item
                  </p>
                </div>
              )}

              {hasMissingSizes && (
                <div className="bg-red-50 p-4 border border-red-100">
                  <p className="text-[9px] text-red-600 font-black uppercase tracking-widest text-center">
                    Select sizes for all selected items
                  </p>
                </div>
              )}

              <button
                disabled={selectedCount === 0 || hasMissingSizes}
                onClick={() => router.push("/checkout")}
                className={`w-full bg-black text-white text-center py-6 text-xs font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 ${selectedCount === 0 || hasMissingSizes ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                Checkout Selected <ArrowRight size={16} />
              </button>

              <Link
                href="/store"
                className="block w-full border border-neutral-200 text-center py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-50 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
