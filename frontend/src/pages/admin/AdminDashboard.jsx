import React, { useState } from 'react';
import { Package, Users, ShoppingBag, Plus, Search, Edit, Trash2 } from 'lucide-react';

// Dummy
const dummyProducts = [
  { _id: '1', title: 'NCERT Physics Class 12', author: 'NCERT', price: 250, category: 'School Books', inStock: true },
  { _id: '2', title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', price: 650, category: 'Competitive Exams', inStock: true }
];

const dummyOrders = [
  { _id: 'ORD-2023-01', customerName: 'Ramesh Konga', total: 650, status: 'Pending', date: 'Oct 24, 2023' },
  { _id: 'ORD-2023-02', customerName: 'Suresh Babu', total: 1250, status: 'Delivered', date: 'Oct 23, 2023' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Dashboard Overview</h1>
         <span className="text-stone-500">Welcome back, Admin</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between group hover:border-rose-300 transition-colors">
            <div>
              <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide">Total Products</p>
              <p className="text-4xl font-black text-stone-900 mt-2">124</p>
            </div>
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-8 h-8" />
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between group hover:border-rose-300 transition-colors">
            <div>
              <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide">Total Orders</p>
              <p className="text-4xl font-black text-stone-900 mt-2">48</p>
            </div>
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-8 h-8" />
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between group hover:border-rose-300 transition-colors">
            <div>
              <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide">Total Customers</p>
              <p className="text-4xl font-black text-stone-900 mt-2">312</p>
            </div>
            <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="border-b border-stone-200 px-6 py-4 flex gap-8">
          <button 
            onClick={() => setActiveTab('products')}
            className={`font-semibold pb-4 -mb-4 border-b-2 transition-all ${activeTab === 'products' ? 'border-rose-600 text-rose-600' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
          >
            Manage Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`font-semibold pb-4 -mb-4 border-b-2 transition-all ${activeTab === 'orders' ? 'border-rose-600 text-rose-600' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
          >
            Recent Orders
          </button>
        </div>
        
        <div className="p-6">
           {activeTab === 'products' ? (
             <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                    <input type="text" placeholder="Search products..." className="pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 w-80" />
                  </div>
                  <button className="flex items-center px-4 py-2.5 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition">
                    <Plus className="w-5 h-5 mr-2" /> Add New Book
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 text-stone-600 text-sm font-medium">
                        <th className="p-4 rounded-tl-xl">Product Name</th>
                        <th className="p-4">Author</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 rounded-tr-xl text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                       {dummyProducts.map(p => (
                         <tr key={p._id} className="hover:bg-stone-50/50 transition">
                            <td className="p-4 font-medium text-stone-900">{p.title}</td>
                            <td className="p-4 text-stone-600">{p.author}</td>
                            <td className="p-4 text-stone-600">
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-stone-100 text-stone-700">{p.category}</span>
                            </td>
                            <td className="p-4 font-medium text-stone-900">₹{p.price}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${p.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {p.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="p-4 flex gap-2 justify-end">
                               <button className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit className="w-5 h-5" /></button>
                               <button className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"><Trash2 className="w-5 h-5" /></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
             </div>
           ) : (
             <div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 text-stone-600 text-sm font-medium">
                        <th className="p-4 rounded-tl-xl">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 rounded-tr-xl text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                       {dummyOrders.map(o => (
                         <tr key={o._id} className="hover:bg-stone-50/50 transition">
                            <td className="p-4 font-medium text-stone-900">{o._id}</td>
                            <td className="p-4 text-stone-600">{o.customerName}</td>
                            <td className="p-4 text-stone-600">{o.date}</td>
                            <td className="p-4 font-bold text-stone-900">₹{o.total}</td>
                            <td className="p-4">
                              <select 
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 appearance-none cursor-pointer outline-none focus:ring-4 focus:ring-opacity-20 ${
                                  o.status === 'Delivered' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 focus:ring-emerald-500' : 
                                  o.status === 'Pending' ? 'border-amber-200 bg-amber-50 text-amber-800 focus:ring-amber-500' : 
                                  'border-stone-200 bg-stone-50 text-stone-800'
                                }`}
                                defaultValue={o.status}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                               <button className="text-rose-600 font-semibold text-sm hover:text-rose-700">View Details</button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
