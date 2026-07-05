import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  Settings,
  LogOut,
  ArrowLeft,
  ChevronDown,
  Package,
  PackagePlus,
  PackageMinus,
  ClipboardList,
  AlertTriangle,
  PackageX,
} from 'lucide-react';
import { toast } from 'sonner';
import { useInventoryStore } from '../../store/inventoryStore';

const INVENTORY_NAV = [
  { to: '/admin/inventory',          label: 'Dashboard',         icon: LayoutDashboard, end: true  },
  { to: '/admin/inventory/incoming', label: 'Incoming Stock',    icon: PackagePlus },
  { to: '/admin/inventory/outgoing', label: 'Outgoing Stock',    icon: PackageMinus },
  { to: '/admin/inventory/history',  label: 'Stock History',     icon: ClipboardList },
  { to: '/admin/inventory/alerts',   label: 'Low Stock Alerts',  icon: AlertTriangle },
  { to: '/admin/inventory/damaged',  label: 'Damaged / Returned',icon: PackageX },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInventoryActive = location.pathname.startsWith('/admin/inventory');
  const [inventoryOpen, setInventoryOpen] = useState(isInventoryActive);

  const getLowStockProducts = useInventoryStore((s) => s.getLowStockProducts);
  const alertCount = getLowStockProducts().length;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logged out of admin panel successfully.');
    navigate('/admin/login');
  };

  const navLinkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 rounded-xl transition-colors text-xs font-bold ${
      isActive
        ? 'bg-[#0A3D91] text-white'
        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-left">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-64 bg-[#040D21] text-slate-350 shrink-0 flex flex-col border-r border-slate-900">
        {/* Brand */}
        <div className="p-6 border-b border-slate-900">
          <Link to="/" className="flex items-center gap-2.5 text-white mb-2">
            <div className="bg-[#0A3D91] p-2 rounded-lg text-accent border border-slate-800 shadow-md">
              <BookOpen className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white leading-none">Sri Thirumala</span>
              <span className="text-[8px] font-bold uppercase tracking-widest leading-none mt-1 text-[#D4AF37]">
                Admin Area
              </span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-grow p-4 space-y-1 text-xs font-bold overflow-y-auto">
          {/* Main Dashboard */}
          <NavLink to="/admin" end className={navLinkCls}>
            <LayoutDashboard className="h-4 w-4 mr-3 text-[#D4AF37]" />
            Dashboard
          </NavLink>

          {/* ── Inventory Section ──────────────────────────────── */}
          <div className="pt-3 pb-1">
            <p className="px-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">
              Inventory
            </p>
          </div>

          {/* Inventory toggle */}
          <button
            onClick={() => setInventoryOpen((o) => !o)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors text-xs font-bold ${
              isInventoryActive
                ? 'bg-slate-900 text-white'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <Package className="h-4 w-4 text-[#D4AF37]" />
              Inventory
              {alertCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[8px] font-black">
                  {alertCount}
                </span>
              )}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${inventoryOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Inventory sub-items */}
          {inventoryOpen && (
            <div className="ml-3 pl-3 border-l border-slate-800 space-y-0.5 mt-0.5">
              {INVENTORY_NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg transition-colors text-[11px] font-bold ${
                      isActive
                        ? 'bg-[#0A3D91] text-white'
                        : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="h-3.5 w-3.5 mr-2.5 shrink-0" />
                  {label}
                  {label === 'Low Stock Alerts' && alertCount > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[8px] font-black">
                      {alertCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}

          {/* ── Settings ──────────────────────────────────────── */}
          <div className="pt-3 pb-1">
            <p className="px-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">
              General
            </p>
          </div>

          <a
            href="#"
            className="flex items-center px-4 py-2.5 hover:bg-slate-900 hover:text-white rounded-xl transition-colors text-slate-400 text-xs font-bold"
          >
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </a>

          <Link
            to="/home"
            className="flex items-center px-4 py-2.5 hover:bg-slate-900 hover:text-white rounded-xl transition-colors text-slate-400 text-xs font-bold"
          >
            <ArrowLeft className="h-4 w-4 mr-3" />
            Back to Storefront
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-900 text-xs font-bold">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3 hover:bg-rose-500/10 text-rose-500 hover:text-rose-400 rounded-xl transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="flex-grow w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
