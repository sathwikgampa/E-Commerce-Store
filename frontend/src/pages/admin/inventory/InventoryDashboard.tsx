import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Boxes,
  PackagePlus,
  PackageMinus,
  AlertTriangle,
  XCircle,
  IndianRupee,
  RefreshCw,
} from 'lucide-react';
import { useInventoryStore } from '../../../store/inventoryStore';
import InventoryStatCard from '../../../components/inventory/InventoryStatCard';
import InventoryTimeline from '../../../components/inventory/InventoryTimeline';
import { StockBadge, StatusBadge } from '../../../components/inventory/StockBadge';

const InventoryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const getDashboardStats = useInventoryStore((s) => s.getDashboardStats);
  const stockMap = useInventoryStore((s) => s.stockMap);
  const stats = getDashboardStats();
  const allRecords = Object.values(stockMap).sort((a, b) => b.currentStock - a.currentStock);

  const formatCurrency = (val: number) =>
    `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const STAT_CARDS = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      subValue: 'Active catalog items',
      accent: true,
    },
    {
      label: 'Total Units in Stock',
      value: stats.totalUnitsInStock.toLocaleString('en-IN'),
      icon: Boxes,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      subValue: 'Across all products',
    },
    {
      label: "Today's Incoming",
      value: `+${stats.todayIncoming}`,
      icon: PackagePlus,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      subValue: 'Units received today',
      trend: stats.todayIncoming > 0
        ? { direction: 'up' as const, label: 'Active today' }
        : { direction: 'neutral' as const, label: 'No activity today' },
    },
    {
      label: "Today's Outgoing",
      value: `-${stats.todayOutgoing}`,
      icon: PackageMinus,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      subValue: 'Units dispatched today',
      trend: stats.todayOutgoing > 0
        ? { direction: 'down' as const, label: 'Stock deducted today' }
        : { direction: 'neutral' as const, label: 'No dispatches today' },
    },
    {
      label: 'Low Stock Products',
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      subValue: 'Below minimum threshold',
      trend: stats.lowStockProducts > 0
        ? { direction: 'down' as const, label: 'Needs reordering' }
        : undefined,
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStockProducts,
      icon: XCircle,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
      subValue: 'Products unavailable',
      trend: stats.outOfStockProducts > 0
        ? { direction: 'down' as const, label: 'Action required' }
        : undefined,
    },
    {
      label: 'Inventory Value',
      value: formatCurrency(stats.inventoryValue),
      icon: IndianRupee,
      iconBg: 'bg-[#D4AF37]/10',
      iconColor: 'text-[#D4AF37]',
      subValue: 'Total at cost price',
      accent: true,
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* ── Stat Cards Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <InventoryStatCard
            key={card.label}
            index={i}
            label={card.label}
            value={card.value}
            subValue={card.subValue}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
            trend={card.trend}
            accent={card.accent}
            onClick={
              card.label === 'Low Stock Products'
                ? () => navigate('/admin/inventory/alerts')
                : undefined
            }
          />
        ))}
      </div>

      {/* ── Main Content: Table + Timeline ──────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Activity Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">Recent Stock Activity</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Last 25 transactions</p>
            </div>
            <button
              onClick={() => navigate('/admin/inventory/history')}
              className="text-[10px] font-bold text-[#0A3D91] hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">SKU</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-xs text-slate-400 font-semibold">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  stats.recentTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                        {new Date(txn.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-3 text-xs font-bold text-slate-800 max-w-[200px] truncate">
                        {txn.productTitle}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {txn.sku}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <StockBadge type={txn.type} quantity={txn.quantity} />
                      </td>
                      <td className="px-5 py-3 text-[10px] font-bold text-slate-500">
                        <span className="text-slate-400">{txn.previousStock}</span>
                        <span className="mx-1 text-slate-300">→</span>
                        <span className="text-slate-800">{txn.currentStock}</span>
                      </td>
                      <td className="px-5 py-3 text-[10px] text-slate-500 font-semibold">
                        {txn.handledBy}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">Activity Feed</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Newest first</p>
            </div>
            <RefreshCw className="w-3.5 h-3.5 text-slate-300" />
          </div>
          <div className="px-3 py-3 max-h-[480px] overflow-y-auto">
            <InventoryTimeline transactions={stats.recentTransactions} />
          </div>
        </div>
      </div>

      {/* ── Stock Overview Table ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">All Product Stock</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Current inventory snapshot · {allRecords.length} products
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3 text-right">Current Stock</th>
                <th className="px-5 py-3 text-right">Reserved</th>
                <th className="px-5 py-3 text-right">Available</th>
                <th className="px-5 py-3 text-right">Threshold</th>
                <th className="px-5 py-3 text-right">Avg Cost</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allRecords.map((record) => (
                <tr key={record.productId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3 text-xs font-bold text-slate-800 max-w-[220px] truncate">
                    {record.productTitle}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      {record.sku}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-xs font-black text-slate-900">{record.currentStock}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-xs font-semibold text-slate-500">{record.reservedStock}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-xs font-black ${
                      record.currentStock - record.reservedStock === 0
                        ? 'text-rose-600'
                        : record.currentStock - record.reservedStock <= record.lowStockThreshold
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}>
                      {record.currentStock - record.reservedStock}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-xs font-semibold text-slate-500">{record.lowStockThreshold}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-xs font-semibold text-slate-700">
                      ₹{(record.averageCost ?? 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={record.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
