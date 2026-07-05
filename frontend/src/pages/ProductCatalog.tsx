import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, AlertCircle } from 'lucide-react';
import { useProducts } from '../api/queries';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import useWishlistStore from '../store/wishlistStore';

const categories = [
  'All', 
  'Textbooks', 
  'Notebooks', 
  'School Supplies', 
  'Engineering Materials', 
  'Question Banks', 
  'Competitive Exam Books', 
  'School Bags', 
  'College Bags'
];

const ProductCatalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products = [], isLoading, error } = useProducts();
  const wishlistItems = useWishlistStore((state) => state.items);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Sync URL search params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const wishlistParam = searchParams.get('wishlist');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }

    if (searchParam) {
      setSearchTerm(searchParam);
    } else {
      setSearchTerm('');
    }

    if (wishlistParam === 'true') {
      setShowOnlyWishlist(true);
    } else {
      setShowOnlyWishlist(false);
    }
  }, [searchParams]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    newParams.delete('wishlist');
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleToggleWishlistOnly = () => {
    const newParams = new URLSearchParams(searchParams);
    if (!showOnlyWishlist) {
      newParams.set('wishlist', 'true');
      newParams.delete('category');
    } else {
      newParams.delete('wishlist');
    }
    setSearchParams(newParams);
  };

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  // Filter items
  const baseProducts = showOnlyWishlist ? wishlistItems : products;
  const filteredProducts = baseProducts.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' ? true : p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left bg-[#F8FAFC]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary text-[#0A3D91]">
          {showOnlyWishlist ? 'My Book Wishlist' : 'Store Catalog'}
        </h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          {showOnlyWishlist 
            ? 'Your collection of items marked as favorites.' 
            : `Discover ${products.length} genuine academic textbooks and stationery tools in Kamareddy.`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar / Filters */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 space-y-6">
            
            {/* Filter title */}
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3.5 border-b border-slate-100">
                <Filter className="w-4.5 h-4.5 text-primary text-[#0A3D91]" /> Filters
              </h2>
            </div>

            {/* Custom Wishlist Toggle */}
            <div>
              <button 
                onClick={handleToggleWishlistOnly}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  showOnlyWishlist 
                    ? 'bg-rose-50 border-rose-200 text-rose-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                <span>Show Favorites Only</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md shadow-xs border border-inherit">
                  {wishlistItems.length}
                </span>
              </button>
            </div>

            {/* Categories list selection */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-xs text-slate-805 uppercase tracking-wider">Categories</h3>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                        selectedCategory === cat && !showOnlyWishlist
                          ? 'bg-[#EAF3FF] text-[#0A3D91] font-extrabold border-l-3 border-[#0A3D91]' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>

        {/* Main Products Feed */}
        <div className="flex-1 space-y-6">
          
          {/* Search box overlay */}
          <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center">
            <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
            <input 
              type="text" 
              placeholder="Search by publication name, author, class, or title..." 
              className="w-full pl-3 pr-4 py-1.5 bg-transparent border-none outline-none focus:ring-0 text-xs text-slate-800 font-semibold placeholder:text-slate-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
              <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Failed to load catalog products</h3>
              <p className="text-xs text-slate-500 mt-1">Please check your network and try again.</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onQuickView={openQuickView} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No study materials match your filters</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting the filters or typing a different keyword search.</p>
            </div>
          )}
        </div>

      </div>

      {/* Quick View Dialog Overlay */}
      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </div>
  );
};

export default ProductCatalog;
