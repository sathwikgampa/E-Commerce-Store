import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  BookOpen, 
  ShieldCheck, 
  Truck, 
  Tag, 
  CheckCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import useCartStore from '../store/cartStore';
import { toast } from 'sonner';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPct: number } | null>(null);

  const subtotal = getTotalPrice();
  const freeShippingThreshold = 500;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const discountAmount = appliedCoupon 
    ? Math.round((subtotal * appliedCoupon.discountPct) / 100) 
    : 0;

  const shippingFee = isFreeShipping ? 0 : 40;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'STUDENT10') {
      setAppliedCoupon({ code: 'STUDENT10', discountPct: 10 });
      toast.success('Coupon applied! 10% student discount applied to order.');
    } else if (code === 'KMRFREE') {
      setAppliedCoupon({ code: 'KMRFREE', discountPct: 5 });
      toast.success('Coupon applied! Free regional handling applied.');
    } else {
      toast.error('Invalid coupon code. Try using "STUDENT10".');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed.');
  };

  if (items.length === 0) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-store-accent min-h-[70vh] flex flex-col justify-center items-center">
        <div className="bg-white p-10 sm:p-14 rounded-3xl shadow-xs border border-slate-200/90 max-w-md w-full space-y-4">
          <div className="w-20 h-20 bg-store-accent rounded-full flex items-center justify-center mx-auto text-store-primary">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-serif">Your Shopping Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
            You haven't added any textbooks, Classmate registers, or student stationery yet. Explore our academic catalog to get started.
          </p>
          <div className="pt-2">
            <Link 
              to="/books" 
              className="btn-primary w-full shadow-md"
            >
              Explore Academic Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-store-accent text-left min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-[11px] font-black tracking-widest text-store-primary uppercase">Order Review</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif mt-1">Shopping Cart</h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
          Review your selected study materials before arranging store pickup or local delivery in Kamareddy.
        </p>
      </div>

      {/* Free Delivery Goal Progress */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs mb-8 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-slate-800">
            <Truck className="w-4 h-4 text-store-primary" />
            {isFreeShipping ? (
              <span className="text-emerald-700 font-bold">🎉 Congratulations! You have unlocked FREE Local Delivery in Kamareddy!</span>
            ) : (
              <span>Add <strong className="text-store-primary">₹{amountToFreeShipping}</strong> more to unlock Free Local Delivery!</span>
            )}
          </span>
          <span className="text-slate-500">{Math.round(progressPct)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-store-primary h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Item Grid List */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 overflow-hidden divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.product._id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-slate-50/50 transition">
                
                {/* Visual wrapper */}
                <div className="h-24 w-24 bg-slate-50 rounded-2xl shrink-0 flex items-center justify-center p-2 border border-slate-200/60">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.title} className="max-h-full max-w-full object-contain drop-shadow-xs" />
                  ) : (
                    <BookOpen className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                {/* Details block */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-store-primary">
                        {item.product.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                        <Link to={`/book/${item.product._id}`} className="hover:text-store-primary transition-colors">
                          {item.product.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">By {item.product.author}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-base sm:text-lg font-black text-slate-900">₹{item.product.price * item.quantity}</p>
                      <p className="text-[11px] text-slate-400 font-semibold">₹{item.product.price} each</p>
                    </div>
                  </div>
                  
                  {/* Quantity Selector and remove triggers */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                      <button 
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="px-3.5 py-1.5 text-slate-650 hover:bg-slate-100 transition font-black min-h-[36px]"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="px-3.5 py-1.5 text-slate-650 hover:bg-slate-100 transition font-black min-h-[36px]"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => {
                        removeFromCart(item.product._id);
                        toast.info(`Removed ${item.product.title} from cart.`);
                      }}
                      className="text-slate-400 hover:text-rose-600 flex items-center text-xs font-bold transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </button>

                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link 
              to="/books" 
              className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-store-primary transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Continue Browsing Catalog
            </Link>
          </div>
        </div>

        {/* Order Summary & Coupon Column */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90 space-y-6">
            
            <h2 className="text-lg font-black text-slate-900 font-serif pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter coupon code (STUDENT10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-store-primary uppercase placeholder:normal-case disabled:opacity-60"
                  />
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-xs"
                  >
                    Apply
                  </button>
                )}
              </form>
              {appliedCoupon && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold mt-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Coupon {appliedCoupon.code} applied (-{appliedCoupon.discountPct}%)</span>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="text-slate-900 font-bold">₹{subtotal}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700">
                  <span>Student Coupon Discount ({appliedCoupon.discountPct}%)</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Local Delivery (Kamareddy)</span>
                <span>
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    <span className="text-slate-900 font-bold">₹{shippingFee}</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-store-primary text-xl">₹{grandTotal}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-4 text-sm shadow-md"
            >
              Proceed to Secure Checkout <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* Trust Assurances */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Print Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-store-primary shrink-0" />
                <span>Free Pick-up Available at Station Road</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
