import {
  ShoppingBag,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'

export default function DashboardKpiGrid({ stats, currency = 'EGP' }) {

  const topProductName = stats.topProduct?.name || '—'
  const topProductUnits = stats.topProduct?.totalSold ?? 0

  const kpis = [
    {
      id: 'total-orders',
      title: 'Total Orders',
      value: (stats.totalOrders ?? 0).toLocaleString(),
      subtitle: 'All orders received',
      icon: ShoppingBag,
      iconStyle: 'bg-primary-dark/10 dark:bg-primary-medium/30 text-primary-dark dark:text-text-gold border border-primary-medium/20',
      accentBorder: 'border-l-4 border-l-primary-dark dark:border-l-primary-medium',
    },
    {
      id: 'pending-orders',
      title: 'Pending Orders',
      value: (stats.pendingOrders ?? 0).toLocaleString(),
      subtitle: 'Awaiting fulfillment',
      icon: Clock,
      iconStyle: 'bg-accent-gold/15 text-accent-gold border border-accent-gold/25',
      accentBorder: 'border-l-4 border-l-accent-gold',
    },
    {
      id: 'total-revenue',
      title: 'Revenue',
      value: formatCurrency(stats.totalRevenue, currency),
      subtitle: 'Total gross revenue',
      icon: DollarSign,
      iconStyle: 'bg-accent-gold/15 text-accent-gold border border-accent-gold/25',
      accentBorder: 'border-l-4 border-l-accent-gold',
    },
    {
      id: 'this-month',
      title: 'This Month',
      value: formatCurrency(stats.thisMonthRevenue, currency),
      subtitle: 'Monthly sales target',
      icon: TrendingUp,
      iconStyle: 'bg-primary-dark/10 dark:bg-primary-medium/30 text-primary-dark dark:text-text-gold border border-primary-medium/20',
      accentBorder: 'border-l-4 border-l-primary-dark dark:border-l-primary-medium',
    },
    {
      id: 'top-product',
      title: 'Top Product',
      value: topProductName,
      subtitle: `${topProductUnits} units sold`,
      icon: Award,
      iconStyle: 'bg-primary-medium/15 dark:bg-primary-medium/30 text-primary-dark dark:text-accent-gold border border-primary-medium/20',
      accentBorder: 'border-l-4 border-l-accent-gold',
      isText: true,
    },
    {
      id: 'users',
      title: 'Registered Users',
      value: (stats.totalCustomers ?? stats.totalUsers ?? 0).toLocaleString(),
      subtitle: 'Customer accounts',
      icon: Users,
      iconStyle: 'bg-primary-dark/10 dark:bg-primary-medium/30 text-primary-dark dark:text-text-gold border border-primary-medium/20',
      accentBorder: 'border-l-4 border-l-primary-dark dark:border-l-primary-medium',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
      {kpis.map((kpi) => {
        const IconComponent = kpi.icon
        return (
          <div
            key={kpi.id}
            className={`group bg-bg-card dark:bg-dark-bg-card p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-border-medium dark:border-primary-medium/30 ${kpi.accentBorder} shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400 font-heading">
                  {kpi.title}
                </span>

                <h3
                  className={`font-extrabold text-primary-dark dark:text-text-light font-heading tracking-tight mt-0.5 sm:mt-1 ${
                    kpi.isText
                      ? 'text-base sm:text-lg md:text-xl truncate'
                      : 'text-xl sm:text-2xl md:text-3xl'
                  }`}
                  title={kpi.isText ? kpi.value : undefined}
                >
                  {kpi.value}
                </h3>

                <p className="text-[11px] sm:text-xs text-text-secondary dark:text-slate-400 font-body">
                  {kpi.subtitle}
                </p>
              </div>

              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105 ${kpi.iconStyle}`}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
