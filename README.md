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
├── admin-dashboard/       # Admin control panel (loads root .env via envDir: '../')
│   ├── src/
│   │   ├── api/           # API service layer (mapped to Swagger endpoints)
│   │   ├── components/    # Reusable UI & layout components
│   │   ├── data/          # 52-item electronics dataset
│   │   ├── pages/         # 9 PRD screen folders (products, orders, users, carts)
│   │   ├── routes/        # Protected & public route definitions
│   │   ├── store/         # Redux Toolkit store & slices
│   │   ├── utils/         # Seeder and helper utilities
│   │   ├── index.css      # Tailwind v4 theme, Lato/Roboto fonts & palette
│   │   └── main.jsx       # App entry (Provider, BrowserRouter, ToastContainer)
│   └── vite.config.js     # Port 5174, envDir: '../', @ alias, Tailwind v4
│
└── store/                 # Customer-facing storefront (loads root .env via envDir: '../')
    ├── src/
    │   ├── api/           # API service layer
    │   ├── components/    # Reusable UI & layout components
    │   ├── constants/     # Electronics categories & brands constants
    │   ├── data/          # 52-item electronics dataset
    │   ├── pages/         # 15 PRD screen folders (products, auth, checkout, profile)
    │   ├── routes/        # Protected & guest route definitions
    │   ├── store/         # Redux Toolkit store & slices
    │   ├── index.css      # Tailwind v4 theme, Lato/Roboto fonts & palette
    │   └── main.jsx       # App entry (Provider, BrowserRouter, ToastContainer)
    └── vite.config.js     # Port 5173, envDir: '../', @ alias, Tailwind v4

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
- **Primary Font**: **Lato** (`300`, `400`, `700`, `900`) — Applied globally across all elements via Tailwind `--font-sans`.
- **Secondary Font**: **Roboto** (`300`, `400`, `500`, `700`) — Available via the `font-roboto` utility class.

### 2. Monochromatic Color Palette (Tailwind CSS v4 `@theme`)
Configured in `src/index.css` in both apps:

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `--color-brand-black` | `#262524` | Deep Obsidian — Primary buttons, top bars, dark sidebar |
| `--color-brand-charcoal` | `#323232` | Primary Dark — Active NavLink backgrounds, card accents |
| `--color-brand-gray` | `#585858` | Mid Neutral — Subtitles, secondary text, metadata labels |
| `--color-brand-light` | `#F6F6F6` | Surface Light Gray — App backgrounds, card fills |
| `--color-brand-white` | `#FFFFFF` | Pure White — Card surfaces, modal backgrounds |

### 3. Reusable Vector Logo Component
Both apps include a vector `Logo` component matching the hexagonal hardware emblem:
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

### `admin-dashboard/src/store/`
- **`authSlice`**: Admin JWT token, user info (`role: "admin"`), login/logout actions, error states, and automatic `localStorage` synchronization.
- **`productsSlice`**: Product inventory list, active filters (category, brand, search), pagination state, and selected product.
- **`ordersSlice`**: Customer orders list, order status filters, and selected order.
- **`uiSlice`**: Responsive sidebar state (desktop collapse & mobile drawer).

### `store/src/store/`
- **`authSlice`**: Customer token, profile info, registration OTP email tracking, login/register/logout.
- **`cartSlice`**: Cart items, live item count, subtotal, coupon discount, total calculation, and quantity modifiers.
- **`wishlistSlice`**: Saved products array and item counter.
- **`filterSlice`**: Catalog filters (category, brand, search query, price range, sorting).

---

## Backend API & Authentication

Both apps communicate with the SEF Academy training backend:
- **API Base URL**: `https://e-commerce-api-3wara.vercel.app`
- **Swagger Documentation**: `https://e-commerce-api-3wara.vercel.app/api-docs`
- **Environment Variable**: `VITE_API_URL` (defined in `.env`)

### Test Admin Credentials:
- **Email**: `admin@koda.com`
- **Password**: `admin1212`

### Test Customer Credentials:
- **Email**: `customer@koda.com`
- **Password**: `customer1212`

### Important API Technical Notes:
1. **JWT Authentication**:
   - The token is stored in `localStorage.getItem('token')`.
   - `src/api/axios.js` automatically attaches `Authorization: Bearer <token>` to every request via an Axios request interceptor.
   - A response interceptor catches `401 Unauthorized` responses and cleans up credentials.
2. **Product Image Uploads (Cloudinary)**:
   - `POST /products` requires `multipart/form-data` with actual binary image files (`images`).
   - The server uploads them directly to Cloudinary and saves `{ public_id, url }`.
3. **Array Fields in FormData**:
   - When sending `tags`, append each tag individually to FormData:
     ```js
     tags.forEach(tag => formData.append('tags', tag));
     ```

---

## Electronics Dataset
A pre-configured catalog of **52 realistic electronics products** (MacBooks, iPhones, Sony headphones, PS5 consoles, OLED monitors, Keychron keyboards) is available at:
- `admin-dashboard/src/data/electronicsProducts.json`
- `store/src/data/electronicsProducts.json`

---

## Current Project Phase
- ✅ **Configuration & Scaffolding Phase**: Complete.
- 🎯 **Current Focus**: **`admin-dashboard` implementation**.
  - Week 1 Milestone: Admin Login flow & Dashboard Overview metrics.
  - Week 2 Milestone: Products CRUD with Cloudinary uploads & Orders management.
  - Customer Store (`store`) will be implemented following the completion of the admin dashboard.
