import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  VenkateshwaraNamamIcon, 
  VenkateshwaraFullEmblem, 
  ShankhaIcon, 
  ChakraIcon, 
  PadmamIcon, 
  KireetamIcon 
} from '../../components/icons/VenkateshwaraIcons';
import { useInventoryStore } from '../../store/inventoryStore';
import { clearAdminSession } from '../../config/adminAuth';

const INVENTORY_NAV = [
  { to: '/admin/inventory',          label: 'Inventory Overview', IconComponent: ChakraIcon, end: true },
  { to: '/admin/inventory/incoming', label: 'Incoming Stock',    IconComponent: ShankhaIcon },
  { to: '/admin/inventory/outgoing', label: 'Outgoing Stock',    IconComponent: PadmamIcon },
  { to: '/admin/inventory/history',  label: 'Stock Ledger History', IconComponent: ChakraIcon },
  { to: '/admin/inventory/alerts',   label: 'Low Stock Alerts',  IconComponent: VenkateshwaraNamamIcon },
  { to: '/admin/inventory/damaged',  label: 'Damaged / Returns', IconComponent: ShankhaIcon },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInventoryActive = location.pathname.startsWith('/admin/inventory');
  const [inventoryOpen, setInventoryOpen] = useState(isInventoryActive);

  const getLowStockProducts = useInventoryStore((s) => s.getLowStockProducts);
  const alertCount = getLowStockProducts().length;

  const handleLogout = () => {
    clearAdminSession();
    toast.success('Administrator signed out securely.');
    navigate('/admin/login');
  };

  // Build breadcrumb items based on current path
  const getBreadcrumbs = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Admin Home', path: '/admin' }];

    if (parts.includes('inventory')) {
      crumbs.push({ label: 'Inventory Management', path: '/admin/inventory' });
      const lastPart = parts[parts.length - 1];
      if (lastPart === 'incoming') crumbs.push({ label: 'Incoming Shipments', path: '/admin/inventory/incoming' });
      else if (lastPart === 'outgoing') crumbs.push({ label: 'Outgoing Stock', path: '/admin/inventory/outgoing' });
      else if (lastPart === 'history') crumbs.push({ label: 'Stock History Ledger', path: '/admin/inventory/history' });
      else if (lastPart === 'alerts') crumbs.push({ label: 'Low Stock Alerts', path: '/admin/inventory/alerts' });
      else if (lastPart === 'damaged') crumbs.push({ label: 'Damaged & Returns', path: '/admin/inventory/damaged' });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const navLinkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 rounded-xl transition-all text-xs font-bold ${
      isActive
        ? 'bg-[#2196F3] text-white shadow-sm ring-1 ring-[#87CEEB]'
        : 'text-slate-300 hover:bg-[#132B4F] hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen bg-[#F4F8FB] text-left">
      
      {/* ── Sidebar (Deep Midnight Navy #0B192C with Blue Accents) ── */}
      <aside className="w-64 bg-[#0B192C] text-slate-300 shrink-0 flex flex-col border-r border-[#132B4F] z-20">
        
        {/* Lord Venkateshwara Swamy Sacred Brand Header */}
        <div className="p-5 border-b border-[#132B4F]">
          <Link to="/admin" className="flex items-center gap-3 text-white group">
            <div className="p-1.5 bg-[#132B4F] rounded-xl border border-[#87CEEB]/30 group-hover:border-[#2196F3] transition-colors shadow-xs">
              <VenkateshwaraNamamIcon className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-white leading-tight">Sri Thirumala</span>
              <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-1 text-[#87CEEB] flex items-center gap-1">
                <KireetamIcon className="w-3 h-3 text-[#FF9800]" /> Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow p-4 space-y-1 text-xs font-bold overflow-y-auto" aria-label="Admin Sidebar">
          
          {/* Main Dashboard Link */}
          <NavLink to="/admin" end className={navLinkCls}>
            <ChakraIcon className="h-4 w-4 mr-3 text-[#87CEEB]" />
            Dashboard Overview
          </NavLink>

          {/* ── Inventory Module Section ──────────────────────────── */}
          <div className="pt-4 pb-1">
            <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <PadmamIcon className="w-3 h-3 text-[#FF9800]" /> Inventory Controls
            </p>
          </div>

          {/* Inventory accordion header */}
          <button
            type="button"
            onClick={() => setInventoryOpen((o) => !o)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-xs font-bold ${
              isInventoryActive
                ? 'bg-[#132B4F] text-white border border-[#87CEEB]/40'
                : 'text-slate-300 hover:bg-[#132B4F] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ShankhaIcon className="h-4 w-4 text-[#87CEEB]" />
              Stock Inventory
              {alertCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#FF9800] text-slate-900 text-[8px] font-black">
                  {alertCount}
                </span>
              )}
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              {inventoryOpen ? '▲' : '▼'}
            </span>
          </button>

          {/* Inventory sub-links */}
          {inventoryOpen && (
            <div className="ml-3 pl-3 border-l-2 border-[#132B4F] space-y-1 mt-1">
              {INVENTORY_NAV.map(({ to, label, IconComponent, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg transition-colors text-[11px] font-bold ${
                      isActive
                        ? 'bg-[#2196F3] text-white'
                        : 'text-slate-400 hover:bg-[#132B4F] hover:text-slate-100'
                    }`
                  }
                >
                  <IconComponent className="h-3.5 w-3.5 mr-2 shrink-0 text-[#87CEEB]" />
                  <span className="truncate">{label}</span>
                  {label === 'Low Stock Alerts' && alertCount > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-[#FF9800] text-slate-900 text-[8px] font-black">
                      {alertCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}

          {/* ── Utilities Section ─────────────────────────────────── */}
          <div className="pt-4 pb-1">
            <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <KireetamIcon className="w-3 h-3 text-[#FF9800]" /> Store Links
            </p>
          </div>

          <Link
            to="/home"
            className="flex items-center px-4 py-2.5 hover:bg-[#132B4F] hover:text-white rounded-xl transition-colors text-slate-300 text-xs font-bold"
          >
            <PadmamIcon className="h-4 w-4 mr-3 text-[#87CEEB]" />
            Live Bookstore Storefront
          </Link>
        </nav>

        {/* Logout Control */}
        <div className="p-4 border-t border-[#132B4F] text-xs font-bold">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors gap-2"
          >
            <span>Sign Out Admin</span>
          </button>
        </div>

      </aside>

      {/* ── Main Content Area with Material-UI Top Bar & Breadcrumbs ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top App Bar with Breadcrumbs & Lord Venkateshwara Insignia */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sticky top-0 z-10 shadow-xs">
          
          {/* Breadcrumb Navigation Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-wrap">
            <VenkateshwaraNamamIcon className="w-4 h-4 mr-1 text-[#2196F3] shrink-0" />
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.path}>
                {idx > 0 && <span className="text-slate-300">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-[#0B192C] font-extrabold">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="text-[#2196F3] hover:underline">
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Offline Store Badge & Location */}
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#E3F2FD] text-[#2196F3] border border-[#87CEEB]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Station Road Storefront Active
            </span>
            <div className="hidden md:flex items-center gap-1.5 font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <KireetamIcon className="w-3.5 h-3.5 text-[#FF9800]" />
              <span>Admin: Kamareddy Branch</span>
            </div>
          </div>

        </header>

        {/* Page View Outlet */}
        <main className="flex-grow w-full">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
