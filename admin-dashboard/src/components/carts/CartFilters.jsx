import { Search } from 'lucide-react'
import Dropdown from '@/components/common/Dropdown'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Recently Updated' },
  { value: 'oldest', label: 'Oldest Created' },
  { value: 'highest-value', label: 'Highest Value' },
  { value: 'lowest-value', label: 'Lowest Value' },
  { value: 'most-items', label: 'Most Items' },
]

export default function CartFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="bg-white dark:bg-[var(--color-dark-bg-card)] p-4 rounded-2xl border border-border-light dark:border-white/10 shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-text-secondary dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customer, email, cart ID, product..."
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-border-light dark:border-white/10 bg-bg-main/30 dark:bg-white/5 text-primary-dark dark:text-white placeholder:text-text-secondary/60 dark:placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-medium"
        />
      </div>

      {/* Sort By Dropdown using Common Component Dropdown */}
      <div className="w-full sm:w-auto shrink-0">
        <Dropdown
          value={sortBy}
          onChange={onSortChange}
          options={SORT_OPTIONS}
          ariaLabel="Sort by"
          placeholder="Sort by"
        />
      </div>
    </div>
  )
}
