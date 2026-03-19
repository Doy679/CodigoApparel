import { products as productsData } from "@/data/products";

export function useProducts() {
  // Return data directly and synchronously to prevent hydration hangs
  return {
    products: productsData,
    loading: false
  };
}
