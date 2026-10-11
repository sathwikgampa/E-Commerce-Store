# Sri Thirumala E-Commerce Store & App — Comprehensive Style Guide

## 1. Design Philosophy & Architectural Overview

The Sri Thirumala design system is organized into two distinct yet unified visual personas:

1. **The Consumer Storefront (`/home`, `/books`, `/book/:id`, `/cart`, `/checkout`, `/blog`):**
   - **Mood:** Warm, editorial, inviting, and academically credible.
   - **Aesthetics:** Warm Orange and Soft Peach tones combined with classical serif typography (*Lora*) for headings and modern sans-serif (*Inter* / *Outfit*) for interface text.
   - **Atmosphere:** Evokes a high-end, calm bookstore and academic center.

2. **The Admin & Inventory Portal (`/admin`, `/admin/login`, `/admin/inventory/*`):**
   - **Mood:** Clear, operational, authoritative, and structured.
   - **Aesthetics:** Deep blue (`#2196F3`) and sky blue (`#87CEEB`) paired with sacred saffron orange (`#FF9800`) and midnight navy (`#0B192C`) surfaces.
   - **Atmosphere:** Reflects the offline store's physical identity in Kamareddy, anchored by sacred iconography honoring **Sri Lord Venkateshwara Swamy**.

---

## 2. Color Palette & Design Tokens

### Storefront Consumer Palette
| Token | Value | Role |
| :--- | :--- | :--- |
| `--color-store-primary` | `#FF7A50` | Primary brand orange for buttons, links, active badges, and highlights. |
| `--color-store-primary-dark`| `#E05E34` | Hover and active pressed state for primary action buttons. |
| `--color-store-accent` | `#FFF7F5` | Default soft peach page canvas background and subtle card fills. |
| `--color-store-accent-dark`| `#FFEFEA` | Secondary container fill, category filter hover states, and card borders. |
| `--color-store-charcoal` | `#1A1A2E` | High-contrast utility bars, dark banners, and primary text colors. |
| `--color-store-charcoal-light`| `#2D3748`| Structured footer sections and secondary utility areas. |

### Admin Operational Palette
| Token | Value | Role |
| :--- | :--- | :--- |
| `--color-admin-primary` | `#2196F3` | Material-UI deep blue for primary admin actions, active tabs, and highlights. |
| `--color-admin-primary-dark`| `#1976D2` | Hover state for admin controls and header actions. |
| `--color-admin-secondary` | `#87CEEB` | Light sky blue for borders, secondary badges, and subtle glows. |
| `--color-admin-accent` | `#FF9800` | Saffron orange for urgent customer pickups, sacred tilaks, and pending alerts. |
| `--color-admin-surface-dark`| `#0B192C` | Deep midnight navy for the admin sidebar and high-contrast toolbars. |
| `--color-admin-surface-nav` | `#132B4F` | Secondary dark container backgrounds and active nav states. |
| `--color-admin-canvas` | `#F4F8FB` | Main dashboard canvas background ensuring optimal eye comfort. |

### Universal Functional Tokens
| State | Color | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Success** | Divine Emerald | `#10B981` / `#ECFDF5` | In-stock indicators, verified order pickups, delivered tags. |
| **Warning** | Amber Saffron | `#F59E0B` / `#FFFBEB` | Low stock inventory alerts, pending handovers, unconfirmed items. |
| **Danger** | Crimson Coral | `#EF4444` / `#FEF2F2` | Out of stock warnings, damaged inventory records, delete triggers. |

---

## 3. Typography Hierarchy

| Style | Font Family | Weight | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display 1** | *Lora*, Georgia, serif | 700 / 800 | `-0.025em` | Hero titles, editorial section headings (32px - 48px). |
| **Display 2** | *Lora*, Georgia, serif | 600 / 700 | `-0.015em` | Page titles, product titles, blog article headers (24px - 32px). |
| **UI Heading** | *Outfit* / *Inter*, sans-serif | 700 / 800 | `-0.01em` | Admin dashboard cards, table headers, drawer titles (16px - 20px). |
| **Body Regular** | *Inter* / *Open Sans*, sans-serif | 400 / 500 | `normal` | Book descriptions, article paragraphs, table cells (14px - 16px). |
| **UI Label** | *Inter*, sans-serif | 600 / 700 | `+0.05em` | Form labels, button captions, metadata tags (11px - 13px). |
| **Micro Badge** | *Inter*, sans-serif | 800 / 900 | `+0.12em` | Uppercase category badges, status chips, order codes (9px - 11px). |

