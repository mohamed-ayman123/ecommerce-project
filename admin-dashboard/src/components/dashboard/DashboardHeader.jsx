import { RefreshCw, Building2, Globe2, LayoutDashboard } from 'lucide-react'
import Button from '@/components/common/Button'

export default function DashboardHeader({
  activeScope,
  onScopeChange,
  onRefresh,
  isRefreshing,
}) {
  return (
    <div className="bg-bg-card dark:bg-dark-bg-card p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-border-medium dark:border-primary-medium/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 transition-colors">
      {/* Header Info: Icon + Category Badge + Title + Subtitle */}
      <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary-dark text-white dark:bg-primary-medium flex items-center justify-center shrink-0 shadow-sm border border-primary-medium/30">
          <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-text-gold" />
        </div>
        <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
          <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase font-heading bg-primary-medium/15 text-primary-dark border border-primary-medium/25 dark:bg-primary-medium/30 dark:text-text-gold">
            STORE OVERVIEW
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-primary-dark dark:text-text-light tracking-tight truncate">
            Dashboard Overview
          </h1>
          <p className="text-xs text-text-secondary font-body line-clamp-2 sm:line-clamp-none">
            Monitor your storefront metrics across inventory, fulfillment, and revenue.
          </p>
        </div>
      </div>

      {/* Action Controls & Scope Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
        {/* Store Scope Toggle */}
        <div className="flex-1 md:flex-initial inline-flex items-center p-1 bg-bg-main dark:bg-dark-bg-main rounded-2xl border border-border-medium dark:border-primary-medium/30 shadow-inner">
          <button
            type="button"
            onClick={() => onScopeChange('store')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-semibold font-heading transition-all duration-150 cursor-pointer ${
              activeScope === 'store'
                ? 'bg-bg-card dark:bg-dark-bg-card text-primary-dark dark:text-text-light shadow-xs'
                : 'text-text-secondary dark:text-slate-400 hover:text-primary-dark dark:hover:text-text-light'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-accent-gold shrink-0" />
            <span className="sm:hidden">Store</span>
            <span className="hidden sm:inline">Nexis Tech (Store)</span>
          </button>

          <button
            type="button"
            onClick={() => onScopeChange('platform')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-semibold font-heading transition-all duration-150 cursor-pointer ${
              activeScope === 'platform'
                ? 'bg-bg-card dark:bg-dark-bg-card text-primary-dark dark:text-text-light shadow-xs'
                : 'text-text-secondary dark:text-slate-400 hover:text-primary-dark dark:hover:text-text-light'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-primary-medium dark:text-accent-gold shrink-0" />
            <span className="sm:hidden">Global</span>
            <span className="hidden sm:inline">Academy (Global)</span>
          </button>
        </div>

        {/* Refresh Action */}
        <Button
          variant="secondary"
          size="md"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 dark:border-white/10"
          title="Refresh metrics from backend"
        >
          <RefreshCw
            className={`w-4 h-4 text-text-secondary dark:text-slate-300 ${
              isRefreshing ? 'animate-spin text-accent-gold' : ''
            }`}
          />
          <span className="hidden sm:inline">Sync</span>
        </Button>
      </div>
    </div>
  )
}
