import { RefreshCw, LayoutDashboard } from 'lucide-react'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'

export default function DashboardHeader({
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
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              NEXIS STORE OVERVIEW
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-primary-dark dark:text-text-light tracking-tight truncate">
            Dashboard Overview
          </h1>
          <p className="text-xs text-text-secondary font-body line-clamp-2 sm:line-clamp-none">
            Real-time Nexis Tech metrics across electronics inventory, customer fulfillment, and store revenue.
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-end">
        {/* Refresh / Sync Action */}
        <Button
          variant="secondary"
          size="md"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 dark:border-white/10"
          title="Refresh metrics from backend"
        >
          <RefreshCw
            className={`w-4 h-4 text-text-secondary dark:text-slate-300 ${
              isRefreshing ? 'animate-spin text-accent-gold' : ''
            }`}
          />
          <span>Sync Data</span>
        </Button>
      </div>
    </div>
  )
}
