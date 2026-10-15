import React, { useState, useMemo } from 'react';
import { ClipboardList, X } from 'lucide-react';
import { useInventoryStore } from '../../../store/inventoryStore';
import { StockBadge } from '../../../components/inventory/StockBadge';
import ExportButton from '../../../components/inventory/ExportButton';
import { useProducts } from '../../../api/queries';
import { Panel, MonoTag, table } from '../../../components/admin/AdminUI';
import { SearchInput } from '../../../components/ui/SearchInput';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/ui/Button';
import type { TransactionType } from '../../../types/inventory';
import { cn } from '../../../lib/utils';

const PAGE_SIZE = 20;

const filterCls =
  'h-9 rounded-md border border-admin-line bg-white px-2 text-[13px] text-slate-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15';

const StockHistory: React.FC = () => {
  const transactions = useInventoryStore((s) => s.transactions);
  const { data: products = [] } = useProducts();

  const [search, setSearch] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterType, setFilterType] = useState<'' | TransactionType>('');
  const [filterReason, setFilterReason] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const allUsers = useMemo(() => [...new Set(transactions.map((t) => t.handledBy))].filter(Boolean), [transactions]);
  const allReasons = useMemo(
    () => [...new Set(transactions.map((t) => t.reason).filter(Boolean))] as string[],
    [transactions]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter((t) => {
      if (
        q &&
        !t.productTitle.toLowerCase().includes(q) &&
        !t.sku.toLowerCase().includes(q) &&
        !t.handledBy.toLowerCase().includes(q) &&
        !(t.invoiceNumber ?? '').toLowerCase().includes(q)
      )
        return false;
      if (filterProduct && t.productId !== filterProduct) return false;
      if (filterType && t.type !== filterType) return false;
      if (filterReason && t.reason !== filterReason) return false;
      if (filterUser && t.handledBy !== filterUser) return false;
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;
      return true;
    });
  }, [transactions, search, filterProduct, filterType, filterReason, filterUser, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paginated = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const hasFilters = !!(search || filterProduct || filterType || filterReason || filterUser || dateFrom || dateTo);
  const resetFilters = () => {
    setSearch('');
    setFilterProduct('');
    setFilterType('');
    setFilterReason('');
    setFilterUser('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };
  // Every filter change returns to page 1
  const on = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  return (
    <Panel
      title="Stock history"
      description={`Complete audit trail · ${filtered.length}${hasFilters ? ` of ${transactions.length}` : ''} records`}
      actions={<ExportButton transactions={filtered} filename="stock-history" />}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-2 border-b border-admin-line bg-slate-50/60 px-4 py-3 sm:px-5">
        <SearchInput
          size="sm"
          value={search}
          onChange={(e) => on(setSearch)(e.target.value)}
          onClear={() => on(setSearch)('')}
          placeholder="Product, SKU, user, invoice"
          aria-label="Search history"
          wrapperClassName="w-full sm:w-64"
        />
        <label className="sr-only" htmlFor="h-product">Product</label>
        <select id="h-product" value={filterProduct} onChange={(e) => on(setFilterProduct)(e.target.value)} className={cn(filterCls, 'max-w-[14rem]')}>
          <option value="">All products</option>
          {products.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
        <label className="sr-only" htmlFor="h-type">Movement type</label>
        <select id="h-type" value={filterType} onChange={(e) => on(setFilterType)(e.target.value as '' | TransactionType)} className={filterCls}>
          <option value="">In &amp; out</option>
          <option value="IN">Incoming only</option>
          <option value="OUT">Outgoing only</option>
        </select>
        <label className="sr-only" htmlFor="h-reason">Reason</label>
        <select id="h-reason" value={filterReason} onChange={(e) => on(setFilterReason)(e.target.value)} className={filterCls}>
          <option value="">All reasons</option>
          {allReasons.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <label className="sr-only" htmlFor="h-user">Performed by</label>
        <select id="h-user" value={filterUser} onChange={(e) => on(setFilterUser)(e.target.value)} className={filterCls}>
          <option value="">All users</option>
          {allUsers.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
          <label htmlFor="h-from">From</label>
          <input id="h-from" type="date" value={dateFrom} onChange={(e) => on(setDateFrom)(e.target.value)} className={filterCls} />
          <label htmlFor="h-to">to</label>
          <input id="h-to" type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => on(setDateTo)(e.target.value)} className={filterCls} />
        </div>
        {hasFilters && (
          <Button size="sm" variant="ghost" onClick={resetFilters}>
            <X className="h-4 w-4" aria-hidden="true" /> Clear
          </Button>
        )}
      </div>

      {paginated.length === 0 ? (
        <EmptyState
          compact
          icon={<ClipboardList />}
          title={transactions.length ? 'No records match these filters' : 'No stock movements yet'}
          description={transactions.length ? 'Adjust or clear the filters.' : 'Receiving or removing stock creates entries here.'}
        />
      ) : (
        <div className={table.wrap}>
          <table className={`${table.table} min-w-[1040px]`}>
            <thead className={table.thead}>
              <tr>
                <th scope="col" className={table.th}>Date &amp; time</th>
                <th scope="col" className={table.th}>Product</th>
                <th scope="col" className={table.th}>SKU</th>
                <th scope="col" className={table.th}>Movement</th>
                <th scope="col" className={`${table.th} text-right`}>Before</th>
                <th scope="col" className={`${table.th} text-right`}>After</th>
                <th scope="col" className={table.th}>Reason / supplier</th>
                <th scope="col" className={table.th}>By</th>
                <th scope="col" className={table.th}>Invoice · remarks</th>
              </tr>
            </thead>
            <tbody className={table.tbody}>
              {paginated.map((t) => {
                const ts = new Date(t.timestamp);
                return (
                  <tr key={t.id} className={table.tr}>
                    <td className={`${table.td} whitespace-nowrap`}>
                      <time dateTime={t.timestamp} className="block text-slate-900">
                        {ts.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </time>
                      <span className="text-[12px] text-slate-500">{ts.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className={`${table.td} max-w-[14rem]`}>
                      <span className="line-clamp-2 font-medium text-slate-900">{t.productTitle}</span>
                    </td>
                    <td className={table.td}><MonoTag>{t.sku}</MonoTag></td>
                    <td className={table.td}><StockBadge type={t.type} quantity={t.quantity} /></td>
                    <td className={table.num}>{t.previousStock}</td>
                    <td className={`${table.num} font-semibold`}>{t.currentStock}</td>
                    <td className={`${table.td} whitespace-nowrap`}>{t.reason ?? t.supplier ?? '—'}</td>
                    <td className={table.td}>{t.handledBy}</td>
                    <td className={`${table.td} max-w-[14rem]`}>
                      <span className="block truncate" title={[t.invoiceNumber, t.remarks].filter(Boolean).join(' · ')}>
                        {[t.invoiceNumber, t.remarks].filter(Boolean).join(' · ') || '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-line px-4 py-3 sm:px-5">
          <p className="text-[13px] text-slate-500">
            Page {current} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="secondary" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - current) <= 1)
              .map((n, i, arr) => (
                <React.Fragment key={n}>
                  {i > 0 && n - arr[i - 1] > 1 && <span className="px-1 text-slate-400">…</span>}
                  <button
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={n === current ? 'page' : undefined}
                    className={cn('h-9 min-w-9 rounded-md px-2 text-[13px] tabular', n === current ? 'bg-navy text-white' : 'text-slate-700 hover:bg-slate-100')}
                  >
                    {n}
                  </button>
                </React.Fragment>
              ))}
            <Button size="sm" variant="secondary" disabled={current === totalPages} onClick={() => setPage(current + 1)}>Next</Button>
          </div>
        </nav>
      )}
    </Panel>
  );
};

export default StockHistory;
