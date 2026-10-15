import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { BookOpen, CheckCircle2, Clock, Heart, LibraryBig, MessageCircle, PackageCheck, Search, Store } from 'lucide-react';
import useWishlistStore from '../../store/wishlistStore';
import { PageHeader, Panel, StatTile, MonoTag, table } from '../../components/admin/AdminUI';
import { Badge } from '../../components/ui/Badge';
import { Button, buttonClasses } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { EmptyState } from '../../components/ui/EmptyState';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { Field, Input } from '../../components/ui/Field';
import { ProductCover } from '../../components/ProductCard';
import { STORE, formatPrice } from '../../components/landing/landingData';

interface PortalOrder {
  id: string;
  token: string;
  date: string;
  studentName: string;
  collegeId: string;
  phone: string;
  items: { title: string; qty: number; price: number }[];
  total: number;
  paymentMethod: string;
  status: 'Ready for Store Pickup' | 'Completed' | 'Processing';
}

// Sample records — the portal is not yet connected to the order service.
const mockOrders: PortalOrder[] = [
  {
    id: 'ORD-9921', token: 'TK-8041', date: 'Oct 11, 2026', studentName: 'Dr. S. K. Sharma', collegeId: 'OU-FAC-8842', phone: '+91 98490 12345',
    items: [
      { title: 'Engineering Mathematics - Vol 1 (NP Bali)', qty: 1, price: 450 },
      { title: 'Basic Electrical Engineering (BL Theraja)', qty: 1, price: 590 },
      { title: 'Classmate Pulse Spiral Notebook (300 pgs)', qty: 1, price: 200 },
    ],
    total: 1240, paymentMethod: 'UPI', status: 'Ready for Store Pickup',
  },
  {
    id: 'ORD-9884', token: 'TK-7910', date: 'Oct 04, 2026', studentName: 'Dr. S. K. Sharma', collegeId: 'OU-FAC-8842', phone: '+91 98490 12345',
    items: [
      { title: 'Telangana History & Culture (Telugu Academy)', qty: 1, price: 380 },
      { title: 'General Studies Telangana Movement Vol 2', qty: 1, price: 420 },
    ],
    total: 800, paymentMethod: 'Cash at counter', status: 'Completed',
  },
  {
    id: 'ORD-9812', token: 'TK-7740', date: 'Sep 28, 2026', studentName: 'Dr. S. K. Sharma', collegeId: 'OU-FAC-8842', phone: '+91 98490 12345',
    items: [
      { title: 'VGS Intermediate Maths 1A Question Bank', qty: 2, price: 260 },
      { title: 'Drawing Instruments Engineering Drafter Pro', qty: 1, price: 480 },
    ],
    total: 740, paymentMethod: 'UPI', status: 'Completed',
  },
];

const statusBadge = (status: PortalOrder['status']) =>
  status === 'Ready for Store Pickup' ? (
    <Badge variant="saffron" dot>Ready for pickup</Badge>
  ) : status === 'Processing' ? (
    <Badge variant="info" dot>Processing</Badge>
  ) : (
    <Badge variant="success" dot>Collected</Badge>
  );

