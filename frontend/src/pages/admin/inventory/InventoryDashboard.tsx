import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Boxes, IndianRupee, Package, PackageMinus, PackagePlus, XCircle } from 'lucide-react';
import { useInventoryStore } from '../../../store/inventoryStore';
import InventoryStatCard from '../../../components/inventory/InventoryStatCard';
import InventoryTimeline from '../../../components/inventory/InventoryTimeline';
import { StatusBadge } from '../../../components/inventory/StockBadge';
import { Panel, MonoTag, table } from '../../../components/admin/AdminUI';
import { SearchInput } from '../../../components/ui/SearchInput';
import { cn } from '../../../lib/utils';
import type { StockStatus } from '../../../types/inventory';

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const InventoryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const stockMap = useInventoryStore((s) => s.stockMap);
  const transactions = useInventoryStore((s) => s.transactions);
  const getDashboardStats = useInventoryStore((s) => s.getDashboardStats);
  // Recompute whenever stock or transactions change
  const stats = useMemo(() => getDashboardStats(), [getDashboardStats, stockMap, transactions]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | StockStatus>('');

  const records = useMemo(
    () =>
      Object.values(stockMap)
        .filter((r) => !statusFilter || r.status === statusFilter)
        .filter((r) => {
          const q = search.toLowerCase();
          return !q || r.productTitle.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q);
        })
        .sort((a, b) => a.currentStock - a.lowStockThreshold - (b.currentStock - b.lowStockThreshold)),
    [stockMap, search, statusFilter]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        <InventoryStatCard label="Products (SKUs)" value={stats.totalProducts} icon={Package} iconBg="bg-navy-soft" iconColor="text-navy" accent />
        <InventoryStatCard label="Units in stock" value={stats.totalUnitsInStock.toLocaleString('en-IN')} icon={Boxes} iconBg="bg-slate-100" iconColor="text-slate-600" />
        <InventoryStatCard
          label="Stock value"
          value={formatCurrency(stats.inventoryValue)}
          subValue="At average cost"
          icon={IndianRupee}
          iconBg="bg-saffron-soft"
          iconColor="text-saffron-ink"
          accent
        />
        <InventoryStatCard
          label="Received today"
          value={stats.todayIncoming}
          subValue="Units"
          icon={PackagePlus}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
          onClick={() => navigate('/admin/inventory/incoming')}
        />
        <InventoryStatCard
          label="Removed today"
          value={stats.todayOutgoing}
          subValue="Units"
          icon={PackageMinus}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          onClick={() => navigate('/admin/inventory/outgoing')}
        />
        <InventoryStatCard
          label="Low stock"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
          trend={stats.lowStockProducts ? { direction: 'down', label: 'Below threshold' } : { direction: 'neutral', label: 'None' }}
          onClick={() => navigate('/admin/inventory/alerts')}
        />
        <InventoryStatCard
          label="Out of stock"
          value={stats.outOfStockProducts}
          icon={XCircle}
          iconBg="bg-rose-50"
          iconColor="text-rose-700"
          trend={stats.outOfStockProducts ? { direction: 'down', label: 'Reorder now' } : { direction: 'neutral', label: 'None' }}
          onClick={() => navigate('/admin/inventory/alerts')}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Panel
          title="Stock levels"
          description="Sorted by how close each product is to its reorder threshold."
          actions={
            <>
              <label htmlFor="stock-status" className="sr-only">Filter by status</label>
              <select
                id="stock-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as '' | StockStatus)}
                className="h-9 rounded-md border border-admin-line bg-white px-2 text-[13px] focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
              >
                <option value="">All statuses</option>
                <option value="In Stock">In stock</option>
                <option value="Low Stock">Low stock</option>
                <option value="Out of Stock">Out of stock</option>
              </select>
              <SearchInput size="sm" value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder="Product or SKU" aria-label="Search stock" wrapperClassName="w-48" />
            </>
          }
        >
          <div className={table.wrap}>
            <table className={`${table.table} min-w-[760px]`}>
              <thead className={table.thead}>
                <tr>
                  <th scope="col" className={table.th}>Product</th>
                  <th scope="col" className={table.th}>SKU</th>
                  <th scope="col" className={`${table.th} w-48`}>Level vs threshold</th>
                  <th scope="col" className={`${table.th} text-right`}>On hand</th>
                  <th scope="col" className={`${table.th} text-right`}>Reserved</th>
                  <th scope="col" className={`${table.th} text-right`}>Avg cost</th>
                  <th scope="col" className={table.th}>Status</th>
                </tr>
              </thead>
              <tbody className={table.tbody}>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">No products match.</td>
                  </tr>
                ) : (
                  records.map((r) => {
                    // Bar scale: 2× threshold = full width; the tick marks the threshold
                    const scale = Math.max(r.lowStockThreshold * 2, r.currentStock, 1);
                    const pct = Math.round((r.currentStock / scale) * 100);
                    const tick = Math.round((r.lowStockThreshold / scale) * 100);
                    return (
                      <tr key={r.productId} className={table.tr}>
                        <td className={`${table.td} max-w-[16rem] truncate font-medium text-slate-900`}>{r.productTitle}</td>
                        <td className={table.td}><MonoTag>{r.sku}</MonoTag></td>
                        <td className={table.td}>
                          <div className="relative h-2 w-full rounded-full bg-slate-100" aria-hidden="true">
                            <div
                              className={cn('h-2 rounded-full', r.status === 'Out of Stock' ? 'bg-rose-600' : r.status === 'Low Stock' ? 'bg-amber-500' : 'bg-emerald-600')}
                              style={{ width: `${pct}%` }}
                            />
                            <span className="absolute -top-1 h-4 w-px bg-slate-500" style={{ left: `${tick}%` }} />
                          </div>
                          <span className="sr-only">{r.currentStock} units, threshold {r.lowStockThreshold}</span>
                        </td>
                        <td className={`${table.num} font-semibold`}>{r.currentStock}</td>
                        <td className={table.num}>{r.reservedStock}</td>
                        <td className={table.num}>{formatCurrency(r.averageCost ?? 0)}</td>
                        <td className={table.td}><StatusBadge status={r.status} /></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Recent movements"
          actions={<Link to="/admin/inventory/history" className="text-[13px] font-medium text-navy hover:underline">Full history</Link>}
          bodyClassName="max-h-[560px] overflow-y-auto px-3 py-2"
        >
          <InventoryTimeline transactions={stats.recentTransactions} />
        </Panel>
      </div>
    </div>
  );
};

export default InventoryDashboard;
