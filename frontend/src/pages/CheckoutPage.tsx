import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { AlertCircle, Banknote, Check, CheckCircle2, MessageCircle, QrCode, Store, Truck } from 'lucide-react';
import useCartStore from '../store/cartStore';
import { useSubmitOrder } from '../api/queries';
import { Order } from '../types';
import { Field, Input } from '../components/ui/Field';
import { Button, buttonClasses } from '../components/ui/Button';
import { ProductCover } from '../components/ProductCard';
import { STORE, formatPrice } from '../components/landing/landingData';
import { DeliveryType, FREE_DELIVERY_THRESHOLD, HOME_DELIVERY_FEE, computeTotals } from '../lib/pricing';
import { saveOrder } from '../lib/orderHistory';
import { cn } from '../lib/utils';

const checkoutSchema = z.object({
  name: z.string().min(3, { message: 'Full name must be at least 3 characters long' }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit Indian mobile number' }),
  pincode: z.string().regex(/^\d{6}$/, { message: 'Pincode must be exactly 6 digits' }),
  address: z.string().min(10, { message: 'Please provide full street, house number, or school landmark' }),
  orderNotes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;
type PlacedOrder = Order & { _id: string; orderNotes?: string };

const Steps: React.FC<{ current: 1 | 2 | 3 }> = ({ current }) => {
  const steps = ['Cart', 'Details & payment', 'Confirmation'];
  return (
    <ol className="flex items-center gap-2 text-[13px]" aria-label="Checkout progress">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
            {i > 0 && <span aria-hidden="true" className="h-px w-5 bg-store-line sm:w-8" />}
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold',
                done ? 'bg-store-charcoal text-white' : active ? 'bg-store-primary text-white' : 'bg-store-muted text-store-charcoal-light'
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : n}
            </span>
            <span className={cn(active ? 'font-medium text-store-charcoal' : 'text-store-charcoal-light', !active && 'max-sm:sr-only')}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const OptionCard: React.FC<{
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  icon: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  description: string;
}> = ({ name, value, checked, onChange, icon, title, meta, description }) => (
  <label
    className={cn(
      'relative flex cursor-pointer gap-3 rounded-xl border bg-white p-4 transition-colors',
      'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-store-primary',
      checked ? 'border-store-primary ring-1 ring-store-primary' : 'border-store-line hover:border-store-charcoal-light/50'
    )}
  >
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
    <span className={cn('mt-0.5 shrink-0', checked ? 'text-store-primary' : 'text-store-charcoal-light')}>{icon}</span>
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[15px] font-semibold text-store-charcoal">{title}</span>
        {meta}
      </span>
      <span className="mt-1 block text-[13px] leading-relaxed text-store-charcoal-light">{description}</span>
    </span>
    <span
      aria-hidden="true"
      className={cn(
        'mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
        checked ? 'border-store-primary' : 'border-store-charcoal-light/50'
      )}
    >
      {checked && <span className="h-2 w-2 rounded-full bg-store-primary" />}
    </span>
  </label>
);

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart, couponCode } = useCartStore();
  const navigate = useNavigate();
  const submitOrderMutation = useSubmitOrder();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const subtotal = getTotalPrice();
  const totals = computeTotals(subtotal, couponCode, deliveryType);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { pincode: '503111', address: '', orderNotes: '' },
  });

  // Redirect if cart is empty and no order has just been placed
  useEffect(() => {
    if (items.length === 0 && !placedOrder) navigate('/cart');
  }, [items, placedOrder, navigate]);

  const onSubmit = (values: CheckoutFormValues) => {
    const orderData: Order = {
      name: values.name,
      phone: values.phone,
      pincode: values.pincode,
      address:
        deliveryType === 'pickup' ? `Store Pickup: Station Road, Kamareddy (Note: ${values.address})` : values.address,
      paymentMethod,
      items: items.map((item) => ({ title: item.product.title, price: item.product.price, quantity: item.quantity })),
      totalAmount: totals.total,
      status: 'Pending',
      deliveryType,
      deliveryFee: totals.deliveryFee,
      ...(totals.discount > 0 && couponCode ? { couponCode, discountAmount: totals.discount } : {}),
    };

    submitOrderMutation.mutate(orderData, {
      onSuccess: (data) => {
        const placed: PlacedOrder = {
          ...orderData,
          _id: data?._id || `STM-${Date.now().toString().slice(-6)}`,
          createdAt: data?.createdAt || new Date().toISOString(),
          orderNotes: values.orderNotes,
        };
        saveOrder({ ...placed, createdAt: placed.createdAt! });
        setPlacedOrder(placed);
        clearCart();
        window.scrollTo(0, 0);
        toast.success('Order placed', { description: 'The store will contact you to confirm.' });
      },
      onError: (err) => {
        console.error(err);
        toast.error('We couldn’t place your order. Please try again.');
      },
    });
  };

  // ── Confirmation ──────────────────────────────────────────────────────────
  if (placedOrder) {
    const waText = encodeURIComponent(
      `Hi Sri Thirumala Store, I just placed Order #${placedOrder._id} for INR ${placedOrder.totalAmount}. Name: ${placedOrder.name}`
    );
    return (
      <div className="mx-auto max-w-2xl px-5 pb-16 pt-8 sm:px-8">
        <Steps current={3} />
        <div className="mt-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-serif text-[32px] font-semibold tracking-tight text-store-charcoal">Thank you, {placedOrder.name}</h1>
          <p className="mt-2 text-[15px] text-store-charcoal-light">
            Your order reference is <strong className="font-mono font-semibold text-store-charcoal">#{placedOrder._id}</strong>.
            The store will call or WhatsApp you to confirm.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-store-line">
          <dl className="grid gap-4 text-[14px] sm:grid-cols-2">
            <div>
              <dt className="text-store-charcoal-light">Fulfilment</dt>
              <dd className="mt-0.5 font-medium text-store-charcoal">
                {placedOrder.deliveryType === 'delivery' ? 'Home delivery in Kamareddy' : 'Pickup — Station Road store'}
              </dd>
            </div>
            <div>
              <dt className="text-store-charcoal-light">Payment</dt>
              <dd className="mt-0.5 font-medium text-store-charcoal">
                {placedOrder.paymentMethod === 'UPI' ? 'UPI (pay once confirmed)' : 'Cash on delivery / at counter'}
              </dd>
            </div>
          </dl>
          <ul className="mt-5 divide-y divide-store-line border-y border-store-line text-[14px]">
            {placedOrder.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-4 py-2.5">
                <span className="min-w-0 truncate text-store-charcoal">
                  <span className="tabular text-store-charcoal-light">{it.quantity} ×</span> {it.title}
                </span>
                <span className="shrink-0 tabular">{formatPrice(it.price * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between text-[15px] font-semibold">
            <span>Total</span>
            <span className="tabular">{formatPrice(placedOrder.totalAmount)}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href={`https://wa.me/919949886640?text=${waText}`} target="_blank" rel="noreferrer" className={buttonClasses('secondary', 'lg', true)}>
            <MessageCircle className="h-4 w-4 text-[#128C7E]" aria-hidden="true" /> Confirm on WhatsApp
          </a>
          <Link to="/home" className={buttonClasses('primary', 'lg', true)}>Continue shopping</Link>
        </div>
        <p className="mt-4 text-center text-[13px] text-store-charcoal-light">
          You can find this order later under <Link to="/dashboard" className="font-medium text-store-primary underline-offset-4 hover:underline">My account</Link>.
        </p>
      </div>
    );
  }

  if (items.length === 0) return null;

  const errorCount = Object.keys(errors).length;

  // ── Checkout form ─────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-store px-5 pb-16 pt-8 sm:px-8 lg:px-12">
      <Steps current={2} />
      <h1 className="mt-6 font-serif text-[32px] font-semibold tracking-tight text-store-charcoal sm:text-[38px]">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-10 lg:col-span-7">
          {errorCount > 0 && (
            <div role="alert" className="flex gap-3 rounded-xl bg-rose-50 p-4 text-[14px] text-rose-800 ring-1 ring-rose-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Please fix the {errorCount === 1 ? 'highlighted field' : `${errorCount} highlighted fields`} below.
            </div>
          )}

          <fieldset>
            <legend className="font-sans text-lg font-semibold text-store-charcoal">1. How would you like to receive it?</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <OptionCard
                name="delivery"
                value="pickup"
                checked={deliveryType === 'pickup'}
                onChange={() => setDeliveryType('pickup')}
                icon={<Store className="h-5 w-5" />}
                title="Store pickup"
                meta={<span className="text-[13px] font-semibold text-emerald-700">Free</span>}
                description={`Collect from Station Road, Kamareddy. Open ${STORE.hours}.`}
              />
              <OptionCard
                name="delivery"
                value="delivery"
                checked={deliveryType === 'delivery'}
                onChange={() => setDeliveryType('delivery')}
                icon={<Truck className="h-5 w-5" />}
                title="Home delivery"
                meta={
                  <span className="text-[13px] font-semibold tabular text-store-charcoal">
                    {subtotal >= FREE_DELIVERY_THRESHOLD ? <span className="text-emerald-700">Free</span> : formatPrice(HOME_DELIVERY_FEE)}
                  </span>
                }
                description="Within Kamareddy town, usually in 24–48 hours."
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-sans text-lg font-semibold text-store-charcoal">2. Contact details</legend>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" required error={errors.name?.message}>
                {(a) => <Input {...a} {...register('name')} autoComplete="name" placeholder="Student or parent name" />}
              </Field>
              <Field label="Mobile number" required error={errors.phone?.message} hint="We’ll confirm your order on this number.">
                {(a) => <Input {...a} {...register('phone')} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit mobile number" />}
              </Field>
              <Field
                label={deliveryType === 'pickup' ? 'Address or landmark' : 'Delivery address'}
                required
                error={errors.address?.message}
                className="sm:col-span-2"
              >
                {(a) => <Input {...a} {...register('address')} autoComplete="street-address" placeholder="House number, street, colony or school landmark" />}
              </Field>
              <Field label="Pincode" required error={errors.pincode?.message}>
                {(a) => <Input {...a} {...register('pincode')} inputMode="numeric" autoComplete="postal-code" maxLength={6} />}
              </Field>
              <Field label="Order note" optional>
                {(a) => <Input {...a} {...register('orderNotes')} placeholder="e.g. Telugu medium edition" />}
              </Field>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-sans text-lg font-semibold text-store-charcoal">3. Payment</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <OptionCard
                name="payment"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
                icon={<Banknote className="h-5 w-5" />}
                title="Cash"
                description="Pay at the counter on pickup, or to the delivery person."
              />
              <OptionCard
                name="payment"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={() => setPaymentMethod('UPI')}
                icon={<QrCode className="h-5 w-5" />}
                title="UPI"
                description="GPay, PhonePe or Paytm. You pay after the store confirms your order."
              />
            </div>
            {paymentMethod === 'UPI' && (
              <p className="mt-3 rounded-lg bg-white px-4 py-3 text-[13px] text-store-charcoal-light ring-1 ring-store-line">
                Store UPI ID: <strong className="font-mono font-semibold text-store-charcoal">srithirumala@upi</strong>. No payment is taken on this page.
              </p>
            )}
          </fieldset>
        </div>

        {/* Summary */}
        <aside aria-labelledby="checkout-summary" className="lg:col-span-5">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-store-line lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 id="checkout-summary" className="font-sans text-lg font-semibold text-store-charcoal">Order summary</h2>
              <Link to="/cart" className="text-[13px] font-medium text-store-primary underline-offset-4 hover:underline">Edit cart</Link>
            </div>
            <ul className="styled-scrollbar mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <li key={product._id} className="flex items-center gap-3">
                  <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-store-muted">
                    <ProductCover product={product} />
                    <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-md bg-store-charcoal px-1 text-[11px] font-semibold text-white tabular">
                      {quantity}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[14px] text-store-charcoal">{product.title}</span>
                  <span className="shrink-0 text-[14px] tabular">{formatPrice(product.price * quantity)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 border-t border-store-line pt-5 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-store-charcoal-light">Subtotal</dt>
                <dd className="tabular">{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <dt>Coupon {couponCode} ({totals.discountPercent}%)</dt>
                  <dd className="tabular">−{formatPrice(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-store-charcoal-light">{deliveryType === 'pickup' ? 'Store pickup' : 'Home delivery'}</dt>
                <dd className="tabular">{totals.deliveryFee === 0 ? <span className="text-emerald-700">Free</span> : formatPrice(totals.deliveryFee)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-store-line pt-4">
                <dt className="font-semibold">Total to pay</dt>
                <dd className="text-xl font-semibold tabular">{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            <Button type="submit" size="lg" fullWidth className="mt-6" isLoading={submitOrderMutation.isPending}>
              {submitOrderMutation.isPending ? 'Placing order…' : `Place order · ${formatPrice(totals.total)}`}
            </Button>
            <p className="mt-3 text-center text-[12px] text-store-charcoal-light">
              Orders are confirmed by phone or WhatsApp before pickup or dispatch.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default CheckoutPage;
