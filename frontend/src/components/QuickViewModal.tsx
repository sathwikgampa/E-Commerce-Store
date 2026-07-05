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
        background: '#0A3D91',
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <span className="text-[10px] font-black text-accent uppercase tracking-widest leading-none">Quick View</span>
          <DialogTitle className="text-2xl font-black text-primary text-left mt-2">{product.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Left: Product Visual */}
          <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-center border border-slate-200/40 relative aspect-square">
            {product.image ? (
              <img 
                alt={product.title} 
                src={product.image}
                className="max-h-full max-w-full object-contain drop-shadow-md"
              />
            ) : (
              <div className="h-32 w-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center border border-slate-200/50">
                <span className="material-symbols-outlined text-5xl text-primary/70">book</span>
              </div>
            )}
          </div>

          {/* Right: Product Specs */}
          <div className="flex flex-col justify-between text-left">
            <div>
              <p className="text-sm font-semibold text-slate-500">By {product.author}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {product.category}
              </span>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-4 text-slate-400 text-xs font-bold">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current text-accent' : ''}`} 
                    />
                  ))}
                </div>
                <span className="text-slate-800">{product.rating}</span>
              </div>

              {/* Prices */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-black text-primary">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 font-bold line-through">₹{product.originalPrice}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-650 leading-relaxed font-semibold mt-4 line-clamp-4">
                {product.description || product.desc}
              </p>

              {/* Badges */}
              <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
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
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              {/* Qty Selector */}
              <div className="flex items-center border border-slate-300 rounded-xl px-2.5 py-1 justify-between bg-white shrink-0 sm:w-32">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition font-black"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-slate-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition font-black"
                >
                  +
                </button>
              </div>

              {/* Cart Button */}
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-grow flex justify-center items-center px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4 mr-2 text-accent" />
                Add to Cart
              </button>

              {/* Wishlist Icon Button */}
              <button
                onClick={handleToggleWishlist}
                className="p-3.5 bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 rounded-xl transition hover:bg-slate-100 active:scale-95 shrink-0"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <Link 
            to={`/book/${product._id}`} 
            onClick={onClose}
            className="text-xs font-bold text-primary hover:text-accent-dark hover:underline"
          >
            View Full Product Information &rarr;
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
