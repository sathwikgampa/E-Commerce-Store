import React, { useMemo } from 'react';
import { PackageX, AlertTriangle, RotateCcw } from 'lucide-react';
import { useInventoryStore } from '../../../store/inventoryStore';
import { StockBadge } from '../../../components/inventory/StockBadge';
import ExportButton from '../../../components/inventory/ExportButton';

const DamagedReturned: React.FC = () => {
  const transactions = useInventoryStore((s) => s.transactions);

  const damagedTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'OUT' && t.reason === 'Damaged'),
    [transactions]
  );

  const returnedTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'OUT' && t.reason === 'Returned to Supplier'),
    [transactions]
  );

  const expiredTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'OUT' && t.reason === 'Expired'),
    [transactions]
  );

  const allRelevant = useMemo(
    () =>
      transactions
        .filter((t) =>
          t.type === 'OUT' &&
          ['Damaged', 'Returned to Supplier', 'Expired', 'Lost'].includes(t.reason ?? '')
        )
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [transactions]
  );

  const totalDamagedUnits = damagedTransactions.reduce((s, t) => s + t.quantity, 0);
  const totalReturnedUnits = returnedTransactions.reduce((s, t) => s + t.quantity, 0);
  const totalExpiredUnits = expiredTransactions.reduce((s, t) => s + t.quantity, 0);
  const totalLostUnits = useMemo(
    () => transactions.filter((t) => t.type === 'OUT' && t.reason === 'Lost').reduce((s, t) => s + t.quantity, 0),
    [transactions]
  );

  const REASON_STYLES: Record<string, string> = {
    'Damaged':             'bg-rose-50 text-rose-700 border-rose-200',
    'Returned to Supplier':'bg-purple-50 text-purple-700 border-purple-200',
    'Expired':             'bg-amber-50 text-amber-700 border-amber-200',
    'Lost':                'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* ── Summary Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Damaged Units', value: totalDamagedUnits, icon: PackageX, bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', num: 'text-rose-800' },
          { label: 'Returned to Supplier', value: totalReturnedUnits, icon: RotateCcw, bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', num: 'text-purple-800' },
          { label: 'Expired Units', value: totalExpiredUnits, icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', num: 'text-amber-800' },
          { label: 'Lost Units', value: totalLostUnits, icon: AlertTriangle, bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', num: 'text-orange-800' },
        ].map((card) => (
          <div key={card.label} className={`rounded-2xl border ${card.border} ${card.bg} p-5`}>
            <p className={`text-[10px] font-black uppercase tracking-widest ${card.text}`}>{card.label}</p>
            <p className={`text-3xl font-black mt-1 ${card.num}`}>{card.value}</p>
            <p className={`text-[10px] font-semibold mt-0.5 ${card.text} opacity-70`}>
              {card.value === 0 ? 'No records' : `in ${card.label.split(' ')[0].toLowerCase()} log`}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main Table ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <PackageX className="w-4.5 h-4.5 text-rose-500" />
            <div>
              <h2 className="text-sm font-black text-slate-900">Damaged & Returned Stock Log</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {allRelevant.length} records — Damaged, Returned, Expired, Lost
              </p>
            </div>
          </div>
          <ExportButton transactions={allRelevant} filename="damaged-returned-stock" />
        </div>

        {allRelevant.length === 0 ? (
          <div className="py-20 text-center">
            <PackageX className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-400">No damaged or returned stock recorded</p>
            <p className="text-[10px] text-slate-300 font-semibold mt-1">
              Deduct stock using "Damaged", "Returned to Supplier", "Expired", or "Lost" reason to see records here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">SKU</th>
                  <th className="px-5 py-3 text-center">Action</th>
                  <th className="px-5 py-3 text-right">Qty</th>
                  <th className="px-5 py-3 text-right">Stock Before</th>
                  <th className="px-5 py-3 text-right">Stock After</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3">Handled By</th>
                  <th className="px-5 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allRelevant.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="text-[10px] font-bold text-slate-700">
                        {new Date(txn.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: '2-digit',
                        })}
                      </p>
                      <p className="text-[9px] text-slate-400 font-semibold">
                        {new Date(txn.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
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
                    <td className="px-5 py-3 text-center">
                      <StockBadge type={txn.type} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs font-black text-rose-600">-{txn.quantity}</span>
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-semibold text-slate-500">
                      {txn.previousStock}
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-slate-900">
                      {txn.currentStock}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${REASON_STYLES[txn.reason ?? ''] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {txn.reason}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[10px] font-semibold text-slate-600">
                      {txn.handledBy}
                    </td>
                    <td className="px-5 py-3 text-[10px] text-slate-400 font-semibold max-w-[120px] truncate">
                      {txn.remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DamagedReturned;
