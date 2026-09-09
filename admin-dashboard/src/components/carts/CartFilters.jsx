import { Search } from 'lucide-react'
import Dropdown from '@/components/common/Dropdown'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Recently Updated' },
  { value: 'oldest', label: 'Oldest Created' },
  { value: 'highest-value', label: 'Highest Value' },
  { value: 'lowest-value', label: 'Lowest Value' },
  { value: 'most-items', label: 'Most Items' },
]

const SCOPE_OPTIONS = [
  { value: 'store-only', label: 'Nexis Tech (Electronics Only)' },
  { value: 'all-carts', label: 'All Shared Database Carts' },
]

export default function CartFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  storeOnly,
  onStoreOnlyChange,
}) {
  return (
    <div className="bg-white dark:bg-[var(--color-dark-bg-card)] p-4 rounded-2xl border border-border-light dark:border-white/10 shadow-xs flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full lg:w-96">
        <Search className="w-4 h-4 text-text-secondary dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customer, email, cart ID, product..."
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-border-light dark:border-white/10 bg-bg-main/30 dark:bg-white/5 text-primary-dark dark:text-white placeholder:text-text-secondary/60 dark:placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-medium"
        />
      </div>

      {/* Filter Dropdowns using Common Component Dropdown */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
        {/* Store Scope Filter */}
        <div className="w-full sm:w-auto">
          <Dropdown
            value={storeOnly ? 'store-only' : 'all-carts'}
            onChange={(val) => onStoreOnlyChange(val === 'store-only')}
            options={SCOPE_OPTIONS}
            ariaLabel="Store Filter Scope"
            placeholder="Select Store Scope"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="w-full sm:w-auto">
          <Dropdown
            value={sortBy}
            onChange={onSortChange}
            options={SORT_OPTIONS}
            ariaLabel="Sort by"
            placeholder="Sort by"
          />
        </div>
      </div>
    </div>
  )
}
