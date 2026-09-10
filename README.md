# Nexis Tech — Electronics & Hardware E-Commerce Platform

Welcome to the **Nexis Tech** e-commerce project repository. This project is built as part of the SEF Academy Frontend Training Program, consisting of two interconnected React applications communicating with a live Express/MongoDB REST API.

---

## Monorepo Structure

```text
ecommerce-project/
├── .env                   # Single shared environment file (VITE_API_URL)
├── .env.example           # Shared environment template
├── .gitignore             # Root gitignore (ignores .env, node_modules, dist)
├── package.json           # Root workspace script runner
├── README.md              # Shared project documentation
├── shared/                # Shared datasets & resources
│   └── data/
│       └── electronicsProducts.json
├── admin-dashboard/       # Enterprise Admin Control Panel (Port 5174)
│   ├── src/
│   │   ├── api/           # API service layer (auth, orders, products, carts, users, axios)
│   │   ├── components/    # Modular component library
│   │   │   ├── common/    # Reusable UI primitives (Badge, Button, Dropdown, Input, Logo, Modal, Pagination)
│   │   │   ├── layout/    # Shell components (Navbar, Sidebar, AppLayout, AuthLayout)
│   │   │   ├── dashboard/ # Executive dashboard cards (Header, KpiGrid, StatusBreakdown, TopProducts, RecentOrders, Skeletons)
│   │   │   ├── products/  # ProductCard, ProductForm, ProductDetails, ProductQuickEditModal
│   │   │   ├── orders/    # OrderDetailPanel, OrderStatusModal, etc.
│   │   │   └── carts/     # CartCard, CartStats, CartDetailModal, CartItemRow, CartFilters
│   │   ├── constants/     # Allowed categories, subcategories & catalog validation rules (categories.js)
│   │   ├── pages/         # Application page views
│   │   │   ├── auth/      # Login.jsx (with instant demo credentials fill)
│   │   │   ├── dashboard/ # DashboardOverview.jsx (Executive real-time metrics & feeds)
│   │   │   ├── products/  # Products.jsx, AddProduct.jsx, EditProduct.jsx
│   │   │   ├── orders/    # OrdersPage.jsx (Order tracking & status pipeline)
│   │   │   ├── users/     # UserList.jsx (User & administrator directory)
│   │   │   ├── carts/     # Carts.jsx (Customer carts & abandoned checkout monitor)
│   │   │   ├── settings/  # SettingsPage.jsx (Theme, currency, density, toasts, landing view)
│   │   │   └── error/     # NotFound.jsx (404 error page)
│   │   ├── routes/        # AppRoutes.jsx, ProtectedRoute.jsx
│   │   ├── store/         # Redux Toolkit store & slices (auth, products, orders, carts, users, dashboard, ui)
│   │   ├── utils/         # Utility modules: formatters.js, orderNotes.js, storeCatalog.js
│   │   ├── index.css      # Tailwind v4 theme, Nexis Tech design tokens & fonts
│   │   └── main.jsx       # App entry (Redux Provider, BrowserRouter, ToastContainer)
│   └── vite.config.js     # Port 5174, @ alias, Tailwind v4
│
└── store/                 # Customer-facing storefront (Port 5173)
    ├── src/
    │   ├── api/           # API service layer
    │   ├── components/    # Reusable UI & layout components
    │   ├── constants/     # Electronics categories & brands constants
    │   ├── pages/         # Screen folders (products, auth, checkout, profile)
    │   ├── routes/        # Protected & guest route definitions
    │   ├── store/         # Redux Toolkit store & slices
    │   ├── index.css      # Tailwind v4 theme & styling
    │   └── main.jsx       # App entry (Provider, BrowserRouter, ToastContainer)
    └── vite.config.js     # Port 5173, @ alias, Tailwind v4
```

---

## Quick Start & Development

### Prerequisites
- Node.js `v18+` (recommended: `v20+` or `v24+`)
- npm `v9+`

### Installation
Run `npm install` inside both project directories:
```bash
# In admin-dashboard
cd admin-dashboard && npm install

# In store
cd ../store && npm install
```

