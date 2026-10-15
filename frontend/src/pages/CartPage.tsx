import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ShoppingBag, Store, Tag, Trash2, Truck } from 'lucide-react';
import { toast } from 'sonner';
import useCartStore from '../store/cartStore';
import { ProductCover } from '../components/ProductCard';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { EmptyState } from '../components/ui/EmptyState';
import { Button, buttonClasses } from '../components/ui/Button';
import { formatPrice } from '../components/landing/landingData';
import { FREE_DELIVERY_THRESHOLD, HOME_DELIVERY_FEE, computeTotals, findCoupon } from '../lib/pricing';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, couponCode, applyCoupon, removeCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = getTotalPrice();
  const totals = computeTotals(subtotal, couponCode, 'pickup');
  const coupon = findCoupon(couponCode);
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const toFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      setCouponError('Enter a coupon code.');
      return;
    }
    if (applyCoupon(couponInput)) {
      setCouponError(null);
      setCouponInput('');
      toast.success('Coupon applied');
    } else {
      setCouponError('That code isn’t valid. Check the spelling and try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-store px-5 py-16 sm:px-8 lg:px-12">
        <EmptyState
          icon={<ShoppingBag />}
          title="Your cart is empty"
          description="Textbooks, notebooks and stationery you add will appear here."
          action={<Link to="/books" className={buttonClasses('primary')}>Browse the catalog</Link>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-store px-5 pb-16 pt-8 sm:px-8 lg:px-12">
      <h1 className="font-serif text-[34px] font-semibold tracking-tight text-store-charcoal sm:text-[40px]">Your cart</h1>
      <p className="mt-1 text-[15px] text-store-charcoal-light">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <section aria-label="Cart items" className="lg:col-span-7 xl:col-span-8">
          <ul className="divide-y divide-store-line border-y border-store-line">
            {items.map(({ product, quantity }) => (
              <li key={product._id} className="flex gap-4 py-5 sm:gap-6">
                <Link to={`/book/${product._id}`} tabIndex={-1} aria-hidden="true" className="block h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-store-muted sm:h-32 sm:w-28">
                  <ProductCover product={product} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-store-charcoal-light">{product.category}</p>
                      <h2 className="mt-1 line-clamp-2 font-sans text-[15px] font-semibold leading-snug text-store-charcoal">
                        <Link to={`/book/${product._id}`} className="hover:text-store-primary">{product.title}</Link>
                      </h2>
                      <p className="mt-0.5 truncate text-[13px] text-store-charcoal-light">{product.author}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[15px] font-semibold tabular text-store-charcoal">{formatPrice(product.price * quantity)}</p>
                      {quantity > 1 && <p className="text-xs tabular text-store-charcoal-light">{formatPrice(product.price)} each</p>}
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <QuantityStepper
                      size="sm"
                      value={quantity}
                      onChange={(q) => updateQuantity(product._id, q)}
                      label={`Quantity of ${product.title}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(product._id);
                        toast('Removed from cart', { description: product.title });
                      }}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-[13px] font-medium text-store-charcoal-light transition-colors hover:bg-rose-50 hover:text-rose-700"
                      aria-label={`Remove ${product.title} from cart`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span className="max-sm:sr-only">Remove</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/books" className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-store-charcoal-light hover:text-store-charcoal">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Continue shopping
          </Link>
        </section>

        <aside aria-labelledby="summary-heading" className="lg:col-span-5 xl:col-span-4">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-store-line lg:sticky lg:top-28">
            <h2 id="summary-heading" className="font-sans text-lg font-semibold text-store-charcoal">Order summary</h2>

            {/* Coupon */}
            <div className="mt-5">
              {coupon ? (
                <div className="flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-[14px] text-emerald-800 ring-1 ring-emerald-200">
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span><strong className="font-semibold">{couponCode}</strong> · {coupon.percent}% off</span>
                  </span>
                  <button type="button" onClick={removeCoupon} className="text-[13px] font-medium underline underline-offset-2">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} noValidate>
                  <label htmlFor="coupon" className="text-[13px] font-medium text-store-charcoal">Coupon code</label>
                  <div className="mt-1.5 flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-store-charcoal-light" aria-hidden="true" />
                      <input
                        id="coupon"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError(null);
                        }}
                        aria-invalid={!!couponError}
                        aria-describedby={couponError ? 'coupon-error' : undefined}
                        autoComplete="off"
                        className="h-11 w-full rounded-lg border border-store-line bg-white pl-9 pr-3 text-base uppercase text-store-charcoal placeholder:normal-case placeholder:text-store-charcoal-light/70 focus:border-store-primary focus:outline-none focus:ring-2 focus:ring-store-primary/15 sm:text-sm"
                        placeholder="e.g. STUDENT10"
                      />
                    </div>
                    <Button type="submit" variant="dark">Apply</Button>
                  </div>
                  {couponError && <p id="coupon-error" className="mt-1.5 text-[13px] font-medium text-rose-700">{couponError}</p>}
                </form>
              )}
            </div>

            <dl className="mt-6 space-y-3 border-t border-store-line pt-5 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-store-charcoal-light">Subtotal</dt>
                <dd className="tabular text-store-charcoal">{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <dt>Coupon ({totals.discountPercent}%)</dt>
                  <dd className="tabular">−{formatPrice(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-store-charcoal-light">Delivery</dt>
                <dd className="text-right text-store-charcoal-light">Chosen at checkout</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-store-line pt-4">
                <dt className="font-semibold text-store-charcoal">Total</dt>
                <dd className="text-xl font-semibold tabular text-store-charcoal">{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            <Link to="/checkout" className={buttonClasses('primary', 'lg', true, 'mt-6')}>
              Checkout <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <ul className="mt-5 space-y-2.5 text-[13px] text-store-charcoal-light">
              <li className="flex gap-2.5">
                <Store className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Store pickup on Station Road is free
              </li>
              <li className="flex gap-2.5">
                <Truck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {toFreeDelivery > 0
                  ? `Home delivery ${formatPrice(HOME_DELIVERY_FEE)} — add ${formatPrice(toFreeDelivery)} more for free delivery`
                  : 'Free home delivery in Kamareddy on this order'}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
