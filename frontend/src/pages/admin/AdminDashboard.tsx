import React, { useState } from 'react';
import { toast } from 'sonner';
import { useProducts, useOrders } from '../../api/queries';
import { Product, Order } from '../../types';
import { 
  VenkateshwaraNamamIcon, 
  VenkateshwaraFullEmblem, 
  ShankhaIcon, 
  ChakraIcon, 
  PadmamIcon, 
  KireetamIcon 
} from '../../components/icons/VenkateshwaraIcons';

type TabType = 'pickups' | 'products' | 'orders';
type ViewMode = 'list' | 'grid';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pickups');
  const [productViewMode, setProductViewMode] = useState<ViewMode>('list');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals state
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [selectedOrderForPickup, setSelectedOrderForPickup] = useState<Order | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifiedItemsCheck, setVerifiedItemsCheck] = useState<Record<string, boolean>>({});

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    author: '',
    publisher: '',
    category: 'Textbooks',
    price: '',
    stock: '',
    isbn: '',
    description: '',
  });

  const { data: initialProducts = [], isLoading: productsLoading } = useProducts();
  const { data: initialOrders = [], isLoading: ordersLoading, refetch: refetchOrders } = useOrders();

  // Local state for products so admins can dynamically add books
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const allProducts = [...customProducts, ...initialProducts];

  // Orders data with local storage sync for real-time pickup status
  const orders = React.useMemo(() => {
    const stored = localStorage.getItem('mock_admin_orders');
    if (stored) {
      try {
        const parsed: Order[] = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        // ignore
      }
    }
    return initialOrders;
  }, [initialOrders]);

  // Pending pickups queue
  const pendingPickups = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Confirmed'
  );

  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  // Search filtered lists
  const filteredProducts = allProducts.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.author.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.publisher && p.publisher.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const filteredOrders = orders.filter((o) =>
    (o.name && o.name.toLowerCase().includes(orderSearch.toLowerCase())) ||
    (o.phone && o.phone.includes(orderSearch)) ||
    (o._id && o._id.toLowerCase().includes(orderSearch.toLowerCase()))
  );

  // Handle Order Status Update
  const updateOrderStatus = (orderId: string, newStatus: 'Pending' | 'Confirmed' | 'Delivered') => {
    const existingOrdersStr = localStorage.getItem('mock_admin_orders') || JSON.stringify(orders);
    const existingOrders: Order[] = JSON.parse(existingOrdersStr);

    const updated = existingOrders.map((o) =>
      o._id === orderId ? { ...o, status: newStatus } : o
    );

    localStorage.setItem('mock_admin_orders', JSON.stringify(updated));
    refetchOrders();
    toast.success(`Order #${orderId} marked as "${newStatus}"!`);
  };

  // Open In-Store Customer Pickup Verification Modal
  const openPickupVerificationModal = (order: Order) => {
    setSelectedOrderForPickup(order);
    setVerificationCode('');
    // Initialize item checklist
    const initialChecks: Record<string, boolean> = {};
    order.items.forEach((item, idx) => {
      initialChecks[`${idx}`] = true;
    });
    setVerifiedItemsCheck(initialChecks);
    setIsPickupModalOpen(true);
  };

  // Complete Customer Pickup
  const handleConfirmPickup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForPickup) return;

    if (!verificationCode.trim()) {
      toast.error('Please input customer verification code or phone confirmation digits.');
      return;
    }

    const orderId = selectedOrderForPickup._id!;
    const existingOrdersStr = localStorage.getItem('mock_admin_orders') || JSON.stringify(orders);
    const existingOrders: Order[] = JSON.parse(existingOrdersStr);

    const updated = existingOrders.map((o) =>
      o._id === orderId
        ? {
            ...o,
            status: 'Delivered' as const,
            pickupVerifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            verifiedBy: 'Store Manager (Kamareddy)',
          }
        : o
    );

    localStorage.setItem('mock_admin_orders', JSON.stringify(updated));
    refetchOrders();
    setIsPickupModalOpen(false);
    toast.success(`🎉 Pickup Verified! Order #${orderId} delivered to ${selectedOrderForPickup.name}.`, {
      description: 'Physical handover recorded and receipt confirmation logged.',
    });
  };

  // Handle Add Product
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title.trim() || !newProduct.price) {
      toast.error('Please provide Title and Price.');
      return;
    }

    const created: Product = {
      _id: `book-${Date.now().toString().slice(-5)}`,
      title: newProduct.title.trim(),
      author: newProduct.author.trim() || 'Academic Editorial Board',
      publisher: newProduct.publisher.trim() || 'Sri Thirumala Press',
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      originalPrice: Math.round(parseFloat(newProduct.price) * 1.15),
      inStock: true,
      stock: parseInt(newProduct.stock || '25', 10),
      rating: 4.8,
      isbn: newProduct.isbn.trim() || '978-81-7450-999-0',
      description: newProduct.description.trim() || 'Standard curriculum guide stocked at Station Road, Kamareddy.',
      image: '/images/products/ncert-maths-10.jpg',
    };

    setCustomProducts([created, ...customProducts]);
    setIsAddProductModalOpen(false);
    setNewProduct({
      title: '',
      author: '',
      publisher: '',
      category: 'Textbooks',
      price: '',
      stock: '',
      isbn: '',
      description: '',
    });
    toast.success(`Added publication "${created.title}" to store inventory!`);
  };

  return (
    <div className="p-4 sm:p-8 bg-[#F4F8FB] min-h-screen text-left space-y-8 font-sans">
      
      {/* ── 1. Page Header with Lord Venkateshwara Swamy Tri-Emblem ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-[#87CEEB]/40 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF9800]">
              Sri Thirumala Book Seller &amp; Stationery
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B192C] tracking-tight">
            Admin Master Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time management for Station Road branch inventory, academic books, and local student pickup fulfillment.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#2196F3] hover:bg-[#1976D2] active:bg-[#0D47A1] text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            <PadmamIcon className="w-4 h-4 text-white" />
            <span>+ Add New Publication</span>
          </button>

          <button
            onClick={() => {
              if (pendingPickups.length > 0) {
                openPickupVerificationModal(pendingPickups[0]);
              } else {
                toast.info('No pending pickups in queue right now.');
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF9800] hover:bg-[#F57C00] text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition"
          >
            <ChakraIcon className="w-4 h-4 text-slate-950" />
            <span>Verify Next Customer Pickup</span>
          </button>
        </div>
      </div>

      {/* ── 2. Bootstrap/Material-UI Grid: 16:9 Aspect Proportional Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Pending Customer Pickups */}
        <div className="bg-white p-6 rounded-3xl border-2 border-[#87CEEB]/60 shadow-xs flex flex-col justify-between hover:border-[#2196F3] transition group aspect-[16/9]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF9800]">
                Awaiting Collection
              </span>
              <p className="text-3xl sm:text-4xl font-black text-[#0B192C] mt-1">
                {pendingPickups.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#FFF3E0] rounded-2xl flex items-center justify-center border border-[#FFE0B2]">
              <ChakraIcon className="w-6 h-6 text-[#FF9800]" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
            <span>In-Store Pickups</span>
            <span className="text-[#FF9800]">{pendingPickups.length > 0 ? 'Action Required' : 'All Clear'}</span>
          </div>
        </div>

        {/* Card 2: Total Active Publications */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-[#2196F3] transition group aspect-[16/9]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2196F3]">
                Catalog Volume
              </span>
              <p className="text-3xl sm:text-4xl font-black text-[#0B192C] mt-1">
                {allProducts.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#E3F2FD] rounded-2xl flex items-center justify-center border border-[#87CEEB]">
              <ShankhaIcon className="w-6 h-6 text-[#2196F3]" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
            <span>Active Titles &amp; Bags</span>
            <span className="text-[#2196F3]">In Stock</span>
          </div>
        </div>

        {/* Card 3: Orders Completed */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-[#2196F3] transition group aspect-[16/9]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                Fulfilled Orders
              </span>
              <p className="text-3xl sm:text-4xl font-black text-[#0B192C] mt-1">
                {deliveredCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-200">
              <VenkateshwaraNamamIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
            <span>Delivered &amp; Picked Up</span>
            <span className="text-emerald-600 font-bold">100% Verified</span>
          </div>
        </div>

        {/* Card 4: Total Book Sales Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-[#2196F3] transition group aspect-[16/9]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Total Transaction Volume
              </span>
              <p className="text-3xl sm:text-4xl font-black text-[#0B192C] mt-1">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200">
              <PadmamIcon className="w-6 h-6 text-[#FF9800]" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
            <span>Kamareddy Local Orders</span>
            <span className="text-[#2196F3]">Direct Store Value</span>
          </div>
        </div>

      </div>

      {/* ── 3. Tabs Navigation: Customer Pickups | Manage Products | All Orders ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* Tab Headers Styled with Themed Blue Palette */}
        <div className="border-b border-slate-200 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 bg-[#F8FAFC]">
          
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            {/* Tab 1: Pickups */}
            <button
              onClick={() => setActiveTab('pickups')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pickups'
                  ? 'bg-[#2196F3] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <ChakraIcon className={`w-4 h-4 ${activeTab === 'pickups' ? 'text-white' : 'text-[#2196F3]'}`} />
              <span>Customer Pickups Verification</span>
              {pendingPickups.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FF9800] text-slate-950 text-[10px] font-black">
                  {pendingPickups.length}
                </span>
              )}
            </button>

            {/* Tab 2: Products */}
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-[#2196F3] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <ShankhaIcon className={`w-4 h-4 ${activeTab === 'products' ? 'text-white' : 'text-[#2196F3]'}`} />
              <span>Product &amp; Book Inventory ({allProducts.length})</span>
            </button>

            {/* Tab 3: All Orders */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#2196F3] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <PadmamIcon className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-[#FF9800]'}`} />
              <span>All Order Receipts ({orders.length})</span>
            </button>
          </div>

          {/* Toggle between List and Grid for products */}
          {activeTab === 'products' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setProductViewMode('list')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  productViewMode === 'list' ? 'bg-white text-[#2196F3] shadow-xs' : 'text-slate-500'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setProductViewMode('grid')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  productViewMode === 'grid' ? 'bg-white text-[#2196F3] shadow-xs' : 'text-slate-500'
                }`}
              >
                16:9 Grid View
              </button>
            </div>
          )}

        </div>

        {/* Tab Content Panes */}
        <div className="p-6 sm:p-8">
          
          {/* ═══════════════════════════════════════════════════════════
              TAB 1: IN-STORE CUSTOMER PICKUP VERIFICATION
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'pickups' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#0B192C] flex items-center gap-2">
                    <ChakraIcon className="w-5 h-5 text-[#2196F3]" />
                    Customer Store Pickups Queue (Station Road Counter)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Orders marked for physical in-store collection. Verify student identity and item count before handover.
                  </p>
                </div>

                <span className="text-xs font-bold text-[#2196F3] bg-[#E3F2FD] border border-[#87CEEB] px-3 py-1.5 rounded-xl">
                  {pendingPickups.length} Orders Awaiting Collection
                </span>
              </div>

              {pendingPickups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingPickups.map((order) => (
                    <div
                      key={order._id}
                      className="bg-[#F8FAFC] p-6 rounded-3xl border-2 border-[#87CEEB]/60 hover:border-[#2196F3] shadow-xs flex flex-col justify-between space-y-4 transition"
                    >
                      <div>
                        {/* Top Metadata */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF9800]">
                              Order #{order._id}
                            </span>
                            <h3 className="text-base font-black text-slate-900 mt-0.5">{order.name}</h3>
                            <p className="text-xs text-slate-500 font-bold">📞 {order.phone}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase ${
                            order.status === 'Confirmed'
                              ? 'bg-blue-100 text-[#2196F3]'
                              : 'bg-amber-100 text-[#E65100]'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items Preview */}
                        <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Items to Hand Over ({order.items.length})
                          </span>
                          <ul className="space-y-1 max-h-24 overflow-y-auto pr-1 styled-scrollbar">
                            {order.items.map((it, i) => (
                              <li key={i} className="flex justify-between font-semibold">
                                <span className="truncate max-w-[200px]">{it.quantity} × {it.title}</span>
                                <span>₹{it.price * it.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-200/80 flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-500">Total Bill Amount:</span>
                          <span className="text-sm font-black text-[#2196F3]">₹{order.totalAmount}</span>
                        </div>
                      </div>

                      {/* Primary Verification Action */}
                      <button
                        onClick={() => openPickupVerificationModal(order)}
                        className="w-full py-3 bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                      >
                        <VenkateshwaraNamamIcon className="w-4 h-4 text-white" />
                        <span>Verify &amp; Hand Over Books</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 space-y-3">
                  <VenkateshwaraNamamIcon className="w-12 h-12 mx-auto text-[#2196F3]" />
                  <h3 className="text-base font-black text-slate-900">All In-Store Customer Pickups Completed</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                    Every student pickup order has been verified and delivered at the Station Road counter.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 2: PRODUCT MANAGEMENT (LIST & 16:9 GRID)
          ═══════════════════════════════════════════════════ */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="w-full sm:w-80 relative">
                  <input
                    type="search"
                    placeholder="Search by title, author, or publisher..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3]"
                  />
                </div>

                <div className="text-xs font-bold text-slate-500">
                  Showing <strong>{filteredProducts.length}</strong> publications
                </div>
              </div>

              {/* LIST VIEW */}
              {productViewMode === 'list' ? (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-[#E3F2FD] text-[#0B192C] text-[10px] font-black uppercase tracking-wider border-b border-[#87CEEB]">
                        <th className="p-4">Book Title &amp; Edition</th>
                        <th className="p-4">Author</th>
                        <th className="p-4">Publisher / Brand</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 bg-white">
                      {filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-[#F8FAFC] transition">
                          <td className="p-4 font-bold text-[#0B192C] max-w-xs truncate">
                            {p.title}
                          </td>
                          <td className="p-4 text-slate-500">{p.author}</td>
                          <td className="p-4 text-slate-500 font-medium">{p.publisher || 'NCERT'}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4 font-black text-[#2196F3]">₹{p.price}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                              {p.inStock ? `In Stock (${p.stock || '20+'})` : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => toast.info(`Viewing specs for ${p.title}`)}
                              className="px-3 py-1 bg-slate-100 hover:bg-[#2196F3] hover:text-white rounded-lg text-xs font-bold transition"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* 16:9 ASPECT RATIO GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#2196F3] transition aspect-[16/9] p-5"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-16 h-20 bg-[#F4F8FB] rounded-xl p-1.5 shrink-0 flex items-center justify-center border border-slate-200">
                          <img src={p.image} alt={p.title} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#2196F3] block">
                            {p.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{p.title}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{p.author}</p>
                          <p className="text-[10px] text-slate-400 mt-1 truncate">Pub: {p.publisher || 'NCERT'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-base font-black text-[#2196F3]">₹{p.price}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {p.inStock ? 'Available' : 'Out'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 3: ALL ORDER RECEIPTS & AUDIT TRAIL
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <input
                  type="search"
                  placeholder="Search orders by customer name, phone, or order ID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                />

                <span className="text-xs font-bold text-slate-500">
                  Total Orders: {filteredOrders.length}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[#E3F2FD] text-[#0B192C] text-[10px] font-black uppercase tracking-wider border-b border-[#87CEEB]">
                      <th className="p-4">Order Reference</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4">Bill Amount</th>
                      <th className="p-4">Fulfillment Status</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 bg-white">
                    {filteredOrders.map((o) => (
                      <tr key={o._id} className="hover:bg-[#F8FAFC] transition">
                        <td className="p-4 font-mono font-bold text-[#2196F3]">{o._id}</td>
                        <td className="p-4 text-slate-900 font-bold">{o.name}</td>
                        <td className="p-4 text-slate-500">{o.phone}</td>
                        <td className="p-4 font-black text-slate-900">₹{o.totalAmount}</td>
                        <td className="p-4">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o._id!, e.target.value as any)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border cursor-pointer ${
                              o.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : o.status === 'Confirmed'
                                ? 'bg-blue-50 text-[#2196F3] border-blue-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Delivered">Delivered / Picked Up</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => openPickupVerificationModal(o)}
                            className="px-3 py-1 text-[11px] font-bold text-[#2196F3] hover:underline"
                          >
                            Verify Pickup
                          </button>
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

      {/* ═══════════════════════════════════════════════════════════════
          BOOTSTRAP/MATERIAL-UI-INSPIRED MODAL:
          PICK UP CUSTOMER AFTER VERIFICATION OF ORDER
      ═══════════════════════════════════════════════════════════════ */}
      {isPickupModalOpen && selectedOrderForPickup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border-2 border-[#87CEEB] shadow-2xl overflow-hidden animate-fade-up">
            
            {/* Modal Header */}
            <div className="bg-[#E3F2FD] px-6 py-4 border-b border-[#87CEEB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VenkateshwaraNamamIcon className="w-5 h-5 text-[#2196F3]" />
                <h3 className="text-base font-black text-[#0B192C]">
                  In-Store Customer Pickup Verification
                </h3>
              </div>
              <button
                onClick={() => setIsPickupModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-black p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmPickup} className="p-6 space-y-5 text-left text-xs">
              
              {/* Customer summary */}
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Order ID Reference:</span>
                  <span className="font-mono font-black text-[#2196F3]">#{selectedOrderForPickup._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Customer Name:</span>
                  <span className="font-bold text-slate-900">{selectedOrderForPickup.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Customer Phone:</span>
                  <span className="font-bold text-slate-900">{selectedOrderForPickup.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Payment Method:</span>
                  <span className="font-bold text-slate-900">{selectedOrderForPickup.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-bold">Total Bill:</span>
                  <span className="text-sm font-black text-[#2196F3]">₹{selectedOrderForPickup.totalAmount}</span>
                </div>
              </div>

              {/* Items handover checklist */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-2">
                  Verify Physical Item Count Checklist
                </label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 styled-scrollbar">
                  {selectedOrderForPickup.items.map((it, idx) => (
                    <label key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={verifiedItemsCheck[`${idx}`] ?? true}
                        onChange={(e) =>
                          setVerifiedItemsCheck({
                            ...verifiedItemsCheck,
                            [`${idx}`]: e.target.checked,
                          })
                        }
                        className="rounded text-[#2196F3] focus:ring-[#2196F3] w-4 h-4"
                      />
                      <span className="font-semibold text-slate-800">
                        {it.quantity} × {it.title} (₹{it.price * it.quantity})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verification Code / Phone digits input */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                  Customer Pickup Token / Last 4 Digits of Phone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6640 or verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPickupModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-xl font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <VenkateshwaraNamamIcon className="w-4 h-4 text-white" />
                  <span>Confirm Handover &amp; Complete Pickup</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ADD PUBLICATION MODAL
      ═══════════════════════════════════════════════════════════════ */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-fade-up">
            
            <div className="bg-[#E3F2FD] px-6 py-4 border-b border-[#87CEEB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PadmamIcon className="w-5 h-5 text-[#2196F3]" />
                <h3 className="text-base font-black text-[#0B192C]">Add New Bookstore Publication</h3>
              </div>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-black p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4 text-left text-xs">
              
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCERT Chemistry Class 12 Part 1"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-[#2196F3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Author / Editor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NCERT Board"
                    value={newProduct.author}
                    onChange={(e) => setNewProduct({ ...newProduct, author: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-[#2196F3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Publisher / Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NCERT / VGS / Classmate"
                    value={newProduct.publisher}
                    onChange={(e) => setNewProduct({ ...newProduct, publisher: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-[#2196F3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-[#2196F3]"
                  >
                    <option value="Textbooks">Textbooks</option>
                    <option value="Notebooks">Notebooks</option>
                    <option value="School Supplies">School Supplies</option>
                    <option value="Engineering Materials">Engineering</option>
                    <option value="Question Banks">Question Banks</option>
                    <option value="Competitive Exam Books">Competitive</option>
                    <option value="School Bags">School Bags</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-[#2196F3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-[#2196F3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ISBN / Barcode
                </label>
                <input
                  type="text"
                  placeholder="978-81-7450-XXX-X"
                  value={newProduct.isbn}
                  onChange={(e) => setNewProduct({ ...newProduct, isbn: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-[#2196F3]"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-xl font-bold shadow-md"
                >
                  Save Publication
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