### Running the Development Servers

You can run both projects from the **workspace root** using shortcut scripts:

```bash
# Run Admin Dashboard (http://localhost:5174)
npm run dev:admin

# Run Customer Store (http://localhost:5173)
npm run dev:store
```

Or navigate to each folder directly:
```bash
# Admin Dashboard
cd admin-dashboard
npm run dev

# Online Store
cd store
npm run dev
```

### Dedicated Ports:
| App | Local URL | Port |
| :--- | :--- | :--- |
| **Online Store** | `http://localhost:5173` | `5173` |
| **Admin Dashboard** | `http://localhost:5174` | `5174` |

---

## Design System & Branding

### 1. Typography
- **Heading Font**: **Plus Jakarta Sans** (`300` - `800`) — Applied across headings, titles, and KPI counters via `font-heading`.
- **Body Font**: **Inter** (`100` - `900`) — Applied globally across body copy, tables, forms, and metadata via `--font-sans`.
- **Fallback**: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

### 2. Nexis Tech Signature Palette (Tailwind CSS v4 `@theme`)
Configured dynamically in `admin-dashboard/src/index.css`:

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `--color-primary-dark` | `#2F4842` | Deep Pine Forest — Master buttons, active states, dark borders |
| `--color-primary-medium` | `#44635B` | Medium Sage — Subtle button hovers, badges, icon backgrounds |
| `--color-accent-gold` | `#DDA136` | Warm Gold — Revenue metrics, star ratings, primary accent highlights |
| `--color-accent-gold-hover`| `#C58C2B` | Deep Amber Gold — Interactive hover states for accent buttons |
| `--color-bg-main` | `#E1E8E6` | Sage Mist Canvas — Light mode application background |
| `--color-bg-card` | `#FFFFFF` | Pure White Surface — Light mode cards, modals, and tables |
| `--color-bg-input` | `#D5DDD9` | Input Field Tint — Form inputs and dropdown surfaces |
| `--color-text-primary` | `#2B3332` | Charcoal Primary — Primary headings, titles, and body text |
| `--color-text-secondary` | `#6B7B76` | Muted Sage Slate — Subtitles, table headers, and timestamp labels |
| `--color-dark-bg-main` | `#1D2826` | Obsidian Forest Canvas — Dark mode main application background |
| `--color-dark-bg-card` | `#253531` | Deep Emerald Card — Dark mode cards, modals, and navigation surfaces |

### 3. Reusable Vector Logo Component
Both apps include an SVG `Logo` component representing the Nexis Tech brand mark:
- Location: `src/components/common/Logo.jsx`
- **Usage Example**:
  ```jsx
  import Logo from '@/components/common/Logo';

  // Light variant (for dark backgrounds like sidebar or dark headers)
  <Logo variant="light" size="sm" />

  // Dark variant (for white backgrounds or light headers)
  <Logo variant="dark" size="md" />

  // Icon only without text
  <Logo variant="dark" size="sm" showText={false} />
  ```

### 4. Common UI Primitives (`admin-dashboard/src/components/common/`)
To eliminate duplicate code and enforce consistent styling across all pages, common UI primitives are centralized:

- **`Badge.jsx`**: Semantic status pills and taxonomy tags.
  - Standardized color variants: `success` (green), `warning` (amber), `danger` (rose/red), `info` (sky/blue), `purple` (indigo/purple), `gold` (accent gold), `default` (slate), and `outline`.
  - Configurable sizes (`sm`, `md`) and optional pulsing dot indicators. Deployed across 15+ cards, tables, and modal views.
- **`Pagination.jsx`**: Universal responsive pagination bar.
  - Automatically calculates and displays the current item slice (`Showing 1 to 10 of 24 items`).
  - Supports dynamic page boundary jumping, direct page selection buttons, and previous/next controls. Automatically hides if total items fit within a single page.
- **`Button.jsx`**: Universal design-system interactive button.
  - 7 stylistic variants: `primary`, `secondary`, `outline`, `gold`, `danger`, `ghost`, and `subtle`.
  - Built-in loading state with animated SVG spinner, left/right icon injection, disabled state enforcement, and prop overrides via nullish coalescing.
