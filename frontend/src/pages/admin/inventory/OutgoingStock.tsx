import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, PackageMinus } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '../../../api/queries';
import { useInventoryStore } from '../../../store/inventoryStore';
import { StatusBadge } from '../../../components/inventory/StockBadge';
import { Panel, table } from '../../../components/admin/AdminUI';
import { Field, Input, Select, Textarea } from '../../../components/ui/Field';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/Dialog';
import type { OutgoingReason, InventoryTransaction } from '../../../types/inventory';

const OUTGOING_REASONS = [
  'Customer Purchase',
  'Damaged',
  'Expired',
  'Returned to Supplier',
  'Internal Use',
  'Lost',
] as const satisfies readonly OutgoingReason[];

// Write-offs are irreversible losses; sales are routine
const REASON_VARIANT: Record<OutgoingReason, 'info' | 'danger' | 'warning' | 'neutral'> = {
  'Customer Purchase': 'info',
  Damaged: 'danger',
  Expired: 'warning',
  'Returned to Supplier': 'neutral',
  'Internal Use': 'neutral',
  Lost: 'danger',
};

const schema = z.object({
  productId: z.string().min(1, 'Select a product'),
  quantity: z.coerce.number().int('Whole units only').min(1, 'Quantity must be at least 1'),
  reason: z.enum(OUTGOING_REASONS, { message: 'Select a reason' }),
  remarks: z.string().optional(),
  date: z.string().min(1, 'Select a date'),
  handledBy: z.string().min(1, 'Enter handler name'),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

const todayISO = () => new Date().toISOString().split('T')[0];

const OutgoingStock: React.FC = () => {
  const { data: products = [] } = useProducts();
  const { addOutgoingStock, ensureProductStock } = useInventoryStore();
  const stockMap = useInventoryStore((s) => s.stockMap);
  const transactions = useInventoryStore((s) => s.transactions);
  const [pending, setPending] = useState<FormOutput | null>(null);
  const [lastTxn, setLastTxn] = useState<InventoryTransaction | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { date: todayISO(), handledBy: 'Admin', productId: '', reason: '' as unknown as OutgoingReason },
  });

  const productId = watch('productId');
  const qty = Number(watch('quantity')) || 0;
  const record = productId ? stockMap[productId] : undefined;
  const available = record ? record.currentStock - record.reservedStock : 0;
  const exceeds = !!record && qty > available;

  const recentOut = useMemo(() => transactions.filter((t) => t.type === 'OUT').slice(0, 8), [transactions]);
  const productField = register('productId');

  const onSubmit = (data: FormOutput) => {
    const rec = stockMap[data.productId];
    const avail = rec ? rec.currentStock - rec.reservedStock : 0;
    if (data.quantity > avail) {
      setError('quantity', { message: `Only ${avail} units are available.` });
      return;
    }
    setPending(data);
  };

  const confirm = () => {
    if (!pending) return;
    const result = addOutgoingStock(pending);
    if (!result.success) {
      toast.error(result.error);
    } else {
      setLastTxn(result.transaction);
      toast.success(`Removed ${pending.quantity} × ${result.transaction.productTitle}`, { description: pending.reason });
      reset({ date: todayISO(), handledBy: pending.handledBy, productId: '', remarks: '', reason: '' as unknown as OutgoingReason });
    }
    setPending(null);
  };

  const pendingRecord = pending ? stockMap[pending.productId] : undefined;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <Panel title="Remove stock" description="Record sales, dispatches and write-offs. You’ll confirm before stock is deducted.">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
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
            <div className={`flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3 text-[13px] sm:col-span-2 ${exceeds ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-slate-50'}`}>
              <dl className="flex gap-6">
                <div><dt className="text-slate-500">On hand</dt><dd className="text-[16px] font-semibold tabular">{record.currentStock}</dd></div>
                <div><dt className="text-slate-500">Reserved</dt><dd className="text-[16px] font-semibold tabular">{record.reservedStock}</dd></div>
                <div><dt className="text-slate-500">Available</dt><dd className="text-[16px] font-semibold tabular">{available}</dd></div>
              </dl>
              <StatusBadge status={record.status} />
              {exceeds && (
                <p className="flex w-full items-center gap-1.5 font-medium text-rose-800" role="alert">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" /> Quantity exceeds the {available} units available.
                </p>
              )}
            </div>
          )}

          <Field label="Quantity" required error={errors.quantity?.message}>
            {(a) => <Input {...a} {...register('quantity')} type="number" min={1} inputMode="numeric" aria-invalid={exceeds || a['aria-invalid']} />}
          </Field>
          <Field label="Reason" required error={errors.reason?.message}>
            {(a) => (
              <Select {...a} {...register('reason')}>
                <option value="">Select a reason…</option>
                {OUTGOING_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </Select>
            )}
          </Field>
          <Field label="Date" required error={errors.date?.message}>
            {(a) => <Input {...a} {...register('date')} type="date" />}
          </Field>
          <Field label="Handled by" required error={errors.handledBy?.message}>
            {(a) => <Input {...a} {...register('handledBy')} autoComplete="name" />}
          </Field>
          <Field label="Remarks" optional className="sm:col-span-2" hint="For write-offs, note what happened (e.g. water damage in storage).">
            {(a) => <Textarea {...a} {...register('remarks')} rows={2} className="min-h-[72px]" />}
          </Field>

          <div className="flex justify-end border-t border-admin-line pt-4 sm:col-span-2">
            <Button type="submit" variant="admin-primary" disabled={exceeds}>
              <PackageMinus className="h-4 w-4" aria-hidden="true" /> Review deduction
            </Button>
          </div>
        </form>
      </Panel>

      <div className="space-y-4">
        {lastTxn && (
          <div role="status" className="rounded-xl border border-admin-line bg-white p-4 text-[13px]">
            <p className="font-semibold text-slate-900">Stock deducted</p>
            <p className="mt-1 text-slate-600">{lastTxn.productTitle}</p>
            <p className="mt-1 tabular text-slate-600">
              {lastTxn.previousStock} → <strong className="text-slate-900">{lastTxn.currentStock}</strong> units · {lastTxn.reason}
            </p>
          </div>
        )}
        <Panel title="Recent removals">
          {recentOut.length === 0 ? (
            <p className="px-5 py-6 text-[13px] text-slate-500">No stock removed yet.</p>
          ) : (
            <table className={table.table}>
              <caption className="sr-only">Most recent outgoing stock entries</caption>
              <tbody className={table.tbody}>
                {recentOut.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2.5">
                      <span className="block max-w-[12rem] truncate text-slate-900">{t.productTitle}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-[12px] text-slate-500">
                        {t.date}
                        {t.reason && <Badge variant={REASON_VARIANT[t.reason as OutgoingReason] ?? 'neutral'}>{t.reason}</Badge>}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular text-rose-700">−{t.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>

      <Dialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        {pending && pendingRecord && (
          <DialogContent scope="admin" size="sm">
            <DialogHeader>
              <DialogTitle>Confirm stock deduction</DialogTitle>
              <DialogDescription>This is logged permanently and can’t be undone — record a correction to reverse it.</DialogDescription>
            </DialogHeader>
            <dl className="mt-5 space-y-2 rounded-lg bg-slate-50 p-4 text-[14px]">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Product</dt><dd className="truncate text-right font-medium">{pendingRecord.productTitle}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Reason</dt><dd><Badge variant={REASON_VARIANT[pending.reason]}>{pending.reason}</Badge></dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Quantity</dt><dd className="font-semibold tabular text-rose-700">−{pending.quantity}</dd></div>
              <div className="flex justify-between gap-4 border-t border-admin-line pt-2">
                <dt className="text-slate-500">Stock after</dt>
                <dd className="font-semibold tabular">{pendingRecord.currentStock} → {pendingRecord.currentStock - pending.quantity}</dd>
              </div>
            </dl>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setPending(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirm}>Deduct {pending.quantity} units</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default OutgoingStock;
