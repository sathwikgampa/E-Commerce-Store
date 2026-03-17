import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ShoppingCart, Truck, Shield, ArrowLeft, Heart } from 'lucide-react';
import useCartStore from '../store/cartStore';

// Dummy
const dummyProducts = [
  { _id: '1', title: 'NCERT Physics Class 12', author: 'NCERT', price: 250, category: 'School Books', inStock: true, image: '', description: 'Comprehensive physics textbook for class 12 students covering electromagnetism, optics, and modern physics according to the latest CBSE syllabus.' },
  { _id: '2', title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', price: 650, category: 'Competitive Exams', inStock: true, image: '', description: 'The ultimate guide for quantitative aptitude, useful for Bank PO, SBI-PO, IBPS, RBI exams.' }
];

const ProductDetail = () => {
  const { id } = useParams();
  const product = dummyProducts.find(p => p._id === id) || dummyProducts[0]; // fallback
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/books" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
      </Link>
      
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="bg-stone-50 p-12 flex justify-center items-center border-b md:border-b-0 md:border-r border-stone-200 min-h-[400px]">
            {product.image ? (
               <img src={product.image} alt={product.title} className="max-w-full h-auto object-contain rounded-xl shadow-lg" />
            ) : (
               <BookOpen className="w-48 h-48 text-stone-300" />
            )}
          </div>
          
          {/* Details */}
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-bold tracking-wider text-rose-600 uppercase">{product.category}</span>
                <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-stone-900">{product.title}</h1>
                <p className="mt-2 text-lg text-stone-500">By {product.author}</p>
              </div>
              <button className="text-stone-400 hover:text-rose-500 p-2 rounded-full hover:bg-stone-100 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mt-8 flex items-end gap-4">
              <span className="text-4xl font-bold text-stone-900">₹{product.price}</span>
            </div>
            
            <p className="mt-6 text-base text-stone-600 leading-relaxed">
              {product.description}
            </p>
            
            <div className="mt-8 space-y-4 pt-8 border-t border-stone-200">
              <div className="flex items-center text-stone-700">
                <Shield className="w-5 h-5 text-emerald-500 mr-3" />
                <span>100% Original Product</span>
              </div>
              <div className="flex items-center text-stone-700">
                <Truck className="w-5 h-5 text-emerald-500 mr-3" />
                <span>Fast Delivery or Store Pickup locally</span>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-stone-300 rounded-xl px-2 py-1 flex-shrink-0 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-stone-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => addToCart(product, quantity)}
                disabled={!product.inStock}
                className="flex-1 flex justify-center items-center px-8 py-4 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 hover:shadow-lg transition disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
