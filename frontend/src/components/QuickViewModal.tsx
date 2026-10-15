import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingBag, Store } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/Dialog';
import { QuantityStepper } from './ui/QuantityStepper';
import { RatingStars } from './ui/RatingStars';
import { Badge } from './ui/Badge';
import { buttonClasses } from './ui/Button';
import { ProductCover } from './ProductCard';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { discountPercent, formatPrice } from './landing/landingData';
import { cn } from '../lib/utils';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const saved = useWishlistStore((s) => (product ? s.items.some((i) => i._id === product._id) : false));
  const [quantity, setQuantity] = useState(1);

  // Reset quantity whenever a product is opened
  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, product]);

  if (!product) return null;

  const discount = discountPercent(product);
  const summary = product.description || product.desc;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} to cart`, { description: product.title });
    onClose();
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    toast(saved ? 'Removed from wishlist' : 'Saved to wishlist', { description: product.title });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl" className="p-0 sm:p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden bg-store-muted md:aspect-auto md:min-h-[420px] md:rounded-l-2xl">
            <ProductCover product={product} className={cn('absolute inset-0', !product.inStock && 'opacity-60')} />
          </div>

          <div className="flex flex-col p-5 sm:p-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-store-charcoal-light">{product.category}</p>
            <DialogTitle className="mt-2 pr-8 font-serif text-[22px] font-semibold leading-tight sm:text-2xl">
              {product.title}
            </DialogTitle>
            <DialogDescription className="mt-1 text-[14px]">by {product.author}</DialogDescription>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <RatingStars rating={product.rating} />
              {product.inStock ? (
                <Badge variant="success" dot>In stock</Badge>
              ) : (
                <Badge variant="danger" dot>Out of stock</Badge>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-semibold tabular text-store-charcoal">{formatPrice(product.price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-[15px] tabular text-store-charcoal-light line-through">
                    <span className="sr-only">Was </span>
                    {formatPrice(product.originalPrice!)}
                  </span>
                  <span className="text-[13px] font-semibold text-emerald-700">Save {discount}%</span>
                </>
              )}
            </div>

            {summary && (
              <p className="mt-4 line-clamp-4 text-[14px] leading-relaxed text-store-charcoal-light">{summary}</p>
            )}

            <p className="mt-4 flex items-center gap-2 text-[13px] text-store-charcoal-light">
              <Store className="h-4 w-4 shrink-0" aria-hidden="true" />
              Free pickup at our Station Road store
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-store-line pt-5 md:mt-auto">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={buttonClasses('primary', 'md', false, 'min-w-[10rem] flex-1')}
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {product.inStock ? 'Add to cart' : 'Out of stock'}
              </button>
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-pressed={saved}
                aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                className={buttonClasses('secondary', 'icon')}
              >
                <Heart className={cn('h-5 w-5', saved && 'fill-store-primary text-store-primary')} strokeWidth={1.75} />
              </button>
            </div>

            <Link
              to={`/book/${product._id}`}
              onClick={onClose}
              className="mt-4 inline-flex items-center gap-1.5 self-start rounded-sm text-[14px] font-medium text-store-primary underline-offset-4 hover:underline"
            >
              View full details <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
