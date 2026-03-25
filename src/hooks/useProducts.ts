import { useAdminStore } from "@/store/useAdminStore";
import { useEffect, useState } from "react";

export function useProducts() {
  const [mounted, setMounted] = useState(false);
  const { products } = useAdminStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return {
    // Return admin store products if mounted (to avoid hydration mismatch),
    // otherwise return empty or static data for the initial SSR pass
    products: mounted ? products : [],
    loading: !mounted
  };
}
