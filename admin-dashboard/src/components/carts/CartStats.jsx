import { ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react'

export default function CartStats({ stats, currency = 'EGP' }) {
  const { totalActive = 0, totalPipelineValue = 0, totalItemsCount = 0, avgValue = '0.00' } = stats || {}

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Active Carts */}
      <div className="bg-white dark:bg-[var(--color-dark-bg-card)] p-5 rounded-2xl border border-border-light dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400">
            Active Carts
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary-dark/10 dark:bg-primary-dark/30 text-primary-dark dark:text-accent-gold flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-bold text-primary-dark dark:text-white mt-2 font-heading">
          {totalActive}
        </p>
        <p className="text-xs text-text-secondary dark:text-slate-400 mt-1 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Live customer sessions
        </p>
      </div>

      {/* Total Pipeline Value */}
      <div className="bg-white dark:bg-[var(--color-dark-bg-card)] p-5 rounded-2xl border border-border-light dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400">
            Pending Cart Value
          </span>
          <div className="w-9 h-9 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-bold text-primary-dark dark:text-white mt-2 font-heading">
          {totalPipelineValue.toLocaleString()}{' '}
          <span className="text-sm font-normal text-accent-gold">{currency}</span>
        </p>
        <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
          Total active merchandise pipeline
        </p>
      </div>

      {/* Total Items in Carts */}
      <div className="bg-white dark:bg-[var(--color-dark-bg-card)] p-5 rounded-2xl border border-border-light dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400">
            Reserved Items
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-bold text-primary-dark dark:text-white mt-2 font-heading">
          {totalItemsCount}
        </p>
        <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
          Products awaiting checkout
        </p>
      </div>

      {/* Avg Cart Value */}
      <div className="bg-white dark:bg-[var(--color-dark-bg-card)] p-5 rounded-2xl border border-border-light dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400">
            Avg. Cart Size
          </span>
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-bold text-primary-dark dark:text-white mt-2 font-heading">
          {avgValue}{' '}
          <span className="text-sm font-normal text-text-secondary dark:text-slate-400">
            {currency}
          </span>
        </p>
        <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
          Average value per shopper
        </p>
      </div>
    </div>
  )
}
