"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore, useCartCount } from "@/store/useCartStore";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const cartCount = useCartCount();

  useEffect(() => {
    if (!isMounted) {
      setTimeout(() => setIsMounted(true), 0);
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md py-3 text-black border-b border-gray-100"
            : "bg-transparent py-4 text-white"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button className="lg:hidden">
                <Menu size={20} />
              </button>
              <nav className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em]">
                <Link href="/store" className="hover:text-neutral-400 transition-colors">
                  Store
                </Link>
                <Link href="/collections" className="hover:text-neutral-400 transition-colors">
                  Collections
                </Link>
                <Link href="/about" className="hover:text-neutral-400 transition-colors">
                  Manifesto
                </Link>
              </nav>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
              <Link
                href="/"
                className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-none"
              >
                Codigo
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-neutral-400 transition-colors"
              >
                <Search size={18} />
              </button>
              <button className="hover:text-neutral-400 transition-colors hidden sm:block">
                <User size={18} />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="hover:text-neutral-400 transition-colors flex items-center gap-2 relative"
              >
                <ShoppingBag size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  ({isMounted ? cartCount : 0})
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <CartDrawer />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
