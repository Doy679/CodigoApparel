"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import BackButton from "@/components/BackButton";
import { useState, use } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useProducts } from "@/hooks/useProducts";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  if (loading) {
    return <div className="min-h-screen bg-white pt-24 text-center">Loading...</div>;
  }

  if (!product) {
    notFound();
  }

  const allImages = [product.image, ...(product.additionalImages || [])];
  const currentImage = activeImage || product.image;

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <BackButton />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images - Sticky on Desktop */}
          <div className="space-y-6 lg:sticky lg:top-32 h-fit">
            <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-500"
                priority
              />
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-[3/4] bg-neutral-100 overflow-hidden border-2 transition-all cursor-pointer ${
                      currentImage === img
                        ? "border-black"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} detail ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-8 h-fit">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">
                {product.category}
              </p>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                {product.name}
              </h1>
              <p className="text-2xl font-black mt-4">
                ₱{product.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-neutral-600 leading-relaxed font-medium">{product.description}</p>

              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-neutral-500"
                  >
                    <div className="w-1.5 h-1.5 bg-black"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Select Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border-2 flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-neutral-100 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => addToCart(product, selectedSize)}
                className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-neutral-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-neutral-400" />
                <span className="text-[8px] font-black uppercase tracking-widest">PH Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw size={20} className="text-neutral-400" />
                <span className="text-[8px] font-black uppercase tracking-widest">
                  7-Day Returns
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck size={20} className="text-neutral-400" />
                <span className="text-[8px] font-black uppercase tracking-widest">
                  Authentic Code
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductGrid title="You might also like" />
    </div>
  );
}
