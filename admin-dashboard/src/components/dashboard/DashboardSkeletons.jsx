export function DashboardKpiSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div
          key={n}
          className="bg-bg-card dark:bg-dark-bg-card p-6 rounded-3xl border border-border-medium dark:border-primary-medium/30 space-y-3"
        >
          <div className="h-3 w-20 bg-bg-main dark:bg-dark-bg-main rounded-md" />
          <div className="h-8 w-32 bg-bg-main dark:bg-dark-bg-main rounded-lg" />
          <div className="h-3 w-24 bg-bg-main dark:bg-dark-bg-main rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function DashboardContentSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <div className="lg:col-span-7 bg-bg-card dark:bg-dark-bg-card p-6 rounded-3xl border border-border-medium dark:border-primary-medium/30 space-y-4 h-96" />
      <div className="lg:col-span-5 bg-bg-card dark:bg-dark-bg-card p-6 rounded-3xl border border-border-medium dark:border-primary-medium/30 space-y-4 h-96" />
    </div>
  )
}
