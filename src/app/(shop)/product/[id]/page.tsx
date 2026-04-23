"use client";

import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Truck, RefreshCw, Zap, ShoppingBag } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import BackButton from "@/components/BackButton";
import SizeGuideModal from "@/components/SizeGuideModal";
import { useState, use } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";
import { useEffect as useGsapEffect, useRef } from "react";
import gsap from "gsap";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { addToCart, selectOnlyItem } = useCartStore();
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useGsapEffect(() => {
    if (product?.isPremium && imageContainerRef.current) {
      const container = imageContainerRef.current;

      const handleMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = container.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to(container, {
          rotateY: x * 20,
          rotateX: -y * 20,
          scale: 1.05,
          duration: 0.5,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(container, {
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)"
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [product]);

  if (loading) {
    return <div className="min-h-screen bg-white pt-24 text-center">Loading...</div>;
  }

  if (!product) {
    notFound();
  }

  const allMedia = [product.image, ...(product.additionalImages || [])];
  if (product.videoUrl) allMedia.push(product.videoUrl);
  const currentMedia = activeImage || product.image;

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      setShowSizeError(true);
      return;
    }
    setShowSizeError(false);
    addToCart(product, selectedSize);
    toast.success(`${product.name} added to cart.`);
    router.push("/cart");
  };

  const handleBuyNow = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      setShowSizeError(true);
      return;
    }
    setShowSizeError(false);
    addToCart(product, selectedSize);
    selectOnlyItem(product.id, selectedSize); // Ensure only this item is selected for checkout
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <BackButton />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images - Sticky on Desktop */}
          <div className="space-y-6 lg:sticky lg:top-32 h-fit" style={{ perspective: "1000px" }}>
            <div
              ref={imageContainerRef}
              className="relative aspect-[3/4] bg-neutral-100 overflow-hidden shadow-2xl transition-shadow"
            >
              {currentMedia.endsWith(".mp4") ? (
                <video
                  src={currentMedia}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src={currentMedia}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-500"
                  priority
                />
              )}
            </div>

            {allMedia.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {allMedia.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(media)}
                    className={`relative aspect-[3/4] bg-neutral-100 overflow-hidden border-2 transition-all cursor-pointer ${
                      currentMedia === media
                        ? "border-black"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    {media.endsWith(".mp4") ? (
                      <video
                        src={media}
                        muted
                        playsInline
                        className="object-cover w-full h-full opacity-70"
                      />
                    ) : (
                      <Image
                        src={media}
                        alt={`${product.name} detail ${idx}`}
                        fill
                        className="object-cover"
                      />
                    )}
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
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Select Size
                  </span>
                  {showSizeError && (
                    <span className="text-[8px] font-black uppercase text-red-500 tracking-widest animate-pulse">
                      Please select a size
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || ["S", "M", "L", "XL", "2XL", "3XL"]).map((size) => {
                    const isOutOfStock = product.stockPerSize && product.stockPerSize[size] === 0;
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          if (isOutOfStock) return;
                          setSelectedSize(size);
                          setShowSizeError(false);
                        }}
                        disabled={isOutOfStock}
                        className={`w-12 h-12 border-2 flex items-center justify-center text-xs font-black transition-all ${
                          isOutOfStock
                            ? "border-neutral-100 text-neutral-300 bg-neutral-50 cursor-not-allowed line-through"
                            : selectedSize === size
                              ? "border-black bg-black text-white cursor-pointer"
                              : "border-neutral-100 hover:border-black cursor-pointer"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-black text-black py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-50 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-black text-white py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Zap size={18} className="fill-white" />
                  Buy Now
                </button>
              </div>
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
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
