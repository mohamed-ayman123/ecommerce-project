import { Boxes, CheckCircle2, AlertTriangle, Star } from 'lucide-react'
import { isElectronicsOrHardwareProduct } from '@/constants/categories'

export default function ProductStats({ products = [] }) {
  const validProducts = products.filter(isElectronicsOrHardwareProduct)
  const total = validProducts.length
  const inStock = validProducts.filter((p) => Number(p.stock) > 0).length
  const outOfStock = validProducts.filter((p) => Number(p.stock) === 0).length
  const featured = validProducts.filter((p) => Boolean(p.featured)).length

  const stats = [
    {
      label: 'Total Products',
      value: total,
      icon: Boxes,
      color: 'text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]',
      bg: 'bg-[var(--color-primary-medium)]/15 dark:bg-[var(--color-primary-medium)]/30',
      border: 'border-[var(--color-primary-medium)]/25',
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
      label: 'Featured Items',
      value: featured,
      icon: Star,
      color: 'text-amber-500 dark:text-[var(--color-text-gold)]',
      bg: 'bg-amber-50 dark:bg-[var(--color-accent-gold)]/15',
      border: 'border-amber-200 dark:border-[var(--color-accent-gold)]/30',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-5">
      {stats.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-2xl border border-[var(--color-border-medium)] bg-white p-4 shadow-xs transition-all duration-200 sm:p-5 dark:border-[var(--color-primary-medium)]/30 dark:bg-[var(--color-dark-bg-card)]"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${item.bg} ${item.border} ${item.color}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] font-body">
                {item.label}
              </p>
              <p className="mt-0.5 text-xl font-extrabold text-[var(--color-text-primary)] font-heading sm:text-2xl dark:text-white">
                {item.value}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
