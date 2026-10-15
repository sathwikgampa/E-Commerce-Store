import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, MessageCircle, Package, ShoppingBag, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import useWishlistStore from '../store/wishlistStore';
import useCartStore from '../store/cartStore';
import { useOrders } from '../api/queries';
import { getSavedOrders } from '../lib/orderHistory';
import { ProductCover } from '../components/ProductCard';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { buttonClasses } from '../components/ui/Button';
import { STORE, formatPrice } from '../components/landing/landingData';
import { cn } from '../lib/utils';

type Tab = 'orders' | 'wishlist' | 'account';

const STATUS: Record<string, { label: string; variant: 'warning' | 'info' | 'success' }> = {
  Pending: { label: 'Awaiting confirmation', variant: 'warning' },
  Confirmed: { label: 'Confirmed', variant: 'info' },
  Delivered: { label: 'Completed', variant: 'success' },
};

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const UserDashboard: React.FC = () => {
  const [tab, setTab] = useState<Tab>('orders');
  const wishlist = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const addToCart = useCartStore((s) => s.addToCart);
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const { data: allOrders = [], isLoading: ordersLoading } = useOrders();

  // Orders placed from this browser, with the latest status from the order service when available
  const myOrders = useMemo(() => {
    const live = new Map(allOrders.filter((o) => o._id).map((o) => [o._id, o]));
    return getSavedOrders().map((o) => ({ ...o, status: live.get(o._id)?.status ?? o.status }));
  }, [allOrders]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'orders', label: 'Orders', icon: <Package className="h-4 w-4" />, count: myOrders.length },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="h-4 w-4" />, count: wishlist.length },
    { id: 'account', label: 'Account', icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-store px-5 pb-16 pt-6 sm:px-8 lg:px-12">
      <Breadcrumb items={[{ label: 'Home', href: '/home' }, { label: 'My account' }]} />

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-store-line pb-8">
        <div>
          <h1 className="font-serif text-[34px] font-semibold tracking-tight text-store-charcoal sm:text-[40px]">My account</h1>
          <p className="mt-2 max-w-xl text-[15px] text-store-charcoal-light">
            Orders, saved items and your cart are kept on this device.
          </p>
        </div>
        <dl className="flex gap-8 text-[14px]">
          <div>
            <dt className="text-store-charcoal-light">Orders</dt>
            <dd className="text-xl font-semibold tabular">{myOrders.length}</dd>
          </div>
          <div>
            <dt className="text-store-charcoal-light">Saved</dt>
            <dd className="text-xl font-semibold tabular">{wishlist.length}</dd>
          </div>
          <div>
            <dt className="text-store-charcoal-light">In cart</dt>
            <dd className="text-xl font-semibold tabular">{cartCount}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[13rem_1fr] lg:gap-12">
        <nav aria-label="Account sections">
          <ul role="tablist" className="flex gap-1 overflow-x-auto hide-scrollbar lg:flex-col">
            {tabs.map((t) => (
              <li key={t.id} className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-[14px] font-medium transition-colors',
                    tab === t.id ? 'bg-store-charcoal text-white' : 'text-store-charcoal-light hover:bg-store-accent-dark hover:text-store-charcoal'
                  )}
                >
                  {t.icon}
                  {t.label}
                  {t.count !== undefined && t.count > 0 && <span className="ml-auto text-xs tabular opacity-75">{t.count}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <section role="tabpanel" aria-label={tabs.find((t) => t.id === tab)?.label} className="min-w-0">
          {tab === 'orders' &&
            (myOrders.length === 0 ? (
              <EmptyState
                icon={<Package />}
                title="No orders yet"
                description="Orders you place from this device will show here, along with their status."
                action={<Link to="/books" className={buttonClasses('primary')}>Start shopping</Link>}
                className="rounded-xl border border-dashed border-store-line"
              />
            ) : (
              <ul className="space-y-4">
                {myOrders.map((order) => {
                  const status = STATUS[order.status] ?? STATUS.Pending;
                  return (
                    <li key={order._id} className="rounded-xl bg-white ring-1 ring-store-line">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-store-line px-5 py-3.5">
                        <div className="text-[14px]">
                          <span className="font-mono font-semibold text-store-charcoal">#{order._id}</span>
                          <span className="text-store-charcoal-light"> · {formatDate(order.createdAt)}</span>
                        </div>
                        <Badge variant={status.variant} dot>{status.label}</Badge>
                      </div>
                      <div className="grid gap-4 px-5 py-4 sm:grid-cols-[1fr_auto]">
                        <ul className="space-y-1.5 text-[14px]">
                          {order.items.map((it, i) => (
                            <li key={i} className="flex gap-2 text-store-charcoal">
                              <span className="tabular text-store-charcoal-light">{it.quantity}×</span>
                              <span className="min-w-0 truncate">{it.title}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="text-[14px] sm:text-right">
                          <p className="text-lg font-semibold tabular">{formatPrice(order.totalAmount)}</p>
                          <p className="text-store-charcoal-light">
                            {order.deliveryType === 'delivery' ? 'Home delivery' : 'Store pickup'} ·{' '}
                            {order.paymentMethod === 'UPI' ? 'UPI' : 'Cash'}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
                {ordersLoading && <li className="text-[13px] text-store-charcoal-light">Checking for status updates…</li>}
              </ul>
            ))}

          {tab === 'wishlist' &&
            (wishlist.length === 0 ? (
              <EmptyState
                icon={<Heart />}
                title="Nothing saved yet"
                description="Tap the heart on any product to keep it here for later."
                action={<Link to="/books" className={buttonClasses('primary')}>Browse the catalog</Link>}
                className="rounded-xl border border-dashed border-store-line"
              />
            ) : (
              <ul className="divide-y divide-store-line border-y border-store-line">
                {wishlist.map((item) => (
                  <li key={item._id} className="flex gap-4 py-4">
                    <Link to={`/book/${item._id}`} tabIndex={-1} aria-hidden="true" className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-store-muted">
                      <ProductCover product={item} />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link to={`/book/${item._id}`} className="line-clamp-2 text-[15px] font-semibold text-store-charcoal hover:text-store-primary">
                        {item.title}
                      </Link>
                      <p className="truncate text-[13px] text-store-charcoal-light">{item.author}</p>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                        <span className="text-[15px] font-semibold tabular">{formatPrice(item.price)}</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              toggleWishlist(item);
                              toast('Removed from wishlist', { description: item.title });
                            }}
                            className={buttonClasses('ghost', 'sm')}
                            aria-label={`Remove ${item.title} from wishlist`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            disabled={!item.inStock}
                            onClick={() => {
                              addToCart(item);
                              toast.success('Added to cart', { description: item.title });
                            }}
                            className={buttonClasses('dark', 'sm')}
                          >
                            <ShoppingBag className="h-4 w-4" aria-hidden="true" /> {item.inStock ? 'Add to cart' : 'Out of stock'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ))}

          {tab === 'account' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-white p-6 ring-1 ring-store-line">
                <h2 className="font-sans text-[16px] font-semibold">Profile</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-store-charcoal-light">
                  Online customer profiles and saved addresses aren’t available yet. Your contact details are entered at checkout for each order.
                </p>
                <Link to="/login" className={buttonClasses('secondary', 'md', false, 'mt-5')}>Sign in</Link>
              </div>
              <div className="rounded-xl bg-white p-6 ring-1 ring-store-line">
                <h2 className="font-sans text-[16px] font-semibold">Need help with an order?</h2>
                <ul className="mt-3 space-y-2.5 text-[14px] text-store-charcoal-light">
                  <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {STORE.address}</li>
                  <li className="flex gap-2.5"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {STORE.phoneDisplay} · {STORE.hours}</li>
                </ul>
                <a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className={buttonClasses('secondary', 'md', false, 'mt-5')}>
                  Message on WhatsApp
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
