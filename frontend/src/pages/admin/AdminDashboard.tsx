import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertTriangle,
  BookPlus,
  CheckCircle2,
  ExternalLink,
  IndianRupee,
  LayoutGrid,
  Library,
  List,
  PackageCheck,
  PackagePlus,
  Store,
} from 'lucide-react';
import { useProducts, useOrders } from '../../api/queries';
import { Product, Order } from '../../types';
import { useInventoryStore } from '../../store/inventoryStore';
import { PageHeader, Panel, StatTile, MonoTag, table } from '../../components/admin/AdminUI';
import { Badge } from '../../components/ui/Badge';
import { Button, buttonClasses } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { EmptyState } from '../../components/ui/EmptyState';
import { Field, Input, Select } from '../../components/ui/Field';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { ProductCover } from '../../components/ProductCard';
import { formatPrice } from '../../components/landing/landingData';
import { cn } from '../../lib/utils';

type TabType = 'pickups' | 'orders' | 'products';
type Status = Order['status'];

const CATEGORY_OPTIONS = [
  'Textbooks', 'Notebooks', 'School Supplies', 'Engineering Materials',
  'Question Banks', 'Competitive Exam Books', 'School Bags', 'College Bags',
];

const STATUS_BADGE: Record<Status, { label: string; variant: 'warning' | 'info' | 'success' }> = {
  Pending: { label: 'Pending', variant: 'warning' },
  Confirmed: { label: 'Confirmed', variant: 'info' },
  Delivered: { label: 'Delivered / collected', variant: 'success' },
};