---

## 4. Layout, Spacing & Grid System

### Responsive Breakpoints
- **Mobile (`< 640px`):** 1-column layouts, sticky bottom navigation bar, single-column product detail.
- **Tablet (`640px - 1024px`):** 2-column card grids, responsive collapsible filters.
- **Desktop (`1024px - 1280px`):** 3-column catalog grid, persistent sidebar, mega-dropdown navigation.
- **Wide Desktop (`> 1280px`):** 4-column catalog grid, max container width `1280px` (or `1400px` for landing hero).

### Aspect Ratios
- **16:9 Aspect Ratio (`aspect-[16/9]`):** Standardized across Admin metric cards, product detail media frames, and dashboard inspection panels to prevent layout shifts.
- **1:1 Aspect Ratio (`aspect-square`):** Catalog product thumbnail staging and social media community photos.

---

## 5. Reusable UI Components

The project includes an extensible component library in `frontend/src/components/ui/`:

1. **`Button` (`Button.tsx`):**
   - Supports variants: `primary`, `secondary`, `admin-primary`, `admin-secondary`, `admin-accent`, `outline`, `ghost`, `danger`.
   - Built-in loading spinners, leading icons, accessible `:focus-visible` ring.
2. **`Badge` (`Badge.tsx`):**
   - Supports variants: `warm`, `peach`, `admin-blue`, `saffron`, `emerald`, `rose`, `slate`.
   - Optional live pulsing status dot.
3. **`Breadcrumb` (`Breadcrumb.tsx`):**
   - Semantic `<nav aria-label="Breadcrumb">` generating accessible navigation trails with chevron separators.
4. **`Card` (`Card.tsx`):**
   - Modular `<Card>`, `<CardHeader>`, `<CardBody>`, and `<CardFooter>` with optional 16:9 proportions and glassmorphic blur.
5. **`SearchInput` (`SearchInput.tsx`):**
   - Unified search input with search icon, focus ring transitions, and instant clear button.

---

## 6. Iconography System

1. **Consumer Storefront:**
   - Lucide React icons with 1.75px stroke width for modern, lightweight, accessible rendering.
2. **Admin Portal (Lord Venkateshwara Swamy Sacred Insignia):**
   - **`VenkateshwaraNamamIcon`:** Sacred Vaishnava Thiruman with central Kasturi tilak.
   - **`ShankhaIcon`:** Panchajanya Divine Conch representing announcements and incoming shipments.
   - **`ChakraIcon`:** Sudarshana Disc representing order verification and turnaround.
   - **`PadmamIcon`:** Divine Lotus representing revenue and catalogue creations.
   - **`KireetamIcon`:** Golden Crown representing administrative branch security.
   - **`VenkateshwaraFullEmblem`:** Tri-emblem combining Shankha, Namam, and Chakra as the official Sri Thirumala seal.

---

## 7. Accessibility (WCAG 2.1 AA) Compliance Standards

1. **Keyboard Navigation & Visible Focus:**
   - All interactive controls have distinct `:focus-visible` rings with a minimum 2px offset (`outline: 2px solid var(--color-primary)`).
2. **Skip-to-Content Link:**
   - Anchored at `#main-content` at the top of the DOM in `index.html`.
3. **Semantic Landmarks:**
   - `<header role="banner">`, `<nav aria-label="...">`, `<main id="main-content">`, `<aside>`, `<footer role="contentinfo">`.
4. **Contrast Ratios:**
   - All text content maintains a minimum contrast ratio of `4.5:1` against its background surface.
5. **Screen Reader Attributes:**
   - Every icon-only button includes descriptive `aria-label` tags (e.g. `aria-label="View shopping cart with 2 items"`).
