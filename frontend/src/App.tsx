import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layout & Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNavigation from './components/BottomNavigation';

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

const LoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#F8FAFC]">
    <div className="h-10 w-10 border-4 border-[#0A3D91] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Shell wraps all non-landing pages with Navbar + Footer
const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-store-accent text-slate-800 font-sans storefront pb-16 md:pb-0">
    <Navbar />
    <main className="flex-grow">
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </main>
    <Footer />
    <BottomNavigation />
  </div>
);

// Inner component so we can use useLocation
const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  // Admin routes skip the Navbar/Footer shell
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      {isLanding ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      ) : isAdmin ? (
        // Admin routes — no Navbar/Footer
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
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
