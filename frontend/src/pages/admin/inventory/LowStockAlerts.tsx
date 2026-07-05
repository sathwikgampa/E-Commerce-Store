import React, { useState } from 'react';
import { AlertTriangle, Bell, Edit3, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useInventoryStore } from '../../../store/inventoryStore';
import { StatusBadge } from '../../../components/inventory/StockBadge';
import { motion, AnimatePresence } from 'framer-motion';

const LowStockAlerts: React.FC = () => {
  const stockMap = useInventoryStore((s) => s.stockMap);
  const setLowStockThreshold = useInventoryStore((s) => s.setLowStockThreshold);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const allRecords = Object.values(stockMap).sort((a, b) => {
    // Sort: Out of Stock first, then Low Stock, then In Stock
    const order = { 'Out of Stock': 0, 'Low Stock': 1, 'In Stock': 2 };
    return order[a.status] - order[b.status];
  });

  const lowStockRecords = allRecords.filter(
    (r) => r.status === 'Low Stock' || r.status === 'Out of Stock'
  );
  const inStockRecords = allRecords.filter((r) => r.status === 'In Stock');

  const startEdit = (productId: string, currentThreshold: number) => {
    setEditingId(productId);
    setEditValue(currentThreshold);
  };

  const saveEdit = (productId: string) => {
    if (editValue < 0) {
      toast.error('Threshold cannot be negative');
      return;
    }
    setLowStockThreshold(productId, editValue);
    toast.success('Threshold updated successfully');
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const stockBarPercent = (current: number, threshold: number) => {
    if (threshold === 0) return 100;
    return Math.min(100, Math.round((current / Math.max(threshold * 2, 1)) * 100));
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* ── Summary Banner ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Out of Stock',
            value: allRecords.filter((r) => r.status === 'Out of Stock').length,
            bg: 'bg-rose-50 border-rose-200',
            text: 'text-rose-700',
            num: 'text-rose-800',
            icon: <X className="w-4 h-4" />,
          },
          {
            label: 'Low Stock',
            value: allRecords.filter((r) => r.status === 'Low Stock').length,
            bg: 'bg-amber-50 border-amber-200',
            text: 'text-amber-700',
            num: 'text-amber-800',
            icon: <AlertTriangle className="w-4 h-4" />,
          },
          {
            label: 'Healthy Stock',
            value: inStockRecords.length,
            bg: 'bg-emerald-50 border-emerald-200',
            text: 'text-emerald-700',
            num: 'text-emerald-800',
            icon: <Check className="w-4 h-4" />,
          },
        ].map((card) => (
          <div key={card.label} className={`rounded-2xl border p-5 flex items-center justify-between ${card.bg}`}>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${card.text}`}>{card.label}</p>
              <p className={`text-3xl font-black mt-1 ${card.num}`}>{card.value}</p>
              <p className={`text-[10px] font-semibold mt-0.5 ${card.text} opacity-70`}>products</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${card.bg} border ${card.bg.split(' ')[1]} flex items-center justify-center ${card.text}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Alert Banner ─────────────────────────────────────────────── */}
      {lowStockRecords.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-black text-amber-800">
              {lowStockRecords.length} product{lowStockRecords.length !== 1 ? 's' : ''} need your attention
            </p>
            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
              {allRecords.filter((r) => r.status === 'Out of Stock').length} out of stock ·{' '}
              {allRecords.filter((r) => r.status === 'Low Stock').length} below minimum threshold
            </p>
          </div>
        </div>
      )}

      {/* ── Alert Products Table ───────────────────────────────────────── */}
      {lowStockRecords.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-black text-slate-900">Products Needing Reorder</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-left">SKU</th>
                  <th className="px-5 py-3 text-right">Current Stock</th>
                  <th className="px-5 py-3 text-right">Min Threshold</th>
                  <th className="px-5 py-3 text-right">Deficit</th>
                  <th className="px-5 py-3 text-center">Stock Level</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-center">Edit Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {lowStockRecords.map((record) => {
                    const deficit = Math.max(0, record.lowStockThreshold - record.currentStock);
                    const pct = stockBarPercent(record.currentStock, record.lowStockThreshold);
                    const isEditing = editingId === record.productId;

                    return (
                      <motion.tr
                        key={record.productId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`hover:bg-slate-50/60 transition-colors ${
                          record.status === 'Out of Stock' ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        <td className="px-5 py-4 text-xs font-bold text-slate-800 max-w-[180px]">
                          <span className="line-clamp-2 leading-tight">{record.productTitle}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                            {record.sku}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={`text-sm font-black ${
                            record.currentStock === 0 ? 'text-rose-600' : 'text-amber-600'
                          }`}>
                            {record.currentStock}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={editValue}
                              onChange={(e) => setEditValue(Number(e.target.value))}
                              className="w-16 px-2 py-1 rounded-lg border border-[#0A3D91]/30 text-xs font-black text-center outline-none focus:ring-2 focus:ring-[#0A3D91]/20"
                              autoFocus
                            />
                          ) : (
                            <span className="text-xs font-semibold text-slate-600">
                              {record.lowStockThreshold}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={`text-xs font-black ${deficit > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                            {deficit > 0 ? `-${deficit}` : '—'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  record.currentStock === 0
                                    ? 'bg-rose-500'
                                    : pct < 50
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 w-8">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="px-5 py-4">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => saveEdit(record.productId)}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                                title="Save"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <button
                                onClick={() => startEdit(record.productId, record.lowStockThreshold)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:border-[#0A3D91]/30 hover:text-[#0A3D91] hover:bg-[#EAF3FF] transition"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── All Products Threshold Table ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900">All Product Thresholds</h2>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Click the Edit button to change the minimum stock threshold for any product
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-right">Current</th>
                <th className="px-5 py-3 text-right">Threshold</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allRecords.map((record) => {
                const isEditing = editingId === record.productId;
                return (
                  <tr key={record.productId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3 text-xs font-bold text-slate-800 max-w-[200px] truncate">
                      {record.productTitle}
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-slate-900">
                      {record.currentStock}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-lg border border-[#0A3D91]/30 text-xs font-black text-center outline-none focus:ring-2 focus:ring-[#0A3D91]/20 float-right"
                          autoFocus
                        />
                      ) : (
                        <span className="text-xs font-semibold text-slate-600">
                          {record.lowStockThreshold}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => saveEdit(record.productId)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={cancelEdit} className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <button
                            onClick={() => startEdit(record.productId, record.lowStockThreshold)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:border-[#0A3D91]/30 hover:text-[#0A3D91] hover:bg-[#EAF3FF] transition"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlerts;
