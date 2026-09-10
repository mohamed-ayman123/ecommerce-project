import { useSelector } from 'react-redux'
import { Boxes, CheckCircle2, AlertTriangle, Star, EyeOff } from 'lucide-react'
import { selectProductCatalogStats } from '@/store/slices/productsSlice'

export default function ProductStats({ stats: propStats }) {
  const reduxStats = useSelector(selectProductCatalogStats)
  const { total, inStock, outOfStock, featured, drafts } = propStats || reduxStats

  const stats = [
    {
      label: 'Total',
      value: total,
      icon: Boxes,
      color: 'text-primary-dark dark:text-text-gold',
      bg: 'bg-primary-medium/15 dark:bg-primary-medium/30',
      border: 'border-primary-medium/25',
    },
    {
      label: 'In Stock',
      value: inStock,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-900/40',
    },
    {
      label: 'Out of Stock',
      value: outOfStock,
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-200 dark:border-rose-900/40',
    },
    {
      label: 'Featured',
      value: featured,
      icon: Star,
      color: 'text-amber-500 dark:text-text-gold',
      bg: 'bg-amber-50 dark:bg-accent-gold/15',
      border: 'border-amber-200 dark:border-accent-gold/30',
    },
    {
      label: 'Draft',
      value: drafts,
      icon: EyeOff,
      color: 'text-slate-600 dark:text-slate-300',
      bg: 'bg-slate-100 dark:bg-slate-800/50',
      border: 'border-slate-200 dark:border-slate-700/60',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-5">
      {stats.map((item) => {
        const Icon = item.icon
        const isDraft = item.label === 'Draft'
        return (
          <div
            key={item.label}
            className={`flex items-center gap-3.5 sm:gap-4 rounded-2xl border border-border-medium bg-white p-3.5 sm:p-5 shadow-xs transition-all duration-200 dark:border-primary-medium/30 dark:bg-dark-bg-card ${
              isDraft ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <div
              className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border ${item.bg} ${item.border} ${item.color}`}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold uppercase tracking-wider text-text-secondary font-body">
                {item.label}
              </p>
              <p className="mt-0.5 text-xl font-extrabold text-text-primary font-heading sm:text-2xl dark:text-white">
                {item.value}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
