import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import useCartStore from '../store/cartStore';
import { useSubmitOrder } from '../api/queries';
import { ChevronRight, ShieldCheck, CreditCard, Landmark } from 'lucide-react';

const checkoutSchema = z.object({
  name: z.string().min(3, { message: 'Full name must be at least 3 characters long' }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit mobile number' }),
  pincode: z.string().regex(/^\d{6}$/, { message: 'Pincode must be exactly 6 digits' }),
  address: z.string().min(10, { message: 'Address must contain street, house number, and nearest landmark' }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const submitOrderMutation = useSubmitOrder();

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const total = getTotalPrice();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      pincode: '503111',
    }
  });

  // Redirect if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  if (items.length === 0) {
    return null;
  }

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
      address: values.address,
      paymentMethod,
      items: orderItems,
      totalAmount: total,
      status: 'Pending' as const
    };

    submitOrderMutation.mutate(orderData, {
      onSuccess: (data) => {
        toast.success(`Order placed successfully! ID: ${data._id || 'Success'}`, {
          description: 'Sri Thirumala owners will contact you on WhatsApp to finalize pickup/delivery.',
        });
        clearCart();
        navigate('/');
      },
      onError: (err) => {
        console.error(err);
        toast.error('Failed to submit order. Please try again.');
      }
    });
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-store-accent text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-store-primary">Checkout Details</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Specify your contact credentials to arrange local store pickup or regional delivery in Kamareddy.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Checkout Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            
            {/* Delivery segment */}
            <div className="space-y-5">
              <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Delivery / Pickup Info</h2>
              
              <div className="space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    {...register('name')}
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border outline-none transition focus:bg-white focus:ring-1 focus:ring-primary ${
                      errors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-primary'
                    }`}
                    placeholder="Enter recipient's full name" 
                  />
                  {errors.name && <span className="text-rose-500 text-[10px] font-bold mt-1.5 block">{errors.name.message}</span>}
                </div>
                
                {/* Phone & Pincode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      {...register('phone')}
                      type="text"
                      className={`w-full px-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border outline-none transition focus:bg-white focus:ring-1 focus:ring-primary ${
                        errors.phone ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-primary'
                      }`}
                      placeholder="e.g. 8897766640" 
                    />
                    {errors.phone && <span className="text-rose-500 text-[10px] font-bold mt-1.5 block">{errors.phone.message}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pincode (Kamareddy Region)</label>
                    <input 
                      {...register('pincode')}
                      type="text"
                      className={`w-full px-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border outline-none transition focus:bg-white focus:ring-1 focus:ring-primary ${
                        errors.pincode ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-primary'
                      }`}
                      placeholder="e.g. 503111" 
                    />
                    {errors.pincode && <span className="text-rose-500 text-[10px] font-bold mt-1.5 block">{errors.pincode.message}</span>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Address</label>
                  <textarea 
                    {...register('address')}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border outline-none transition focus:bg-white focus:ring-1 focus:ring-primary ${
                      errors.address ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-primary'
                    }`}
                    rows={3}
                    placeholder="House details, Street name, Near Landmark (For delivery or pickup reference)" 
                  ></textarea>
                  {errors.address && <span className="text-rose-500 text-[10px] font-bold mt-1.5 block">{errors.address.message}</span>}
                </div>

              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4 pt-4">
              <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Payment Option</h2>
              
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                  paymentMethod === 'COD' ? 'border-store-primary bg-store-peach-light' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD" 
                    checked={paymentMethod === 'COD'} 
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 text-store-primary focus:ring-store-primary" 
                  />
                  <div className="ml-3 text-left">
                    <span className="block text-xs font-bold text-slate-900">Cash on Delivery (COD)</span>
                    <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">Pay in cash when you pick up or receive the study files.</span>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                  paymentMethod === 'UPI' ? 'border-store-primary bg-store-peach-light' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="UPI" 
                    checked={paymentMethod === 'UPI'} 
                    onChange={() => setPaymentMethod('UPI')}
                    className="w-4 h-4 text-store-primary focus:ring-store-primary" 
                  />
                  <div className="ml-3 text-left">
                    <span className="block text-xs font-bold text-slate-900">UPI (GPay / PhonePe / Paytm)</span>
                    <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">Scan store QR code at store pickup or delivery execution.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting || submitOrderMutation.isPending}
              className="w-full flex justify-center items-center px-6 py-4 bg-store-primary hover:bg-store-primary-dark text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:bg-slate-200 disabled:cursor-not-allowed text-xs uppercase tracking-wider min-h-[48px]"
            >
              {isSubmitting || submitOrderMutation.isPending ? 'Placing Order...' : `Place Local Order - ₹${total}`}
            </button>
            
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs sticky top-24 space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Item Breakdown</h2>
            
            <ul className="space-y-4 max-h-[300px] overflow-y-auto pr-2 divide-y divide-slate-50">
              {items.map((item) => (
                <li key={item.product._id} className="flex justify-between items-start pt-3.5 first:pt-0">
                  <div className="text-left max-w-[200px]">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.title}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">Qty: {item.quantity} × ₹{item.product.price}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">₹{item.product.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            
            <div className="border-t border-slate-100 pt-5 space-y-3.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-650">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{total}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-650">
                <span>Local Pickup</span>
                <span className="text-emerald-600 font-bold">Free</span>
              </div>
              <div className="flex justify-between items-center text-slate-900 pt-4 border-t border-slate-100">
                <span className="text-sm font-bold">Total Bill</span>
                <span className="text-xl font-black text-store-primary">₹{total}</span>
              </div>
            </div>

            <div className="bg-store-peach-light p-4 rounded-xl flex gap-2.5 items-start">
              <ShieldCheck className="w-5 h-5 text-store-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-600 font-semibold leading-relaxed text-left">
                <strong>Assured Local Care:</strong> Your books will be kept reserved at the counter. The manager will coordinate details with you.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
