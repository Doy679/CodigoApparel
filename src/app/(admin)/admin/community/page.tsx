"use client";

import { useAdminStore } from "@/store/useAdminStore";
import { Plus, Trash2, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminCommunity() {
  const [mounted, setMounted] = useState(false);
  const { communityImages, addCommunityImage, removeCommunityImage } = useAdminStore();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      addCommunityImage(result);
      toast.success("Community image added successfully.");
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-10 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
            Community Code
          </h2>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Manage your community feature images
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => document.getElementById("community-upload")?.click()}
            className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center gap-3 w-fit"
          >
            <Plus size={16} /> Add Image
          </button>
          <input
            id="community-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          />
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`w-full aspect-[21/9] bg-neutral-50 border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${
          isDragging ? "border-black bg-neutral-100" : "border-neutral-200"
        }`}
      >
        <Camera
          className={`mb-4 transition-transform ${isDragging ? "scale-125" : ""}`}
          size={48}
        />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">
          {isDragging ? "Drop to Upload" : "Drag Community Image Here"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <AnimatePresence>
          {communityImages.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              className="relative aspect-[3/4] group bg-neutral-100 overflow-hidden"
            >
              <Image src={src} alt="Community" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => removeCommunityImage(src)}
                  className="w-10 h-10 bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
