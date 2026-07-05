import React, { useState } from 'react';
import { Package, Users, ShoppingBag, Plus, Search, Edit, Trash2, ShieldCheck, Clock, FileCheck } from 'lucide-react';
import { useProducts, useOrders } from '../../api/queries';
import { Product, Order } from '../../types';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [productSearch, setProductSearch] = useState('');
  
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useOrders();

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    // Modify status in localStorage mock for simulation
    const existingOrdersStr = localStorage.getItem('mock_admin_orders') || '[]';
    const existingOrders: Order[] = JSON.parse(existingOrdersStr);
    
    const updatedOrders = existingOrders.map((o) => 
      o._id === orderId ? { ...o, status: newStatus as any } : o
    );
    
    localStorage.setItem('mock_admin_orders', JSON.stringify(updatedOrders));
    refetchOrders();
    toast.success(`Order status updated to "${newStatus}"!`);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.author.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 text-left bg-[#F8FAFC] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
         <div>
           <h1 className="text-2xl sm:text-3xl font-black text-[#0A3D91] tracking-tight">Dashboard Overview</h1>
           <p className="text-xs text-slate-500 font-semibold mt-1">Monitor catalog items, process local student pickups, and view statistics.</p>
         </div>
         <span className="text-xs font-bold bg-[#EAF3FF] text-[#0A3D91] border border-blue-150 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
           Owner Portal: Sri Thirumala
         </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         
         {/* Products count */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between group hover:border-[#0A3D91]/30 transition-colors">
            <div>
              <p className="text-[10px] font-bold text-slate-550 uppercase tracking-wide">Total Products</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{products.length}</p>
            </div>
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package className="w-6 h-6" />
            </div>
         </div>
         
         {/* Orders count */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between group hover:border-[#0A3D91]/30 transition-colors">
            <div>
              <p className="text-[10px] font-bold text-slate-550 uppercase tracking-wide">Recent Orders</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{orders.length}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
         </div>

         {/* Customers mock count */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between group hover:border-[#0A3D91]/30 transition-colors">
            <div>
              <p className="text-[10px] font-bold text-slate-550 uppercase tracking-wide">Active Customers</p>
              <p className="text-3xl font-black text-slate-900 mt-2">18</p>
            </div>
            <div className="w-14 h-14 bg-amber-50 text-[#D4AF37] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
         </div>

      </div>

      {/* Tabs list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex gap-8">
          <button 
            onClick={() => setActiveTab('products')}
            className={`font-bold pb-4 -mb-4 text-xs uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'products' ? 'border-[#0A3D91] text-[#0A3D91]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Manage Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`font-bold pb-4 -mb-4 text-xs uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'orders' ? 'border-[#0A3D91] text-[#0A3D91]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Recent Orders ({orders.length})
          </button>
        </div>
        
        <div className="p-6">
           {activeTab === 'products' ? (
             <div>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-450" />
                    <input 
                      type="text" 
                      placeholder="Search store inventory..." 
                      className="pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-[#0A3D91] text-xs font-semibold w-full bg-[#F8FAFC] focus:bg-white" 
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>
                  <button className="flex items-center px-5.5 py-3 bg-[#0A3D91] hover:bg-[#082C6C] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shrink-0">
                    <Plus className="w-4 h-4 mr-1.5 text-accent text-[#D4AF37]" /> Add Book
                  </button>
                </div>
                
                {productsLoading ? (
                  <p className="text-xs text-slate-550">Loading products database...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                          <th className="p-4 rounded-l-xl">Product Name</th>
                          <th className="p-4">Author</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Stock status</th>
                          <th className="p-4 rounded-r-xl text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
                         {filteredProducts.map(p => (
                           <tr key={p._id} className="hover:bg-slate-50/50 transition">
                              <td className="p-4 font-bold text-slate-900 max-w-[280px] truncate">{p.title}</td>
                              <td className="p-4 text-slate-500">{p.author}</td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-700">{p.category}</span>
                              </td>
                              <td className="p-4 font-bold text-slate-900">₹{p.price}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                                  p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                }`}>
                                  <span className={`w-1 h-1 rounded-full ${p.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                  {p.inStock ? 'In Stock' : 'Out'}
                                </span>
                              </td>
                              <td className="p-4 flex gap-2 justify-end">
                                 <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit className="w-4 h-4" /></button>
                                 <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                    </table>
                  </div>
                )}
             </div>
           ) : (
             <div>
                {ordersLoading ? (
                  <p className="text-xs text-slate-550">Loading orders list...</p>
                ) : orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                          <th className="p-4 rounded-l-xl">Order ID</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Total Bill</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 rounded-r-xl text-right">Method</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
                         {orders.map(o => (
                           <tr key={o._id} className="hover:bg-slate-50/50 transition">
                              <td className="p-4 font-bold text-slate-900">{o._id}</td>
                              <td className="p-4 text-slate-900">{o.name}</td>
                              <td className="p-4 text-slate-500">{o.phone}</td>
                              <td className="p-4 font-bold text-slate-900">₹{o.totalAmount}</td>
                              <td className="p-4">
                                <div className="relative inline-block">
                                  <select 
                                    className={`px-3 py-1.5 text-[9px] font-black rounded-lg border-2 appearance-none cursor-pointer outline-none focus:ring-4 focus:ring-opacity-20 ${
                                      o.status === 'Delivered' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 
                                      o.status === 'Confirmed' ? 'border-blue-200 bg-blue-50 text-blue-800' :
                                      'border-amber-200 bg-amber-50 text-amber-800'
                                    }`}
                                    value={o.status}
                                    onChange={(e) => handleUpdateOrderStatus(o._id!, e.target.value)}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                 <span className="px-2.5 py-1 text-[9px] font-black uppercase rounded bg-slate-100 text-slate-700">
                                   {o.paymentMethod}
                                 </span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-[#F8FAFC] border border-slate-200 border-dashed rounded-xl">
                    <ShoppingBag className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                    <h3 className="text-sm font-bold text-slate-800">No Orders Submitted Yet</h3>
                    <p className="text-[10px] text-slate-550 mt-1">Submit a checkout cart in the frontend to view orders here.</p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
