import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const total = getTotalPrice();

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit = (data) => {
    // Here we'll later send data to backend
    console.log('Order Data:', { ...data, paymentMethod, items, total });
    toast.success('Order placed successfully!');
    clearCart();
    navigate('/');
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-stone-900 mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-6">Delivery Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                  <input 
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                    placeholder="Enter your full name" 
                  />
                  {errors.name && <span className="text-rose-500 text-sm mt-1">{errors.name.message}</span>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                    <input 
                      {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10}$/, message: 'Invalid phone number' } })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                      placeholder="e.g. 8897766640" 
                    />
                    {errors.phone && <span className="text-rose-500 text-sm mt-1">{errors.phone.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Pincode</label>
                    <input 
                      {...register('pincode', { required: 'Pincode is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                      placeholder="e.g. 503111" 
                      defaultValue="503111"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Full Address (Local Delivery)</label>
                  <textarea 
                    {...register('address', { required: 'Address is required' })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                    rows="3"
                    placeholder="House No, Street, Landmark" 
                  ></textarea>
                  {errors.address && <span className="text-rose-500 text-sm mt-1">{errors.address.message}</span>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-6">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'COD' ? 'border-rose-500 bg-rose-50' : 'border-stone-300 hover:bg-stone-50'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD" 
                    checked={paymentMethod === 'COD'} 
                    onChange={() => setPaymentMethod('COD')}
                    className="w-5 h-5 text-rose-600 focus:ring-rose-500" 
                  />
                  <span className="ml-3 font-medium text-stone-900">Cash on Delivery (COD)</span>
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'UPI' ? 'border-rose-500 bg-rose-50' : 'border-stone-300 hover:bg-stone-50'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="UPI" 
                    checked={paymentMethod === 'UPI'} 
                    onChange={() => setPaymentMethod('UPI')}
                    className="w-5 h-5 text-rose-600 focus:ring-rose-500" 
                  />
                  <span className="ml-3 font-medium text-stone-900">UPI (GPay / PhonePe) - Pay at Delivery</span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full flex justify-center items-center px-8 py-4 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 hover:shadow-lg transition text-lg"
            >
              Place Order - ₹{total}
            </button>
          </form>
        </div>

        <div className="lg:w-96 flex-shrink-0">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 sticky top-24">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h2>
            <ul className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <li key={item.product._id} className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">{item.product.title}</h4>
                    <span className="text-xs text-stone-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-sm font-semibold text-stone-900 ml-4">₹{item.product.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-stone-200 pt-6 space-y-3">
              <div className="flex justify-between items-center text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">₹{total}</span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between items-center text-stone-900 pt-3 border-t border-stone-100">
                <span className="text-lg font-bold">Total to Pay</span>
                <span className="text-2xl font-extrabold text-rose-600">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
