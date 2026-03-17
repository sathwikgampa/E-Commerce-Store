import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, BookOpen } from 'lucide-react';
import useCartStore from '../store/cartStore'; // will create later

const Navbar = () => {
  const items = useCartStore((state) => state.items) || [];
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-12 2xl:px-24">
        <div className="flex justify-between items-center py-3 md:py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-rose-600" />
              <span className="font-bold text-lg md:text-xl text-stone-800">
                E-Commerce Store
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-stone-600 hover:text-rose-600 font-medium transition-colors">Home</Link>
            <Link to="/books" className="text-stone-600 hover:text-rose-600 font-medium transition-colors">Catalog</Link>
            <Link to="/contact" className="text-stone-600 hover:text-rose-600 font-medium transition-colors">Contact</Link>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            <button className="text-stone-500 hover:text-rose-600 p-2">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/cart" className="text-stone-500 hover:text-rose-600 p-2 relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-red-100 bg-rose-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <div className="hidden md:flex items-center space-x-3 border-l border-stone-200 pl-6 ml-2">
              <Link to="/admin/login" className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors">
                Admin
              </Link>
              <Link 
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
                >
                User Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
