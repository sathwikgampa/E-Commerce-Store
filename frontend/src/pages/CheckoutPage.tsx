import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import useCartStore from '../store/cartStore';
import { useSubmitOrder } from '../api/queries';
import { 
  ChevronRight, 
  ShieldCheck, 
  CreditCard, 
  Landmark, 
  CheckCircle, 
  Building2, 
  Truck, 
  MessageCircle, 
  QrCode,
  ArrowRight
} from 'lucide-react';

const checkoutSchema = z.object({
  name: z.string().min(3, { message: 'Full name must be at least 3 characters long' }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit Indian mobile number' }),
  pincode: z.string().regex(/^\d{6}$/, { message: 'Pincode must be exactly 6 digits' }),
  address: z.string().min(10, { message: 'Please provide full street, house number, or school landmark' }),
  orderNotes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const submitOrderMutation = useSubmitOrder();

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  const subtotal = getTotalPrice();
  const deliveryFee = deliveryType === 'delivery' && subtotal < 500 ? 40 : 0;
  const total = subtotal + deliveryFee;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      pincode: '503111',
      address: '',
      orderNotes: '',
    }
  });

  // Redirect if cart is empty and no placed order
  React.useEffect(() => {
    if (items.length === 0 && !placedOrder) {
      navigate('/cart');
    }
  }, [items, placedOrder, navigate]);

  const onSubmit = async (values: CheckoutFormValues) => {
    const orderItems = items.map(item => ({
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity
    }));

    const orderData = {
      name: values.name,
      phone: values.phone,
      pincode: values.pincode,
      address: deliveryType === 'pickup' ? `Store Pickup: Station Road, Kamareddy (Note: ${values.address})` : values.address,
      paymentMethod,
      items: orderItems,
      totalAmount: total,
      status: 'Pending' as const
    };

    submitOrderMutation.mutate(orderData, {
      onSuccess: (data) => {
        setPlacedOrder({
          ...orderData,
          _id: data._id || `STM-${Date.now().toString().slice(-6)}`,
          orderNotes: values.orderNotes,
        });
        clearCart();
        toast.success('Order placed successfully!', {
          description: 'Thank you! Sri Thirumala staff will contact you shortly.',
        });
      },
      onError: (err) => {
        console.error(err);
        toast.error('Failed to submit order. Please try again.');
      }
    });
  };

  // Success Confirmation View
  if (placedOrder) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-store-accent min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200/90 max-w-xl w-full space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-store-primary">Order Confirmed</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Thank You, {placedOrder.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Your order reference is <strong className="text-slate-900 font-mono">#{placedOrder._id}</strong>
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-semibold">Payment Method:</span>
              <span className="font-bold text-slate-900">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-semibold">Delivery Type:</span>
              <span className="font-bold text-slate-900">
                {deliveryType === 'pickup' ? 'Free In-Store Pickup (Station Road)' : 'Doorstep Delivery (Kamareddy)'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-semibold">Total Amount:</span>
              <span className="font-black text-store-primary text-sm">₹{placedOrder.totalAmount}</span>
            </div>
            <div className="pt-1">
              <span className="text-slate-500 font-semibold block mb-1">Purchased Items:</span>
              <ul className="space-y-1">
                {placedOrder.items.map((it: any, i: number) => (
                  <li key={i} className="flex justify-between font-medium text-slate-700">
                    <span className="truncate max-w-[260px]">{it.quantity} × {it.title}</span>
                    <span>₹{it.price * it.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Direct WhatsApp Confirmation Button */}
          <a
            href={`https://wa.me/919949886640?text=Hi%20Sri%20Thirumala%20Store%2C%20I%20just%20placed%20Order%20%23${placedOrder._id}%20for%20INR%20${placedOrder.totalAmount}.%20Name%3A%20${encodeURIComponent(placedOrder.name)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
          >
            <MessageCircle className="w-4 h-4" /> Confirm Order via WhatsApp (+91 99498 86640)
          </a>

          {/* Return to Home Store button */}
          <Link
            to="/home"
            className="btn-primary w-full py-3.5 text-xs shadow-md"
          >
            Return to Storefront Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-store-accent text-left min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-[11px] font-black tracking-widest text-store-primary uppercase">Secure Checkout</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif mt-1">Finalize Your Order</h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
          Specify your contact details to arrange immediate store collection or local delivery in Kamareddy.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Checkout Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
            
            {/* Delivery Method Selection */}
            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 font-serif">
                1. Delivery &amp; Pickup Preference
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                    deliveryType === 'pickup'
                      ? 'border-store-primary bg-store-primary-subtle ring-2 ring-store-primary/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Building2 className={`w-5 h-5 shrink-0 mt-0.5 ${deliveryType === 'pickup' ? 'text-store-primary' : 'text-slate-400'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Store Pickup</span>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">FREE</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      Pick up directly from Station Road, Kamareddy (Open 9:00 AM - 9:00 PM).
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                    deliveryType === 'delivery'
                      ? 'border-store-primary bg-store-primary-subtle ring-2 ring-store-primary/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Truck className={`w-5 h-5 shrink-0 mt-0.5 ${deliveryType === 'delivery' ? 'text-store-primary' : 'text-slate-400'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Local Home Delivery</span>
                      {subtotal >= 500 ? (
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">FREE</span>
                      ) : (
                        <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">₹40</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      Door delivery within Kamareddy town within 24-48 hours.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 pt-2">
              <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 font-serif">
                2. Contact &amp; Address Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Enter student / parent full name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-store-primary focus:bg-white"
                  />
                  {errors.name && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-store-primary focus:bg-white"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Address / Landmark / School *
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    placeholder="Colony, street name, house number or landmark"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-store-primary focus:bg-white"
                  />
                  {errors.address && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.address.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    {...register('pincode')}
                    placeholder="503111"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-store-primary focus:bg-white"
                  />
                  {errors.pincode && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.pincode.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Order Note / Specific Class Edition (Optional)
                </label>
                <input
                  type="text"
                  {...register('orderNotes')}
                  placeholder="e.g. Please reserve Telugu Medium edition or provide 2 extra ruled registers"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-store-primary focus:bg-white"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4 pt-2">
              <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 font-serif">
                3. Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                    paymentMethod === 'COD'
                      ? 'border-store-primary bg-store-primary-subtle ring-2 ring-store-primary/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Landmark className={`w-5 h-5 shrink-0 mt-0.5 ${paymentMethod === 'COD' ? 'text-store-primary' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Cash on Delivery / Pay at Counter</span>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      Pay cash upon inspecting textbooks in store or on home arrival.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                    paymentMethod === 'UPI'
                      ? 'border-store-primary bg-store-primary-subtle ring-2 ring-store-primary/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <QrCode className={`w-5 h-5 shrink-0 mt-0.5 ${paymentMethod === 'UPI' ? 'text-store-primary' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Instant UPI (GPay / PhonePe / QR)</span>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      Fast contactless payment via any UPI app directly to Sri Thirumala.
                    </p>
                  </div>
                </button>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4 text-xs">
                  <div className="w-14 h-14 bg-white p-1 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                    <QrCode className="w-10 h-10 text-slate-800" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Store UPI ID: srithirumala@upi</span>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      You can pay instantly using Google Pay, PhonePe, or Paytm once your order is confirmed.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Place Order CTA Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-sm shadow-md disabled:opacity-60"
              >
                {isSubmitting ? 'Placing Order...' : `Confirm & Place Order (₹${total})`}
              </button>
            </div>

          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90 space-y-6">
            
            <h2 className="text-lg font-black text-slate-900 font-serif pb-3 border-b border-slate-100">
              Order Items ({items.length})
            </h2>

            {/* Scrollable list of items */}
            <div className="max-h-72 overflow-y-auto space-y-3 styled-scrollbar pr-1 divide-y divide-slate-100">
              {items.map((it) => (
                <div key={it.product._id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <div className="w-12 h-14 bg-slate-50 rounded-lg p-1 shrink-0 flex items-center justify-center border border-slate-200">
                    <img src={it.product.image} alt={it.product.title} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{it.product.title}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">Qty: {it.quantity} × ₹{it.product.price}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">₹{it.product.price * it.quantity}</span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2.5 text-xs font-semibold text-slate-600 pt-3 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-900 font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    <span className="text-slate-900 font-bold">₹{deliveryFee}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-black text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-store-primary text-xl">₹{total}</span>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="bg-store-accent/70 p-3.5 rounded-xl border border-store-primary/10 text-[11px] text-slate-600 font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct verification with Sri Thirumala bookstore staff</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default CheckoutPage;
