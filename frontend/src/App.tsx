import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layout & Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNavigation from './components/BottomNavigation';
import { isAdminAuthenticated } from './config/adminAuth';

// Landing Page (eagerly loaded for fast first impression)
import LandingPage from './pages/LandingPage';

// Lazy loading pages for production optimization
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductCatalog = lazy(() => import('./pages/ProductCatalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const UserLogin = lazy(() => import('./pages/UserLogin'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

// Customer & Student Portal Pages (navy & saffron)
const CustomerPortalLayout = lazy(() => import('./pages/portal/CustomerPortalLayout'));
const CustomerPortalDashboard = lazy(() => import('./pages/portal/CustomerPortalDashboard'));
const CustomerPortalLogin = lazy(() => import('./pages/portal/CustomerPortalLogin'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));

// Inventory Pages
const InventoryLayout   = lazy(() => import('./pages/admin/inventory/InventoryLayout'));
const InventoryDashboard = lazy(() => import('./pages/admin/inventory/InventoryDashboard'));
const IncomingStock     = lazy(() => import('./pages/admin/inventory/IncomingStock'));
const OutgoingStock     = lazy(() => import('./pages/admin/inventory/OutgoingStock'));
const StockHistory      = lazy(() => import('./pages/admin/inventory/StockHistory'));
const LowStockAlerts    = lazy(() => import('./pages/admin/inventory/LowStockAlerts'));
const DamagedReturned   = lazy(() => import('./pages/admin/inventory/DamagedReturned'));

const LoadingFallback: React.FC<{ tone?: 'store' | 'navy' }> = ({ tone = 'store' }) => (
  <div
    role="status"
    className={`flex min-h-[60vh] items-center justify-center ${tone === 'navy' ? 'bg-admin-canvas' : 'bg-store-accent'}`}
  >
    <span
      aria-hidden="true"
      className={`h-8 w-8 animate-spin rounded-full border-[3px] border-t-transparent ${
        tone === 'navy' ? 'border-navy' : 'border-store-primary'
      }`}
    />
    <span className="sr-only">Loading…</span>
  </div>
);

// Scroll to top on route change (keeps in-page hash links working)
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Admin pages require a valid admin session (see config/adminAuth.ts)
const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};

// Storefront shell: Navbar + Footer + mobile tab bar. Checkout gets a focused header.
const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isCheckout = pathname === '/checkout';

  return (
    <div className={`storefront flex min-h-screen flex-col bg-store-accent font-sans text-store-charcoal ${isCheckout ? '' : 'pb-16 md:pb-0'}`}>
      <Navbar variant={isCheckout ? 'minimal' : 'default'} />
      <main id="main-content" className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
      </main>
      <Footer />
      {!isCheckout && <BottomNavigation />}
    </div>
  );
};

// Inner component so we can use useLocation
const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  // Admin and Portal routes skip the consumer Navbar/Footer shell
  const isAdmin = location.pathname.startsWith('/admin');
  const isPortal = location.pathname.startsWith('/portal');

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <ScrollToTop />

      {isLanding ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      ) : isPortal ? (
        <Suspense fallback={<LoadingFallback tone="navy" />}>
          <Routes>
            <Route path="/portal/login" element={<CustomerPortalLogin />} />
            <Route path="/portal" element={<CustomerPortalLayout />}>
              <Route index element={<CustomerPortalDashboard />} />
            </Route>
          </Routes>
        </Suspense>
      ) : isAdmin ? (
        <Suspense fallback={<LoadingFallback tone="navy" />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<AdminDashboard />} />
              {/* ── Inventory Module ──────────────────────────── */}
              <Route path="inventory" element={<InventoryLayout />}>
                <Route index element={<InventoryDashboard />} />
                <Route path="incoming"  element={<IncomingStock />} />
                <Route path="outgoing"  element={<OutgoingStock />} />
                <Route path="history"   element={<StockHistory />} />
                <Route path="alerts"    element={<LowStockAlerts />} />
                <Route path="damaged"   element={<DamagedReturned />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      ) : (
        <AppShell>
          <Routes>
            <Route path="/home"       element={<HomePage />} />
            <Route path="/books"      element={<ProductCatalog />} />
            <Route path="/book/:id"   element={<ProductDetail />} />
            <Route path="/cart"       element={<CartPage />} />
            <Route path="/checkout"   element={<CheckoutPage />} />
            <Route path="/contact"    element={<ContactPage />} />
            <Route path="/login"      element={<UserLogin />} />
            <Route path="/dashboard"  element={<UserDashboard />} />
            <Route path="/account"    element={<UserDashboard />} />
            <Route path="/blog"       element={<BlogPage />} />
            <Route path="/blog/:id"   element={<BlogPostPage />} />
          </Routes>
        </AppShell>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
