import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Shared Pagination Component
 * Consistently renders page navigation controls, item counts, and active states.
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 15,
  itemLabel = 'items',
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1 && totalItems === 0) return null

  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0
  const endItem = totalItems > 0 ? Math.min(currentPage * pageSize, totalItems) : 0

  // Calculate visible page numbers window (max 5 numbers)
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className={`flex flex-col items-center justify-between gap-3 sm:flex-row ${className}`}>
      {totalItems > 0 && (
        <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400">
          Showing{' '}
          <span className="font-semibold text-primary-dark dark:text-white">
            {startItem}
          </span>{' '}
          -{' '}
          <span className="font-semibold text-primary-dark dark:text-white">
            {endItem}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-primary-dark dark:text-white">
            {totalItems}
          </span>{' '}
          {itemLabel}
        </p>
      )}

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-border-medium dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-card text-text-secondary dark:text-slate-300 transition-colors hover:bg-bg-main dark:hover:bg-primary-medium/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((p) => {
          const isActive = p === currentPage
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange?.(p)}
              className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary-dark text-white dark:bg-accent-gold dark:text-primary-dark shadow-sm'
                  : 'border border-border-medium dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-card text-text-primary dark:text-slate-200 hover:bg-bg-main dark:hover:bg-primary-medium/20'
              }`}
            >
              {p}
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-border-medium dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-card text-text-secondary dark:text-slate-300 transition-colors hover:bg-bg-main dark:hover:bg-primary-medium/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
