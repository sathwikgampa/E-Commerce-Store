import React, { useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  AlertTriangle,
  ClipboardList,
  LayoutDashboard,
  PackageMinus,
  PackagePlus,
  PackageX,
} from 'lucide-react';
import { useInventoryStore } from '../../../store/inventoryStore';
import { cn } from '../../../lib/utils';

const NAV_ITEMS = [
  { to: '/admin/inventory', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/inventory/incoming', label: 'Incoming', icon: PackagePlus },
  { to: '/admin/inventory/outgoing', label: 'Outgoing', icon: PackageMinus },
  { to: '/admin/inventory/history', label: 'History', icon: ClipboardList },
  { to: '/admin/inventory/alerts', label: 'Low stock', icon: AlertTriangle },
  { to: '/admin/inventory/damaged', label: 'Damaged & returned', icon: PackageX },
];

const InventoryLayout: React.FC = () => {
  const { seedInitialData, initialized } = useInventoryStore();

  // Seed opening stock on first visit
  useEffect(() => {
    if (!initialized) seedInitialData();
  }, [initialized, seedInitialData]);

  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-admin-line bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-admin">
          <div className="flex flex-wrap items-end justify-between gap-2 pt-5">
            <div>
              <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Inventory</h1>
              <p className="mt-0.5 text-[13px] text-slate-500">Stock levels, movements and audit trail · records are stored in this browser</p>
            </div>
          </div>
          <nav aria-label="Inventory sections" className="-mb-px mt-4 flex gap-5 overflow-x-auto hide-scrollbar">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex h-11 shrink-0 items-center gap-2 border-b-2 text-[14px] font-medium transition-colors',
                    isActive ? 'border-navy text-navy' : 'border-transparent text-slate-500 hover:text-slate-900'
                  )
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-admin">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default InventoryLayout;