- **`Dropdown.jsx`**: Accessible custom dropdown selector with keyboard support, replacing unstylable native `<select>` tags across filters, forms, and settings.
- **`Modal.jsx`**: Accessible dialog overlay with backdrop dismiss, Escape key listener, smooth fade transitions, and structured header, body, and action footer slots.
- **`Input.jsx`**: Standardized text, number, and search inputs with unified borders, focus rings, and dark mode styling.

---

## State Management (Redux Toolkit)

Both projects are wired to centralized Redux Toolkit stores wrapped at the entry point (`main.jsx`).

### `admin-dashboard/src/store/` (Production Architecture)
- **`dashboardSlice`**: 
  - **Unified Orchestrator (`fetchDashboardData`)**: Implements a **cache-first** pattern checking `getState()` to eliminate redundant network requests on route navigation.
  - **Strict Store Isolation & Single Source of Truth**: Computes real-time revenue, order fulfillment pipelines, and top-selling electronics directly from the store-scoped domain slices.
  - **Memoized Reselect Selectors**: Employs `createSelector` for zero-re-render computation of order pipelines, top sellers, customer counts, and revenues.
- **`productsSlice`**: 
  - **Single Source of Truth**: Manages inventory items, multi-criteria filters (category, brand, search query), pagination state, and CRUD operations.
  - **Memoized Catalog Stats Selector (`selectProductCatalogStats`)**: Uses `createSelector` to derive catalog totals, in-stock, out-of-stock, featured, and draft counts in a single memoized pass for `ProductStats.jsx` and `Products.jsx`.
  - **Universal Catalog Lookup (`selectStoreCatalogLookup`)**: Pre-computes $O(1)$ `Set` lookup structure across the entire app for instant order/cart line item matching.
  - **Draft / Inactive Persistence**: Slice-level `localStorage` hydration (`nexis_draft_products`) ensures unpublished/draft products persist across page reloads without disappearing due to backend public-only filters.
- **`ordersSlice`**: Customer orders list, order status filter pills, status update pipeline (`pending`, `processing`, `confirmed`, `shipped`, `delivered`, `cancelled`), and selected order inspection.
- **`cartsSlice`**: Active customer carts directory, abandoned cart analytics, and live cart contents drawer.
- **`usersSlice`**: Complete user directory, administrator vs customer role toggles, search, and pagination.
- **`uiSlice`**: Responsive sidebar state (desktop collapse & mobile drawer), dark/light theme persistence, and user preferences (`currency`, `defaultLanding`, `defaultPageSize`, `toastPosition`, `toastDuration`).
- **`authSlice`**: Admin JWT token management, automatic `localStorage` synchronization, role validation, designated admin email resilience (`admin@nexis.com`, `admin@koda.com`), and offline demo fallback.

---

## Business Logic, Utilities & Catalog Constants

Because the application communicates with a shared training backend hosting multiple projects, dedicated constants and high-performance utilities ensure **strict store isolation** and **data integrity**:

### 1. Catalog Scope & Constants (`src/constants/categories.js`)
- **`ALLOWED_CATEGORIES`**: Strictly limited to `['electronics', 'hardware']`.
- **`ALLOWED_SUBCATEGORIES`**: `laptops`, `smartphones`, `tablets`, `audio`, `gaming`, `wearables`, `cameras`, `accessories`.
- **`isElectronicsOrHardwareProduct(product)`**: Validates incoming products against official categories, subcategories, and tags to prevent cross-contamination from non-electronics records.

### 2. Store Catalog Isolation Utilities (`src/utils/storeCatalog.js`)
- **`buildStoreCatalogLookup(reduxProducts)`**: Generates high-performance `Set` lookups (`ids`, `names`) derived directly from live products in Redux state (`state.products.items`).
- **`isStoreItem(item, lookup)`**: Validates whether a line item belongs to Nexis Tech's electronics catalog.
- **`isStoreOrder(order, lookup)` & `filterStoreOrder(order, lookup)`**: Filters platform orders to isolate Nexis Tech items, recalculating store subtotal, taxes, shipping fees, and accurate gross/net revenue.
- **`isStoreCart(cart, lookup)` & `filterStoreCart(cart, lookup)`**: Filters active carts to calculate accurate abandoned cart values specifically for Nexis Tech merchandise.

