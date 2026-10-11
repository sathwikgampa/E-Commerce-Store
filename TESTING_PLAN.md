# Sri Thirumala E-Commerce Store & App — Quality Assurance & Testing Plan

## 1. Overview & Objectives

This Quality Assurance Testing Plan defines the testing standards, matrix, and test cases to guarantee that the Sri Thirumala E-Commerce Store and Admin Portal deliver a uniform, high-performance, and accessible user experience across all devices, browsers, and operating systems.

---

## 2. Test Environment Matrix

### 2.1 Viewport & Device Resolution Matrix
| Device Category | Target Viewport Dimensions | Reference Devices | Layout Expectations |
| :--- | :--- | :--- | :--- |
| **Mobile Compact** | `360 × 640` to `390 × 844` | iPhone 12/13/14, Samsung Galaxy S21/S22 | Single-column layout, sticky bottom nav (`BottomNavigation`), hamburger drawer, stacked product details. |
| **Mobile Large / Phablet** | `412 × 915` to `430 × 932` | iPhone 15/16 Pro Max, Pixel 7/8 Pro | Full responsive layout, touch target size `≥ 44 × 44px`. |
| **Tablet Portrait** | `768 × 1024` to `820 × 1180` | iPad Air, iPad 10th Gen, Galaxy Tab S8 | 2-column catalog grid, collapsible filter sidebar, top utility bar. |
| **Tablet Landscape** | `1024 × 768` to `1180 × 820` | iPad Pro 11", Surface Pro 9 | 3-column catalog grid, persistent desktop navbar, mega-dropdown. |
| **Desktop Standard** | `1366 × 768` to `1440 × 900` | Standard Laptops, MacBook Air | Full 12-column grid, 16:9 proportional admin cards, sticky headers. |
| **Desktop High-Res** | `1920 × 1080` (FHD) & `2560 × 1440` | External Displays, iMac | Max container bounds (`1280px` / `1400px`), centered alignment. |

### 2.2 Browser Compatibility Matrix
- **Google Chrome / Chromium:** Version 115+ (Windows, macOS, Android, Linux).
- **Mozilla Firefox:** Version 115+ (Windows, macOS, Linux).
- **Apple Safari:** Version 16.0+ (iOS, iPadOS, macOS).
- **Microsoft Edge:** Version 115+ (Windows).

---

## 3. Comprehensive Feature Test Suite

### Suite 1: Navigation & Header Consistency
- [ ] **Brand Logo Routing:** Verify clicking the Sri Thirumala brand logo on consumer pages navigates strictly to `/home` (per user rules).
- [ ] **Announcement Ticker:** Verify banner is visible, dismissible via `(X)` button, and stays dismissed for the session.
- [ ] **Categories Mega-Menu:** Verify dropdown displays all 8 department links with descriptions and closes upon outside click or item selection.
- [ ] **Mobile Bottom Navigation:** Verify bar is visible on screens `< 768px`, displays live badge counts for Cart and Wishlist, and active route reflects correct color (`#FF7A50`).
- [ ] **Keyboard Tab Navigation:** Verify focus outlines (`:focus-visible`) travel logically through utility bar, logo, nav links, search, and action icons.

### Suite 2: Search Functionality & Autocomplete
- [ ] **Live Suggestions Preview:** Type `"NCERT"` or `"Classmate"` in the search input and verify preview dropdown displays matching titles, authors, and prices.
- [ ] **Catalog Multi-Field Query:** Search by:
  - Book title (e.g. `"Physics Class 12"`).
  - Author name (e.g. `"R.S. Aggarwal"`).
  - Publisher / Supplier (e.g. `"VGS Publishing"`).
  - ISBN code (e.g. `"978-81-7450"`).
- [ ] **Active Filter Chips:** Verify each selected filter displays a chip with an `(X)` removal button, and clicking `"Clear All Filters"` resets all criteria.
- [ ] **Sorting Orders:** Verify sorting by *Price: Low to High*, *Price: High to Low*, *Highest Rated*, and *Alphabetical* correctly sorts catalog items without page reloads.

