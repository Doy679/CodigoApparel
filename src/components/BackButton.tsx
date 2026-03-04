"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors mb-12"
    >
      <ArrowLeft size={14} />
      Back to selection
    </button>
  );
}
