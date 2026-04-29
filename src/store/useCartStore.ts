import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/data/products";

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selected?: boolean; // New property for checkout selection
}

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product, size?: string, autoSelect?: boolean) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  updateItemSize: (productId: string, oldSize: string | undefined, newSize: string) => void;
  clearCart: () => void;
  clearSelectedItems: () => void;
  setIsCartOpen: (isOpen: boolean) => void;

  // Selection Actions
  toggleSelectItem: (productId: string, size?: string) => void;
  toggleSelectAll: (isSelected: boolean) => void;
  selectOnlyItem: (productId: string, size?: string) => void; // For Buy Now flow
}

const areSizesEqual = (size1?: string | null, size2?: string | null) => {
  const s1 = size1 || undefined;
  const s2 = size2 || undefined;
  return s1 === s2;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,

      addToCart: (product: Product, size?: string, autoSelect = true) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (item) => item.id === product.id && areSizesEqual(item.selectedSize, size)
          );

          if (existingItemIndex >= 0) {
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += 1;
            if (autoSelect) newCart[existingItemIndex].selected = true;
            return { cart: newCart, isCartOpen: false };
          }

          return {
            cart: [
              ...state.cart,
              { ...product, quantity: 1, selectedSize: size || undefined, selected: autoSelect }
            ],
            isCartOpen: false
          };
        }),

      removeFromCart: (productId: string, size?: string) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.id === productId && areSizesEqual(item.selectedSize, size))
          )
        })),

      updateQuantity: (productId: string, quantity: number, size?: string) =>
        set((state) => {
          if (quantity < 1) return state;
          return {
            cart: state.cart.map((item) =>
              item.id === productId && areSizesEqual(item.selectedSize, size)
                ? { ...item, quantity }
                : item
            )
          };
        }),

      updateItemSize: (productId: string, oldSize: string | undefined, newSize: string) =>
        set((state) => {
          if (areSizesEqual(oldSize, newSize)) return state;

          const existingWithNewSizeIndex = state.cart.findIndex(
            (item) => item.id === productId && areSizesEqual(item.selectedSize, newSize)
          );

          if (existingWithNewSizeIndex >= 0) {
            const oldItem = state.cart.find(
              (item) => item.id === productId && areSizesEqual(item.selectedSize, oldSize)
            );

            if (!oldItem) return state;

            const mergedCart = state.cart
              .map((item, index) => {
                if (index === existingWithNewSizeIndex) {
                  return { ...item, quantity: item.quantity + oldItem.quantity, selected: true };
                }
                return item;
              })
              .filter(
                (item) => !(item.id === productId && areSizesEqual(item.selectedSize, oldSize))
              );

            return { cart: mergedCart };
          }

          return {
            cart: state.cart.map((item) =>
              item.id === productId && areSizesEqual(item.selectedSize, oldSize)
                ? { ...item, selectedSize: newSize }
                : item
            )
          };
        }),

      clearCart: () => set({ cart: [] }),

      clearSelectedItems: () =>
        set((state) => ({
          cart: state.cart.filter((item) => !item.selected)
        })),

      setIsCartOpen: (isOpen: boolean) => set({ isCartOpen: isOpen }),

      toggleSelectItem: (productId: string, size?: string) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId && areSizesEqual(item.selectedSize, size)
              ? { ...item, selected: !item.selected }
              : item
          )
        })),

      toggleSelectAll: (isSelected: boolean) =>
        set((state) => ({
          cart: state.cart.map((item) => ({ ...item, selected: isSelected }))
        })),

      selectOnlyItem: (productId: string, size?: string) =>
        set((state) => ({
          cart: state.cart.map((item) => ({
            ...item,
            selected: item.id === productId && areSizesEqual(item.selectedSize, size)
          }))
        }))
    }),
    {
      name: "codigo-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart })
    }
  )
);

export const useCartCount = () =>
  useCartStore((state) => state.cart.reduce((total, item) => total + item.quantity, 0));

export const useSelectedCount = () =>
  useCartStore((state) =>
    state.cart.filter((item) => item.selected).reduce((total, item) => total + item.quantity, 0)
  );

export const useCartTotal = () =>
  useCartStore((state) =>
    state.cart
      .filter((item) => item.selected) // Only total the selected items
      .reduce((total, item) => total + item.price * item.quantity, 0)
  );
