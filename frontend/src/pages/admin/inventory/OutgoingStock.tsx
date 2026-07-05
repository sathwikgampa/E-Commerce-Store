import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackageMinus, AlertCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '../../../api/queries';
import { useInventoryStore } from '../../../store/inventoryStore';
import { StockBadge, StatusBadge } from '../../../components/inventory/StockBadge';
import type { OutgoingReason, InventoryTransaction } from '../../../types/inventory';

const OUTGOING_REASONS: OutgoingReason[] = [
  'Customer Purchase',
  'Damaged',
  'Expired',
  'Returned to Supplier',
  'Internal Use',
  'Lost',
];

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const schema = z.object({
  productId:  z.string().min(1, 'Select a product'),
  quantity:   z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  reason:     z.enum([
    'Customer Purchase', 'Damaged', 'Expired',
    'Returned to Supplier', 'Internal Use', 'Lost',
  ] as const, { required_error: 'Select a reason' }),
  remarks:    z.string().optional(),
  date:       z.string().min(1, 'Select a date'),
  handledBy:  z.string().min(1, 'Enter handler name'),
});

type FormData = z.infer<typeof schema>;

const Field: React.FC<{
  label: string; required?: boolean; error?: string; children: React.ReactNode; hint?: string;
}> = ({ label, required, error, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-[9px] text-slate-400 font-semibold">{hint}</p>}
    {error && (
      <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

const inputCls = (hasError?: boolean) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-slate-800 outline-none transition-all bg-slate-50 focus:bg-white focus:ring-2 ${
    hasError
      ? 'border-rose-300 focus:ring-rose-100'
      : 'border-slate-200 focus:ring-[#0A3D91]/10 focus:border-[#0A3D91]/50'
  }`;

const REASON_COLORS: Record<OutgoingReason, string> = {
  'Customer Purchase':    'text-blue-600 bg-blue-50 border-blue-200',
  'Damaged':              'text-rose-600 bg-rose-50 border-rose-200',
  'Expired':              'text-amber-600 bg-amber-50 border-amber-200',
  'Returned to Supplier': 'text-purple-600 bg-purple-50 border-purple-200',
  'Internal Use':         'text-slate-600 bg-slate-50 border-slate-200',
  'Lost':                 'text-orange-600 bg-orange-50 border-orange-200',
};

const OutgoingStock: React.FC = () => {
  const { data: products = [] } = useProducts();
  const { addOutgoingStock, getStockForProduct, ensureProductStock } = useInventoryStore();
  const [stockError, setStockError] = useState<string | null>(null);
  const [recentTransaction, setRecentTransaction] = useState<InventoryTransaction | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      handledBy: 'Admin',
    },
  });

  const watchedProductId = watch('productId');
  const watchedQty = watch('quantity');
  const watchedReason = watch('reason');

  const stockRecord = watchedProductId ? getStockForProduct(watchedProductId) : null;
  const available = stockRecord
    ? stockRecord.currentStock - stockRecord.reservedStock
    : 0;
  const willExceed = watchedQty > 0 && watchedQty > available && !!watchedProductId;

  const onProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setValue('productId', id);
    setStockError(null);
    if (id) {
      const product = products.find((p) => p._id === id);
      if (product) ensureProductStock(id, product.title);
    }
  };

  const onSubmit = (data: FormData) => {
    setStockError(null);
    const record = getStockForProduct(data.productId);
    const avail = record ? record.currentStock - record.reservedStock : 0;
    if (data.quantity > avail) {
      setStockError(`Cannot deduct ${data.quantity} — only ${avail} units available.`);
      return;
    }
    setPendingData(data);
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    if (!pendingData) return;
    const result = addOutgoingStock(pendingData);
    if (!result.success) {
      toast.error(result.error);
    } else {
      setRecentTransaction(result.transaction);
      toast.success(`✅ Deducted ${pendingData.quantity} units — ${pendingData.reason}`);
      reset({
        date: new Date().toISOString().split('T')[0],
        handledBy: 'Admin',
        productId: '',
        quantity: undefined,
        reason: undefined,
        remarks: '',
      });
      setStockError(null);
    }
    setShowConfirm(false);
    setPendingData(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Confirmation Dialog */}
      {showConfirm && pendingData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Confirm Stock Deduction</h3>
                <p className="text-[10px] text-slate-400 font-semibold">This action cannot be undone</p>
              </div>
            </div>
            <div className="space-y-2 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl p-4 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Product:</span>
                <span className="font-black text-right max-w-[160px] truncate">
                  {products.find(p => p._id === pendingData.productId)?.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-black text-rose-600">-{pendingData.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reason:</span>
                <span className="font-black">{pendingData.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">New Stock:</span>
                <span className="font-black">{available - pendingData.quantity}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirm(false); setPendingData(null); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition"
              >
                Confirm Deduct
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Form ─────────────────────────────────────────────── */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center">
              <PackageMinus className="w-4.5 h-4.5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Outgoing Stock</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Manually deduct stock with full audit trail
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Product */}
              <div className="sm:col-span-2">
                <Field label="Product" required error={errors.productId?.message}>
                  <select
                    {...register('productId')}
                    onChange={onProductChange}
                    className={inputCls(!!errors.productId)}
                  >
                    <option value="">— Select a product —</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Live Stock Display */}
              {watchedProductId && stockRecord && (
                <div className="sm:col-span-2">
                  <div className={`rounded-xl border p-4 flex items-center justify-between ${
                    willExceed ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex gap-6 text-xs font-bold">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider">Current Stock</p>
                        <p className="text-base font-black text-slate-900">{stockRecord.currentStock}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider">Reserved</p>
                        <p className="text-base font-black text-slate-500">{stockRecord.reservedStock}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider">Available</p>
                        <p className={`text-base font-black ${available === 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {available}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={stockRecord.status} />
                  </div>
                  {willExceed && (
                    <p className="text-[10px] text-rose-600 font-black flex items-center gap-1 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Requested quantity exceeds available stock ({available} units)
                    </p>
                  )}
                  {stockError && (
                    <p className="text-[10px] text-rose-600 font-black flex items-center gap-1 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> {stockError}
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <Field label="Quantity to Deduct" required error={errors.quantity?.message}>
                <input
                  type="number"
                  min={1}
                  {...register('quantity')}
                  placeholder="e.g. 5"
                  className={inputCls(!!errors.quantity || willExceed)}
                />
              </Field>

              {/* Reason */}
              <Field label="Reason" required error={errors.reason?.message}>
                <select
                  {...register('reason')}
                  className={inputCls(!!errors.reason)}
                >
                  <option value="">— Select reason —</option>
                  {OUTGOING_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </Field>

              {/* Date */}
              <Field label="Date" required error={errors.date?.message}>
                <input
                  type="date"
                  {...register('date')}
                  className={inputCls(!!errors.date)}
                />
              </Field>

              {/* Handled By */}
              <Field label="Handled By" required error={errors.handledBy?.message}>
                <input
                  {...register('handledBy')}
                  placeholder="e.g. Admin"
                  className={inputCls(!!errors.handledBy)}
                />
              </Field>

              {/* Remarks */}
              <div className="sm:col-span-2">
                <Field label="Remarks / Notes" hint="Optional">
                  <textarea
                    {...register('remarks')}
                    rows={2}
                    placeholder="e.g. Books found damaged in storage"
                    className={`${inputCls()} resize-none`}
                  />
                </Field>
              </div>
            </div>

            {/* Reason badge preview */}
            {watchedReason && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-semibold">Reason tagged as:</span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${REASON_COLORS[watchedReason as OutgoingReason]}`}>
                  {watchedReason}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold">
                A confirmation prompt will appear before stock is deducted.
              </p>
              <button
                type="submit"
                disabled={isSubmitting || willExceed}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
              >
                <PackageMinus className="w-3.5 h-3.5" />
                Deduct Stock
              </button>
            </div>
          </form>
        </div>

        {/* ── Side Panel ─────────────────────────────────────── */}
        <div className="space-y-4">
          {recentTransaction && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <StockBadge type="OUT" />
                <span className="text-xs font-black text-rose-800">Stock Deducted</span>
              </div>
              <div className="space-y-2 text-[10px] font-semibold text-rose-700">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-black text-rose-900 text-right max-w-[140px] truncate">
                    {recentTransaction.productTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Deducted:</span>
                  <span className="font-black">-{recentTransaction.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Was:</span>
                  <span>{recentTransaction.previousStock}</span>
                </div>
                <div className="flex justify-between">
                  <span>Now:</span>
                  <span className="font-black text-rose-900">{recentTransaction.currentStock}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reason:</span>
                  <span className="font-black">{recentTransaction.reason}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-3">
              Deduction Reasons
            </h3>
            <div className="space-y-1.5">
              {OUTGOING_REASONS.map((reason) => (
                <div
                  key={reason}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border ${REASON_COLORS[reason]}`}
                >
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutgoingStock;
