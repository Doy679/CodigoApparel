"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <section className="py-32 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-neutral-900">
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
              Join The <br className="hidden md:block" /> Syndicate
            </h2>
            <p className="text-sm md:text-base font-bold uppercase tracking-widest text-neutral-400 max-w-md">
              Exclusive drops. Early access. Zero spam. Enter the code to unlock the culture.
            </p>
          </div>

          <div className="flex-1 w-full max-w-md">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "success"}
                className="w-full bg-transparent border-b-2 border-white/20 py-4 pr-12 text-sm md:text-base font-bold uppercase tracking-widest text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
                required
              />
              <button
                type="submit"
                disabled={status !== "idle" && status !== "success"}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-neutral-400 transition-colors disabled:opacity-50"
              >
                {status === "success" ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[10px] font-black tracking-widest text-green-400"
                  >
                    JOINED
                  </motion.span>
                ) : status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight size={20} />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