### Suite 3: Product Pages & Customer Feedback
- [ ] **Gallery Thumbnails:** Verify clicking multi-angle thumbnails swaps the primary display image smoothly.
- [ ] **Image Zoom:** Verify hovering over the main product image enlarges the view cleanly without breaking card overflow.
- [ ] **Specification Sheet:** Verify Publisher, Edition, ISBN, Binding, Curriculum, Dimensions, and Weight render accurately in the specs tab.
- [ ] **Review Submission:**
  - Submit a test review with star rating, name, title, and comments.
  - Verify review is added to the top of the reviews list immediately with instant toast notification.
- [ ] **Review Helpfulness Counter:** Verify clicking `"Helpful"` increments the counter and prevents duplicate votes.
- [ ] **Direct WhatsApp Ordering:** Verify clicking the WhatsApp button opens WhatsApp with pre-filled book details and price.

### Suite 4: Cart & Checkout Workflow
- [ ] **Free Delivery Progress Bar:** Verify adding items dynamically calculates remaining amount to unlock free local delivery (`₹500` threshold).
- [ ] **Student Discount Coupons:**
  - Input coupon `STUDENT10` and verify 10% discount is applied to the subtotal.
  - Test coupon removal and invalid code feedback.
- [ ] **Checkout Validation:**
  - Verify full name (`≥ 3 chars`), Indian mobile number (`10 digits starting with 6-9`), and 6-digit postal code.
- [ ] **Delivery Preference:** Verify switching between *In-Store Pickup (Free)* and *Local Delivery (₹40)* updates total.
- [ ] **Payment Methods:** Verify selection between *Cash on Delivery (COD)* and *Instant UPI (with QR code and UPI ID preview)*.
- [ ] **Post-Order Receipt:** Verify order confirmation screen renders unique Order ID, WhatsApp confirmation button, and link back to `/home`.

### Suite 5: Study Blog & Content Marketing
- [ ] **Article Directory (`/blog`):** Verify category pills (*Exam Preparation*, *Stationery Guide*, *Study Tips*) correctly filter articles.
- [ ] **Article Reader (`/blog/:id`):** Verify header, author avatar, reading time, structured sections, bullet highlights, and share button.
- [ ] **Embedded Product Recommendations:** Verify book cards mentioned in the article link directly to the respective product detail page.

### Suite 6: Admin Portal & Sacred Iconography
- [ ] **Secure Authentication:**
  - Verify demo credentials (`admin123` / `password123`) are rejected.
  - Verify authorized credentials (`admin@srithirumala.com` / `SriThirumala@2025!`) generate valid session tokens.
- [ ] **Sacred Lord Venkateshwara Swamy Icons:** Verify the sacred *Namam*, *Shankha*, *Chakra*, *Padmam*, and *Kireetam* icons render crisply across the sidebar, cards, and headers.
- [ ] **Themed Blue Palette:** Verify primary deep blue (`#2196F3`), secondary sky blue (`#87CEEB`), and accent saffron (`#FF9800`) are applied consistently.
- [ ] **16:9 Metric Cards:** Verify admin dashboard metric cards maintain 16:9 proportions across screen sizes.
- [ ] **In-Store Customer Pickup Verification Modal:**
  - Open modal for a pending pickup order.
  - Check item handover checkboxes.
  - Input verification code.
  - Submit and verify order status changes to `"Delivered / Picked Up"` with timestamp logging.
- [ ] **Add Book Publication:** Verify adding a new book registers it in the catalog and list view in real time.

---

## 4. Accessibility & Performance Verification

### 4.1 Accessibility (WCAG 2.1 AA) Checklist
- [ ] **Color Contrast:** Verify all text-to-background combinations meet or exceed `4.5:1` contrast ratio.
- [ ] **Semantic Landmarks:** Verify `<header>`, `<nav>`, `<main id="main-content">`, and `<footer>` are properly indexed by accessibility inspectors.
- [ ] **Screen Reader Test:** Navigate using NVDA / VoiceOver to ensure buttons have meaningful `aria-label` tags.
- [ ] **Skip Link:** Press `Tab` upon initial page load to verify `"Skip to main content"` appears and focuses `#main-content`.

### 4.2 Performance & Core Web Vitals
- [ ] **Production Build Check:** Verify `npm run build` succeeds with zero errors.
- [ ] **Cumulative Layout Shift (CLS):** Ensure images and 16:9 frames have explicit aspect ratios to prevent page reflows.
- [ ] **Largest Contentful Paint (LCP):** Preload font headers and compress static images.
