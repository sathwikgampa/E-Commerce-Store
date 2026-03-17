import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const navigate = useNavigate();
  
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white p-16 rounded-3xl shadow-sm border border-stone-200 inline-block">
          <ShoppingBag className="w-20 h-20 text-stone-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-stone-900 mb-4">Your cart is empty</h2>
          <p className="text-stone-500 mb-8 max-w-sm mx-auto">Looks like you haven't added any books or items to your cart yet.</p>
          <Link to="/books" className="inline-flex items-center justify-center px-8 py-4 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 hover:shadow-md transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-stone-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
            <ul className="divide-y divide-stone-200">
              {items.map((item) => (
                <li key={item.product._id} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                  <div className="h-24 w-24 bg-stone-100 rounded-xl flex-shrink-0 flex items-center justify-center border border-stone-200">
                     {/* Image Placeholder */}
                     <ShoppingBag className="w-8 h-8 text-stone-300" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-stone-900">
                          <Link to={`/book/${item.product._id}`} className="hover:text-rose-600 transition-colors">
                            {item.product.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-stone-500">{item.product.author}</p>
                      </div>
                      <p className="text-lg font-bold text-stone-900">₹{item.product.price * item.quantity}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="px-3 py-1.5 text-stone-500 hover:bg-stone-100 transition"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="px-3 py-1.5 text-stone-500 hover:bg-stone-100 transition"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-stone-400 hover:text-rose-600 flex items-center text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="lg:w-96 flex-shrink-0">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 sticky top-24">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h2>
            <div className="space-y-4 text-stone-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-stone-900">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
            </div>
            <div className="border-t border-stone-200 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-stone-900">Total</span>
                <span className="text-3xl font-extrabold text-stone-900">₹{total}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full flex justify-center items-center px-8 py-4 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 hover:shadow-lg transition w-full"
            >
              Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
