"use client";

import { products as fallbackProducts, type Product } from "@/data/products";
import { useAdminStore } from "@/store/useAdminStore";
import { useEffect, useState } from "react";

let cachedProducts: Product[] | null = null;
let productRequest: Promise<Product[]> | null = null;

const normalizeProducts = (value: unknown): Product[] => {
  if (!Array.isArray(value)) return fallbackProducts;
  const products = value.filter((item): item is Product => {
    return (
      item &&
      typeof item === "object" &&
      typeof (item as Product).id === "string" &&
      typeof (item as Product).name === "string" &&
      typeof (item as Product).price === "number" &&
      typeof (item as Product).image === "string"
    );
  });

  return products.length > 0 ? products : fallbackProducts;
};

const fetchProductsOnce = async () => {
  if (cachedProducts) return cachedProducts;

  productRequest ??= fetch("/api/products", {
    cache: "no-store",
    headers: { Accept: "application/json" }
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Products request failed with status ${response.status}`);
      }
      return normalizeProducts(await response.json());
    })
    .catch((error) => {
      console.warn("Using static products because live catalog sync failed:", error);
      return fallbackProducts;
    })
    .then((products) => {
      cachedProducts = products;
      productRequest = null;
      return products;
    });

  return productRequest;
};

export function useProducts() {
  const products = useAdminStore((state) => state.products);
  const setProducts = useAdminStore((state) => state.setProducts);
  const [loading, setLoading] = useState(!cachedProducts && products.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    fetchProductsOnce()
      .then((nextProducts) => {
        if (!isCurrent) return;
        setProducts(nextProducts);
        setError(null);
      })
      .catch((nextError) => {
        if (!isCurrent) return;
        setError(nextError instanceof Error ? nextError.message : "Failed to load products");
        setProducts(fallbackProducts);
      })
      .finally(() => {
        if (isCurrent) {
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [setProducts]);

  const refresh = async () => {
    productRequest = null;
    cachedProducts = null;
    setLoading(true);

    try {
      const nextProducts = await fetchProductsOnce();
      setProducts(nextProducts);
      setError(null);
      return nextProducts;
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "Failed to load products";
      setError(message);
      setProducts(fallbackProducts);
      return fallbackProducts;
    } finally {
      setLoading(false);
    }
  };

  const visibleProducts = products.length > 0 ? products : cachedProducts || fallbackProducts;

  return {
    products: visibleProducts,
    loading: loading && visibleProducts.length === 0,
    error,
    refresh
  };
}

export function primeProductCache(products: Product[]) {
  cachedProducts = normalizeProducts(products);
}

export function invalidateProductCache() {
  cachedProducts = null;
  productRequest = null;
}
