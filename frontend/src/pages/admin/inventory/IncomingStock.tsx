import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackagePlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '../../../api/queries';
import { useInventoryStore } from '../../../store/inventoryStore';
import { StockBadge } from '../../../components/inventory/StockBadge';
import type { InventoryTransaction } from '../../../types/inventory';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const schema = z.object({
  productId:     z.string().min(1, 'Select a product'),
  quantity:      z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  supplier:      z.string().min(1, 'Supplier name is required'),
  purchaseCost:  z.coerce.number().min(0, 'Enter a valid cost'),
  sellingPrice:  z.coerce.number().optional(),
  invoiceNumber: z.string().optional(),
  date:          z.string().min(1, 'Select a date'),
  remarks:       z.string().optional(),
  addedBy:       z.string().min(1, 'Enter your name'),
});

type FormData = z.infer<typeof schema>;

// ─── Field Component ─────────────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
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

// ─── Component ────────────────────────────────────────────────────────────────
const IncomingStock: React.FC = () => {
  const { data: products = [] } = useProducts();
  const { addIncomingStock, getStockForProduct, ensureProductStock, suppliers } = useInventoryStore();
  const [recentTransaction, setRecentTransaction] = useState<InventoryTransaction | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

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
      addedBy: 'Admin',
    },
  });

  const watchedProductId = watch('productId');
  const currentStock = watchedProductId
    ? getStockForProduct(watchedProductId)?.currentStock ?? 0
    : 0;
  const selectedSku = watchedProductId
    ? getStockForProduct(watchedProductId)?.sku ?? '—'
    : '—';

  const onProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setValue('productId', id);
    setSelectedProductId(id);
    if (id) {
      const product = products.find((p) => p._id === id);
      if (product) ensureProductStock(id, product.title);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const product = products.find((p) => p._id === data.productId);
      if (product) ensureProductStock(data.productId, product.title);

      const txn = addIncomingStock(data);
      setRecentTransaction(txn);
      toast.success(`✅ Added ${data.quantity} units to ${product?.title ?? 'product'}`);
      reset({
        date: new Date().toISOString().split('T')[0],
        addedBy: 'Admin',
        productId: '',
        supplier: '',
        quantity: undefined,
        purchaseCost: undefined,
        sellingPrice: undefined,
        invoiceNumber: '',
        remarks: '',
      });
      setSelectedProductId('');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to add stock');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Form ──────────────────────────────────────────────────────── */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
              <PackagePlus className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Add Incoming Stock</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Record newly received inventory items
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

              {/* SKU (readonly) */}
              <Field label="SKU" hint="Auto-filled from product">
                <input
                  readOnly
                  value={selectedSku}
                  className={`${inputCls()} bg-slate-100 text-slate-500 cursor-not-allowed font-mono`}
                />
              </Field>

              {/* Current Stock (readonly) */}
              <Field label="Current Stock" hint="Before this transaction">
                <input
                  readOnly
                  value={watchedProductId ? currentStock : '—'}
                  className={`${inputCls()} bg-slate-100 text-slate-500 cursor-not-allowed`}
                />
              </Field>

              {/* Quantity */}
              <Field label="Quantity Received" required error={errors.quantity?.message}>
                <input
                  type="number"
                  min={1}
                  {...register('quantity')}
                  placeholder="e.g. 50"
                  className={inputCls(!!errors.quantity)}
                />
              </Field>

              {/* Supplier */}
              <Field label="Supplier / Vendor" required error={errors.supplier?.message}>
                <input
                  {...register('supplier')}
                  placeholder="e.g. DC Books Distributor"
                  list="supplier-list"
                  className={inputCls(!!errors.supplier)}
                />
                <datalist id="supplier-list">
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.name} />
                  ))}
                </datalist>
              </Field>

              {/* Purchase Cost */}
              <Field label="Purchase Cost (₹ per unit)" required error={errors.purchaseCost?.message}>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  {...register('purchaseCost')}
                  placeholder="e.g. 180"
                  className={inputCls(!!errors.purchaseCost)}
                />
              </Field>

              {/* Selling Price */}
              <Field label="Selling Price (₹ per unit)" hint="Optional — updates catalog price">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  {...register('sellingPrice')}
                  placeholder="e.g. 250"
                  className={inputCls()}
                />
              </Field>

              {/* Invoice Number */}
              <Field label="Invoice / PO Number" hint="Optional">
                <input
                  {...register('invoiceNumber')}
                  placeholder="e.g. INV-2024-001"
                  className={inputCls()}
                />
              </Field>

              {/* Date */}
              <Field label="Date Received" required error={errors.date?.message}>
                <input
                  type="date"
                  {...register('date')}
                  className={inputCls(!!errors.date)}
                />
              </Field>

              {/* Added By */}
              <Field label="Added By" required error={errors.addedBy?.message}>
                <input
                  {...register('addedBy')}
                  placeholder="e.g. Admin"
                  className={inputCls(!!errors.addedBy)}
                />
              </Field>

              {/* Remarks */}
              <div className="sm:col-span-2">
                <Field label="Remarks / Notes" hint="Optional">
                  <textarea
                    {...register('remarks')}
                    rows={2}
                    placeholder="e.g. New batch from supplier — semester stock"
                    className={`${inputCls()} resize-none`}
                  />
                </Field>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold">
                All transactions are permanently logged and cannot be deleted.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0A3D91] hover:bg-[#082C6C] disabled:opacity-60 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                {isSubmitting ? 'Saving...' : 'Add Stock'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Side Panel ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Success card */}
          {recentTransaction && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black text-emerald-800">Stock Added Successfully</span>
              </div>
              <div className="space-y-2 text-[10px] font-semibold text-emerald-700">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-black text-emerald-900 text-right max-w-[140px] truncate">
                    {recentTransaction.productTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity Added:</span>
                  <span className="font-black text-emerald-900">+{recentTransaction.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Previous Stock:</span>
                  <span>{recentTransaction.previousStock}</span>
                </div>
                <div className="flex justify-between">
                  <span>New Stock:</span>
                  <span className="font-black text-emerald-900">{recentTransaction.currentStock}</span>
                </div>
                <div className="flex justify-between">
                  <span>Supplier:</span>
                  <span>{recentTransaction.supplier}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-emerald-200">
                  <StockBadge type="IN" quantity={recentTransaction.quantity} />
                </div>
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-3">
              Guidelines
            </h3>
            <ul className="space-y-2 text-[10px] text-slate-500 font-semibold">
              <li className="flex gap-2">
                <span className="text-emerald-500 shrink-0">✓</span>
                All incoming stock is permanently logged
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 shrink-0">✓</span>
                Average cost is recalculated on each stock addition
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 shrink-0">✓</span>
                Invoice number helps track supplier invoices
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 shrink-0">⚠</span>
                Transactions cannot be deleted — add a correction entry if needed
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingStock;
