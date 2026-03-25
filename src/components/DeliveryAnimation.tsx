"use client";

import { motion } from "framer-motion";
import { Truck, Package, Check } from "lucide-react";

export default function DeliveryAnimation() {
  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-lg h-64 flex flex-col items-center justify-center">
        {/* Road line */}
        <div className="absolute bottom-16 left-0 right-0 h-1 bg-neutral-100 overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-1/2 h-full bg-black/20"
          />
        </div>

        {/* Moving Truck */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <motion.div
            animate={{ 
              y: [0, -4, 0],
            }}
            transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
            className="text-black"
          >
            <Truck size={80} strokeWidth={1.5} />
          </motion.div>
          
          {/* Exhaust/Speed particles */}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1, x: 20 }}
                animate={{ opacity: 0, scale: 0, x: 40 }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 bg-neutral-200 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Text reveals */}
        <div className="mt-12 text-center space-y-2">
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs font-black uppercase tracking-[0.4em] italic"
          >
            Encoding Shipment
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
            className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest"
          >
            Verifying Address...
          </motion.p>
        </div>
      </div>

      {/* Background large text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <h2 className="text-[30vw] font-black italic uppercase">CODIGO</h2>
      </div>
    </div>
  );
}
