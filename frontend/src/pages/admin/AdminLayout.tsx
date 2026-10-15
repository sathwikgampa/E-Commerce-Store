import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import {
  AlertTriangle,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageMinus,
  PackagePlus,
  PackageX,
  Warehouse,
  X,
} from 'lucide-react';
import { VenkateshwaraNamamIcon } from '../../components/icons/VenkateshwaraIcons';
import { useInventoryStore } from '../../store/inventoryStore';
import { ADMIN_CONFIG, clearAdminSession } from '../../config/adminAuth';
import { cn } from '../../lib/utils';

const INVENTORY_NAV = [
  { to: '/admin/inventory', label: 'Stock overview', icon: Warehouse, end: true },
  { to: '/admin/inventory/incoming', label: 'Incoming stock', icon: PackagePlus },
  { to: '/admin/inventory/outgoing', label: 'Outgoing stock', icon: PackageMinus },
  { to: '/admin/inventory/history', label: 'Stock history', icon: ClipboardList },
  { to: '/admin/inventory/alerts', label: 'Low stock alerts', icon: AlertTriangle, alerts: true },
  { to: '/admin/inventory/damaged', label: 'Damaged & returned', icon: PackageX },
];

const CRUMBS: Record<string, string> = {
  incoming: 'Incoming stock',
  outgoing: 'Outgoing stock',
  history: 'Stock history',
  alerts: 'Low stock alerts',
  damaged: 'Damaged & returned',
};

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const stockMap = useInventoryStore((s) => s.stockMap);
  const alertCount = useMemo(
    () => Object.values(stockMap).filter((r) => r.status !== 'In Stock').length,
    [stockMap]
  );

  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    clearAdminSession();
    toast.success('Signed out');
    navigate('/admin/login');
  };

  const parts = location.pathname.split('/').filter(Boolean);
  const crumbs: { label: string; to?: string }[] = [{ label: 'Dashboard', to: '/admin' }];
  if (parts[1] === 'inventory') {
    crumbs.push({ label: 'Inventory', to: '/admin/inventory' });
    if (parts[2] && CRUMBS[parts[2]]) crumbs.push({ label: CRUMBS[parts[2]] });
  }
  crumbs[crumbs.length - 1].to = undefined;

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative flex h-9 items-center gap-3 rounded-md px-3 text-[14px] font-medium transition-colors',
      isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    );
  const indicator = (isActive: boolean) =>
    isActive && <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-saffron" />;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-3 border-b border-white/10 px-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-navy">
          <VenkateshwaraNamamIcon className="h-5 w-5" />
        </span>
        <span className="leading-tight">
          <span className="block text-[14px] font-semibold text-white">Sri Thirumala</span>
          <span className="block text-[11px] text-slate-400">Store admin</span>
        </span>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          <li>
            <NavLink to="/admin" end className={linkCls}>
              {({ isActive }) => (
                <>
                  {indicator(isActive)}
                  <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden="true" /> Dashboard
                </>
              )}
            </NavLink>
          </li>
        </ul>

        <p className="mt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Inventory</p>
        <ul className="space-y-0.5">
          {INVENTORY_NAV.map(({ to, label, icon: Icon, end, alerts }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={linkCls}>
                {({ isActive }) => (
                  <>
                    {indicator(isActive)}
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{label}</span>
                    {alerts && alertCount > 0 && (
                      <span className="ml-auto rounded-full bg-saffron px-1.5 text-[11px] font-semibold tabular text-[#1F1300]">
                        {alertCount}
                        <span className="sr-only"> products need attention</span>
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <p className="mt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Store</p>
        <ul>
          <li>
            <Link to="/home" target="_blank" className="flex h-9 items-center gap-3 rounded-md px-3 text-[14px] font-medium text-slate-300 hover:bg-white/5 hover:text-white">
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /> View storefront
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="app-admin flex min-h-screen bg-admin-canvas text-slate-900">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 bg-navy-deep lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <div className="absolute inset-0 bg-slate-950/50 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-navy-deep shadow-modal animate-slide-in-left">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-300 hover:bg-white/10"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-admin-line bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <nav aria-label="Breadcrumb" className="min-w-0 text-[14px]">
            <ol className="flex items-center gap-1.5 text-slate-500">
              {crumbs.map((c, i) => (
                <li key={c.label} className={cn('flex min-w-0 items-center gap-1.5', i < crumbs.length - 1 && 'max-sm:hidden')}>
                  {i > 0 && <span aria-hidden="true" className="max-sm:hidden">/</span>}
                  {c.to ? (
                    <Link to={c.to} className="hover:text-navy">{c.label}</Link>
                  ) : (
                    <span aria-current="page" className="truncate font-semibold text-slate-900">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="ml-auto flex h-10 items-center gap-2 rounded-md px-2 text-[14px] text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-navy">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-[12px] font-semibold text-white" aria-hidden="true">A</span>
              <span className="hidden font-medium sm:inline">Admin</span>
              <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" sideOffset={6} className="app-admin z-50 w-60 rounded-lg border border-admin-line bg-white p-1 shadow-pop animate-fade-up">
                <div className="px-3 py-2 text-[13px]">
                  <p className="font-medium text-slate-900">Signed in as</p>
                  <p className="truncate text-slate-500">{ADMIN_CONFIG.username}</p>
                </div>
                <DropdownMenu.Separator className="my-1 h-px bg-admin-line" />
                <DropdownMenu.Item asChild>
                  <Link to="/home" className="flex h-9 items-center gap-2 rounded-md px-3 text-[14px] text-slate-700 outline-none data-[highlighted]:bg-slate-100">
                    <ExternalLink className="h-4 w-4" aria-hidden="true" /> View storefront
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={handleLogout}
                  className="flex h-9 cursor-pointer items-center gap-2 rounded-md px-3 text-[14px] text-rose-700 outline-none data-[highlighted]:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </header>

        <main id="admin-main" className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
