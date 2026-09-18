import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'

// Pages
import HomePage from '@/pages/home/HomePage'
import ProductsPage from '@/pages/products/ProductsPage'
import ProductDetailPage from '@/pages/products/ProductDetailPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import VerifyOtpPage from '@/pages/auth/VerifyOtpPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import CartPage from '@/pages/cart/CartPage'
import WishlistPage from '@/pages/wishlist/WishlistPage'
import CheckoutPage from '@/pages/checkout/CheckoutPage'
import PaymentPage from '@/pages/checkout/PaymentPage'
import OrderSuccessPage from '@/pages/checkout/OrderSuccessPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import OrdersPage from '@/pages/orders/OrdersPage'
import OrderDetailPage from '@/pages/orders/OrderDetailPage'
import NotFoundPage from '@/pages/NotFoundPage'


export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Dedicated Auth Flow Routes (Guest Only + AuthLayout) */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-otp" element={<VerifyOtpPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      {/* 2. Main Store Application Routes (MainLayout with Navbar & Footer) */}
      <Route element={<MainLayout />}>
        {/* Public Store Routes */}
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        {/* User (Protected) Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/payment" element={<PaymentPage />} />
          <Route path="order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/orders" element={<OrdersPage />} />
          <Route path="profile/orders/:id" element={<OrderDetailPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
