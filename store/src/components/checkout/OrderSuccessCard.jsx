import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Copy,
  Check,
  Package,
  ShoppingBag,
  Truck,
  MapPin,
  CreditCard,
  Printer,
  Calendar,
} from 'lucide-react'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import { formatCurrency, formatDate } from '@/utils/formatters'

/**
 * OrderSuccessCard Component
 * Implements the user's sample design elevated with Nexis Tech branding, copyable Order ID,
 * delivery timeline preview, and responsive action buttons.
 *
 * @param {Object} props
 * @param {Object} props.order - Confirmed order object from backend
 */
export default function OrderSuccessCard({ order }) {
  const [copied, setCopied] = useState(false)

  if (!order) return null

  const orderId = order._id || order.id || 'ORDER'
  const displayId = `#${orderId.slice(-8).toUpperCase()}`

  const handleCopyId = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const items = order.items || []
  const shippingAddress = order.shippingAddress || {}
  const totalAmount = order.totalPrice || order.totalAmount || 0
  const paymentMethod = order.paymentMethod || 'cash'

  // Estimated delivery: 2-3 business days from creation
  const createdDate = order.createdAt ? new Date(order.createdAt) : new Date()
  const deliveryEta = new Date(createdDate)
  deliveryEta.setDate(deliveryEta.getDate() + 3)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-400">
      {/* 1. Hero Confirmation Section (Directly matching user sample image) */}
      <div className="bg-bg-card dark:bg-dark-bg-card rounded-3xl border border-border-light dark:border-primary-medium/30 p-8 sm:p-12 text-center shadow-sm space-y-6">
        {/* Animated Green Circular Badge */}
        <div className="inline-flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-4 border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-2 max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-primary-dark dark:text-text-light tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-sm sm:text-base text-text-secondary dark:text-slate-300">
            Thank you for your purchase. Your order has been confirmed and is being prepared for dispatch.
          </p>
        </div>

        {/* Order ID Badge with One-Click Copy */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-main dark:bg-dark-bg-main border border-border-medium/60 dark:border-primary-medium/40 text-xs sm:text-sm font-medium text-text-secondary dark:text-slate-300">
          <span>Order ID:</span>
          <span className="font-heading font-bold text-accent-gold dark:text-accent-gold text-sm sm:text-base">
            {displayId}
          </span>
          <button
            type="button"
            onClick={handleCopyId}
            title="Copy full order ID"
            aria-label="Copy order ID"
            className="p-1 rounded-md hover:bg-border-light dark:hover:bg-primary-medium/40 transition-colors ml-1 text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-text-light"
          >
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" /> Copied!
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Primary CTA Buttons (Matching Sample Image) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link to={`/profile/orders/${orderId}`} className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2"
            >
              <Package className="w-4 h-4 text-accent-gold" />
              <span>Track My Order</span>
            </Button>
          </Link>

          <Link to="/products" className="w-full sm:w-auto">
            <Button
              variant="gold"
              size="lg"
              className="w-full sm:w-auto gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Order Details & Delivery Card */}
      <div className="bg-bg-card dark:bg-dark-bg-card rounded-2xl border border-border-light dark:border-primary-medium/30 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-primary-medium/30 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent-gold/10 text-accent-gold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-primary-dark dark:text-text-light">
                Delivery & Order Information
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400">
                Confirmed on {formatDate(createdDate, true)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </Button>
            <Badge variant="success" size="sm" dot>
              Confirmed
            </Badge>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Estimated Delivery */}
          <div className="p-4 rounded-xl bg-bg-main/60 dark:bg-dark-bg-main border border-border-light dark:border-primary-medium/20 space-y-1">
            <div className="flex items-center gap-1.5 text-text-secondary dark:text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-accent-gold" />
              <span>Estimated Delivery</span>
            </div>
            <p className="font-heading font-bold text-sm text-primary-dark dark:text-text-light">
              {formatDate(deliveryEta)}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Standard Express Courier (2-3 Days)
            </p>
          </div>

          {/* Shipping Address */}
          <div className="p-4 rounded-xl bg-bg-main/60 dark:bg-dark-bg-main border border-border-light dark:border-primary-medium/20 space-y-1">
            <div className="flex items-center gap-1.5 text-text-secondary dark:text-slate-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-accent-gold" />
              <span>Delivery Address</span>
            </div>
            <p className="font-heading font-semibold text-text-primary dark:text-text-light truncate">
              {shippingAddress.fullName || 'Customer'}
            </p>
            <p className="text-text-secondary dark:text-slate-400 truncate">
              {shippingAddress.address || '—'}, {shippingAddress.city}
            </p>
            <p className="text-[11px] text-text-secondary dark:text-slate-400">
              {shippingAddress.phone}
            </p>
          </div>

          {/* Payment Details */}
          <div className="p-4 rounded-xl bg-bg-main/60 dark:bg-dark-bg-main border border-border-light dark:border-primary-medium/20 space-y-1">
            <div className="flex items-center gap-1.5 text-text-secondary dark:text-slate-400 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-accent-gold" />
              <span>Payment Summary</span>
            </div>
            <p className="font-heading font-bold text-sm text-accent-gold">
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-text-secondary dark:text-slate-400">
              Method: {paymentMethod === 'stripe' ? 'Credit / Debit Card (Stripe)' : 'Cash on Delivery'}
            </p>
            <p className="text-[11px] text-text-secondary dark:text-slate-400">
              Status: {order.paymentStatus || 'Pending on delivery'}
            </p>
          </div>
        </div>

        {/* Purchased Items List */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-border-light dark:border-primary-medium/30 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-primary-dark dark:text-text-light">
              Items In This Order ({items.length})
            </h4>
            <div className="divide-y divide-border-light/60 dark:divide-primary-medium/20">
              {items.map((item, idx) => {
                const title = item.product?.title || item.title || item.name || 'Item'
                const price = Number(item.price) || 0
                const quantity = Number(item.quantity) || 1
                const image =
                  item.product?.images?.[0] ||
                  item.image ||
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'

                return (
                  <div key={item._id || item.productId || idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={image}
                        alt={title}
                        className="w-12 h-12 rounded-lg object-cover bg-bg-main dark:bg-dark-bg-main border border-border-light dark:border-primary-medium/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary dark:text-text-light truncate">
                          {title}
                        </p>
                        <p className="text-text-secondary dark:text-slate-400 text-[11px]">
                          Qty: {quantity} × {formatCurrency(price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-heading font-bold text-primary-dark dark:text-text-light shrink-0">
                      {formatCurrency(price * quantity)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
