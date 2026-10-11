import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  BookOpen, 
  AlertCircle, 
  X, 
  SlidersHorizontal, 
  Star, 
  RotateCcw,
  Check,
  Building2,
  Tag
} from 'lucide-react';
import { useProducts } from '../api/queries';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import useWishlistStore from '../store/wishlistStore';

const CATEGORIES = [
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

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating-high' | 'title-az';

const ProductCatalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products = [], isLoading, error } = useProducts();
  const wishlistItems = useWishlistStore((state) => state.items);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSupplier, setSelectedSupplier] = useState('All');
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Extract unique publishers/suppliers from product catalog
  const suppliers = useMemo(() => {
    const pubSet = new Set<string>();
    products.forEach((p) => {
      if (p.publisher) {
        pubSet.add(p.publisher);
      }
    });
    return ['All', ...Array.from(pubSet)];
  }, [products]);

  // Sync URL search params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const supplierParam = searchParams.get('supplier');
    const wishlistParam = searchParams.get('wishlist');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }

    if (supplierParam) {
      setSelectedSupplier(supplierParam);
    } else {
      setSelectedSupplier('All');
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

  const updateParam = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    updateParam('category', cat);
    if (showOnlyWishlist) {
      setShowOnlyWishlist(false);
      updateParam('wishlist', null);
    }
  };

  const handleSupplierClick = (supplier: string) => {
    setSelectedSupplier(supplier);
    updateParam('supplier', supplier);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    updateParam('search', val.trim() ? val : null);
  };

  const handleToggleWishlistOnly = () => {
    const nextState = !showOnlyWishlist;
    setShowOnlyWishlist(nextState);
    const newParams = new URLSearchParams(searchParams);
    if (nextState) {
      newParams.set('wishlist', 'true');
      newParams.delete('category');
      setSelectedCategory('All');
    } else {
      newParams.delete('wishlist');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSupplier('All');
    setSearchTerm('');
    setPriceRange(2000);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy('featured');
    setShowOnlyWishlist(false);
    setSearchParams(new URLSearchParams());
  };

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  // Base list of items
  const baseProducts = showOnlyWishlist ? wishlistItems : products;

  // Filter products by keyword, category, supplier, price, stock, and rating
  const filteredProducts = useMemo(() => {
    return baseProducts.filter((p) => {
      // Keyword search across title, author, publisher, ISBN, and description
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query || (
        p.title.toLowerCase().includes(query) || 
        p.author.toLowerCase().includes(query) ||
        (p.publisher && p.publisher.toLowerCase().includes(query)) ||
        (p.isbn && p.isbn.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query)
      );

      // Category filter
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

      // Supplier / Publisher filter
      const matchesSupplier = selectedSupplier === 'All' || p.publisher === selectedSupplier;

      // Price filter
      const matchesPrice = p.price <= priceRange;

      // Stock status filter
      const matchesStock = !inStockOnly || p.inStock;

      // Rating filter
      const matchesRating = p.rating >= minRating;

      return matchesSearch && matchesCategory && matchesSupplier && matchesPrice && matchesStock && matchesRating;
    });
  }, [baseProducts, searchTerm, selectedCategory, selectedSupplier, priceRange, inStockOnly, minRating]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'rating-high':
        return list.sort((a, b) => b.rating - a.rating);
      case 'title-az':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'featured':
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    selectedSupplier !== 'All' || 
    searchTerm.trim().length > 0 || 
    inStockOnly || 
    minRating > 0 || 
    priceRange < 2000 || 
    showOnlyWishlist;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left bg-store-accent min-h-screen">
      
      {/* Catalog Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-black tracking-widest text-store-primary uppercase">Authorised Bookstore Inventory</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1 font-serif">
            {showOnlyWishlist ? 'Saved Wishlist Items' : 'Academic Textbooks & Supplies'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            {showOnlyWishlist 
              ? `You have saved ${wishlistItems.length} books and materials.` 
              : `Showing genuine academic books, guides, and student supplies available in Kamareddy.`}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="catalog-sort" className="text-xs font-bold text-slate-650 shrink-0">Sort By:</label>
          <select
            id="catalog-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-store-primary/30 shadow-xs"
          >
            <option value="featured">Featured / Best Match</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating-high">Highest Rated (★)</option>
            <option value="title-az">Alphabetical (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filters Toggle Button */}
        <div className="lg:hidden w-full">
          <button 
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-800 min-h-[48px] shadow-xs"
            aria-expanded={mobileFiltersOpen}
          >
            <SlidersHorizontal className="w-4 h-4 text-store-primary" />
            {mobileFiltersOpen ? 'Hide Filters & Categories' : 'Filter Books & Suppliers'}
          </button>
        </div>

        {/* Sidebar / Filters Column */}
        <aside className={`w-full lg:w-72 shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-24 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200/90 space-y-6">
            
            {/* Header with Reset */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4.5 h-4.5 text-store-primary" /> Refine Catalog
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Custom Wishlist Toggle */}
            <div>
              <button 
                onClick={handleToggleWishlistOnly}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  showOnlyWishlist 
                    ? 'bg-rose-50 border-rose-200 text-rose-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>View My Wishlist</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md shadow-xs border border-inherit font-black">
                  {wishlistItems.length}
                </span>
              </button>
            </div>

            {/* In-Stock Only Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-store-primary rounded border-slate-300 focus:ring-store-primary"
                />
                <span>In Stock Items Only</span>
              </label>
            </div>

            {/* Categories list */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-store-primary" /> Categories
              </h3>
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        selectedCategory === cat && !showOnlyWishlist
                          ? 'bg-store-primary text-white font-extrabold shadow-xs' 
                          : 'text-slate-650 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Publishers / Suppliers Filter */}
            {suppliers.length > 1 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-store-primary" /> Publishers &amp; Brands
                </h3>
                <div className="max-h-44 overflow-y-auto space-y-1 styled-scrollbar pr-1">
                  {suppliers.map((supplier) => (
                    <button
                      key={supplier}
                      onClick={() => handleSupplierClick(supplier)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold truncate transition-colors ${
                        selectedSupplier === supplier
                          ? 'bg-store-accent-dark text-store-primary font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      title={supplier}
                    >
                      {supplier === 'All' ? 'All Publishers' : supplier}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Max Price Range Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-900 uppercase tracking-wider">Max Price</span>
                <span className="text-store-primary font-black">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="50"
                max="2500"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-store-primary cursor-pointer"
                aria-label="Filter by maximum price"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>₹50</span>
                <span>₹2,500</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="block font-bold text-xs text-slate-900 uppercase tracking-wider">Customer Rating</span>
              <div className="flex items-center gap-1.5">
                {[0, 3, 4, 4.5].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      minRating === stars
                        ? 'bg-store-primary text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {stars === 0 ? 'All' : `${stars}★+`}
                  </button>
                ))}
              </div>
            </div>
            
          </div>
        </aside>

        {/* Main Catalog Feed */}
        <main className="flex-1 space-y-6">
          
          {/* Search Box Input */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-slate-200/90 flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
            <input 
              type="search" 
              placeholder="Search by publication name, author, class, supplier, ISBN..." 
              className="w-full px-2 py-1.5 bg-transparent border-none outline-none focus:ring-0 text-xs sm:text-sm text-slate-800 font-medium placeholder:text-slate-400"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search catalog materials"
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); updateParam('search', null); }}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-400">Active Filters:</span>
              
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 shadow-xs text-slate-700">
                  Search: "{searchTerm}"
                  <button onClick={() => { setSearchTerm(''); updateParam('search', null); }}><X className="w-3 h-3 text-slate-400 hover:text-slate-600" /></button>
                </span>
              )}

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-store-primary text-white shadow-xs">
                  Category: {selectedCategory}
                  <button onClick={() => handleCategoryClick('All')}><X className="w-3 h-3 text-white/80 hover:text-white" /></button>
                </span>
              )}

              {selectedSupplier !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-white shadow-xs">
                  Supplier: {selectedSupplier}
                  <button onClick={() => handleSupplierClick('All')}><X className="w-3 h-3 text-white/80 hover:text-white" /></button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3 text-emerald-600" /></button>
                </span>
              )}

              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Rating: {minRating}★+
                  <button onClick={() => setMinRating(0)}><X className="w-3 h-3 text-amber-600" /></button>
                </span>
              )}

              {priceRange < 2000 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 shadow-xs text-slate-700">
                  Max: ₹{priceRange}
                  <button onClick={() => setPriceRange(2000)}><X className="w-3 h-3 text-slate-400" /></button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-store-primary hover:underline ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Summary Counter */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>Showing <strong className="text-slate-900">{sortedProducts.length}</strong> items</span>
            {sortedProducts.length > 0 && (
              <span className="text-slate-400 text-[11px]">Authorized stock verified</span>
            )}
          </div>

          {/* Product Grid / Loading / Empty States */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl p-8">
              <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Failed to load catalog products</h3>
              <p className="text-xs text-slate-500 mt-1">Please check your connection and try refreshing.</p>
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onQuickView={openQuickView} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-200/90 rounded-2xl p-8 space-y-4">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto" />
              <h3 className="text-xl font-black text-slate-900 font-serif">No study materials matched your criteria</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                We couldn't find any items matching your selected keywords, category, or publisher. Try clearing your filters to explore our full selection.
              </p>
              <button
                onClick={clearAllFilters}
                className="btn-primary"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>

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
