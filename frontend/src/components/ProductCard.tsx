import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, ImageOff, ShoppingBag, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { discountPercent, formatPrice } from './landing/landingData';
import { RatingStars } from './ui/RatingStars';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  layout?: 'grid' | 'list';
  priority?: boolean;
}

const ring = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-primary';

// Discount-style badges ("15% OFF") are skipped; the price row shows the discount computed from real prices
const merchBadge = (product: Product) =>
  product.badge && !/%|discount|off\b/i.test(product.badge) ? product.badge : null;

export const ProductCover: React.FC<{ product: Product; className?: string; priority?: boolean }> = ({
  product,
  className = '',
  priority = false,
}) =>
  product.image ? (
    <img
      src={product.image}
      alt=""
      width={1024}
      height={1024}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn('h-full w-full object-cover', className)}
    />
  ) : (
    <span className={cn('flex h-full w-full items-center justify-center text-store-charcoal-light/50', className)}>
      <ImageOff className="h-8 w-8" aria-hidden="true" />
    </span>
  );

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, layout = 'grid', priority = false }) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const saved = useWishlistStore((s) => s.items.some((item) => item._id === product._id));

  const discount = discountPercent(product);
  const badge = merchBadge(product);
  const href = `/book/${product._id}`;

  const handleAdd = () => {
    addToCart(product);
    toast.success('Added to cart', { description: product.title });
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast(saved ? 'Removed from wishlist' : 'Saved to wishlist', { description: product.title });
  };

  const wishlistButton = (
    <button
      type="button"
      onClick={handleWishlist}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-store-charcoal transition-colors hover:text-store-primary',
        ring
      )}
    >
      <Heart className={cn('h-[18px] w-[18px]', saved && 'fill-store-primary text-store-primary')} strokeWidth={1.75} />
    </button>
  );

  const priceBlock = (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="text-[17px] font-semibold tabular text-store-charcoal">{formatPrice(product.price)}</span>
      {discount > 0 && (
        <>
          <span className="text-[13px] tabular text-store-charcoal-light line-through">
            <span className="sr-only">Was </span>
            {formatPrice(product.originalPrice!)}
          </span>
          <span className="text-[12px] font-semibold text-emerald-700">{discount}% off</span>
        </>
      )}
    </div>
  );

  const addButton = (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!product.inStock}
      aria-label={product.inStock ? `Add ${product.title} to cart` : `${product.title} is out of stock`}
      className={cn(
        'inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold transition-colors',
        'bg-store-charcoal text-white hover:bg-store-primary disabled:cursor-not-allowed disabled:bg-store-muted disabled:text-store-charcoal-light',
        ring
      )}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      <span className={layout === 'grid' ? 'max-[380px]:sr-only' : ''}>{product.inStock ? 'Add' : 'Sold out'}</span>
    </button>
  );

  if (layout === 'list') {
    return (
      <article className="group flex gap-4 border-b border-store-line py-5 sm:gap-6">
        <div className="relative w-28 shrink-0 overflow-hidden rounded-lg bg-store-muted sm:w-36">
          <Link to={href} tabIndex={-1} aria-hidden="true" className="block aspect-square">
            <ProductCover product={product} priority={priority} className="transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" />
          </Link>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-store-charcoal-light">{product.category}</p>
              <h3 className="mt-1 text-[16px] font-semibold leading-snug text-store-charcoal">
                <Link to={href} className={cn('rounded-sm hover:text-store-primary', ring)}>
                  {product.title}
                </Link>
              </h3>
              <p className="mt-0.5 truncate text-[13px] text-store-charcoal-light">{product.author}</p>
            </div>
            <div className="shrink-0 max-sm:hidden">{wishlistButton}</div>
          </div>
          {(product.description || product.desc) && (
            <p className="mt-2 line-clamp-2 max-w-2xl text-[13px] leading-relaxed text-store-charcoal-light max-sm:hidden">
              {product.description || product.desc}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
            <div className="space-y-1">
              {priceBlock}
              <div className="flex items-center gap-3">
                <RatingStars rating={product.rating} />
                {!product.inStock && <span className="text-xs font-medium text-rose-700">Out of stock</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onQuickView && (
                <button
                  type="button"
                  onClick={() => onQuickView(product)}
                  className={cn('hidden h-10 items-center rounded-lg border border-store-line bg-white px-3 text-[13px] font-medium text-store-charcoal hover:bg-store-accent sm:inline-flex', ring)}
                >
                  Quick view
                </button>
              )}
              {addButton}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-xl bg-store-muted">
        <Link to={href} tabIndex={-1} aria-hidden="true" className="block aspect-square">
          <ProductCover
            product={product}
            priority={priority}
            className={cn('transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]', !product.inStock && 'opacity-60')}
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex max-w-[calc(100%-4.5rem)] flex-col items-start gap-1.5">
          {!product.inStock ? (
            <span className="rounded-md bg-store-charcoal px-2 py-1 text-[11px] font-semibold text-white">Out of stock</span>
          ) : badge ? (
            <span className="truncate rounded-md bg-white/95 px-2 py-1 text-[11px] font-medium text-store-charcoal max-sm:hidden">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="absolute right-2 top-2">{wishlistButton}</div>

        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className={cn(
              'absolute inset-x-3 bottom-3 hidden h-10 items-center justify-center gap-2 rounded-lg bg-white/95 text-[13px] font-medium text-store-charcoal shadow-card transition-opacity duration-150 md:inline-flex',
              'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100',
              ring
            )}
            aria-label={`Quick view: ${product.title}`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" /> Quick view
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.12em] text-store-charcoal-light">
            {product.category}
          </p>
          {product.rating > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[12px] tabular text-store-charcoal-light">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" aria-hidden="true" />
              <span className="sr-only">Rated </span>
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-snug text-store-charcoal">
          <Link to={href} className={cn('rounded-sm transition-colors hover:text-store-primary', ring)}>
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 truncate text-[13px] text-store-charcoal-light">{product.author}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          {priceBlock}
          {addButton}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
