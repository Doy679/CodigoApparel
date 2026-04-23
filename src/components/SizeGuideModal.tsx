"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";
import { useState } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [measurement, setMeasurement] = useState<"cm" | "in">("in");

  const sizeData = [
    { size: "S", chest: { in: "38-40", cm: "96-101" }, length: { in: "28", cm: "71" } },
    { size: "M", chest: { in: "40-42", cm: "101-106" }, length: { in: "29", cm: "73" } },
    { size: "L", chest: { in: "42-44", cm: "106-111" }, length: { in: "30", cm: "76" } },
    { size: "XL", chest: { in: "44-46", cm: "111-116" }, length: { in: "31", cm: "78" } },
    { size: "2XL", chest: { in: "46-48", cm: "116-121" }, length: { in: "32", cm: "81" } },
    { size: "3XL", chest: { in: "48-50", cm: "121-127" }, length: { in: "33", cm: "83" } }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white z-[101] shadow-2xl p-6 md:p-8"
          >
            <div className="flex justify-between items-start mb-6 border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                  <Ruler size={24} /> Size Guide
                </h2>
                <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest font-bold">
                  Find your perfect fit
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 transition-colors border border-transparent hover:border-neutral-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 flex justify-between items-end">
              <div className="bg-neutral-50 p-4 border-l-4 border-black">
                <p className="text-sm font-bold uppercase">Fit Predictor:</p>
                <p className="text-xs text-neutral-600 mt-1">
                  Our items feature a signature oversized fit. We recommend ordering your normal
                  size for the intended baggy look, or sizing down if you prefer a standard fit.
                </p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMeasurement("in")}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
                  measurement === "in"
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-black hover:bg-neutral-200"
                }`}
              >
                Inches (IN)
              </button>
              <button
                onClick={() => setMeasurement("cm")}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
                  measurement === "cm"
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-black hover:bg-neutral-200"
                }`}
              >
                Centimeters (CM)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-4 border-b-2 border-black text-xs font-black uppercase tracking-widest">
                      Size
                    </th>
                    <th className="py-3 px-4 border-b-2 border-black text-xs font-black uppercase tracking-widest">
                      Chest
                    </th>
                    <th className="py-3 px-4 border-b-2 border-black text-xs font-black uppercase tracking-widest">
                      Length
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-50 border-b border-neutral-100">
                      <td className="py-3 px-4 text-xs font-bold uppercase">{row.size}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        {row.chest[measurement]}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        {row.length[measurement]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
