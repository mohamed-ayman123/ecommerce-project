import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

import AddProduct from "@/pages/products/AddProduct";
import EditProduct from "@/pages/products/EditProduct";
import UserList from "@/pages/users/UserList";
import OrdersPage from "@/pages/orders/OrdersPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import Login from "@/pages/auth/Login";
import Products from "@/pages/products/Products";
import Carts from "@/pages/carts/Carts";
import NotFound from "@/pages/error/NotFound";

export default function AppRoutes() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const defaultLanding = useSelector(
    (state) => state.ui?.preferences?.defaultLanding || "/dashboard"
  );

  return (
    <Routes>
      {/* Public Landing / Root route */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? defaultLanding : "/login"} replace />
        }
      />

      {/* Auth routes (clean layout for login/auth) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Dashboard routes (guarded by ProtectedRoute + wrapped with AppLayout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<h2>dashboard</h2>} />
          <Route path="/dashboard/products" element={<Products />} />
          <Route path="/dashboard/products/new" element={<AddProduct />} />
          <Route path="/dashboard/products/:id/edit" element={<EditProduct />} />
          <Route path="/dashboard/users" element={<UserList />} />
          <Route path="/dashboard/orders" element={<OrdersPage />} />
          <Route path="/dashboard/carts" element={<Carts />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}