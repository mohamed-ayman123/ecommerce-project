import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Sparkles, ArrowRight } from 'lucide-react'

export default function TopProductsCard({ topProducts = [], currency = 'EGP' }) {
  const [imageErrors, setImageErrors] = useState({})

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }))
  }

  const items = Array.isArray(topProducts) ? topProducts.slice(0, 5) : []

  return (
    <div className="h-full flex flex-col justify-between bg-bg-card dark:bg-dark-bg-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-border-medium dark:border-primary-medium/30 shadow-xs transition-colors duration-200">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5 gap-3">
          <div>
            <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase font-heading bg-primary-medium/15 text-primary-dark border border-primary-medium/25 dark:bg-primary-medium/30 dark:text-text-gold">
              PRODUCT PERFORMANCE
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-primary-dark dark:text-text-light tracking-tight mt-1">
              Best sellers
            </h2>
          </div>

          <div className="w-8 h-8 rounded-xl bg-accent-gold/15 text-accent-gold flex items-center justify-center border border-accent-gold/20 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-2.5 sm:space-y-3">
          {items.length === 0 ? (
            <div className="py-8 sm:py-12 text-center text-text-secondary dark:text-slate-400">
              <Package className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No sales data recorded yet</p>
            </div>
          ) : (
            items.map((prod, index) => {
              const prodId = prod._id || prod.id || `top-${index}`
              const name = prod.name || prod.title || 'Product'
              const unitsSold = prod.totalSold ?? prod.sold ?? 0
              const revenue = Number(prod.revenue) || 0
              const hasError = imageErrors[prodId]
              const targetUrl = prod._id ? `/dashboard/products/${prod._id}/edit` : '/dashboard/products'

              return (
                <Link
                  to={targetUrl}
                  key={prodId}
                  className="group flex items-center gap-2.5 sm:gap-3.5 p-2.5 sm:p-3.5 rounded-2xl bg-bg-main/50 dark:bg-dark-bg-main/60 hover:bg-bg-main dark:hover:bg-dark-bg-main border border-border-light dark:border-primary-medium/20 hover:border-border-medium dark:hover:border-primary-medium/40 transition-all duration-150 min-w-0 cursor-pointer"
                  title={`Edit ${name}`}
                >
                  {/* Rank Badge */}
                  <span className="w-5 sm:w-6 text-center text-xs font-bold font-heading text-primary-dark dark:text-text-gold shrink-0">
                    #{index + 1}
                  </span>

                  {/* Product Thumbnail */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-bg-card dark:bg-dark-bg-card border border-border-medium dark:border-primary-medium/30 overflow-hidden flex items-center justify-center shrink-0">
                    {prod.image && !hasError ? (
                      <img
                        src={prod.image}
                        alt={name}
                        onError={() => handleImageError(prodId)}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary dark:text-slate-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h4
                      className="text-xs sm:text-sm font-bold text-primary-dark dark:text-text-light font-heading truncate group-hover:text-accent-gold transition-colors"
                      title={name}
                    >
                      {name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-text-secondary dark:text-slate-400 mt-0.5 truncate">
                      <span className="font-semibold text-primary-dark dark:text-slate-200">
                        {unitsSold} sold
                      </span>{' '}
                      •{' '}
                      <span className="font-semibold text-accent-gold">
                        {revenue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        {currency}
                      </span>
                    </p>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>

      {/* Footer link to occupy remaining space & balance layout */}
      <div className="mt-4 sm:mt-5 pt-3.5 border-t border-border-light dark:border-primary-medium/20 flex items-center justify-between gap-2 text-xs text-text-secondary dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden xs:inline">Real-time catalog ranking</span>
          <span className="xs:hidden">Live ranking</span>
        </span>

        <Link
          to="/dashboard/products"
          className="font-semibold text-primary-dark dark:text-text-light hover:text-accent-gold dark:hover:text-accent-gold transition-colors inline-flex items-center gap-1 group shrink-0"
        >
          <span>All products</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
