import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, PackagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '../../../api/queries';
import { useInventoryStore } from '../../../store/inventoryStore';
import { Panel, MonoTag, table } from '../../../components/admin/AdminUI';
import { Field, Input, Select, Textarea } from '../../../components/ui/Field';
import { Button } from '../../../components/ui/Button';
import type { InventoryTransaction } from '../../../types/inventory';

const schema = z.object({
  productId: z.string().min(1, 'Select a product'),
  quantity: z.coerce.number().int('Whole units only').min(1, 'Quantity must be at least 1'),
  supplier: z.string().min(1, 'Supplier name is required'),
  purchaseCost: z.coerce.number().min(0, 'Enter a valid cost'),
  sellingPrice: z.preprocess((v) => (v === '' || v == null ? undefined : v), z.coerce.number().min(0).optional()),
  invoiceNumber: z.string().optional(),
  date: z.string().min(1, 'Select a date'),
  remarks: z.string().optional(),
  addedBy: z.string().min(1, 'Enter your name'),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

const todayISO = () => new Date().toISOString().split('T')[0];

const IncomingStock: React.FC = () => {
  const { data: products = [] } = useProducts();
  const { addIncomingStock, ensureProductStock, suppliers } = useInventoryStore();
  const stockMap = useInventoryStore((s) => s.stockMap);
  const transactions = useInventoryStore((s) => s.transactions);
  const [recentTransaction, setRecentTransaction] = useState<InventoryTransaction | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { date: todayISO(), addedBy: 'Admin', productId: '' },
  });

  const productId = watch('productId');
  const record = productId ? stockMap[productId] : undefined;
  const recentReceipts = useMemo(() => transactions.filter((t) => t.type === 'IN').slice(0, 8), [transactions]);

  const productField = register('productId');

  const onSubmit = (data: FormOutput) => {
    try {
      const product = products.find((p) => p._id === data.productId);
      if (product) ensureProductStock(data.productId, product.title);
      const txn = addIncomingStock(data);
      setRecentTransaction(txn);
      toast.success(`Received ${data.quantity} × ${txn.productTitle}`);
      reset({ date: todayISO(), addedBy: data.addedBy, productId: '', supplier: '', invoiceNumber: '', remarks: '' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add stock');
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <Panel title="Receive stock" description="Log a supplier delivery or purchase order. Every entry is added to the audit trail.">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 p-4 sm:p-5">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500">Item</legend>
            <Field label="Product" required error={errors.productId?.message} className="sm:col-span-2">
              {(a) => (
                <Select
                  {...a}
                  {...productField}
                  onChange={(e) => {
                    productField.onChange(e);
                    const product = products.find((p) => p._id === e.target.value);
                    if (product) ensureProductStock(product._id, product.title);
                  }}
                >
                  <option value="">Select a product…</option>
                  {products.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
                </Select>
              )}
            </Field>
            {record && (
              <div className="flex flex-wrap gap-x-6 gap-y-1 rounded-lg bg-slate-50 px-4 py-3 text-[13px] sm:col-span-2">
                <span>SKU <MonoTag>{record.sku}</MonoTag></span>
                <span className="text-slate-600">On hand <strong className="tabular text-slate-900">{record.currentStock}</strong></span>
                <span className="text-slate-600">Reorder at <strong className="tabular text-slate-900">{record.lowStockThreshold}</strong></span>
              </div>
            )}
            <Field label="Quantity received" required error={errors.quantity?.message}>
              {(a) => <Input {...a} {...register('quantity')} type="number" min={1} inputMode="numeric" />}
            </Field>
            <Field label="Date received" required error={errors.date?.message}>
              {(a) => <Input {...a} {...register('date')} type="date" />}
            </Field>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500">Supplier & cost</legend>
            <Field label="Supplier" required error={errors.supplier?.message}>
              {(a) => (
                <>
                  <Input {...a} {...register('supplier')} list="supplier-list" placeholder="Start typing to pick a saved supplier" />
                  <datalist id="supplier-list">
                    {suppliers.map((s) => <option key={s.id} value={s.name} />)}
                  </datalist>
                </>
              )}
            </Field>
            <Field label="Invoice / PO number" optional>
              {(a) => <Input {...a} {...register('invoiceNumber')} placeholder="e.g. INV-2026-014" />}
            </Field>
            <Field label="Purchase cost per unit (₹)" required error={errors.purchaseCost?.message} hint="Used to recalculate average cost.">
              {(a) => <Input {...a} {...register('purchaseCost')} type="number" min={0} step={0.01} inputMode="decimal" />}
            </Field>
            <Field label="Selling price per unit (₹)" optional hint="Recorded on this transaction only.">
              {(a) => <Input {...a} {...register('sellingPrice')} type="number" min={0} step={0.01} inputMode="decimal" />}
            </Field>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500">Record</legend>
            <Field label="Received by" required error={errors.addedBy?.message}>
              {(a) => <Input {...a} {...register('addedBy')} autoComplete="name" />}
            </Field>
            <Field label="Remarks" optional className="sm:col-span-2">
              {(a) => <Textarea {...a} {...register('remarks')} rows={2} className="min-h-[72px]" placeholder="e.g. Semester batch, 2 cartons" />}
            </Field>
          </fieldset>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-line pt-5">
            <p className="text-[13px] text-slate-500">Entries can’t be deleted — record a correction instead.</p>
            <Button type="submit" variant="admin-primary" isLoading={isSubmitting}>
              <PackagePlus className="h-4 w-4" aria-hidden="true" /> Add to stock
            </Button>
          </div>
        </form>
      </Panel>

      <div className="space-y-4">
        {recentTransaction && (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-[13px] text-emerald-900">
            <p className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Stock added
            </p>
            <p className="mt-1.5">{recentTransaction.productTitle}</p>
            <p className="mt-1 tabular">
              {recentTransaction.previousStock} → <strong>{recentTransaction.currentStock}</strong> units (+{recentTransaction.quantity}) from {recentTransaction.supplier}
            </p>
          </div>
        )}
        <Panel title="Recent receipts">
          {recentReceipts.length === 0 ? (
            <p className="px-5 py-6 text-[13px] text-slate-500">No stock received yet.</p>
          ) : (
            <table className={table.table}>
              <caption className="sr-only">Most recent incoming stock entries</caption>
              <tbody className={table.tbody}>
                {recentReceipts.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2.5">
                      <span className="block max-w-[13rem] truncate text-slate-900">{t.productTitle}</span>
                      <span className="text-[12px] text-slate-500">{t.date} · {t.supplier}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular text-emerald-700">+{t.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>
    </div>
  );
};

export default IncomingStock;
