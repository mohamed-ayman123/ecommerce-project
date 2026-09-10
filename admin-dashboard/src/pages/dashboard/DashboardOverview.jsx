import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DashboardKpiGrid from '@/components/dashboard/DashboardKpiGrid'
import OrderStatusBreakdown from '@/components/dashboard/OrderStatusBreakdown'
import TopProductsCard from '@/components/dashboard/TopProductsCard'
import RecentOrdersCard from '@/components/dashboard/RecentOrdersCard'
import {
  DashboardKpiSkeleton,
  DashboardContentSkeleton,
} from '@/components/dashboard/DashboardSkeletons'
import {
  fetchDashboardData,
  setDashboardScope,
  selectDashboardScope,
  selectDashboardStats,
} from '@/store/slices/dashboardSlice'

export default function DashboardOverview() {
  const dispatch = useDispatch()
  const activeScope = useSelector(selectDashboardScope)
  const stats = useSelector(selectDashboardStats)
  const currency = useSelector(
    (state) => state.ui?.preferences?.currency || 'EGP'
  )

  // Check if store already has data so we don't flash skeletons on route transition
  const hasExistingData = useSelector(
    (state) => Boolean(state.orders?.items?.length || state.products?.items?.length)
  )

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!hasExistingData)

  const loadDashboardData = useCallback(
    (force = false) => {
      return dispatch(fetchDashboardData({ force }))
    },
    [dispatch]
  )

  useEffect(() => {
    let isMounted = true
    loadDashboardData(false).finally(() => {
      if (isMounted) setInitialLoading(false)
    })
    return () => {
      isMounted = false
    }
  }, [loadDashboardData])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadDashboardData(true)
    setIsRefreshing(false)
  }

  const handleScopeChange = (newScope) => {
    dispatch(setDashboardScope(newScope))
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* 1. Header with Scope Switcher & Refresh Button */}
      <DashboardHeader
        activeScope={activeScope}
        onScopeChange={handleScopeChange}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Top 6 Primary Commerce KPI Cards */}
      {initialLoading ? (
        <DashboardKpiSkeleton />
      ) : (
        <DashboardKpiGrid stats={stats} currency={currency} />
      )}

      {/* 3. Middle Section: Order Status Grid (Left) & Top Best Sellers (Right) */}
      {initialLoading ? (
        <DashboardContentSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col">
            <OrderStatusBreakdown stats={stats} />
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <TopProductsCard
              topProducts={stats.topProducts}
              currency={currency}
            />
          </div>
        </div>
      )}

      {/* 4. Bottom Section: Recent Orders Activity Feed */}
      {!initialLoading && (
        <RecentOrdersCard
          recentOrders={stats.recentOrders}
          currency={currency}
        />
      )}
    </div>
  )
}
