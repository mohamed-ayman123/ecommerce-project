import { Link } from 'react-router-dom'
import { Search, Plus, Sparkles, CheckCircle2, AlertTriangle, Layers } from 'lucide-react'
import Button from '@/components/common/Button'

export default function ProductFilterBar({
  search = '',
  onSearchChange,
  filter = 'all',
  onFilterChange,
  totalResults = 0,
}) {
  const filterOptions = [
    { value: 'all', label: 'All', icon: Layers },
    { value: 'featured', label: 'Featured', icon: Sparkles },
    { value: 'inStock', label: 'In Stock', icon: CheckCircle2 },
    { value: 'outOfStock', label: 'Out of Stock', icon: AlertTriangle },
  ]

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border-medium)] bg-white p-4 shadow-xs transition-colors duration-200 sm:p-5 dark:border-[var(--color-primary-medium)]/30 dark:bg-[var(--color-dark-bg-card)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-[var(--color-text-gold)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product name, category, or brand..."
            className="w-full rounded-xl border border-[var(--color-border-medium)] bg-[var(--color-bg-input)]/45 py-2.5 pl-10 pr-4 text-sm font-body text-[var(--color-text-primary)] outline-none transition-all duration-150 placeholder:text-[var(--color-text-secondary)]/60 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 dark:bg-[var(--color-dark-bg-main)] dark:text-white dark:placeholder:text-slate-300 dark:focus:ring-[var(--color-text-gold)] shadow-2xs"
          />
        </div>

        {/* Action button */}
        <Link to="/dashboard/products/new">
          <Button variant="primary" size="md" className="w-full sm:w-auto font-heading font-semibold">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/20">
        <div className="flex flex-wrap items-center gap-1.5">
          {filterOptions.map((opt) => {
            const Icon = opt.icon
            const isActive = filter === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange(opt.value)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold font-heading transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-primary-dark)] text-white dark:bg-[var(--color-text-gold)] dark:text-[var(--color-primary-dark)] shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-input)]/60 hover:text-[var(--color-text-primary)] dark:text-slate-300 dark:hover:bg-[var(--color-primary-medium)]/30 dark:hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{opt.label}</span>
              </button>
            )
          })}
        </div>

        <span className="text-xs text-[var(--color-text-secondary)] font-body">
          Showing <strong className="text-[var(--color-primary-dark)] dark:text-white">{totalResults}</strong> items
        </span>
      </div>
    </div>
  )
}
