import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/data/products";

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  updateItemSize: (productId: string, oldSize: string | undefined, newSize: string) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,

      addToCart: (product: Product, size?: string) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (item) => item.id === product.id && item.selectedSize === size
          );

          if (existingItemIndex >= 0) {
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += 1;
            return { cart: newCart, isCartOpen: true };
          }

          return {
            cart: [...state.cart, { ...product, quantity: 1, selectedSize: size }],
            isCartOpen: true
          };
        }),

      removeFromCart: (productId: string, size?: string) =>
        set((state) => ({
          cart: state.cart.filter((item) => !(item.id === productId && item.selectedSize === size))
        })),

      updateQuantity: (productId: string, quantity: number, size?: string) =>
        set((state) => {
          if (quantity < 1) return state;
          return {
            cart: state.cart.map((item) =>
              item.id === productId && item.selectedSize === size ? { ...item, quantity } : item
            )
          };
        }),

      updateItemSize: (productId: string, oldSize: string | undefined, newSize: string) =>
        set((state) => {
          const existingWithNewSizeIndex = state.cart.findIndex(
            (item) => item.id === productId && item.selectedSize === newSize
          );

          if (existingWithNewSizeIndex >= 0) {
            const oldItem = state.cart.find(
              (item) => item.id === productId && item.selectedSize === oldSize
            );

            if (!oldItem) return state;

            const mergedCart = state.cart
              .map((item, index) => {
                if (index === existingWithNewSizeIndex) {
                  return { ...item, quantity: item.quantity + oldItem.quantity };
                }
                return item;
              })
              .filter((item) => !(item.id === productId && item.selectedSize === oldSize));

            return { cart: mergedCart };
          }

          return {
            cart: state.cart.map((item) =>
              item.id === productId && item.selectedSize === oldSize
                ? { ...item, selectedSize: newSize }
                : item
            )
          };
        }),

      clearCart: () => set({ cart: [] }),

      setIsCartOpen: (isOpen: boolean) => set({ isCartOpen: isOpen })
    }),
    {
      name: "codigo-cart",
      storage: createJSONStorage(() => localStorage),
      // Only persist the cart state, not whether the cart is open
      partialize: (state) => ({ cart: state.cart })
    }
  )
);

// Derived state hooks to replace Context's derived values
export const useCartCount = () =>
  useCartStore((state) => state.cart.reduce((total, item) => total + item.quantity, 0));

export const useCartTotal = () =>
  useCartStore((state) =>
    state.cart.reduce((total, item) => total + item.price * item.quantity, 0)
  );
