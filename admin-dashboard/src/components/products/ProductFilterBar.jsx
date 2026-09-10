import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  EyeOff,
} from 'lucide-react'
import Button from '@/components/common/Button'

export default function ProductFilterBar({
  search = '',
  onSearchChange,
  filter = 'all',
  onFilterChange,
  totalResults = 0,
  counts = {},
}) {
  const filterOptions = [
    { value: 'all', label: 'All', icon: Layers },
    { value: 'featured', label: 'Featured', icon: Sparkles },
    { value: 'inStock', label: 'In Stock', icon: CheckCircle2 },
    { value: 'outOfStock', label: 'Out of Stock', icon: AlertTriangle },
    { value: 'draft', label: 'Drafts', icon: EyeOff },
  ]

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-medium bg-white p-4 shadow-xs transition-colors duration-200 sm:p-5 dark:border-primary-medium/30 dark:bg-dark-bg-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search bar */}
        <div className="relative flex-1 w-full min-w-0 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary dark:text-text-gold" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product name, category, or brand..."
            className="w-full rounded-xl border border-border-medium bg-bg-input/45 py-2.5 pl-10 pr-4 text-sm font-body text-text-primary outline-none transition-all duration-150 placeholder:text-text-secondary/60 focus:border-transparent focus:ring-2 focus:ring-primary-medium dark:border-primary-medium/40 dark:bg-dark-bg-main dark:text-white dark:placeholder:text-slate-300 dark:focus:ring-text-gold shadow-2xs"
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
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-light dark:border-primary-medium/20">
        <div className="flex flex-wrap items-center gap-1.5">
          {filterOptions.map((opt) => {
            const Icon = opt.icon
            const isActive = filter === opt.value
            const count = counts[opt.value]
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange(opt.value)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold font-heading transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-dark text-white dark:bg-text-gold dark:text-primary-dark shadow-xs'
                    : 'text-text-secondary hover:bg-bg-input/60 hover:text-text-primary dark:text-slate-300 dark:hover:bg-primary-medium/30 dark:hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{opt.label}</span>
                {count !== undefined && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-white/25 text-white dark:bg-black/25 dark:text-primary-dark'
                        : 'bg-bg-input text-text-secondary dark:bg-primary-medium/40 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <span className="text-xs text-text-secondary font-body">
          Showing <strong className="text-primary-dark dark:text-white">{totalResults}</strong> items
        </span>
      </div>
    </div>
  )
}
