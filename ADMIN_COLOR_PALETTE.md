# Sri Thirumala Admin Portal — UI Color Palette & Design System

## Brand Identity & Color Specification

The Admin Portal UI has been updated to reflect the offline bookstore's core brand identity, honoring **Sri Lord Venkateshwara Swamy** with a harmonious blue and saffron palette.

### 1. Primary Colors
| Role | Color Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Blue | `#2196F3` | Main interactive controls, active sidebar links, primary buttons, focal highlights, and table headers. |
| **Secondary** | Light Sky Blue | `#87CEEB` | Card borders, secondary state backgrounds, hover accents, subtle dividers, and badge fills. |
| **Accent** | Vibrant Saffron Orange | `#FF9800` | Sacred Namam central tilak, urgent stock warnings, pending verification alerts, and action chips. |

### 2. Supporting Neutral & Surface Palette
| Role | Color Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Dark Navy Surface** | Midnight Navy | `#0B192C` | Admin Sidebar background, utility toolbars, and high-contrast navigation headers. |
| **Dark Navy Hover** | Deep Slate Blue | `#132B4F` | Sidebar hover state and secondary dropdown backgrounds. |
| **Canvas Background** | Soft Slate Azure | `#F4F8FB` | Main dashboard canvas background ensuring optimal visual contrast and low eye fatigue. |
| **Card White** | Pure Card Surface | `#FFFFFF` | Material-UI inspired elevated card surfaces with subtle borders and shadows. |
| **Success State** | Divine Emerald | `#10B981` | Delivered orders, in-stock products, verified student customer pickup tags. |
| **Warning State** | Amber Gold | `#F59E0B` | Low stock inventory alerts, pending pickups, awaiting physical verification. |
| **Danger State** | Crimson Coral | `#EF4444` | Damaged inventory items, cancelled orders, delete actions. |

---

## Sri Lord Venkateshwara Swamy Sacred Iconography

In accordance with project requirements, standard generic React icons within the Admin Portal have been replaced with sacred iconography representing **Sri Lord Venkateshwara Swamy** (Tirumala):

1. **Venkateshwara Namam (Thiruman / Urdhva Pundra):**
   - The sacred upright white Vaishnava flanks with the central golden saffron Kasturi tilak.
   - Used for the primary store badge, portal branding, and verified status insignia.
2. **Shankha (Panchajanya Conch):**
   - Held in Lord Venkateshwara's upper left hand, representing divine cosmic sound, order, and announcements.
   - Used for catalog announcements, notification centers, and incoming shipments.
3. **Chakra (Sudarshana Sacred Disc):**
   - Held in Lord Venkateshwara's upper right hand with radiant spokes, representing cosmic protection, precision, and order tracking.
   - Used for order processing, inventory turnover, and operational workflows.
4. **Padmam (Divine Lotus):**
   - Symbol of Sri Padmavathi Devi and divine prosperity.
   - Used for financial statistics, revenue, and product catalogs.
5. **Kireetam (Divine Crown):**
   - The towering golden crown of Lord Venkateshwara Swamy.
   - Used for admin privilege indicators, security verification, and master store controls.
6. **Sri Venkateshwara Tri-Emblem (`FullEmblem`):**
   - Unified sacred emblem combining Shankha, Thiruman (Namam), and Chakra on a golden pedestal.
   - Serves as the official brand seal of Sri Thirumala Admin Portal.

---

## UI Patterns & Architectural Decisions

1. **Material-UI Inspired Elevated Design:**
   - Soft card elevations (`box-shadow: 0 4px 20px -2px rgba(33, 150, 243, 0.08)`).
   - Clear input outlines that glow with `#2196F3` on active focus.
   - High-clarity typography with Open Sans / Inter / Outfit.
2. **Bootstrap-Inspired 12-Column Grid:**
   - 16:9 proportional cards and 12-column grid layout for multi-device responsiveness.
3. **Structured Breadcrumb Navigation:**
   - Standardized `Dashboard > Order Management > In-Store Pickup Verification` path tracking on every screen.
4. **Physical In-Store Customer Pickup Verification Dialog:**
   - Integrated Bootstrap-inspired verification modal allowing admins to check order tokens, student verification IDs, and stamp pickup completion.
