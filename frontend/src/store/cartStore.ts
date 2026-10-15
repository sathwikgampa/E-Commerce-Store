import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '../types';
import { findCoupon, normalizeCoupon } from '../lib/pricing';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,

      addToCart: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.product._id === product._id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },

      removeFromCart: (productId) => {
        set({ items: get().items.filter((item) => item.product._id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [], couponCode: null }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      // Returns false when the code is not a recognised store coupon
      applyCoupon: (code) => {
        if (!findCoupon(code)) return false;
        set({ couponCode: normalizeCoupon(code) });
        return true;
      },

      removeCoupon: () => set({ couponCode: null }),
    }),
    {
      name: 'bookstore-cart', // local storage key
    }
  )
);

export default useCartStore;