### 3. Client-Side Image Compression (`src/utils/imageCompression.js`)
- **`compressImageFile(file, maxSizeKB = 500)`**: Framework-agnostic HTML5 Canvas compression pipeline that dynamically resizes high-resolution camera uploads to max 1600x1600 and compresses to JPEG (quality 0.85). Guarantees files remain below 500 KB to eliminate Vercel 4.5MB payload limit errors (`413 Payload Too Large`).

### 4. Modular Product Form Architecture (`src/components/products/form/`)
The monolithic product form was cleanly refactored from a 987-line file into a focused orchestrator (`ProductForm.jsx`) with 6 modular subcomponents:
- **`ProductGeneralInfo`**: Title, brand, short description, and rich specifications textarea.
- **`ProductMediaGallery`**: Drag-and-drop cover photo and multi-image upload grid with instant canvas compression.
- **`ProductPricingInventory`**: Base price, discount price, stock count, SKU, and barcode.
- **`ProductStatusCard`**: Real-time publish status toggle (`Active in Store` vs `Draft / Hidden`) and featured showcase switch.
- **`ProductOrganizationCard`**: Category and subcategory selectors with interactive tag management.
- **`ProductReadinessChecklist`**: Dynamic quality indicator validating complete listing readiness before publishing.
- **Multer Tag Array Guarantee**: Enforces $\ge 2$ tags during `FormData` serialization, preventing Express/Joi validator rejection caused by single-item string collapse.

### 5. Universal Formatters (`src/utils/formatters.js`)
- **`formatCurrency(amount, currency = 'USD')`**: Centralized, locale-safe currency formatting supporting `EGP`, `USD`, `EUR`, and `GBP` with graceful numeric fallbacks.
- **`formatDate(dateString, options)`**: Standardized human-readable date and time formatting across order histories, table timestamps, and user registration dates.

### 6. Multi-Key Persistent Order Notes (`src/utils/orderNotes.js`)
- **`getOrderNotes(orderId)` / `saveOrderNotes(orderId, notes)`**: High-reliability admin note persistence in `localStorage` supporting both raw MongoDB `_id` and normalized `orderId` keys for seamless order fulfillment tracking.

### 7. Store Isolation & Resilient Pagination Architecture
The admin dashboard implements a unified client-side pagination pattern across all primary catalog views (`Products.jsx`, `OrdersPage.jsx`, `carts.jsx`, `UserList.jsx`):
- **Store-Scoped Range Calculation**: Item counts and page boundaries are computed directly from the store-scoped dataset (`scopedItems.length`) rather than raw platform arrays. This prevents "ghost" empty pages (e.g. browsing to page 5 when Nexis Tech only has 2 records).
- **Boundary Clamping (`safePage`)**: Dynamic page clamping via `Math.min(currentPage, totalPages || 1)` ensures that adjusting filters or switching stores automatically clamps out-of-bounds pagination indices back to valid ranges.
- **Global Preferences Sync**: Initial rows-per-page defaults are tied directly to the Redux UI preferences slice (`defaultPageSize`), controllable via the **Settings** page (`10`, `25`, `50`, or `100` rows).

### 8. Live MongoDB Backend Seeding (Zero Local Mocks)
To ensure the dashboard is immediately vibrant, operational, and accurately displays realistic metrics before customer storefront transactions begin, the live MongoDB backend was seeded directly via the REST API:
- **Customer Accounts**: 9 distinct customer accounts registered in MongoDB with valid credentials and customer profiles.
- **Electronics Orders**: Real orders placed via `POST /orders` using live seeded electronics products (MacBook Pro 16, iPhone 18 Pro Max, Sony WH-1000XM5, Belkin charging docks, OLED monitors) with complete shipping addresses.
- **Order Lifecycle States**: Orders updated via `PATCH /orders/admin/:id/status` across varied fulfillment states (`delivered`, `shipped`, `processing`, `confirmed`, `pending`) with realistic admin operational notes.
- **Active Shopping Carts**: Customer sessions populated with electronics items via `POST /carts/items` for live abandoned cart monitoring.
- **100% Pure Live Architecture**: Zero mock data or fallback files exist in the client codebase—the admin dashboard communicates directly and strictly with the live MongoDB database.

