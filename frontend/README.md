# Sri Thirumala E-Commerce Store — Frontend

A high-performance, accessible, and editorial web application built for **Sri Thirumala Book & Stationery Store** (Station Road, Kamareddy, Telangana). Bootstrapped with [Vite](https://vitejs.dev/) and [React 19](https://react.dev/), styled using [Tailwind CSS v4](https://tailwindcss.com/), and powered by [Zustand](https://github.com/pmndrs/zustand) and [TanStack Query](https://tanstack.com/query).

---

## 📖 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Design System & Theming](#-design-system--theming)
- [Page Directory & Route Map](#-page-directory--route-map)
- [Core Features](#-core-features)
- [State Management & Data Layer](#-state-management--data-layer)
- [Project Directory Structure](#-project-directory-structure)
- [Available Scripts](#-available-scripts)
- [Environment Configuration](#-environment-configuration)
- [Quality Assurance & Testing](#-quality-assurance--testing)

---

## 🌟 Overview & Architecture

The frontend serves two primary user experiences:
1. **Consumer Storefront (`/home`, `/books`, `/cart`, etc.)**: An editorial bookstore experience inspired by literary aesthetics, utilizing warm terracotta/coral tones, soft peach card backgrounds, and *Lora* serif typography.
2. **Back-Office Admin & Inventory Portal (`/admin`, `/admin/inventory/*`)**: A high-density management portal designed with deep navy blue hues, sacred Venkateshwara Swamy iconography, 16:9 metric cards, pickup handover verifications, and real-time inventory ledger controls.

---

## 🎨 Design System & Theming

### 1. Storefront Palette
- **Primary Brand Color:** Warm Terracotta/Coral (`#FF7A50`, `var(--color-store-primary)`) — Used for primary CTAs, active highlights, badges, and navigation anchors.
- **Secondary Accent:** Soft Peach (`#FFF7F5` / `#FFEFEA`, `var(--color-store-accent)`) — Used for card backgrounds, subtle page sections, and hover fills.
- **Text & Footer Charcoal:** Deep Charcoal (`#2D3748` / `#1A1A2E`, `var(--color-store-charcoal)`) — Delivers WCAG AA compliant reading contrast.
- **Typography:** *Lora* (serif) for major page titles and editorial headings; *Inter* (sans-serif) for body text and tabular numbers.

### 2. Admin & Student Portal Palette
- **Deep Navy Base:** `#0A3D91` & `#041D47` (`var(--color-navy)`) — Differentiates back-office and institutional operations from consumer retail.
- **Secondary Sky Blue:** `#87CEEB` — Data accents and secondary badges.
- **Accent Saffron:** `#FF9800` — Highlight badges and alerts.
- **Sacred Iconography:** High-resolution SVG icons representing Lord Venkateshwara Swamy (*Namam*, *Shankha*, *Chakra*, *Padmam*, *Kireetam*) embedded across headers and system metrics.

---

## 🗺️ Page Directory & Route Map

| Route | Component | Description |
| :--- | :--- | :--- |
| `/` | `LandingPage.tsx` | Immersive 3D animated hero with OGL shader, floating product cards, and quick shop link |
| `/home` | `HomePage.tsx` | Main retail storefront with announcement banner, department carousel, curated shelves, and reviews |
| `/books` | `ProductCatalog.tsx` | Searchable & filterable catalog with multi-field matching (Title, Author, Publisher, ISBN), price range, and sort |
| `/book/:id` | `ProductDetail.tsx` | Full specification sheet, multi-angle image zoom gallery, live customer reviews, and direct WhatsApp ordering |
| `/cart` | `CartPage.tsx` | Dynamic item counter, coupon validation (`STUDENT10`), and free delivery progress bar (`₹500` threshold) |
| `/checkout` | `CheckoutPage.tsx` | In-store pickup vs. local delivery toggle, COD & instant UPI QR preview, validation, and printable receipt |
| `/login` | `UserLogin.tsx` | Customer authentication and registration flow |
| `/dashboard` | `UserDashboard.tsx` | Customer order tracking, item status timeline, and saved wishlist |
| `/blog` | `BlogPage.tsx` | Regional study guides, exam preparation tips, and stationery buyer recommendations |
| `/blog/:id` | `BlogPostPage.tsx` | In-depth study article with embedded direct product links |
| `/contact` | `ContactPage.tsx` | Store address (Station Road, Kamareddy), Google Maps embed, phone, and direct contact form |
| `/portal` | `CustomerPortalLayout.tsx` | Customer & Student academic portal for board syllabi, booklists, and bulk class kits |
| `/admin/login` | `AdminLogin.tsx` | Authenticated gateway for authorized store managers |
| `/admin` | `AdminDashboard.tsx` | Real-time analytics, revenue, order tracking, and in-store customer pickup verification modal |
| `/admin/inventory` | `InventoryDashboard.tsx` | Stock health metrics, stock distribution by category, and recent movement summary |
| `/admin/inventory/incoming` | `IncomingStock.tsx` | Record incoming shipments from publishers and suppliers |
| `/admin/inventory/outgoing` | `OutgoingStock.tsx` | Log counter sales, school bulk orders, and stock dispatches |
| `/admin/inventory/history` | `StockHistory.tsx` | Complete searchable stock movement audit trail with CSV/Excel export |
| `/admin/inventory/alerts` | `LowStockAlerts.tsx` | Configurable reorder threshold alerts and supplier contact shortcuts |
| `/admin/inventory/damaged` | `DamagedReturned.tsx` | Defective stock, damaged shipments, and publisher return logs |

---

## ⚡ Core Features

- **3D OGL Shader Landing Hero:** Custom WebGL-accelerated book spine shader with responsive hover physics.
- **Search & Suggestions:** Instant search matching book title, author, publisher, and ISBN with highlights and filter chips.
- **Regional Ordering Workflows:**
  - **In-Store Pickup:** Zero delivery charge; generates a customer pickup voucher for Station Road counter collection.
  - **Local Delivery:** Flat ₹40 delivery fee with free delivery above ₹500 across Kamareddy and neighbouring mandals.
  - **Direct WhatsApp Ordering:** Pre-fills cart contents, item details, and total pricing directly into WhatsApp for quick customer assistance.
- **Comprehensive Inventory Control Suite:** Dedicated ledger tracking incoming consignments, outgoing receipts, vendor returns, and stock warnings.
- **Accessibility (WCAG 2.1 AA):** High-contrast color ratios, `:focus-visible` keyboard outlines, skip-to-content anchor, and semantic HTML landmarks.

---

## 🗃️ State Management & Data Layer

### 1. Zustand Stores (`src/store/`)
- **`useCartStore`**: Handles cart items, quantities, coupon code applications, subtotal calculation, and delivery fees. Persisted in `localStorage`.
- **`useWishlistStore`**: Handles book bookmarks and heart toggles across catalog and detail cards. Persisted in `localStorage`.
- **`useInventoryStore`**: In-memory inventory state manager managing real-time stock counts, supplier directories, low-stock thresholds, and transaction ledgers.

### 2. TanStack React Query (`src/api/`)
- **`useProducts()`**: Fetches catalog from backend (`http://localhost:5000/api/products`), automatically falling back to high-fidelity static catalog data (`FALLBACK_PRODUCTS`) if the server is offline.
- **`useSubmitOrder()`**: Submits customer orders to backend (`POST /api/orders`) with local simulation fallback.
- **`useOrders()`**: Retrieves active orders for customer dashboard and admin order views.

---

## 📁 Project Directory Structure

```text
frontend/
├── public/                  # Static assets and product cover images
├── src/
│   ├── api/                 # React Query hooks (queries.ts, inventoryQueries.ts)
│   ├── assets/              # Sacred iconography and logos
│   ├── components/          # Reusable UI components
│   │   ├── admin/           # Sacred Venkateshwara Swamy icons & Admin UI elements
│   │   ├── landing/         # 3D canvas, shelf cards, landing search & nav
│   │   └── ui/              # Badges, Steppers, Fields, Dialogs, Modals, Breadcrumbs
│   ├── config/              # Admin session verification (adminAuth.ts)
│   ├── data/                # Static regional blog articles (blogData.ts)
│   ├── lib/                 # Pricing calculators, order persistence, and cn utilities
│   ├── pages/               # Top-level view routes
│   │   ├── admin/           # Admin portal & Inventory management views
│   │   └── portal/          # Customer and Student resource portal
│   ├── store/               # Zustand state stores (cart, wishlist, inventory)
│   ├── types/               # TypeScript interfaces (Product, Order, Inventory, etc.)
│   ├── App.tsx              # Application router and shell wrapper
│   ├── index.css            # Tailwind CSS v4 design tokens and theme variables
│   └── main.tsx             # React DOM entry point
├── .env.example             # Template environment variables
├── index.html               # Web root with Google Fonts (Lora, Inter)
├── package.json             # NPM dependencies and build commands
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite bundler configuration
```

---

## 🔌 Available Scripts

In the `frontend` directory, you can run:

```bash
# Start local development server with Hot Module Replacement (HMR)
npm run dev

# Compile TypeScript and bundle production build to /dist
npm run build

# Run ESLint to verify code quality and style compliance
npm run lint

# Preview the compiled production build locally
npm run preview
```

---

## 🔐 Environment Configuration

Create a `.env` file in the `frontend` root by copying `.env.example`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the backend API server | `http://localhost:5000/api` |
| `VITE_ADMIN_USERNAME` | Default store manager admin email | `admin@srithirumala.com` |
| `VITE_ADMIN_PASSWORD` | Default store manager admin password | `SriThirumala@2025!` |
| `VITE_ADMIN_SESSION_TIMEOUT` | Admin session timeout in seconds | `86400` (24 Hours) |

---

## 🧪 Quality Assurance & Testing

Refer to the project-wide testing documentation in the repository root:
- [`TESTING_PLAN.md`](../TESTING_PLAN.md) — Viewport matrices, device resolutions, and functional test suite covering Suites 1 through 6.
- [`STYLE_GUIDE.md`](../STYLE_GUIDE.md) — Typography rules, button variants, and color system guidelines.
- [`COLOR_PALETTE.md`](../COLOR_PALETTE.md) — Complete hex codes and Tailwind variable specifications.
