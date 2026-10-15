import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, CheckCircle2, Pencil, X, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useInventoryStore } from '../../../store/inventoryStore';
import { StatusBadge } from '../../../components/inventory/StockBadge';
import { Panel, StatTile, MonoTag, table } from '../../../components/admin/AdminUI';
import { SearchInput } from '../../../components/ui/SearchInput';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button, buttonClasses } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const ORDER = { 'Out of Stock': 0, 'Low Stock': 1, 'In Stock': 2 } as const;

const LowStockAlerts: React.FC = () => {
  const stockMap = useInventoryStore((s) => s.stockMap);
  const setLowStockThreshold = useInventoryStore((s) => s.setLowStockThreshold);

  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const all = useMemo(
    () =>
      Object.values(stockMap).sort(
        (a, b) => ORDER[a.status] - ORDER[b.status] || a.currentStock - a.lowStockThreshold - (b.currentStock - b.lowStockThreshold)
      ),
    [stockMap]
  );
  const out = all.filter((r) => r.status === 'Out of Stock').length;
  const low = all.filter((r) => r.status === 'Low Stock').length;
  const healthy = all.length - out - low;

  const rows = all
    .filter((r) => showAll || r.status !== 'In Stock')
    .filter((r) => {
      const q = search.toLowerCase();
      return !q || r.productTitle.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q);
    });

  const startEdit = (id: string, threshold: number) => {
    setEditingId(id);
    setEditValue(String(threshold));
    setEditError(null);
  };

  const saveEdit = (id: string) => {
    const value = Number(editValue);
    if (editValue.trim() === '' || !Number.isInteger(value) || value < 0) {
      setEditError('Enter a whole number of 0 or more.');
      return;
    }
    setLowStockThreshold(id, value);
    toast.success('Reorder threshold updated');
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Out of stock" value={out} icon={<XCircle />} tone={out ? 'danger' : 'neutral'} note={out ? 'Cannot be sold' : 'None'} />
        <StatTile label="Low stock" value={low} icon={<AlertTriangle />} tone={low ? 'warning' : 'neutral'} note={low ? 'At or below threshold' : 'None'} />
        <StatTile label="Healthy" value={healthy} icon={<CheckCircle2 />} tone="success" note="Above threshold" />
      </div>

      <Panel
        title={showAll ? 'All products' : 'Needs reordering'}
        description="Thresholds set the stock level at which a product is flagged. Edit them inline."
        actions={
          <>
            <SearchInput size="sm" value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder="Product or SKU" aria-label="Search products" wrapperClassName="w-48" />
            <div role="group" aria-label="Show" className="flex rounded-md border border-admin-line p-0.5 text-[13px]">
              {[
                { v: false, label: 'Alerts' },
                { v: true, label: 'All products' },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  aria-pressed={showAll === o.v}
                  onClick={() => setShowAll(o.v)}
                  className={cn('h-7 rounded px-2.5 font-medium', showAll === o.v ? 'bg-navy text-white' : 'text-slate-600 hover:text-slate-900')}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </>
        }
      >
        {all.length === 0 ? (
          <EmptyState compact icon={<AlertTriangle />} title="No stock records yet" description="Stock data is created when you open Inventory or receive stock." />
        ) : rows.length === 0 ? (
          <EmptyState
            compact
            icon={<CheckCircle2 />}
            title={search ? 'No products match' : 'Nothing to reorder'}
            description={search ? 'Try a different search.' : 'Every product is above its reorder threshold.'}
          />
        ) : (
          <div className={table.wrap}>
            <table className={`${table.table} min-w-[820px]`}>
              <thead className={table.thead}>
                <tr>
                  <th scope="col" className={table.th}>Product</th>
                  <th scope="col" className={table.th}>Status</th>
                  <th scope="col" className={`${table.th} text-right`}>On hand</th>
                  <th scope="col" className={`${table.th} text-right`}>Threshold</th>
                  <th scope="col" className={`${table.th} text-right`}>Short by</th>
                  <th scope="col" className={table.th}>Last updated</th>
                  <th scope="col" className={`${table.th} text-right`}><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className={table.tbody}>
                {rows.map((r) => {
                  const short = Math.max(0, r.lowStockThreshold - r.currentStock);
                  const editing = editingId === r.productId;
                  return (
                    <tr key={r.productId} className={cn(table.tr, r.status === 'Out of Stock' && 'bg-rose-50/40')}>
                      <td className={`${table.td} max-w-[16rem]`}>
                        <span className="block truncate font-medium text-slate-900">{r.productTitle}</span>
                        <MonoTag>{r.sku}</MonoTag>
                      </td>
                      <td className={table.td}><StatusBadge status={r.status} /></td>
                      <td className={cn(table.num, 'font-semibold', r.status === 'Out of Stock' ? 'text-rose-700' : r.status === 'Low Stock' ? 'text-amber-700' : '')}>
                        {r.currentStock}
                      </td>
                      <td className={table.num}>
                        {editing ? (
                          <form
                            className="flex items-center justify-end gap-1"
                            onSubmit={(e) => {
                              e.preventDefault();
                              saveEdit(r.productId);
                            }}
                          >
                            <label htmlFor={`thr-${r.productId}`} className="sr-only">Threshold for {r.productTitle}</label>
                            <input
                              id={`thr-${r.productId}`}
                              type="number"
                              min={0}
                              inputMode="numeric"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Escape' && setEditingId(null)}
                              aria-invalid={!!editError}
                              aria-describedby={editError ? `thr-err-${r.productId}` : undefined}
                              autoFocus
                              className="h-8 w-20 rounded-md border border-admin-line px-2 text-right text-[13px] tabular focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
                            />
                            <button type="submit" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-emerald-700 hover:bg-emerald-50" aria-label="Save threshold">
                              <Check className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => setEditingId(null)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100" aria-label="Cancel">
                              <X className="h-4 w-4" />
                            </button>
                          </form>
                        ) : (
                          r.lowStockThreshold
                        )}
                        {editing && editError && (
                          <p id={`thr-err-${r.productId}`} className="mt-1 text-[12px] font-normal text-rose-700">{editError}</p>
                        )}
                      </td>
                      <td className={cn(table.num, short > 0 ? 'font-semibold text-rose-700' : 'text-slate-400')}>{short > 0 ? short : '—'}</td>
                      <td className={`${table.td} whitespace-nowrap text-[12px] text-slate-500`}>
                        {new Date(r.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className={`${table.td} whitespace-nowrap text-right`}>
                        {!editing && (
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => startEdit(r.productId, r.lowStockThreshold)} aria-label={`Edit threshold for ${r.productTitle}`}>
                              <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Threshold
                            </Button>
                            {r.status !== 'In Stock' && (
                              <Link to="/admin/inventory/incoming" className={buttonClasses('admin-secondary', 'sm')}>
                                Receive stock
                              </Link>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
};

export default LowStockAlerts;
