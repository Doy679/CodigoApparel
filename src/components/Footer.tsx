import Link from "next/link";
import { MessageSquare, Share2, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="text-3xl font-black tracking-tighter uppercase italic">
              Codigo
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Street and Culture. Redefining style for the modern individual.
              Inspired by the streets, crafted for the world.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Shop</h4>
            <nav className="flex flex-col gap-3 text-[10px] font-black uppercase tracking-widest">
              <Link href="/store" className="hover:text-black text-gray-600 transition-colors">All Products</Link>
              <Link href="/store" className="hover:text-black text-gray-600 transition-colors">New Arrivals</Link>
              <Link href="/store" className="hover:text-black text-gray-600 transition-colors">Best Sellers</Link>
              <Link href="/store" className="hover:text-black text-gray-600 transition-colors">Collections</Link>
            </nav>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Customer Support</h4>
            <nav className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/contact" className="hover:text-black text-gray-600 transition-colors">Contact Us</Link>
              <Link href="/shipping" className="hover:text-black text-gray-600 transition-colors">Shipping & Returns</Link>
              <Link href="/size-chart" className="hover:text-black text-gray-600 transition-colors">Size Chart</Link>
              <Link href="/faq" className="hover:text-black text-gray-600 transition-colors">FAQ</Link>
            </nav>
          </div>

          {/* Newsletter & Social */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Newsletter</h4>
            <div className="flex flex-col gap-4">
              <h5 className="text-sm font-black uppercase italic tracking-tighter">Join the Inner Circle</h5>
              <p className="text-xs text-gray-500 leading-relaxed">Subscribe to get special offers and first look at new drops.</p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Your Email address"
                  className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                />
                <button className="uppercase text-[10px] font-black tracking-widest bg-black text-white py-3 hover:bg-neutral-800 transition-colors">
                  Join Now
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <Link href="#" className="p-2 border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
                <Globe size={18} />
              </Link>
              <Link href="#" className="p-2 border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
                <Share2 size={18} />
              </Link>
              <Link href="#" className="p-2 border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
                <MessageSquare size={18} />
              </Link>
              <Link href="#" className="p-2 border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
                <Mail size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© 2026 Codigo Street and Culture. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-xs text-gray-400 uppercase tracking-widest">Visa</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Mastercard</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Amex</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
