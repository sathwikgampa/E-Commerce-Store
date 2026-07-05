import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, Truck, Shield, ArrowLeft, Heart, Star, CheckCircle } from 'lucide-react';
import { useProducts } from '../api/queries';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { toast } from 'sonner';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p._id === id);
      if (found) {
        setProduct(found);
        setRelatedProducts(products.filter((p) => p.category === found.category && p._id !== found._id).slice(0, 4));
      } else {
        // Fallback to first product
        setProduct(products[0]);
        setRelatedProducts(products.slice(1, 5));
      }
    }
  }, [id, products]);

  if (isLoading) {
    return (
      <div className="w-full mx-auto px-4 py-20 text-center">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-bold">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full mx-auto px-4 py-20 text-center bg-[#F8FAFC]">
        <h2 className="text-2xl font-black text-slate-800">Product Not Found</h2>
        <Link to="/books" className="text-primary hover:underline font-bold mt-4 inline-block">Back to Catalog</Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.title} added to cart!`, {
      style: {
        background: '#0A3D91',
        color: '#FFFFFF',
      },
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    if (!isFavorited) {
      toast.success(`Added ${product.title} to wishlist!`, { icon: '❤️' });
    } else {
      toast.info(`Removed ${product.title} from wishlist.`, { icon: '💔' });
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#F8FAFC] text-left">
      
      {/* Back button */}
      <Link to="/books" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Store Catalog
      </Link>
      
      {/* Main detail card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Product Visual */}
          <div className="bg-slate-50 p-8 sm:p-12 flex justify-center items-center border-b md:border-b-0 md:border-r border-slate-200/50 min-h-[400px]">
            {product.image ? (
              <div className="max-w-[320px] aspect-square flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="max-h-full max-w-full object-contain drop-shadow-lg rounded-lg" 
                />
              </div>
            ) : (
              <div className="h-44 w-44 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center border border-slate-200/50 shadow-inner">
                <BookOpen className="w-24 h-24 text-primary/70 animate-pulse-slow" />
              </div>
            )}
          </div>
          
          {/* Right Column: Spec Sheet & Cart Actions */}
          <div className="p-8 sm:p-12 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Category, Title, Author */}
              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-widest text-accent uppercase text-[#D4AF37]">{product.category}</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{product.title}</h1>
                <p className="text-sm font-semibold text-slate-500">By {product.author}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current text-accent text-[#D4AF37]' : ''}`} 
                    />
                  ))}
                </div>
                <span className="text-slate-800">{product.rating}</span>
              </div>

              {/* Price Tags */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-primary">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 font-bold line-through">₹{product.originalPrice}</span>
                )}
              </div>

              {/* Stock Indicator */}
              <div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md ${
                  product.inStock 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-rose-50 text-rose-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  {product.inStock ? 'In Stock (Available at Kamareddy)' : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-semibold text-slate-600">
                {product.description || product.desc}
              </p>
              
              {/* Store Benefits */}
              <div className="space-y-2 border-t border-slate-100 pt-5">
                <div className="flex items-center text-slate-700 text-xs font-semibold">
                  <Shield className="w-4 h-4 text-emerald-600 mr-2.5 shrink-0" />
                  <span>100% Genuine Publications &amp; Authorised Bookstore Stock</span>
                </div>
                <div className="flex items-center text-slate-700 text-xs font-semibold">
                  <Truck className="w-4 h-4 text-emerald-600 mr-2.5 shrink-0" />
                  <span>Available for Direct Store Pick-up on Station Road</span>
                </div>
              </div>
            </div>

            {/* Cart & Wishlist Trigger Controls */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              
              {/* Quantity Select counter */}
              <div className="flex items-center border border-slate-350 rounded-xl px-3.5 py-1.5 justify-between bg-white shrink-0 sm:w-36">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-150 rounded-md transition font-black"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-slate-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-150 rounded-md transition font-black"
                >
                  +
                </button>
              </div>

              {/* Cart Button */}
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-grow flex justify-center items-center px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4 mr-2 text-accent text-[#D4AF37]" />
                Add to Shopping Cart
              </button>

              {/* Favorite Wishlist Icon Button */}
              <button 
                onClick={handleToggleWishlist}
                className={`p-4 rounded-xl border border-slate-200 transition-all flex items-center justify-center active:scale-95 ${
                  isFavorited 
                    ? 'bg-rose-50 text-rose-500 border-rose-100 hover:bg-rose-100' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-650'
                }`}
                title="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3">Related Publications &amp; Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard 
                key={p._id} 
                product={p} 
                onQuickView={() => {
                  setSelectedProduct(p);
                  setIsQuickViewOpen(true);
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick View Dialog Overlay */}
      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </div>
  );
};

export default ProductDetail;
