import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const Navbar = () => {
  const items = useCartStore((state) => state.items) || [];
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-white text-2xl">auto_stories</span>
            </div>
            <span className="text-xl font-black tracking-tight text-charcoal dark:text-white">EduStore</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-semibold text-charcoal hover:text-primary dark:text-slate-200 dark:hover:text-primary transition-colors" to="/books?category=Textbooks">Textbooks</Link>
            <Link className="text-sm font-semibold text-charcoal hover:text-primary dark:text-slate-200 dark:hover:text-primary transition-colors" to="/books?category=Stationery">Stationery</Link>
            <Link className="text-sm font-semibold text-charcoal hover:text-primary dark:text-slate-200 dark:hover:text-primary transition-colors" to="/books?category=Exams">Exams</Link>
            <Link className="text-sm font-semibold text-charcoal hover:text-primary dark:text-slate-200 dark:hover:text-primary transition-colors" to="/contact">Contact</Link>
          </nav>
          
          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-1.5 border border-transparent focus-within:border-primary/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
              <input className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-48 placeholder:text-slate-400" placeholder="Search resources..." type="text"/>
            </div>
            <Link to="/cart" className="p-2 text-charcoal dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative block">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <Link to="/login" className="p-2 text-charcoal dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors block">
              <span className="material-symbols-outlined">person</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
