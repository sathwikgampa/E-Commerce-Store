import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, Heart, MessageCircle, SearchX, Share2, ShoppingBag, Store, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '../api/queries';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import ProductCard, { ProductCover } from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { RatingStars } from '../components/ui/RatingStars';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { buttonClasses } from '../components/ui/Button';
import { STORE, catalogPath, discountPercent, formatPrice } from '../components/landing/landingData';
import { FREE_DELIVERY_THRESHOLD, HOME_DELIVERY_FEE } from '../lib/pricing';
import { cn } from '../lib/utils';

type Tab = 'overview' | 'specs' | 'reviews';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const saved = useWishlistStore((s) => s.items.some((i) => i._id === id));

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [quickView, setQuickView] = useState<Product | null>(null);

  const product = products.find((p) => p._id === id) ?? null;
  const related = useMemo(() => {
    if (!product) return [];
    const same = products.filter((p) => p.category === product.category && p._id !== product._id);
    const others = products.filter((p) => p.category !== product.category && p._id !== product._id);
    return [...same, ...others].slice(0, 4);
  }, [products, product]);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-store gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:px-12" aria-busy="true">
        <div className="aspect-square rounded-2xl bg-store-muted motion-safe:animate-pulse" />
        <div className="space-y-4 pt-4">
          <div className="h-3 w-24 rounded bg-store-muted" />
          <div className="h-9 w-4/5 rounded bg-store-muted" />
          <div className="h-4 w-1/3 rounded bg-store-muted" />
          <div className="h-8 w-32 rounded bg-store-muted" />
        </div>
        <span className="sr-only" role="status">Loading product…</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-store px-5 py-16 sm:px-8 lg:px-12">
        <EmptyState
          icon={<SearchX />}
          title="We couldn't find that product"
          description="It may have been removed from the catalog, or the link is incorrect."
          action={<Link to="/books" className={buttonClasses('primary')}>Browse the catalog</Link>}
        />
      </div>
    );
  }

  const discount = discountPercent(product);
  const summary = product.description || product.desc;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} to cart`, {
      description: product.title,
      action: { label: 'View cart', onClick: () => navigate('/cart') },
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    toast(saved ? 'Removed from wishlist' : 'Saved to wishlist', { description: product.title });
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({ title: product.title, url: window.location.href }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy the link');
    }
  };

  // Only show specification rows the product actually has
  const specs = (
    [
      ['Author / brand', product.author],
      ['Publisher', product.publisher],
      ['Edition', product.edition],
      ['ISBN / SKU', product.isbn],
      ['Language / format', product.language],
      ['Pages / capacity', product.pages],
      ['Binding / material', product.binding],
      ['Curriculum', product.curriculum],
      ['Dimensions', product.dimensions],
      ['Weight', product.weight],
    ] as [string, string | undefined][]
  ).filter(([, value]) => Boolean(value)) as [string, string][];

  const whatsappHref = `https://wa.me/919949886640?text=${encodeURIComponent(
    `Hi Sri Thirumala Store, I would like to order: ${product.title} (Price: INR ${product.price})`
  )}`;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    ...(specs.length ? [{ id: 'specs' as Tab, label: 'Specifications' }] : []),
    { id: 'reviews', label: 'Ratings' },
  ];

  return (
    <div className="mx-auto max-w-store px-5 pb-16 pt-6 sm:px-8 lg:px-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/home' },
          { label: 'Shop', href: '/books' },
          { label: product.category, href: catalogPath({ category: product.category }) },
          { label: product.title },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-14">
        {/* Imagery */}
        <div className="lg:col-span-6">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-store-muted lg:sticky lg:top-28">
            <ProductCover product={product} priority className={cn(!product.inStock && 'opacity-60')} />
            {product.badge && !/%|discount|off\b/i.test(product.badge) && (
              <span className="absolute left-4 top-4 rounded-md bg-white/95 px-2.5 py-1 text-xs font-medium text-store-charcoal">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Purchase panel */}
        <div className="lg:col-span-6 lg:pt-2">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-store-charcoal-light">{product.category}</p>
          <h1 className="mt-3 text-balance font-serif text-[30px] font-semibold leading-[1.1] tracking-tight text-store-charcoal sm:text-[38px]">
            {product.title}
          </h1>
          <p className="mt-2 text-[15px] text-store-charcoal-light">
            by <span className="font-medium text-store-charcoal">{product.author}</span>
            {product.publisher && <> · {product.publisher}</>}
          </p>

          {product.rating > 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('reviews');
                document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="mt-3 rounded-sm"
            >
              <RatingStars rating={product.rating} size="md" />
            </button>
          )}

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[32px] font-semibold tabular leading-none text-store-charcoal">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg tabular text-store-charcoal-light line-through">
                  <span className="sr-only">Was </span>
                  {formatPrice(product.originalPrice!)}
                </span>
                <Badge variant="success">Save {discount}%</Badge>
              </>
            )}
          </div>
          <p className="mt-2 text-[13px] text-store-charcoal-light">Inclusive of all taxes</p>

          <div className="mt-5">
            {product.inStock ? (
              <Badge variant="success" dot>In stock — ready for pickup or local delivery</Badge>
            ) : (
              <Badge variant="danger" dot>Currently out of stock</Badge>
            )}
          </div>

          {summary && <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-store-charcoal-light">{summary}</p>}

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-store-line pt-6">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={buttonClasses('primary', 'lg', false, 'min-w-[12rem] flex-1')}
            >
              <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
              {product.inStock ? `Add to cart · ${formatPrice(product.price * quantity)}` : 'Out of stock'}
            </button>
            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              className={buttonClasses('secondary', 'icon', false, 'h-12 w-12')}
            >
              <Heart className={cn('h-5 w-5', saved && 'fill-store-primary text-store-primary')} strokeWidth={1.75} />
            </button>
            <button type="button" onClick={handleShare} aria-label="Share this product" className={buttonClasses('secondary', 'icon', false, 'h-12 w-12')}>
              <Share2 className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-store-line bg-white text-[14px] font-medium text-store-charcoal transition-colors hover:bg-store-accent"
          >
            <MessageCircle className="h-4 w-4 text-[#128C7E]" aria-hidden="true" /> Order on WhatsApp ({STORE.phoneDisplay})
          </a>

          <ul className="mt-6 space-y-3 rounded-xl bg-white p-5 text-[14px] text-store-charcoal-light ring-1 ring-store-line">
            <li className="flex gap-3">
              <Store className="mt-0.5 h-4 w-4 shrink-0 text-store-primary" aria-hidden="true" />
              <span><strong className="font-medium text-store-charcoal">Free store pickup</strong> — Station Road, Kamareddy, {STORE.hours}</span>
            </li>
            <li className="flex gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-store-primary" aria-hidden="true" />
              <span>
                <strong className="font-medium text-store-charcoal">Home delivery in Kamareddy</strong> — free over {formatPrice(FREE_DELIVERY_THRESHOLD)}, otherwise {formatPrice(HOME_DELIVERY_FEE)}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Details tabs */}
      <section id="product-tabs" className="mt-16 scroll-mt-28">
        <div role="tablist" aria-label="Product information" className="flex gap-6 overflow-x-auto border-b border-store-line hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                '-mb-px shrink-0 border-b-2 py-3.5 text-[15px] font-medium transition-colors',
                activeTab === tab.id ? 'border-store-primary text-store-charcoal' : 'border-transparent text-store-charcoal-light hover:text-store-charcoal'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} className="py-8">
          {activeTab === 'overview' && (
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h2 className="font-serif text-2xl font-semibold text-store-charcoal">About this item</h2>
                <p className="mt-4 max-w-reading text-[16px] leading-[1.75] text-store-charcoal-light">
                  {summary || 'No description is available for this item yet.'}
                </p>
              </div>
              {product.features && product.features.length > 0 && (
                <div className="lg:col-span-5">
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-store-charcoal">Highlights</h3>
                  <ul className="mt-4 space-y-3">
                    {product.features.map((f) => (
                      <li key={f} className="flex gap-3 text-[15px] leading-relaxed text-store-charcoal-light">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <dl className="max-w-2xl divide-y divide-store-line border-y border-store-line">
              {specs.map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-[14px] text-store-charcoal-light">{label}</dt>
                  <dd className="text-[14px] font-medium text-store-charcoal sm:col-span-2">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {activeTab === 'reviews' && (
            <div className="flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-center">
              {product.rating > 0 ? (
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-semibold tabular text-store-charcoal">{product.rating.toFixed(1)}</span>
                  <div>
                    <RatingStars rating={product.rating} size="md" showValue={false} />
                    <p className="mt-1 text-[13px] text-store-charcoal-light">Average customer rating</p>
                  </div>
                </div>
              ) : (
                <p className="text-[15px] text-store-charcoal-light">This item hasn't been rated yet.</p>
              )}
              <p className="text-[14px] leading-relaxed text-store-charcoal-light sm:border-l sm:border-store-line sm:pl-6">
                Written reviews aren't collected online yet. Bought this from us? Share feedback with the store on{' '}
                <a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className="font-medium text-store-primary underline-offset-4 hover:underline">
                  WhatsApp
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-8 border-t border-store-line pt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-heading" className="font-serif text-[26px] font-semibold tracking-tight text-store-charcoal">
              You may also need
            </h2>
            <Link to={catalogPath({ category: product.category })} className="shrink-0 text-[14px] font-medium text-store-primary underline-offset-4 hover:underline">
              More in {product.category}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p._id} product={p} onQuickView={setQuickView} />)}
          </div>
        </section>
      )}

      <QuickViewModal product={quickView} isOpen={!!quickView} onClose={() => setQuickView(null)} />
    </div>
  );
};

export default ProductDetail;
