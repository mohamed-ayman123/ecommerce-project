import {
  Clock,
  RotateCw,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  Activity,
} from 'lucide-react'
import Badge from '@/components/common/Badge'

const STATUS_CONFIGS = [
  {
    key: 'pending',
    label: 'Pending',
    icon: Clock,
    iconColor: 'text-amber-500',
    badgeBg: 'bg-amber-500/10',
  },
  {
    key: 'processing',
    label: 'Processing',
    icon: RotateCw,
    iconColor: 'text-primary-medium dark:text-text-gold',
    badgeBg: 'bg-primary-medium/10',
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    icon: CheckCircle2,
    iconColor: 'text-sky-500',
    badgeBg: 'bg-sky-500/10',
  },
  {
    key: 'shipped',
    label: 'Shipped',
    icon: Truck,
    iconColor: 'text-primary-dark dark:text-emerald-400',
    badgeBg: 'bg-primary-dark/10 dark:bg-primary-medium/30',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    icon: PackageCheck,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    icon: XCircle,
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-500/10',
  },
]

export default function OrderStatusBreakdown({ stats }) {
  const counts = stats.statusCounts || {}

  return (
    <div className="h-full flex flex-col justify-between bg-bg-card dark:bg-dark-bg-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-border-medium dark:border-primary-medium/30 shadow-xs transition-colors duration-200">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <Badge variant="primary" size="sm">
            FULFILLMENT METRICS
          </Badge>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-primary-dark dark:text-text-light tracking-tight mt-1">
            Live fulfillment breakdown
          </h2>
        </div>

        <Badge variant="success" size="sm">
          <Activity className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Updated from API</span>
          <span className="xs:hidden">Live</span>
        </Badge>
      </div>

      {/* 6-box responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 flex-1">
        {STATUS_CONFIGS.map((cfg) => {
          const Icon = cfg.icon
          const count = counts[cfg.key] ?? stats[`${cfg.key}Orders`] ?? 0

          return (
            <div
              key={cfg.key}
              className="flex flex-col justify-between p-3 sm:p-4 md:p-5 rounded-2xl bg-bg-main/50 dark:bg-dark-bg-main/60 border border-border-light dark:border-primary-medium/20 hover:border-border-medium dark:hover:border-primary-medium/40 transition-all duration-150 hover:shadow-xs min-w-0"
            >
              <div className="flex items-center justify-between gap-1 min-w-0">
                <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase font-heading text-primary-dark dark:text-text-light truncate">
                  {cfg.label}
                </span>
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.badgeBg} ${cfg.iconColor}`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              <div className="mt-2 sm:mt-3">
                <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary-dark dark:text-text-light font-heading tracking-tight">
                  {count.toLocaleString()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
