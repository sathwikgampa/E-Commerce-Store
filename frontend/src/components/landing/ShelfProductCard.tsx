import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../../types';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import { discountPercent, focusRing, formatPrice } from './landingData';

interface ShelfProductCardProps {
  product: Product;
  priority?: boolean;
}

const ShelfProductCard: React.FC<ShelfProductCardProps> = ({ product, priority = false }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const saved = useWishlistStore((state) => state.items.some((item) => item._id === product._id));
  const discount = discountPercent(product);
  const href = `/book/${product._id}`;
  // Discount-style badges ("15% OFF") are skipped; the price row shows the discount computed from real prices
  const badge = product.badge && !/%|discount/i.test(product.badge) ? product.badge : null;

  const handleAdd = () => {
    addToCart(product);
    toast.success('Added to cart', { description: product.title });
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast(saved ? 'Removed from wishlist' : 'Saved to wishlist', { description: product.title });
  };

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-xl bg-paper-deep">
        <Link to={href} tabIndex={-1} aria-hidden="true" className="block">
          {product.image ? (
            <img
              src={product.image}
              alt=""
              width={1024}
              height={1024}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              className="aspect-square w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
            />
          ) : (
            <div className="aspect-square w-full" />
          )}
        </Link>

        {badge && (
          <span className="pointer-events-none absolute left-3 top-3 hidden max-w-[calc(100%-4.5rem)] truncate rounded-md bg-paper/95 px-2 py-1 text-[11px] font-medium tracking-wide text-ink sm:block">
            {badge}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
          className={`absolute right-2 top-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/95 text-ink transition-colors hover:text-ember ${focusRing}`}
        >
          <Heart className={`h-[18px] w-[18px] ${saved ? 'fill-ember text-ember' : ''}`} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[11px] uppercase tracking-[0.12em] text-ink-muted">{product.category}</p>
          {product.rating > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[12px] text-ink-soft">
              <Star className="h-3 w-3 fill-ink-soft text-ink-soft" aria-hidden="true" />
              <span className="sr-only">Rated </span>
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <h3 className="mt-1.5 font-sans text-[15px] font-medium leading-snug tracking-normal text-ink">
          <Link to={href} className={`line-clamp-2 rounded-sm hover:underline hover:underline-offset-4 ${focusRing}`}>
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 truncate text-[13px] text-ink-muted">{product.author}</p>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-3">
          <span className="text-[16px] font-semibold text-ink">{formatPrice(product.price)}</span>
          {discount > 0 && product.originalPrice && (
            <>
              <span className="text-[13px] text-ink-muted line-through">
                <span className="sr-only">Was </span>
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-[13px] font-medium text-ember">{discount}% off</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`mt-4 h-11 w-full rounded-lg border border-ink/80 text-[14px] font-medium text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-ink-muted ${focusRing}`}
        >
          {product.inStock ? 'Add to cart' : 'Out of stock'}
        </button>
      </div>
    </article>
  );
};

export default ShelfProductCard;
