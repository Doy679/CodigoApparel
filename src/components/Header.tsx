"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCartCount } from "@/store/useCartStore";
import SearchOverlay from "./SearchOverlay";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const scrollFrame = useRef<number | null>(null);
  const scrolledRef = useRef(false);
  const cartCount = useCartCount();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }
    }, 0);
    const updateScrollState = () => {
      scrollFrame.current = null;
      const nextIsScrolled = window.scrollY > 2;
      if (scrolledRef.current !== nextIsScrolled) {
        scrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }
    };
    const handleScroll = () => {
      if (scrollFrame.current === null) {
        scrollFrame.current = window.requestAnimationFrame(updateScrollState);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame.current !== null) {
        window.cancelAnimationFrame(scrollFrame.current);
      }
      clearTimeout(timer);
    };
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow || "";
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/store", label: "Store" },
    { href: "/collections", label: "Collections" },
    { href: "/lookbook", label: "Lookbook" },
    { href: "/about", label: "Manifesto" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "bg-white/90 backdrop-blur-md py-3 text-black border-b border-gray-100"
            : "bg-transparent py-4 text-white"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 -ml-2 hover:text-neutral-400 transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <nav className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em]">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-neutral-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
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

            <div className="flex items-center gap-6 md:gap-8">
              <button
                onClick={toggleTheme}
                className="hover:text-neutral-400 transition-colors"
                title={isDark ? "Light Mode" : "Dark Mode"}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-neutral-400 transition-colors"
                title="Search"
              >
                <Search size={18} />
              </button>

              <Link
                href="/cart"
                className="hover:text-neutral-400 transition-colors flex items-center gap-2 relative"
                title="Your Cart"
              >
                <ShoppingBag size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  ({isMounted ? cartCount : 0})
                </span>
              </Link>

              <Link
                href="/account"
                className="hover:text-neutral-400 transition-colors hidden sm:block"
                title="Account"
              >
                <User size={18} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white pt-24"
          >
            <nav className="flex flex-col items-center gap-8 p-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-black uppercase italic tracking-tighter hover:text-neutral-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="flex items-center gap-8 mt-12"
              >
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-neutral-400 transition-colors"
                >
                  <User size={24} />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-neutral-400 transition-colors"
                >
                  <ShoppingBag size={24} />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-auto pt-12 text-center"
              >
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-neutral-300">
                  Codigo Street & Culture © 2026
                </p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {isSearchOpen && (
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
}
