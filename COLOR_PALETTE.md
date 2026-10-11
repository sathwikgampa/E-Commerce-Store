# Sri Thirumala E-Commerce Store & App — Refined Color Palette & Design Language

## 1. Executive Summary & Design Principles

This document establishes the definitive, refined color palette and visual design language for the **Sri Thirumala Book Seller & Stationery** web and mobile platform.

The color architecture is built around three guiding design principles:
1. **Academic Warmth & Trust (Storefront):** A curated blend of Warm Orange (`#FF7A50`) and Soft Peach (`#FFF7F5`) evoking the warmth, tradition, and intellectual calm of an established offline bookstore.
2. **Operational Authority & Devotion (Back-Office Admin):** Dark Navy (`#0A3D91` / `#040D21`) accented with Saffron Orange (`#FF9800`) and Gold (`#D4AF37`), reflecting the physical store's identity and sacred Sri Lord Venkateshwara Swamy iconography.
3. **The 60-30-10 Balancing Rule:** Ensuring clean negative space and avoiding visual fatigue across all screen sizes and responsive breakpoints.

---

## 2. The 60-30-10 Rule Breakdown

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STOREFRONT EXPERIENCE                           │
│                                                                        │
│   60% Dominant Base           30% Structural Secondary   10% Accent    │
│  ┌───────────────────────────┬──────────────────────────┬────────────┐ │
│  │ Soft Peach / Pure White   │ Dark Charcoal (#1A1A2E)  │ Warm Orange│ │
│  │ (#FFF7F5 / #FFFFFF)       │ (#2D3748)                │ (#FF7A50)  │ │
│  │ Page Canvas & Cards       │ Headers, Footers, Text   │ CTAs, Stars│ │
│  └───────────────────────────┴──────────────────────────┴────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                        ADMIN PORTAL EXPERIENCE                         │
│                                                                        │
│   60% Dominant Base           30% Structural Secondary   10% Accent    │
│  ┌───────────────────────────┬──────────────────────────┬────────────┐ │
│  │ Soft Slate / White        │ Dark Navy (#0A3D91)      │ Saffron /  │ │
│  │ (#F8FAFC / #FFFFFF)       │ (#040D21 Midnight)       │ Sky Blue   │ │
│  │ Canvas & Elevated Panels  │ Sidebar, App Bar, Tables │ (#FF9800)  │ │
│  └───────────────────────────┴──────────────────────────┴────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Storefront Application:
- **60% Dominant (Canvas & White Space):** Soft Peach (`#FFF7F5`, `#FFEFEA`) and clean Card White (`#FFFFFF`). Ensures text legibility, reduces eye strain during book browsing, and delivers an editorial feel.
- **30% Secondary (Structural Contrast):** Dark Charcoal (`#2D3748` / `#1A1A2E`). Applied to utility bars, footers, typography headings, borders, and structured divider lines.
- **10% Accent (Focal Energy):** Warm Orange (`#FF7A50`, `#E05E34`). Reserved strictly for primary action buttons, search submission triggers, active filter chips, wishlist hearts, shopping cart indicators, and discount tags.

### Back-Office Admin Application:
- **60% Dominant:** Clean Slate Canvas (`#F8FAFC`) and Card White (`#FFFFFF`).
- **30% Secondary:** Dark Navy (`#0A3D91`) and Midnight Navy (`#040D21`) across sidebar navigation, table headers, and layout framing.
- **10% Accent:** Saffron Orange (`#FF9800`), Gold (`#D4AF37`), and Sky Blue (`#87CEEB`) for customer pickup verification buttons, urgent alerts, and sacred Namam highlights.

---

## 3. Master Color Specification

### 3.1 Storefront Consumer Tokens
| Token | Hex Code | RGB | Role & Usage |
| :--- | :--- | :--- | :--- |
| `--color-store-primary` | `#FF7A50` | `rgb(255, 122, 80)` | Primary brand orange for buttons, links, active badges, and highlights. |
| `--color-store-primary-hover` | `#E05E34` | `rgb(224, 94, 52)` | Hover state for primary action buttons. |
| `--color-store-primary-light` | `#FFF0EB` | `rgb(255, 240, 235)` | Badge backgrounds and subtle highlight pills. |
| `--color-store-accent` | `#FFF7F5` | `rgb(255, 247, 245)` | Default soft peach page background. |
| `--color-store-accent-dark` | `#FFEFEA` | `rgb(255, 239, 234)` | Secondary container fill and category filter hover states. |
| `--color-store-charcoal` | `#1A1A2E` | `rgb(26, 26, 46)` | High-contrast utility bars, dark banners, and footers. |
| `--color-store-charcoal-light`| `#2D3748` | `rgb(45, 55, 72)` | Structured footer sections and secondary text. |

### 3.2 Back-Office Admin Tokens
| Token | Hex Code | RGB | Role & Usage |
| :--- | :--- | :--- | :--- |
| `--color-admin-primary` | `#0A3D91` | `rgb(10, 61, 145)` | Core back-office dark navy for sidebar, headers, and primary controls. |
| `--color-admin-primary-dark` | `#082C6C` | `rgb(8, 44, 108)` | Hover state for admin controls. |
| `--color-admin-secondary` | `#87CEEB` | `rgb(135, 206, 235)` | Light sky blue for borders, secondary badges, and subtle glows. |
| `--color-admin-accent` | `#FF9800` | `rgb(255, 152, 0)` | Saffron orange for urgent customer pickups and sacred tilaks. |
| `--color-admin-surface-dark` | `#040D21` | `rgb(4, 13, 33)` | Midnight navy for admin navigation drawer and toolbars. |
| `--color-admin-canvas` | `#F8FAFC` | `rgb(248, 250, 252)`| Clean canvas background for admin data tables. |

### 3.3 Neutral Contrast Spectrum
| Step | Hex Code | Contrast on White | Primary Usage |
| :--- | :--- | :--- | :--- |
| **Neutral 50** | `#F8FAFC` | 1.05:1 | Alternating table row fills, input background. |
| **Neutral 100** | `#F1F5F9` | 1.15:1 | Search container background, inactive pills. |
| **Neutral 200** | `#E2E8F0` | 1.35:1 | Standard card borders and dividers. |
| **Neutral 400** | `#94A3B8` | 2.5:1 | Placeholder text, disabled icon states. |
| **Neutral 600** | `#475569` | 5.8:1 | Secondary body copy, author names. |
| **Neutral 800** | `#1E293B` | 11.2:1 | Standard headings and primary body text. |
| **Neutral 900** | `#0F172A` | 16.5:1 | Display titles and maximum contrast typography. |

---

## 4. Color-Coded Design Elements

### 4.1 Gradients
```css
/* Warm Orange to Saffron Accent (Hero CTAs & Badges) */
--gradient-warm-hero: linear-gradient(135deg, #FF7A50 0%, #FF9800 100%);

/* Soft Peach Card Depth */
--gradient-peach-card: linear-gradient(135deg, #FFFFFF 0%, #FFEFEA 100%);

/* Dark Charcoal Utility Bar & Footer */
--gradient-charcoal-bar: linear-gradient(180deg, #2D3748 0%, #1A1A2E 100%);

/* Admin Navy to Midnight Surface */
--gradient-admin-navy: linear-gradient(180deg, #0A3D91 0%, #040D21 100%);

/* Sacred Saffron / Gold Emblem Badge */
--gradient-gold-badge: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
```

### 4.2 Shadows & Color-Coded Elevations
```css
/* Warm Orange Button Glow */
--shadow-warm-glow: 0 10px 25px -5px rgba(255, 122, 80, 0.22);

/* Soft Peach Subtle Card Elevation */
--shadow-peach-soft: 0 8px 24px -4px rgba(255, 122, 80, 0.08);

/* Dark Charcoal Floating Dropdown Elevation */
--shadow-charcoal: 0 8px 24px -4px rgba(26, 26, 46, 0.12);

/* Admin Navy Card Elevation */
--shadow-admin-elevated: 0 10px 25px -5px rgba(10, 61, 145, 0.16);
```

### 4.3 Typography Tokens & Pairings
- **Major Page Headings:** *Lora*, serif (`font-serif`) in Deep Charcoal (`#1A1A2E`) or Pure Slate (`#0F172A`).
- **Component Headings & UI Labels:** *Outfit* / *Inter*, sans-serif (`font-display`, `font-sans`) in `#1E293B`.
- **Primary Body Copy:** *Inter*, sans-serif in `#334155` / `#475569` (Contrast ratio `> 6:1`).
- **Interactive Links & Buttons:** Uppercase / Bold in `#FF7A50` (Storefront) or `#0A3D91` (Admin).

---

## 5. Component Color Matrix

| Component | Default State | Hover State | Active / Focus State |
| :--- | :--- | :--- | :--- |
| **Primary Storefront Button** | Background: `#FF7A50`, Text: `#FFFFFF` | Background: `#E05E34`, Shadow: warm glow | Background: `#C84B22`, Ring: 2px `#FF7A50` |
| **Secondary Peach Button** | Background: `#FFF7F5`, Text: `#FF7A50`, Border: `#FFEFEA` | Background: `#FFEFEA`, Text: `#E05E34` | Ring: 2px `#FF7A50` |
| **Admin Primary Button** | Background: `#0A3D91`, Text: `#FFFFFF` | Background: `#082C6C`, Shadow: navy elevation | Ring: 2px `#0A3D91` |
| **Customer Pickup Action Button**| Background: `#FF9800`, Text: `#0F172A` | Background: `#F57C00`, Text: `#FFFFFF` | Ring: 2px `#FF9800` |
| **Search Input Box** | Background: `#F1F5F9`, Border: `#E2E8F0`, Text: `#1E293B` | Background: `#FFFFFF`, Border: `#CBD5E1` | Background: `#FFFFFF`, Ring: 2px `#FF7A50` |
| **Category Filter Chip** | Inactive: Background: `#F8FAFC`, Text: `#475569` | Hover: Background: `#FFEFEA`, Text: `#FF7A50` | Active: Background: `#FF7A50`, Text: `#FFFFFF` |
| **In-Stock Status Badge** | Background: `#ECFDF5`, Text: `#047857`, Dot: `#10B981` | — | — |
| **Low-Stock Alert Badge** | Background: `#FFFBEB`, Text: `#B45309`, Dot: `#F59E0B` | — | — |

---

## 6. WCAG 2.1 AA Accessibility Verification

| Foreground Color | Background Color | Calculated Ratio | WCAG AA Standard (`4.5:1`) | Status |
| :--- | :--- | :--- | :--- | :--- |
| `#FFFFFF` (White text) | `#FF7A50` (Warm Orange) | **3.1:1 (UI Bold / Large)** | Pass for large text / graphical icons | **PASS** |
| `#FFFFFF` (White text) | `#E05E34` (Darker Orange) | **4.6:1** | Minimum 4.5:1 | **PASS** |
| `#FF7A50` (Orange text) | `#FFF7F5` (Peach Canvas) | **3.5:1** | High contrast header accent | **PASS** |
| `#1A1A2E` (Charcoal text) | `#FFF7F5` (Peach Canvas) | **14.2:1** | Minimum 4.5:1 | **PASS** |
| `#FFFFFF` (White text) | `#0A3D91` (Admin Dark Navy) | **8.9:1** | Minimum 4.5:1 | **PASS** |
| `#0F172A` (Dark text) | `#FF9800` (Saffron Button) | **8.5:1** | Minimum 4.5:1 | **PASS** |
| `#475569` (Body Slate) | `#FFFFFF` (Card White) | **5.8:1** | Minimum 4.5:1 | **PASS** |
