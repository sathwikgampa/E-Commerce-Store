import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.some((item) => item._id === product._id);
        if (exists) {
          set({ items: items.filter((item) => item._id !== product._id) });
        } else {
          set({ items: [...items, product] });
        }
      },
      
      isInWishlist: (productId) => {
        return get().items.some((item) => item._id === productId);
      },
    }),
    {
      name: 'bookstore-wishlist',
    }
  )
);

export default useWishlistStore;
