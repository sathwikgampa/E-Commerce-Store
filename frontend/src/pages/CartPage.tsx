import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, BookOpen } from 'lucide-react';
import useCartStore from '../store/cartStore';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const navigate = useNavigate();
  
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-store-accent">
        <div className="bg-white p-12 sm:p-16 rounded-2xl shadow-xs border border-slate-200/80 inline-block max-w-md">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-slate-500 mb-8 max-w-sm mx-auto font-semibold">
            You haven't added any academic guides, notebooks, or student bags to your cart yet.
          </p>
          <Link to="/books" className="inline-flex items-center justify-center px-6 py-3.5 bg-store-primary hover:bg-store-primary-dark text-white font-bold rounded-xl shadow-xs transition min-h-[48px]">
            Continue Shopping Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-store-accent text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-store-primary">Shopping Cart</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Review your selected bookstore materials before finalizing pickup details.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Item Grid List */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item.product._id} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                  
                  {/* Visual wrapper */}
                  <div className="h-24 w-24 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-slate-200/50">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.title} className="h-16 w-auto object-contain drop-shadow-xs" />
                    ) : (
                      <BookOpen className="w-10 h-10 text-slate-300" />
                    )}
                  </div>

                  {/* Details block */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          <Link to={`/book/${item.product._id}`} className="hover:text-store-primary transition-colors">
                            {item.product.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">{item.product.author}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          {item.product.category}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-base font-black text-slate-900">₹{item.product.price * item.quantity}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">₹{item.product.price} each</p>
                      </div>
                    </div>
                    
                    {/* Quantity Selector and remove triggers */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                      
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="px-4 py-2.5 text-slate-500 hover:bg-slate-100 transition font-black min-h-[48px]"
                          aria-label="Decrease Quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="px-4 py-2.5 text-slate-500 hover:bg-slate-100 transition font-black min-h-[48px]"
                          aria-label="Increase Quantity"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-slate-400 hover:text-rose-600 flex items-center text-xs font-bold transition-colors min-h-[48px]"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </button>

                    </div>
                  </div>

                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Order Summary sidebar */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80 sticky top-24 space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Order Summary</h2>
            
            <div className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup / Delivery</span>
                <span className="text-emerald-600 font-bold">Free Pickup</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900">Total Amount</span>
                <span className="text-2xl font-black text-store-primary">₹{total}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full flex justify-center items-center px-6 py-4 bg-store-primary hover:bg-store-primary-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 text-xs uppercase tracking-wider min-h-[48px]"
            >
              Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4 text-white" />
            </button>

            <div className="pt-2 text-center">
              <Link to="/books" className="text-xs font-bold text-slate-500 hover:text-store-primary hover:underline min-h-[48px] inline-block pt-3">
                &larr; Continue Shopping
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