const EMPTY_PRODUCT = { title: '', author: '', publisher: '', category: 'Textbooks', price: '', stock: '', isbn: '' };

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pickups');
  const [productViewMode, setProductViewMode] = useState<'list' | 'grid'>('list');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const [pickupOrder, setPickupOrder] = useState<Order | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [productErrors, setProductErrors] = useState<{ title?: string; price?: string }>({});

  const { data: initialProducts = [], isLoading: productsLoading } = useProducts();
  const { data: initialOrders = [], isLoading: ordersLoading, refetch: refetchOrders } = useOrders();
  const stockMap = useInventoryStore((s) => s.stockMap);

  // Products added this session (not persisted to the catalog API)
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const allProducts = useMemo(() => [...customProducts, ...initialProducts], [customProducts, initialProducts]);

  // Orders with local storage sync for pickup status (existing behaviour)
  const orders = useMemo(() => {
    const stored = localStorage.getItem('mock_admin_orders');
    if (stored) {
      try {
        const parsed: Order[] = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      } catch {
        // ignore malformed cache
      }
    }
    return initialOrders;
  }, [initialOrders]);

  const pendingPickups = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed');
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const totalOrderValue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const stockAlerts = Object.values(stockMap).filter((r) => r.status !== 'In Stock');

  const filteredProducts = allProducts.filter((p) => {
    const q = productSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || (p.publisher ?? '').toLowerCase().includes(q);
  });

  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    return (o.name ?? '').toLowerCase().includes(q) || (o.phone ?? '').includes(orderSearch) || (o._id ?? '').toLowerCase().includes(q);
  });

  const writeOrders = (updater: (list: Order[]) => Order[]) => {
    const existing: Order[] = JSON.parse(localStorage.getItem('mock_admin_orders') || JSON.stringify(orders));
    localStorage.setItem('mock_admin_orders', JSON.stringify(updater(existing)));
    refetchOrders();
  };

  const updateOrderStatus = (orderId: string, newStatus: Status) => {
    writeOrders((list) => list.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    toast.success(`Order #${orderId} marked as ${STATUS_BADGE[newStatus].label.toLowerCase()}`);
  };

  const openPickup = (order: Order) => {
    setPickupOrder(order);
    setVerificationCode('');
    setVerificationError(null);
    setCheckedItems(Object.fromEntries(order.items.map((_, i) => [i, true])));
  };

  const handleConfirmPickup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupOrder) return;
    if (!verificationCode.trim()) {
      setVerificationError('Enter the customer’s pickup token or the last 4 digits of their phone.');
      return;
    }
    const orderId = pickupOrder._id!;
    writeOrders((list) =>
      list.map((o) =>
        o._id === orderId
          ? { ...o, status: 'Delivered' as const, pickupVerifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), verifiedBy: 'Store Manager (Kamareddy)' }
          : o
      )
    );
    toast.success(`Order #${orderId} handed over to ${pickupOrder.name}`);
    setPickupOrder(null);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof productErrors = {};
    if (!newProduct.title.trim()) errs.title = 'Enter a title.';
    const price = parseFloat(newProduct.price);
    if (!newProduct.price || Number.isNaN(price) || price <= 0) errs.price = 'Enter a price greater than 0.';
    setProductErrors(errs);
    if (Object.keys(errs).length) return;

    const stock = newProduct.stock.trim() === '' ? undefined : parseInt(newProduct.stock, 10);
    const created: Product = {
      _id: `book-${Date.now().toString().slice(-5)}`,
      title: newProduct.title.trim(),
      author: newProduct.author.trim() || 'Unknown',
      publisher: newProduct.publisher.trim() || undefined,
      category: newProduct.category,
      price,
      inStock: stock === undefined ? true : stock > 0,
      stock,
      rating: 0,
      isbn: newProduct.isbn.trim() || undefined,
    };
    setCustomProducts((prev) => [created, ...prev]);
    setIsAddProductOpen(false);
    setNewProduct(EMPTY_PRODUCT);
    toast.success(`Added “${created.title}” for this session`);
  };

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'pickups', label: 'Pickup queue', count: pendingPickups.length },
    { id: 'orders', label: 'All orders', count: orders.length },
    { id: 'products', label: 'Products', count: allProducts.length },
  ];

  return (
    <div className="mx-auto max-w-admin space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Dashboard"
        description="Orders, pickups and catalog for the Station Road store."
        actions={
          <>
            <Button variant="admin-secondary" onClick={() => setIsAddProductOpen(true)}>
              <BookPlus className="h-4 w-4" aria-hidden="true" /> Add product
            </Button>
            <Button
              variant="admin-primary"
              disabled={pendingPickups.length === 0}
              onClick={() => pendingPickups[0] && openPickup(pendingPickups[0])}
            >
              <PackageCheck className="h-4 w-4" aria-hidden="true" /> Verify next pickup
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatTile
          label="Awaiting collection"
          value={pendingPickups.length}
          icon={<Store />}
          tone={pendingPickups.length ? 'warning' : 'success'}
          note={pendingPickups.length ? 'Pending or confirmed orders' : 'Queue is clear'}
          onClick={() => setActiveTab('pickups')}
        />
        <StatTile label="Completed orders" value={deliveredCount} icon={<CheckCircle2 />} tone="success" note={`of ${orders.length} total`} />
        <StatTile label="Order value" value={formatPrice(totalOrderValue)} icon={<IndianRupee />} tone="info" note={`Sum of ${orders.length} recorded orders`} />
        <StatTile
          label="Stock alerts"
          value={stockAlerts.length}
          icon={<AlertTriangle />}
          tone={stockAlerts.length ? 'danger' : 'neutral'}
          note={Object.keys(stockMap).length ? 'Low or out of stock' : 'Open inventory to load stock'}
          to="/admin/inventory/alerts"
        />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1fr_20rem]">
        <section className="overflow-hidden rounded-xl border border-admin-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-admin-line px-4 sm:px-5">
            <div role="tablist" aria-label="Dashboard sections" className="-mb-px flex gap-5 overflow-x-auto hide-scrollbar">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    'flex h-12 shrink-0 items-center gap-2 border-b-2 text-[14px] font-medium transition-colors',
                    activeTab === t.id ? 'border-navy text-navy' : 'border-transparent text-slate-500 hover:text-slate-900'
                  )}
                >
                  {t.label}
                  <span className={cn('rounded-full px-1.5 text-[12px] tabular', activeTab === t.id ? 'bg-navy-soft' : 'bg-slate-100')}>{t.count}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 py-2">
              {activeTab === 'orders' && (
                <SearchInput size="sm" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} onClear={() => setOrderSearch('')} placeholder="Name, phone or order ID" aria-label="Search orders" wrapperClassName="w-56" />
              )}
              {activeTab === 'products' && (
                <>
                  <SearchInput size="sm" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} onClear={() => setProductSearch('')} placeholder="Title, author, publisher" aria-label="Search products" wrapperClassName="w-56" />
                  <div role="group" aria-label="Layout" className="flex rounded-md border border-admin-line p-0.5">
                    {(['list', 'grid'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setProductViewMode(m)}
                        aria-pressed={productViewMode === m}
                        aria-label={m === 'list' ? 'List view' : 'Grid view'}
                        className={cn('inline-flex h-7 w-8 items-center justify-center rounded', productViewMode === m ? 'bg-navy text-white' : 'text-slate-500 hover:text-slate-900')}
                      >
                        {m === 'list' ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Pickups */}
          {activeTab === 'pickups' && (
            ordersLoading ? (
              <p className="p-6 text-[14px] text-slate-500" role="status">Loading orders…</p>
            ) : pendingPickups.length === 0 ? (
              <EmptyState compact icon={<CheckCircle2 />} title="No pickups waiting" description="Pending and confirmed orders will appear here for handover." />
            ) : (
              <ul className="divide-y divide-admin-line">
                {pendingPickups.map((order) => (
                  <li key={order._id} className="grid gap-3 px-4 py-4 sm:px-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[15px] font-semibold text-slate-900">{order.name}</span>
                        <MonoTag>#{order._id}</MonoTag>
                        <Badge variant={STATUS_BADGE[order.status].variant} dot>{STATUS_BADGE[order.status].label}</Badge>
                      </div>
                      <p className="mt-1 text-[13px] text-slate-500">
                        {order.phone} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · <span className="font-semibold tabular text-slate-900">{formatPrice(order.totalAmount)}</span> · {order.paymentMethod}
                      </p>
                      <p className="mt-1 truncate text-[13px] text-slate-600">
                        {order.items.map((it) => `${it.quantity}× ${it.title}`).join(', ')}
                      </p>
                    </div>
                    <Button size="sm" variant="admin-primary" onClick={() => openPickup(order)}>Verify & hand over</Button>
                  </li>
                ))}
              </ul>
            )
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            filteredOrders.length === 0 ? (
              <EmptyState compact icon={<PackagePlus />} title={orders.length ? 'No matching orders' : 'No orders yet'} description={orders.length ? 'Try a different name, phone or order ID.' : 'Orders placed at checkout will appear here.'} />
            ) : (
              <div className={table.wrap}>
                <table className={`${table.table} min-w-[760px]`}>
                  <thead className={table.thead}>
                    <tr>
                      <th scope="col" className={table.th}>Order</th>
                      <th scope="col" className={table.th}>Customer</th>
                      <th scope="col" className={`${table.th} text-right`}>Amount</th>
                      <th scope="col" className={table.th}>Payment</th>
                      <th scope="col" className={table.th}>Status</th>
                      <th scope="col" className={`${table.th} text-right`}><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className={table.tbody}>
                    {filteredOrders.map((o) => (
                      <tr key={o._id} className={table.tr}>
                        <td className={table.td}>
                          <MonoTag>#{o._id}</MonoTag>
                          {o.createdAt && <span className="mt-1 block text-[12px] text-slate-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>}
                        </td>
                        <td className={table.td}>
                          <span className="block font-medium text-slate-900">{o.name}</span>
                          <span className="text-[12px] text-slate-500">{o.phone}</span>
                        </td>
                        <td className={`${table.num} font-semibold`}>
                          {formatPrice(o.totalAmount)}
                          {o.couponCode && <span className="block text-[11px] font-normal text-slate-500">{o.couponCode}</span>}
                        </td>
                        <td className={table.td}>{o.paymentMethod}</td>
                        <td className={table.td}>
                          <label className="sr-only" htmlFor={`status-${o._id}`}>Status for order {o._id}</label>
                          <select
                            id={`status-${o._id}`}
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o._id!, e.target.value as Status)}
                            className="h-8 rounded-md border border-admin-line bg-white px-2 text-[13px] text-slate-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Delivered">Delivered / collected</option>
                          </select>
                        </td>
                        <td className={`${table.td} text-right`}>
                          {o.status !== 'Delivered' && (
                            <Button size="sm" variant="ghost" onClick={() => openPickup(o)}>Verify pickup</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* Products */}
          {activeTab === 'products' && (
            productsLoading ? (
              <p className="p-6 text-[14px] text-slate-500" role="status">Loading products…</p>
            ) : filteredProducts.length === 0 ? (
              <EmptyState compact icon={<Library />} title="No matching products" />
            ) : productViewMode === 'list' ? (
              <div className={table.wrap}>
                <table className={`${table.table} min-w-[760px]`}>
                  <thead className={table.thead}>
                    <tr>
                      <th scope="col" className={table.th}>Title</th>
                      <th scope="col" className={table.th}>Publisher</th>
                      <th scope="col" className={table.th}>Category</th>
                      <th scope="col" className={`${table.th} text-right`}>Price</th>
                      <th scope="col" className={table.th}>Availability</th>
                      <th scope="col" className={`${table.th} text-right`}><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className={table.tbody}>
                    {filteredProducts.map((p) => {
                      const units = stockMap[p._id]?.currentStock ?? p.stock;
                      const isCustom = customProducts.includes(p);
                      return (
                        <tr key={p._id} className={table.tr}>
                          <td className={`${table.td} max-w-xs`}>
                            <span className="block truncate font-medium text-slate-900">{p.title}</span>
                            <span className="text-[12px] text-slate-500">{p.author}{isCustom && ' · added this session'}</span>
                          </td>
                          <td className={`${table.td} max-w-[14rem] truncate`}>{p.publisher || '—'}</td>
                          <td className={table.td}>{p.category}</td>
                          <td className={`${table.num} font-semibold`}>{formatPrice(p.price)}</td>
                          <td className={table.td}>
                            {p.inStock ? (
                              <Badge variant="success" dot>In stock{units !== undefined ? ` · ${units}` : ''}</Badge>
                            ) : (
                              <Badge variant="danger" dot>Out of stock</Badge>
                            )}
                          </td>
                          <td className={`${table.td} text-right`}>
                            {!isCustom && (
                              <Link to={`/book/${p._id}`} target="_blank" className={buttonClasses('ghost', 'sm')} aria-label={`Open ${p.title} in the storefront`}>
                                View <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <ul className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                {filteredProducts.map((p) => (
                  <li key={p._id} className="flex gap-3 rounded-lg border border-admin-line p-3">
                    <span className="h-20 w-16 shrink-0 overflow-hidden rounded bg-slate-100"><ProductCover product={p} /></span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[12px] text-slate-500">{p.category}</span>
                      <span className="truncate text-[14px] font-medium text-slate-900">{p.title}</span>
                      <span className="truncate text-[12px] text-slate-500">{p.author}</span>
                      <span className="mt-auto flex items-center justify-between pt-1">
                        <span className="text-[14px] font-semibold tabular">{formatPrice(p.price)}</span>
                        <Badge variant={p.inStock ? 'success' : 'danger'}>{p.inStock ? 'In stock' : 'Out'}</Badge>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </section>

        <div className="space-y-4">
          <Panel title="Inventory" actions={<Link to="/admin/inventory" className="text-[13px] font-medium text-navy hover:underline">Open</Link>}>
            {stockAlerts.length === 0 ? (
              <p className="px-5 py-4 text-[13px] text-slate-500">
                {Object.keys(stockMap).length ? 'All products are above their reorder threshold.' : 'Stock data loads the first time you open Inventory.'}
              </p>
            ) : (
              <ul className="divide-y divide-admin-line">
                {stockAlerts.slice(0, 5).map((r) => (
                  <li key={r.productId} className="flex items-center justify-between gap-3 px-5 py-2.5 text-[13px]">
                    <span className="min-w-0 truncate text-slate-700">{r.productTitle}</span>
                    <Badge variant={r.status === 'Out of Stock' ? 'danger' : 'warning'}>
                      {r.currentStock} left
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Quick actions" bodyClassName="p-2">
            {[
              { to: '/admin/inventory/incoming', label: 'Receive stock', icon: PackagePlus },
              { to: '/admin/inventory/outgoing', label: 'Record dispatch or write-off', icon: PackageCheck },
              { to: '/admin/inventory/alerts', label: 'Review reorder list', icon: AlertTriangle },
            ].map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex h-10 items-center gap-3 rounded-md px-3 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                <Icon className="h-4 w-4 text-navy" aria-hidden="true" /> {label}
              </Link>
            ))}
          </Panel>
        </div>
      </div>

      {/* Pickup verification */}
      <Dialog open={!!pickupOrder} onOpenChange={(open) => !open && setPickupOrder(null)}>
        {pickupOrder && (
          <DialogContent scope="admin" size="md">
            <form onSubmit={handleConfirmPickup} noValidate>
              <DialogHeader>
                <DialogTitle>Verify pickup · #{pickupOrder._id}</DialogTitle>
                <DialogDescription>Confirm the customer’s identity and the physical items before handing over.</DialogDescription>
              </DialogHeader>
              <dl className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-4 text-[13px]">
                <div><dt className="text-slate-500">Customer</dt><dd className="font-medium text-slate-900">{pickupOrder.name}</dd></div>
                <div><dt className="text-slate-500">Phone</dt><dd className="font-medium tabular text-slate-900">{pickupOrder.phone}</dd></div>
                <div><dt className="text-slate-500">Payment</dt><dd className="font-medium text-slate-900">{pickupOrder.paymentMethod}</dd></div>
                <div><dt className="text-slate-500">Bill total</dt><dd className="font-semibold tabular text-slate-900">{formatPrice(pickupOrder.totalAmount)}</dd></div>
              </dl>
              <fieldset className="mt-5">
                <legend className="text-[13px] font-medium text-slate-900">Item checklist</legend>
                <ul className="styled-scrollbar mt-2 max-h-40 space-y-1.5 overflow-y-auto">
                  {pickupOrder.items.map((it, idx) => (
                    <li key={idx}>
                      <label className="flex cursor-pointer items-center gap-3 rounded-md border border-admin-line px-3 py-2 text-[13px]">
                        <input
                          type="checkbox"
                          checked={checkedItems[idx] ?? true}
                          onChange={(e) => setCheckedItems({ ...checkedItems, [idx]: e.target.checked })}
                          className="h-4 w-4 accent-navy"
                        />
                        <span className="min-w-0 flex-1 truncate">{it.quantity} × {it.title}</span>
                        <span className="tabular text-slate-500">{formatPrice(it.price * it.quantity)}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
              <Field label="Pickup token or last 4 digits of phone" required error={verificationError ?? undefined} className="mt-5">
                {(a) => (
                  <Input {...a} value={verificationCode} onChange={(e) => { setVerificationCode(e.target.value); setVerificationError(null); }} placeholder="e.g. 6640" />
                )}
              </Field>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setPickupOrder(null)}>Cancel</Button>
                <Button type="submit" variant="admin-primary">Confirm handover</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>

      {/* Add product */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent scope="admin" size="lg">
          <form onSubmit={handleAddProduct} noValidate>
            <DialogHeader>
              <DialogTitle>Add product</DialogTitle>
              <DialogDescription>
                Added for this session only — the product is not saved to the catalog service and will disappear on reload.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Title" required error={productErrors.title} className="sm:col-span-2">
                {(a) => <Input {...a} value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} placeholder="e.g. NCERT Chemistry Class 12 Part 1" />}
              </Field>
              <Field label="Author / editor" optional>
                {(a) => <Input {...a} value={newProduct.author} onChange={(e) => setNewProduct({ ...newProduct, author: e.target.value })} />}
              </Field>
              <Field label="Publisher / brand" optional>
                {(a) => <Input {...a} value={newProduct.publisher} onChange={(e) => setNewProduct({ ...newProduct, publisher: e.target.value })} />}
              </Field>
              <Field label="Category">
                {(a) => (
                  <Select {...a} value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                )}
              </Field>
              <Field label="Price (₹)" required error={productErrors.price}>
                {(a) => <Input {...a} type="number" min={1} inputMode="decimal" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />}
              </Field>
              <Field label="Stock units" optional>
                {(a) => <Input {...a} type="number" min={0} inputMode="numeric" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />}
              </Field>
              <Field label="ISBN / barcode" optional>
                {(a) => <Input {...a} value={newProduct.isbn} onChange={(e) => setNewProduct({ ...newProduct, isbn: e.target.value })} />}
              </Field>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsAddProductOpen(false)}>Cancel</Button>
              <Button type="submit" variant="admin-primary">Add product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
