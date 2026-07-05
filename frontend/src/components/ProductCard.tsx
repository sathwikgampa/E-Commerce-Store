import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFavorited = isInWishlist(product._id);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.title} added to cart!`, {
      style: {
        background: '#0A3D91',
        color: '#FFFFFF',
      },
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isFavorited) {
      toast.success(`Added ${product.title} to wishlist!`, {
        icon: '❤️',
      });
    } else {
      toast.info(`Removed ${product.title} from wishlist.`, {
        icon: '💔',
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col group relative"
    >
      {/* Wishlist Button */}
      <button 
        onClick={handleToggleWishlist}
        aria-label="Toggle Wishlist"
        className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 p-2.5 rounded-full shadow-sm border border-slate-100/50 transition-all active:scale-90"
      >
        <Heart className={`w-4.5 h-4.5 transition-colors ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
      </button>

      {/* Discount/Badge */}
      {discountPercentage > 0 ? (
        <span className="absolute top-4 left-4 z-20 bg-accent text-primary text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
          {discountPercentage}% OFF
        </span>
      ) : product.badge ? (
        <span className="absolute top-4 left-4 z-20 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
          {product.badge}
        </span>
      ) : null}

      {/* Product Image Wrapper */}
      <Link to={`/book/${product._id}`} className="relative aspect-video rounded-t-2xl overflow-hidden bg-slate-50 border-b border-slate-100 p-6 flex justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {product.image ? (
          <img 
            alt={product.title} 
            src={product.image}
            className="h-28 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="h-28 w-28 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 relative border border-slate-200/50">
            <span className="material-symbols-outlined text-4xl text-primary/70">book</span>
          </div>
        )}

        {/* Hover action overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-250 z-10">
          <button
            onClick={handleQuickView}
            className="p-3 bg-white text-primary rounded-full shadow-md hover:bg-accent hover:text-primary transition-all active:scale-95 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </Link>
      
      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow text-left">
        <span className="text-[10px] font-black text-accent uppercase tracking-widest mb-1.5 block">{product.category}</span>
        
        <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug text-base min-h-[2.75rem]">
          <Link to={`/book/${product._id}`}>{product.title}</Link>
        </h3>
        
        <p className="text-xs text-slate-500 font-semibold mt-1">By {product.author}</p>
        
        {/* Star Rating */}
        <div className="flex items-center gap-1.5 mt-2.5 text-slate-400 text-xs font-bold">
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

        {/* Short description */}
        <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
          {product.description || product.desc}
        </p>

        {/* Stock status indicator */}
        <div className="mt-4 flex items-center">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
            product.inStock 
              ? 'bg-emerald-50 text-emerald-700' 
              : 'bg-rose-50 text-rose-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        {/* Action items */}
        <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-slate-400 font-bold line-through">₹{product.originalPrice}</span>
            )}
            <span className="font-black text-lg text-primary leading-none mt-0.5">₹{product.price}</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-accent" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
