import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, User } from 'lucide-react'
import { formatDate } from '@/utils/formatters'
import Badge from '@/components/common/Badge'

export default function RecentOrdersCard({ recentOrders = [], currency = 'EGP' }) {
  const items = Array.isArray(recentOrders) ? recentOrders.slice(0, 5) : []

  return (
    <div className="bg-bg-card dark:bg-dark-bg-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-border-medium dark:border-primary-medium/30 shadow-xs transition-colors duration-200">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 gap-3">
        <div>
          <Badge variant="primary" size="sm">
            CUSTOMER ORDERS
          </Badge>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-primary-dark dark:text-text-light tracking-tight mt-1">
            Latest customer activity
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Badge variant="primary" size="sm">
            {items.length} orders
          </Badge>

          <Link
            to="/dashboard/orders"
            className="text-xs font-semibold text-accent-gold hover:text-accent-gold-hover inline-flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-2.5 sm:space-y-3">
        {items.length === 0 ? (
          <div className="py-8 sm:py-10 text-center text-text-secondary dark:text-slate-400">
            <ShoppingBag className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No customer orders recorded yet</p>
          </div>
        ) : (
          items.map((order, idx) => {
            const id = order._id || order.id || `order-${idx}`
            const customer = order.user || order.customer || {}
            const customerName =
              customer.username ||
              customer.name ||
              order.shippingAddress?.fullName ||
              'Customer'
            const rawStatus = (order.status || 'pending').toLowerCase()

            // Extract item snippet
            const firstItemName =
              order.items?.[0]?.name ||
              order.items?.[0]?.product?.name ||
              'Merchandise'
            const otherCount = (order.items?.length || 1) - 1
            const itemSnippet =
              otherCount > 0
                ? `${firstItemName} +${otherCount} more`
                : firstItemName

            const total = Number(order.totalPrice || order.total) || 0

            return (
              <Link
                to={`/dashboard/orders?orderId=${encodeURIComponent(order.originalId || order._id || order.id || id)}`}
                key={id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-bg-main/50 dark:bg-dark-bg-main/60 hover:bg-bg-main dark:hover:bg-dark-bg-main border border-border-light dark:border-primary-medium/20 hover:border-border-medium dark:hover:border-primary-medium/40 transition-all duration-150 min-w-0 cursor-pointer"
              >
                {/* Customer & Item snippet */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-dark/10 dark:bg-primary-medium/30 text-primary-dark dark:text-text-gold flex items-center justify-center shrink-0 border border-primary-medium/20">
                    <User className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-primary-dark dark:text-text-light font-heading truncate group-hover:text-accent-gold transition-colors">
                      {customerName}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-text-secondary dark:text-slate-400 truncate mt-0.5">
                      {itemSnippet} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Status Pill & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-light/60 dark:border-primary-medium/10">
                  <Badge status={rawStatus} size="sm" />

                  <span className="text-xs sm:text-sm font-bold text-primary-dark dark:text-text-light font-heading min-w-[70px] text-right">
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    <span className="text-[11px] sm:text-xs text-accent-gold font-semibold">
                      {currency}
                    </span>
                  </span>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
