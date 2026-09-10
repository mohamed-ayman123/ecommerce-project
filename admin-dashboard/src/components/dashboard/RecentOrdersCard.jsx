import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, User } from 'lucide-react'

const STATUS_PILL_STYLES = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  processing: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  confirmed: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  shipped: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  returned: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return String(dateStr)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function RecentOrdersCard({ recentOrders = [], currency = 'EGP' }) {
  const items = Array.isArray(recentOrders) ? recentOrders.slice(0, 5) : []

  return (
    <div className="bg-bg-card dark:bg-dark-bg-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-border-medium dark:border-primary-medium/30 shadow-xs transition-colors duration-200">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 gap-3">
        <div>
          <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase font-heading bg-primary-medium/15 text-primary-dark border border-primary-medium/25 dark:bg-primary-medium/30 dark:text-text-gold">
            CUSTOMER ORDERS
          </span>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-primary-dark dark:text-text-light tracking-tight mt-1">
            Latest customer activity
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-primary-medium/15 text-primary-dark dark:text-text-gold border border-primary-medium/20">
            {items.length} orders
          </span>

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
            <p className="text-sm font-medium">No recent orders found</p>
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
            const statusClass =
              STATUS_PILL_STYLES[rawStatus] || STATUS_PILL_STYLES.pending

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
              <div
                key={id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-bg-main/50 dark:bg-dark-bg-main/60 hover:bg-bg-main dark:hover:bg-dark-bg-main border border-border-light dark:border-primary-medium/20 transition-all duration-150 min-w-0"
              >
                {/* Customer & Item snippet */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-dark/10 dark:bg-primary-medium/30 text-primary-dark dark:text-text-gold flex items-center justify-center shrink-0 border border-primary-medium/20">
                    <User className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-primary-dark dark:text-text-light font-heading truncate">
                      {customerName}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-text-secondary dark:text-slate-400 truncate mt-0.5">
                      {itemSnippet} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Status Pill & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-light/60 dark:border-primary-medium/10">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${statusClass}`}
                  >
                    {rawStatus}
                  </span>

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
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