const CustomerPortalDashboard: React.FC = () => {
  const [params] = useSearchParams();
  const tab = params.get('tab');
  const wishlist = useWishlistStore((s) => s.items);

  const [orders, setOrders] = useState<PortalOrder[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');

  // Pickup verification dialog
  const [pickupOpen, setPickupOpen] = useState(false);
  const [lookup, setLookup] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<PortalOrder | null>(null);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const readyOrders = orders.filter((o) => o.status === 'Ready for Store Pickup');
  const openOrders = orders.filter((o) => o.status !== 'Completed');
  const completed = orders.filter((o) => o.status === 'Completed');

  const visibleOrders = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return orders
      .filter((o) => (tab === 'pickups' ? o.status === 'Ready for Store Pickup' : true))
      .filter(
        (o) =>
          o.token.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.items.some((i) => i.title.toLowerCase().includes(q))
      );
  }, [orders, searchTerm, tab]);

  const openPickup = (order: PortalOrder | null) => {
    setActiveOrder(order);
    setLookup(order?.token ?? '');
    setLookupError(null);
    setChecked(order ? Object.fromEntries(order.items.map((_, i) => [i, false])) : {});
    setPickupOpen(true);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const q = lookup.trim().toLowerCase();
    const found = orders.find(
      (o) => o.token.toLowerCase() === q || o.id.toLowerCase() === q || (q.length >= 4 && o.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '')))
    );
    if (found) {
      setActiveOrder(found);
      setLookupError(null);
      setChecked(Object.fromEntries(found.items.map((_, i) => [i, false])));
    } else {
      setActiveOrder(null);
      setLookupError('No order matches that token, order ID or phone number.');
    }
  };

  const allChecked = activeOrder ? activeOrder.items.every((_, i) => checked[i]) : false;

  const confirmPickup = () => {
    if (!activeOrder) return;
    setOrders((prev) => prev.map((o) => (o.id === activeOrder.id ? { ...o, status: 'Completed' } : o)));
    toast.success(`Order ${activeOrder.id} marked as collected`);
    setPickupOpen(false);
  };

  return (
    <div className="mx-auto max-w-admin space-y-6">
      <PageHeader
        eyebrow="Student & institution portal"
        title={tab === 'pickups' ? 'Store pickups' : tab === 'saved' ? 'Saved titles' : 'Overview'}
        description="Track textbook orders, collect pickups at the Station Road counter and keep course book lists together."
        actions={
          <Button variant="admin-accent" onClick={() => openPickup(readyOrders[0] ?? null)}>
            <PackageCheck className="h-4 w-4" aria-hidden="true" /> Verify pickup token
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Open orders" value={openOrders.length} icon={<Clock />} tone="info" note="Not yet collected" />
        <StatTile label="Ready for pickup" value={readyOrders.length} icon={<Store />} tone={readyOrders.length ? 'warning' : 'neutral'} note={readyOrders.length ? 'Waiting at the counter' : 'Nothing waiting'} to="/portal?tab=pickups" />
        <StatTile label="Collected" value={completed.length} icon={<CheckCircle2 />} tone="success" note="Completed orders" />
        <StatTile label="Saved titles" value={wishlist.length} icon={<Heart />} note="From your wishlist" to="/portal?tab=saved" />
      </div>

      {tab === 'saved' ? (
        <Panel title="Saved titles" description="Books and supplies you have saved in the storefront.">
          {wishlist.length === 0 ? (
            <EmptyState
              compact
              icon={<Heart />}
              title="No saved titles"
              description="Save books from the catalog to build a course list here."
              action={<Link to="/books" className={buttonClasses('admin-primary')}>Open the catalog</Link>}
            />
          ) : (
            <ul className="divide-y divide-admin-line">
              {wishlist.map((p) => (
                <li key={p._id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
                  <span className="h-14 w-11 shrink-0 overflow-hidden rounded bg-slate-100"><ProductCover product={p} /></span>
                  <div className="min-w-0 flex-1">
                    <Link to={`/book/${p._id}`} className="block truncate text-[14px] font-medium text-slate-900 hover:text-navy">{p.title}</Link>
                    <p className="truncate text-[13px] text-slate-500">{p.author} · {p.category}</p>
                  </div>
                  <span className="shrink-0 text-[14px] font-semibold tabular">{formatPrice(p.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
          <Panel
            title={tab === 'pickups' ? 'Orders ready for pickup' : 'Order history & pickup tokens'}
            description="Show the token at the Station Road counter to collect your books."
            actions={
              <SearchInput
                size="sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm('')}
                placeholder="Token, order or title"
                aria-label="Search orders"
                wrapperClassName="w-full sm:w-60"
              />
            }
          >
            {visibleOrders.length === 0 ? (
              <EmptyState compact icon={<Search />} title="No matching orders" description="Try a different token or book title." />
            ) : (
              <div className={table.wrap}>
                <table className={`${table.table} min-w-[720px]`}>
                  <thead className={table.thead}>
                    <tr>
                      <th scope="col" className={table.th}>Token</th>
                      <th scope="col" className={table.th}>Items</th>
                      <th scope="col" className={`${table.th} text-right`}>Total</th>
                      <th scope="col" className={table.th}>Payment</th>
                      <th scope="col" className={table.th}>Status</th>
                      <th scope="col" className={`${table.th} text-right`}><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className={table.tbody}>
                    {visibleOrders.map((o) => (
                      <tr key={o.id} className={table.tr}>
                        <td className={table.td}>
                          <span className="block font-mono font-semibold text-slate-900">{o.token}</span>
                          <span className="text-[12px] text-slate-500">{o.id} · {o.date}</span>
                        </td>
                        <td className={`${table.td} max-w-xs`}>
                          {o.items.map((i) => (
                            <span key={i.title} className="block truncate">
                              <span className="tabular text-slate-500">{i.qty}×</span> {i.title}
                            </span>
                          ))}
                        </td>
                        <td className={`${table.num} font-semibold`}>{formatPrice(o.total)}</td>
                        <td className={table.td}>{o.paymentMethod}</td>
                        <td className={table.td}>{statusBadge(o.status)}</td>
                        <td className={`${table.td} text-right`}>
                          {o.status !== 'Completed' && (
                            <Button size="sm" variant="admin-secondary" onClick={() => openPickup(o)}>Verify</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <div className="space-y-4">
            <Panel title="Next steps" bodyClassName="p-2">
              <ul>
                {[
                  { href: '/books', icon: LibraryBig, label: 'Order course textbooks', note: 'Browse the full catalog' },
                  { href: '/blog', icon: BookOpen, label: 'Syllabus & exam guides', note: 'Book lists from the store team' },
                ].map(({ href, icon: Icon, label, note }) => (
                  <li key={href}>
                    <Link to={href} className="flex items-start gap-3 rounded-lg p-3 hover:bg-slate-50">
                      <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-navy" aria-hidden="true" />
                      <span>
                        <span className="block text-[14px] font-medium text-slate-900">{label}</span>
                        <span className="block text-[13px] text-slate-500">{note}</span>
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-lg p-3 hover:bg-slate-50">
                    <MessageCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-navy" aria-hidden="true" />
                    <span>
                      <span className="block text-[14px] font-medium text-slate-900">Bulk & institutional orders</span>
                      <span className="block text-[13px] text-slate-500">Request a quote on WhatsApp</span>
                    </span>
                  </a>
                </li>
              </ul>
            </Panel>
            <div className="rounded-xl border border-admin-line bg-white p-4 text-[13px] text-slate-600">
              <p className="font-semibold text-slate-900">Station Road counter</p>
              <p className="mt-1">{STORE.address}</p>
              <p className="mt-1">Open {STORE.hours} · {STORE.phoneDisplay}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pickup verification */}
      <Dialog open={pickupOpen} onOpenChange={setPickupOpen}>
        <DialogContent scope="portal" size="md">
          <DialogHeader>
            <DialogTitle>Verify pickup token</DialogTitle>
            <DialogDescription>Look up the order, check each item against the physical copies, then mark it collected.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLookup} className="mt-5 flex items-end gap-2" noValidate>
            <Field label="Token, order ID or phone" error={lookupError ?? undefined} className="flex-1">
              {(a) => <Input {...a} value={lookup} onChange={(e) => setLookup(e.target.value)} placeholder="e.g. TK-8041" />}
            </Field>
            <Button type="submit" variant="admin-secondary" className={lookupError ? 'mb-6' : ''}>Look up</Button>
          </form>

          {activeOrder && (
            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-4 py-3 text-[13px]">
                <div>
                  <p className="font-semibold text-slate-900">{activeOrder.studentName}</p>
                  <p className="text-slate-500">{activeOrder.collegeId} · {activeOrder.phone}</p>
                </div>
                <MonoTag>{activeOrder.token}</MonoTag>
              </div>
              {activeOrder.status === 'Completed' ? (
                <Badge variant="success" dot>Already collected</Badge>
              ) : (
                <fieldset>
                  <legend className="text-[13px] font-medium text-slate-900">Items to hand over</legend>
                  <ul className="mt-2 space-y-1.5">
                    {activeOrder.items.map((item, idx) => (
                      <li key={idx}>
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-admin-line px-3 py-2.5 text-[14px] hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={!!checked[idx]}
                            onChange={(e) => setChecked({ ...checked, [idx]: e.target.checked })}
                            className="h-4 w-4 accent-navy"
                          />
                          <span className="min-w-0 flex-1 truncate">{item.title}</span>
                          <span className="shrink-0 tabular text-slate-500">×{item.qty}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              )}
              <div className="flex justify-between text-[14px]">
                <span className="text-slate-600">Bill total</span>
                <span className="font-semibold tabular">{formatPrice(activeOrder.total)}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setPickupOpen(false)}>Cancel</Button>
            <Button
              variant="admin-primary"
              onClick={confirmPickup}
              disabled={!activeOrder || activeOrder.status === 'Completed' || !allChecked}
            >
              Mark as collected
            </Button>
          </DialogFooter>
          {activeOrder && activeOrder.status !== 'Completed' && !allChecked && (
            <p className="mt-2 text-right text-[12px] text-slate-500">Tick every item to enable.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerPortalDashboard;
