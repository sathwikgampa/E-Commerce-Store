import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Shield, Truck, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { toast } from 'sonner';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [quantity, setQuantity] = useState(1);

  // Reset quantity on open
  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, product]);

  if (!product) return null;

  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.title} added to cart!`, {
      style: {
        background: '#FF7A50',
        color: '#FFFFFF',
      },
    });
    onClose();
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    if (!isFavorited) {
      toast.success(`Added to wishlist!`, { icon: '❤️' });
    } else {
      toast.info(`Removed from wishlist.`, { icon: '💔' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-[92vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <span className="text-[10px] font-black text-store-primary uppercase tracking-widest leading-none">Quick View</span>
          <DialogTitle className="text-xl sm:text-2xl font-black text-store-primary text-left mt-2">{product.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Left: Product Visual */}
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-200/40 relative aspect-square max-h-[280px] md:max-h-none md:aspect-auto">
            {product.image ? (
              <img 
                alt={product.title} 
                src={product.image}
                className="max-h-full max-w-full object-contain drop-shadow-md"
                loading="lazy"
              />
            ) : (
              <div className="h-32 w-32 bg-gradient-to-br from-store-primary/10 to-store-accent-dark/10 rounded-2xl flex items-center justify-center border border-slate-200/50">
                <span className="material-symbols-outlined text-5xl text-store-primary/70">book</span>
              </div>
            )}
          </div>

          {/* Right: Product Specs */}
          <div className="flex flex-col justify-between text-left">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">By {product.author}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-store-accent-dark text-store-primary border border-store-primary/10">
                {product.category}
              </span>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-4 text-slate-400 text-xs font-bold">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current text-store-primary' : ''}`} 
                    />
                  ))}
                </div>
                <span className="text-slate-800">{product.rating}</span>
              </div>

              {/* Prices */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-xl sm:text-2xl font-black text-store-primary">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 font-bold line-through">₹{product.originalPrice}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-650 leading-relaxed font-semibold mt-4 line-clamp-3 md:line-clamp-4">
                {product.description || product.desc}
              </p>

              {/* Badges */}
              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center text-xs text-slate-600 font-semibold">
                  <Shield className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                  <span>100% Genuine Publications</span>
                </div>
                <div className="flex items-center text-xs text-slate-600 font-semibold">
                  <Truck className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                  <span>Available for Instant Store Pickup</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              {/* Qty Selector */}
              <div className="flex items-center border border-slate-300 rounded-xl px-2.5 py-1 justify-between bg-white shrink-0 sm:w-32 min-h-[48px]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition font-black min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-slate-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition font-black min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {/* Cart Button */}
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-grow flex justify-center items-center px-6 py-3 bg-store-primary hover:bg-store-primary-dark text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed min-h-[48px]"
              >
                <ShoppingCart className="w-4 h-4 mr-2 text-white" />
                Add to Cart
              </button>

              {/* Wishlist Icon Button */}
              <button
                onClick={handleToggleWishlist}
                className="p-3 bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 rounded-xl transition hover:bg-slate-100 active:scale-95 shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <Link 
            to={`/book/${product._id}`} 
            onClick={onClose}
            className="text-xs font-bold text-store-primary hover:text-store-primary-dark hover:underline"
          >
            View Full Product Information &rarr;
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
