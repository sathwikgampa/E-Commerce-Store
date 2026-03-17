import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen } from 'lucide-react';
import useCartStore from '../store/cartStore';

// Dummy Data
const dummyProducts = [
  { _id: '1', title: 'NCERT Physics Class 12', author: 'NCERT', price: 250, category: 'School Books', inStock: true, image: '' },
  { _id: '2', title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', price: 650, category: 'Competitive Exams', inStock: true, image: '' },
  { _id: '3', title: 'B.Tech Engineering Mathematics', author: 'B.S. Grewal', price: 890, category: 'College Books', inStock: true, image: '' },
  { _id: '4', title: 'Premium Note Book - 200 Pages', author: 'Classmate', price: 65, category: 'Stationery', inStock: true, image: '' },
  { _id: '5', title: 'TS TET Study Material', author: 'Telugu Academy', price: 450, category: 'Competitive Exams', inStock: true, image: '' },
  { _id: '6', title: 'Wireless Keyboard & Mouse', author: 'Logitech', price: 1250, category: 'Computer Accessories', inStock: false, image: '' },
];

const categories = ['All', 'School Books', 'College Books', 'Competitive Exams', 'Stationery', 'Computer Accessories'];

const ProductCatalog = () => {
  const [products, setProducts] = useState(dummyProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const addToCart = useCartStore((state) => state.addToCart);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' ? true : p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" /> Filters
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-stone-700 mb-2">Categories</h3>
                <ul className="space-y-2">
                  {categories.map(cat => (
                    <li key={cat}>
                      <button 
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? 'bg-rose-50 text-rose-700 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6 flex items-center">
            <Search className="w-5 h-5 text-stone-400 ml-2" />
            <input 
              type="text" 
              placeholder="Search by title or author..." 
              className="w-full pl-3 pr-4 py-2 bg-transparent border-none outline-none focus:ring-0 text-stone-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col group">
                <Link to={`/book/${product._id}`} className="block h-56 bg-stone-100 p-6 flex justify-center items-center overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="max-h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <BookOpen className="h-20 w-20 text-stone-300 group-hover:scale-110 transition-transform" />
                  )}
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-xs font-medium text-rose-600 mb-2">{product.category}</span>
                  <Link to={`/book/${product._id}`}>
                    <h3 className="font-semibold text-lg text-stone-900 line-clamp-2 hover:text-rose-600 transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-stone-500 mt-1">{product.author}</p>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-bold text-xl text-stone-900">₹{product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${product.inStock ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-900">No products found</h3>
              <p className="text-stone-500 mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductCatalog;