---

## Backend API & Authentication

Both apps communicate with the SEF Academy training backend:
- **API Base URL**: `https://e-commerce-api-3wara.vercel.app`
- **Swagger Documentation**: `https://e-commerce-api-3wara.vercel.app/api-docs`
- **Environment Variable**: `VITE_API_URL` (defined in `.env`)

### Test Admin Credentials:
- **Email**: `admin@nexis.com` or `admin@koda.com`
- **Password**: `admin1212`
- *(The Admin Login screen includes an instant **Quick Fill Demo Credentials** button).*

### Test Customer Credentials:
- **Email**: `customer@koda.com`
- **Password**: `customer1212`

### Important API Technical Notes:
1. **JWT Authentication**:
   - The token is stored in `localStorage.getItem('admin_token')`.
   - `src/api/axios.js` automatically attaches `Authorization: Bearer <token>` to every request via an Axios request interceptor.
   - A response interceptor catches `401 Unauthorized` responses and cleans up credentials.
2. **Product Image Uploads (Cloudinary)**:
   - `POST /products` and `PUT /products/:id` support `multipart/form-data` with binary image files (`images`).
3. **Array Fields in FormData**:
   - When sending `tags`, append each tag individually to FormData:
     ```js
     tags.forEach(tag => formData.append('tags', tag));
     ```

---

## Electronics Reference Dataset
A catalog of **52 realistic electronics products** (MacBooks, iPhones, Sony headphones, PS5 consoles, OLED monitors, Keychron keyboards) is available for reference and sample inputs at:
- `shared/data/electronicsProducts.json`

---

## Project Status & Completed Milestones

### Admin Dashboard (`admin-dashboard`) — **100% COMPLETE & PRODUCTION-AUDITED**
- ✅ **Authentication**: Secure JWT login with validation, show/hide password, and offline demo mode.
- ✅ **Executive Dashboard Overview**: Live 6-KPI metrics grid, interactive fulfillment status breakdown, top 5 best sellers leaderboard linking to product edit forms, latest customer orders feed, and real-time live MongoDB synchronization.
- ✅ **Product Inventory**: Full catalog view (grid & table), multi-filter search (including Drafts & Inactive), high-contrast status badges, modular 6-component product form, client-side canvas image compression (≤500KB), Cloudinary image upload, and quick edit modal.
- ✅ **Order Fulfillment**: Complete order management, lifecycle status updater (`pending` → `delivered`), customer lookup, and order detail drawer.
- ✅ **User Administration**: Role assignment, active customer counts, search, and pagination.
- ✅ **Active Carts & Abandoned Checkouts**: Live customer cart tracking and items drawer.
- ✅ **Settings & Preferences**: Live theme switcher (Dark Forest & Light), catalog currency formatter (`EGP`, `USD`, `EUR`, `GBP`), table row density presets, landing page router, and notification toast positioning.
- ✅ **Engineering & Quality Assurance**: 
  - Zero hardcoded colors (strict design tokens & Tailwind v4 `@theme`).
  - Centralized UI primitive library (`Badge`, `Pagination`, `Button`, `Dropdown`, `Modal`, `Input`, `Logo`).
  - Resilient store-isolated pagination architecture with dynamic safe-page clamping.
  - Multi-key persistent admin order notes (`localStorage`).
  - 100% memoized selectors (`createSelector`).
  - Cache-first zero-latency navigation.
  - Zero lint warnings (`oxlint`).
  - Production build in <200ms (`vite build`).
  - Mobile responsive from 360px up to 4K displays.

### Customer Store (`store`) — **Next Phase**
- 🎯 Customer storefront development with product discovery, cart, wishlist, checkout, and order history.
