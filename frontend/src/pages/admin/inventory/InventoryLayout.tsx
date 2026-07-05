import React, { useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PackagePlus,
  PackageMinus,
  ClipboardList,
  AlertTriangle,
  PackageX,
} from 'lucide-react';
import { useInventoryStore } from '../../../store/inventoryStore';

const NAV_ITEMS = [
  { to: '/admin/inventory',           label: 'Dashboard',         icon: LayoutDashboard, end: true },
  { to: '/admin/inventory/incoming',  label: 'Incoming Stock',    icon: PackagePlus },
  { to: '/admin/inventory/outgoing',  label: 'Outgoing Stock',    icon: PackageMinus },
  { to: '/admin/inventory/history',   label: 'Stock History',     icon: ClipboardList },
  { to: '/admin/inventory/alerts',    label: 'Low Stock Alerts',  icon: AlertTriangle },
  { to: '/admin/inventory/damaged',   label: 'Damaged / Returned',icon: PackageX },
];

const InventoryLayout: React.FC = () => {
  const location = useLocation();
  const { seedInitialData, initialized } = useInventoryStore();

  // Seed data on first visit
  useEffect(() => {
    if (!initialized) seedInitialData();
  }, [initialized, seedInitialData]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-8 pt-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A3D91] tracking-tight">
              Inventory Management
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Sri Thirumala Bookstore · Real-time stock tracking & audit log
            </p>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Inventory
          </span>
        </div>

        {/* ── Sub Navigation Tabs ───────────────────────────── */}
        <nav className="flex gap-0 overflow-x-auto hide-scrollbar -mb-px">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => {
            const isActive = end
              ? location.pathname === to
              : location.pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={`flex items-center gap-2 px-4 py-3 text-[11px] font-bold whitespace-nowrap border-b-2 transition-all duration-150 ${
                  isActive
                    ? 'border-[#0A3D91] text-[#0A3D91] bg-[#EAF3FF]/40'
                    : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="uppercase tracking-wider">{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* ── Page Content ─────────────────────────────────────── */}
      <div className="flex-grow overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default InventoryLayout;
