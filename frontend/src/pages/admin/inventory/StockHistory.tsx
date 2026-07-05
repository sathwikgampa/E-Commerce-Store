import React, { useState, useMemo } from 'react';
import { Search, Filter, ClipboardList } from 'lucide-react';
import { useInventoryStore } from '../../../store/inventoryStore';
import { StockBadge } from '../../../components/inventory/StockBadge';
import ExportButton from '../../../components/inventory/ExportButton';
import { useProducts } from '../../../api/queries';
import type { TransactionType } from '../../../types/inventory';

const PAGE_SIZE = 20;

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

  // Unique users and reasons for filter dropdowns
  const allUsers = useMemo(
    () => [...new Set(transactions.map((t) => t.handledBy))].filter(Boolean),
    [transactions]
  );
  const allReasons = useMemo(
    () => [...new Set(transactions.map((t) => t.reason).filter(Boolean))],
    [transactions]
  );

  // Filter logic
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.productTitle.toLowerCase().includes(q) &&
          !t.sku.toLowerCase().includes(q) &&
          !t.handledBy.toLowerCase().includes(q) &&
          !(t.invoiceNumber ?? '').toLowerCase().includes(q)
        )
          return false;
      }
      if (filterProduct && t.productId !== filterProduct) return false;
      if (filterType && t.type !== filterType) return false;
      if (filterReason && t.reason !== filterReason) return false;
      if (filterUser && t.handledBy !== filterUser) return false;
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;
      return true;
    });
  }, [transactions, search, filterProduct, filterType, filterReason, filterUser, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

  const hasFilters = search || filterProduct || filterType || filterReason || filterUser || dateFrom || dateTo;

  const inputCls = 'px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#0A3D91]/10 focus:border-[#0A3D91]/40 transition';

  return (
    <div className="p-6 sm:p-8 space-y-5">
      {/* ── Header + Export ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-4.5 h-4.5 text-[#0A3D91]" />
            Stock History
          </h2>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Complete audit log · {filtered.length} records
          </p>
        </div>
        <ExportButton transactions={filtered} filename="stock-history" />
      </div>

      {/* ── Filters ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search product, SKU, user, invoice..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className={`${inputCls} pl-9 w-full`}
            />
          </div>

          {/* Product filter */}
          <select
            value={filterProduct}
            onChange={(e) => { setFilterProduct(e.target.value); setPage(1); }}
            className={inputCls}
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.title}</option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value as any); setPage(1); }}
            className={inputCls}
          >
            <option value="">IN + OUT</option>
            <option value="IN">Incoming Only</option>
            <option value="OUT">Outgoing Only</option>
          </select>

          {/* Reason filter */}
          <select
            value={filterReason}
            onChange={(e) => { setFilterReason(e.target.value); setPage(1); }}
            className={inputCls}
          >
            <option value="">All Reasons</option>
            {allReasons.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* User filter */}
          <select
            value={filterUser}
            onChange={(e) => { setFilterUser(e.target.value); setPage(1); }}
            className={inputCls}
          >
            <option value="">All Users</option>
            {allUsers.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          {/* Date range */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className={inputCls}
            title="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className={inputCls}
            title="To date"
          />

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl text-[10px] font-black text-rose-600 hover:bg-rose-50 border border-rose-200 transition uppercase tracking-wider"
            >
              Clear Filters
            </button>
          )}
        </div>

        {hasFilters && (
          <p className="mt-2 text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Filter className="w-3 h-3" />
            Showing {filtered.length} of {transactions.length} records
          </p>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                <th className="px-5 py-3 rounded-tl-2xl">Date & Time</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3 text-right">Qty</th>
                <th className="px-5 py-3 text-right">Prev Stock</th>
                <th className="px-5 py-3 text-right">New Stock</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Performed By</th>
                <th className="px-5 py-3 rounded-tr-2xl">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="w-8 h-8 text-slate-200" />
                      <p className="text-xs font-bold text-slate-400">No transactions match your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="text-[10px] font-bold text-slate-700">
                        {new Date(txn.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: '2-digit',
                        })}
                      </p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                        {new Date(txn.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-xs font-bold text-slate-800 max-w-[180px]">
                      <span className="line-clamp-2 leading-tight">{txn.productTitle}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        {txn.sku}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StockBadge type={txn.type} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-xs font-black ${txn.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {txn.type === 'IN' ? '+' : '-'}{txn.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-semibold text-slate-500">
                      {txn.previousStock}
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-slate-900">
                      {txn.currentStock}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap">
                        {txn.reason ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[10px] font-semibold text-slate-600">
                      {txn.handledBy}
                    </td>
                    <td className="px-5 py-3 text-[10px] text-slate-400 font-semibold max-w-[120px] truncate">
                      {txn.remarks || txn.invoiceNumber || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ───────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-semibold">
              Page {page} of {totalPages} · {filtered.length} records
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = page <= 3 ? i + 1 : page - 2 + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-[10px] font-black transition ${
                      pageNum === page
                        ? 'bg-[#0A3D91] text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockHistory;
