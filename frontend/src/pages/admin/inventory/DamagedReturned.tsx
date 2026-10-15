import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CalendarX, PackageMinus, PackageX, RotateCcw, SearchX } from 'lucide-react';
import { useInventoryStore } from '../../../store/inventoryStore';
import ExportButton from '../../../components/inventory/ExportButton';
import { Panel, StatTile, MonoTag, table } from '../../../components/admin/AdminUI';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { buttonClasses } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const REASONS = ['Damaged', 'Returned to Supplier', 'Expired', 'Lost'] as const;
type Reason = (typeof REASONS)[number];

const REASON_VARIANT: Record<Reason, 'danger' | 'neutral' | 'warning'> = {
  Damaged: 'danger',
  'Returned to Supplier': 'neutral',
  Expired: 'warning',
  Lost: 'danger',
};

const DamagedReturned: React.FC = () => {
  const transactions = useInventoryStore((s) => s.transactions);
  const [filter, setFilter] = useState<'' | Reason>('');

  const relevant = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'OUT' && REASONS.includes(t.reason as Reason))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [transactions]
  );

  const unitsFor = (reason: Reason) => relevant.filter((t) => t.reason === reason).reduce((s, t) => s + t.quantity, 0);
  const rows = filter ? relevant.filter((t) => t.reason === filter) : relevant;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Damaged" value={unitsFor('Damaged')} icon={<PackageX />} tone={unitsFor('Damaged') ? 'danger' : 'neutral'} note="Units written off" onClick={() => setFilter('Damaged')} />
        <StatTile label="Returned to supplier" value={unitsFor('Returned to Supplier')} icon={<RotateCcw />} note="Units sent back" onClick={() => setFilter('Returned to Supplier')} />
        <StatTile label="Expired" value={unitsFor('Expired')} icon={<CalendarX />} tone={unitsFor('Expired') ? 'warning' : 'neutral'} note="Outdated editions" onClick={() => setFilter('Expired')} />
        <StatTile label="Lost" value={unitsFor('Lost')} icon={<AlertTriangle />} tone={unitsFor('Lost') ? 'danger' : 'neutral'} note="Units unaccounted for" onClick={() => setFilter('Lost')} />
      </div>

      <Panel
        title="Write-off & return log"
        description={`${rows.length} ${rows.length === 1 ? 'record' : 'records'}${filter ? ` · ${filter}` : ''}`}
        actions={
          <>
            <Link to="/admin/inventory/outgoing" className={buttonClasses('admin-primary', 'sm')}>
              <PackageMinus className="h-4 w-4" aria-hidden="true" /> Record write-off
            </Link>
            <ExportButton transactions={rows} filename="damaged-returned-stock" />
          </>
        }
      >
        <div role="group" aria-label="Filter by reason" className="flex gap-1.5 overflow-x-auto border-b border-admin-line px-4 py-2.5 hide-scrollbar sm:px-5">
          {(['', ...REASONS] as const).map((r) => (
            <button
              key={r || 'all'}
              type="button"
              aria-pressed={filter === r}
              onClick={() => setFilter(r)}
              className={cn(
                'h-8 shrink-0 rounded-full border px-3 text-[13px] font-medium',
                filter === r ? 'border-navy bg-navy text-white' : 'border-admin-line text-slate-600 hover:text-slate-900'
              )}
            >
              {r || 'All reasons'}
            </button>
          ))}
        </div>

        {rows.length === 0 ? (
          <EmptyState
            compact
            icon={relevant.length ? <SearchX /> : <PackageX />}
            title={relevant.length ? `No ${filter.toLowerCase()} records` : 'No write-offs or returns recorded'}
            description="Use Outgoing stock with the reason Damaged, Returned to Supplier, Expired or Lost to log one."
          />
        ) : (
          <div className={table.wrap}>
            <table className={`${table.table} min-w-[900px]`}>
              <thead className={table.thead}>
                <tr>
                  <th scope="col" className={table.th}>Date</th>
                  <th scope="col" className={table.th}>Product</th>
                  <th scope="col" className={table.th}>SKU</th>
                  <th scope="col" className={table.th}>Reason</th>
                  <th scope="col" className={`${table.th} text-right`}>Units</th>
                  <th scope="col" className={`${table.th} text-right`}>Stock after</th>
                  <th scope="col" className={table.th}>Handled by</th>
                  <th scope="col" className={table.th}>Remarks</th>
                </tr>
              </thead>
              <tbody className={table.tbody}>
                {rows.map((t) => (
                  <tr key={t.id} className={table.tr}>
                    <td className={`${table.td} whitespace-nowrap`}>
                      <time dateTime={t.timestamp} className="block text-slate-900">
                        {new Date(t.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </time>
                      <span className="text-[12px] text-slate-500">
                        {new Date(t.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className={`${table.td} max-w-[14rem]`}><span className="line-clamp-2 font-medium text-slate-900">{t.productTitle}</span></td>
                    <td className={table.td}><MonoTag>{t.sku}</MonoTag></td>
                    <td className={table.td}><Badge variant={REASON_VARIANT[t.reason as Reason]}>{t.reason}</Badge></td>
                    <td className={`${table.num} font-semibold text-rose-700`}>−{t.quantity}</td>
                    <td className={table.num}>{t.previousStock} → {t.currentStock}</td>
                    <td className={table.td}>{t.handledBy}</td>
                    <td className={`${table.td} max-w-[14rem]`}><span className="block truncate" title={t.remarks}>{t.remarks || '—'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
};

export default DamagedReturned;
