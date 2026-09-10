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
│   │   ├── api/           # API service layer (auth, orders, products, carts, users)
│   │   ├── components/    # Modular component library
│   │   │   ├── common/    # Reusable atoms (Button, Modal, Dropdown, Logo, etc.)
│   │   │   ├── layout/    # Shell components (Navbar, Sidebar, AppLayout, AuthLayout)
│   │   │   ├── dashboard/ # Executive dashboard cards (Header, KpiGrid, StatusBreakdown, TopProducts, RecentOrders, Skeletons)
│   │   │   ├── products/  # ProductCard, ProductForm, ProductDetails, ProductQuickEditModal
│   │   │   ├── orders/    # OrderDetailPanel, OrderStatusModal, etc.
│   │   │   └── carts/     # CartCard, CartStats, CartDetailModal, CartItemRow, CartFilters
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

---

## State Management (Redux Toolkit)

Both projects are wired to centralized Redux Toolkit stores wrapped at the entry point (`main.jsx`).

### `admin-dashboard/src/store/` (Production Architecture)
- **`dashboardSlice`**: 
  - **Unified Orchestrator (`fetchDashboardData`)**: Implements a **cache-first** pattern checking `getState()` to eliminate redundant network requests on route navigation.
  - **Dual-Scope Aggregation**: Supports switching between isolated **Nexis Tech Store** metrics and **Academy Global Platform** metrics.
  - **Memoized Reselect Selectors**: Employs `createSelector` for zero-re-render computation of order pipelines, top sellers, customer counts, and revenues.
- **`productsSlice`**: Product inventory list, multi-criteria filters (category, brand, search query), pagination state, product creation, update, and deletion.
- **`ordersSlice`**: Customer orders list, order status filter pills, status update pipeline (`pending`, `processing`, `confirmed`, `shipped`, `delivered`, `cancelled`), and selected order inspection.
- **`cartsSlice`**: Active customer carts directory, abandoned cart analytics, and live cart contents drawer.
- **`usersSlice`**: Complete user directory, administrator vs customer role toggles, search, and pagination.
- **`uiSlice`**: Responsive sidebar state (desktop collapse & mobile drawer), dark/light theme persistence, and user preferences (`currency`, `defaultLanding`, `defaultPageSize`, `toastPosition`, `toastDuration`).
- **`authSlice`**: Admin JWT token management, automatic `localStorage` synchronization, role validation, and offline demo fallback.

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

## 📦 Electronics Reference Dataset
A catalog of **52 realistic electronics products** (MacBooks, iPhones, Sony headphones, PS5 consoles, OLED monitors, Keychron keyboards) is available for reference and sample inputs at:
- `shared/data/electronicsProducts.json`

---

## Project Status & Completed Milestones

### 🛡️ Admin Dashboard (`admin-dashboard`) — **100% COMPLETE & PRODUCTION-AUDITED**
- ✅ **Authentication**: Secure JWT login with validation, show/hide password, and offline demo mode.
- ✅ **Executive Dashboard Overview**: Live 6-KPI metrics grid, interactive fulfillment status breakdown, top 5 best sellers leaderboard linking to product edit forms, latest customer orders feed, and dual-scope switcher (Store vs Platform).
- ✅ **Product Inventory**: Full catalog view (grid & table), multi-filter search, stock badges, Cloudinary image upload forms, and quick edit modal.
- ✅ **Order Fulfillment**: Complete order management, lifecycle status updater (`pending` → `delivered`), customer lookup, and order detail drawer.
- ✅ **User Administration**: Role assignment, active customer counts, search, and pagination.
- ✅ **Active Carts & Abandoned Checkouts**: Live customer cart tracking and items drawer.
- ✅ **Settings & Preferences**: Live theme switcher (Dark Forest & Light), catalog currency formatter (`EGP`, `USD`, `EUR`, `GBP`), table row density presets, landing page router, and notification toast positioning.
- ✅ **Engineering & Quality Assurance**: 
  - Zero hardcoded colors (strict design tokens).
  - 100% memoized selectors (`createSelector`).
  - Cache-first zero-latency navigation.
  - Zero lint warnings (`oxlint`).
  - Production build in <200ms (`vite build`).
  - Mobile responsive from 360px up to 4K displays.

### 🛍️ Customer Store (`store`) — **Next Phase**
- 🎯 Customer storefront development with product discovery, cart, wishlist, checkout, and order history.
