import { useAdminStore } from "@/store/useAdminStore";
import { useEffect, useState } from "react";
import { getProductsAction } from "@/lib/actions";
import { Product } from "@/data/products";

export function useProducts() {
  const [loading, setLoading] = useState(true);
  const { products, setProducts } = useAdminStore();

  useEffect(() => {
    async function loadProducts() {
      // Always fetch fresh data on the client to stay in sync with DB
      const result = await getProductsAction();
      if (result.success) {
        setProducts(result.products as Product[]);
      }
      setLoading(false);
    }

    loadProducts();
  }, [setProducts]);

  return {
    products: products || [],
    loading
  };
}
