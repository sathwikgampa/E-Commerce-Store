import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  BookOpen,
  Heart,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  MapPin,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Store,
  X,
} from 'lucide-react';
import { VenkateshwaraNamamIcon } from '../../components/icons/VenkateshwaraIcons';
import { STORE } from '../../components/landing/landingData';
import { cn } from '../../lib/utils';

const NAV = [
  { group: 'Portal', items: [
    { to: '/portal', label: 'Overview', icon: LayoutDashboard, tab: null },
    { to: '/portal?tab=pickups', label: 'Store pickups', icon: Store, tab: 'pickups' },
    { to: '/portal?tab=saved', label: 'Saved titles', icon: Heart, tab: 'saved' },
  ] },
  { group: 'Resources', items: [
    { to: '/books', label: 'Textbook catalog', icon: LibraryBig, tab: undefined },
    { to: '/blog', label: 'Syllabus & guides', icon: BookOpen, tab: undefined },
    { to: '/contact', label: 'Station Road store', icon: MapPin, tab: undefined },
  ] },
];

const TITLES: Record<string, string> = {
  overview: 'Overview',
  pickups: 'Store pickups',
  saved: 'Saved titles',
};

const CustomerPortalLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('stm_portal_collapsed') === '1');

  useEffect(() => setMobileOpen(false), [location.pathname, location.search]);
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

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      localStorage.setItem('stm_portal_collapsed', c ? '0' : '1');
      return !c;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    toast.success('Signed out of the portal');
    navigate('/portal/login');
  };

  const isActive = (tab: string | null | undefined) =>
    tab !== undefined && location.pathname === '/portal' && (tab ?? 'overview') === currentTab;

  const sidebar = (compact: boolean) => (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center gap-3 border-b border-admin-line', compact ? 'justify-center px-2' : 'px-5')}>
        <Link to="/portal" className="flex min-w-0 items-center gap-3 rounded-md" aria-label="Portal overview">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy">
            <VenkateshwaraNamamIcon className="h-6 w-6" />
          </span>
          {!compact && (
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[15px] font-semibold text-slate-900">Sri Thirumala</span>
              <span className="block truncate text-[11px] font-medium uppercase tracking-[0.12em] text-saffron-ink">Student portal</span>
            </span>
          )}
        </Link>
      </div>

      <nav aria-label="Portal" className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((section) => (
          <div key={section.group} className="mb-5">
            {!compact && <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{section.group}</p>}
            <ul className="space-y-0.5">
              {section.items.map(({ to, label, icon: Icon, tab }) => {
                const active = isActive(tab);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      aria-current={active ? 'page' : undefined}
                      title={compact ? label : undefined}
                      className={cn(
                        'relative flex h-10 items-center gap-3 rounded-lg text-[14px] font-medium transition-colors',
                        compact ? 'justify-center' : 'px-3',
                        active ? 'bg-navy-soft text-navy' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      )}
                    >
                      {active && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-saffron" />}
                      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                      {compact ? <span className="sr-only">{label}</span> : label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-admin-line p-3">
        <Link
          to="/home"
          title={compact ? 'Back to bookstore' : undefined}
          className={cn('flex h-10 items-center gap-3 rounded-lg text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900', compact ? 'justify-center' : 'px-3')}
        >
          <ArrowLeft className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          {compact ? <span className="sr-only">Back to bookstore</span> : 'Back to bookstore'}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          title={compact ? 'Sign out' : undefined}
          className={cn('flex h-10 w-full items-center gap-3 rounded-lg text-[14px] font-medium text-rose-700 hover:bg-rose-50', compact ? 'justify-center' : 'px-3')}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          {compact ? <span className="sr-only">Sign out</span> : 'Sign out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-portal flex min-h-screen bg-admin-canvas text-slate-900">
      <a href="#portal-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className={cn('sticky top-0 hidden h-screen shrink-0 border-r border-admin-line bg-white transition-[width] duration-200 md:block', collapsed ? 'w-[72px]' : 'w-64')}>
        {sidebar(collapsed)}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Portal navigation">
          <div className="absolute inset-0 bg-slate-950/40 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-modal animate-slide-in-left">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-3 inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar(false)}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-admin-line bg-white/95 px-4 backdrop-blur-sm sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:inline-flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={collapsed}
          >
            {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
          <nav aria-label="Breadcrumb" className="min-w-0 text-[14px]">
            <ol className="flex items-center gap-1.5 text-slate-500">
              <li className="hidden sm:block"><Link to="/portal" className="hover:text-navy">Student portal</Link></li>
              <li aria-hidden="true" className="hidden sm:block">/</li>
              <li aria-current="page" className="truncate font-semibold text-slate-900">{TITLES[currentTab] ?? 'Overview'}</li>
            </ol>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-[13px] text-slate-500 lg:inline">Station Road counter · {STORE.hours}</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-admin-line py-1 pl-1 pr-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-saffron text-[12px] font-bold text-[#1F1300]" aria-hidden="true">
                SK
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-[13px] font-semibold text-slate-900">Dr. S. K. Sharma</span>
                <span className="block text-[11px] text-slate-500">Institutional Member</span>
              </span>
            </div>
          </div>
        </header>

        <main id="portal-main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerPortalLayout;
