import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ShoppingCart,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import {
  fetchAdminCarts,
  setSearchTerm,
  setSortBy,
  setPage,
  setStoreOnly,
  setSelectedCart,
} from '@/store/slices/cartsSlice'
import { fetchProducts } from '@/store/slices/productsSlice'
import CartStats from '@/components/carts/CartStats'
import CartFilters from '@/components/carts/CartFilters'
import CartCard from '@/components/carts/CartCard'
import CartDetailModal from '@/components/carts/CartDetailModal'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Pagination from '@/components/common/Pagination'
import {
  buildStoreCatalogLookup,
  isStoreCart,
  filterStoreCart,
} from '@/utils/storeCatalog'

export default function Carts() {
  const dispatch = useDispatch()

  // 1. Redux as Single Source of Truth
  const {
    items: rawCarts,
    page,
    isLoading,
    error,
    searchTerm,
    sortBy,
    storeOnly,
    selectedCart,
  } = useSelector((state) => state.carts)

  const products = useSelector((state) => state.products.items || [])
  const preferences = useSelector((state) => state.ui?.preferences)
  const currency = preferences?.currency || 'EGP'
  const pageSize = Number(preferences?.defaultPageSize) || 25

  const [expandedCartIds, setExpandedCartIds] = useState({})

  // Fetch active carts and ensure store products catalog is loaded
  useEffect(() => {
    dispatch(fetchAdminCarts({ limit: 100 }))
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: 100 }))
    }
  }, [dispatch, products.length])

  const toggleCartExpand = (id) => {
    setExpandedCartIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // 2. Pure Data-Driven Catalog Matching
  const storeCatalogLookup = useMemo(
    () => buildStoreCatalogLookup(products),
    [products]
  )

  // 3. Store-Scope Filter:
  // Shows only carts containing Nexis Tech electronics products when storeOnly is true.
  const storeScopedCarts = useMemo(() => {
    if (!storeOnly) return rawCarts
    return rawCarts
      .filter((cart) => isStoreCart(cart, storeCatalogLookup))
      .map((cart) => filterStoreCart(cart, storeCatalogLookup))
  }, [rawCarts, storeOnly, storeCatalogLookup])

  // 4. Search and Sort Filtering
  const filteredCarts = useMemo(() => {
    let result = [...storeScopedCarts]

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      result = result.filter((cart) => {
        const username = cart.user?.username?.toLowerCase() || ''
        const email = cart.user?.email?.toLowerCase() || ''
        const cartId = (cart._id || cart.id || '').toLowerCase()
        const itemMatch = cart.items?.some((item) =>
          item.name?.toLowerCase().includes(q)
        )
        return (
          username.includes(q) ||
          email.includes(q) ||
          cartId.includes(q) ||
          itemMatch
        )
      })
    }

    if (sortBy === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0)
      )
    } else if (sortBy === 'oldest') {
      result.sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      )
    } else if (sortBy === 'highest-value') {
      result.sort((a, b) => (b.subtotal || 0) - (a.subtotal || 0))
    } else if (sortBy === 'lowest-value') {
      result.sort((a, b) => (a.subtotal || 0) - (b.subtotal || 0))
    } else if (sortBy === 'most-items') {
      result.sort(
        (a, b) =>
          (b.itemCount || b.items?.length || 0) -
          (a.itemCount || a.items?.length || 0)
      )
    }

    return result
  }, [storeScopedCarts, searchTerm, sortBy])

  // 5. Accurate KPI summary derived from store-scoped carts
  const stats = useMemo(() => {
    const totalActive = filteredCarts.length
    const totalPipelineValue = filteredCarts.reduce(
      (acc, cart) => acc + (cart.subtotal || 0),
      0
    )
    const totalItemsCount = filteredCarts.reduce(
      (acc, cart) => acc + (cart.itemCount || cart.items?.length || 0),
      0
    )
    const avgValue =
      totalActive > 0 ? (totalPipelineValue / totalActive).toFixed(2) : '0.00'

    return {
      totalActive,
      totalPipelineValue,
      totalItemsCount,
      avgValue,
    }
  }, [filteredCarts])

  // 6. Pagination calculations based on store preferences (defaultPageSize)
  const totalCarts = filteredCarts.length
  const totalPages = Math.max(1, Math.ceil(totalCarts / pageSize))
  const safePage = Math.min(page, totalPages)

  const paginatedCarts = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredCarts.slice(start, start + pageSize)
  }, [filteredCarts, safePage, pageSize])

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[var(--color-dark-bg-card)] p-6 rounded-2xl border border-border-light dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              <ShoppingCart className="w-3.5 h-3.5" />
              Active Carts Monitor
            </Badge>
            {storeOnly && (
              <Badge variant="success" size="sm">
                <Sparkles className="w-3 h-3" />
                Nexis Tech Catalog Matched (Electronics & Hardware)
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-primary-dark dark:text-white font-heading">
            Live Shopping Carts
          </h1>
          <p className="text-text-secondary dark:text-slate-400 text-sm mt-1">
            Real-time visibility into customer shopping sessions, abandoned cart values, and item demand.
          </p>
        </div>

        {/* Refresh Button using Common Component Button */}
        <Button
          variant="outline"
          size="md"
          onClick={() => dispatch(fetchAdminCarts({ page, limit: pageSize }))}
          disabled={isLoading}
          className="self-start md:self-auto gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <CartStats stats={stats} currency={currency} />

      {/* Filter & Search Toolbar */}
      <CartFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => dispatch(setSearchTerm(val))}
        sortBy={sortBy}
        onSortChange={(val) => dispatch(setSortBy(val))}
        storeOnly={storeOnly}
        onStoreOnlyChange={(val) => dispatch(setStoreOnly(val))}
      />

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(fetchAdminCarts({ page, limit: pageSize }))}
            className="text-rose-600 dark:text-rose-400 font-semibold underline"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-[var(--color-dark-bg-card)] p-6 rounded-2xl border border-border-light dark:border-white/10 animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10" />
                  <div className="space-y-1.5">
                    <div className="w-36 h-4 bg-slate-200 dark:bg-white/10 rounded" />
                    <div className="w-24 h-3 bg-slate-200 dark:bg-white/10 rounded" />
                  </div>
                </div>
                <div className="w-20 h-6 bg-slate-200 dark:bg-white/10 rounded-full" />
              </div>
              <div className="h-16 bg-slate-100 dark:bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCarts.length === 0 && (
        <div className="bg-white dark:bg-[var(--color-dark-bg-card)] p-12 rounded-3xl border border-border-light dark:border-white/10 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary-dark/5 dark:bg-white/5 text-text-secondary dark:text-slate-400 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-bold text-primary-dark dark:text-white font-heading">
            No active carts found
          </h3>
          <p className="text-sm text-text-secondary dark:text-slate-400 max-w-md">
            {searchTerm
              ? `No shopping carts match "${searchTerm}". Try another query or clear the filter.`
              : storeOnly
              ? 'No active carts currently hold Electronics & Hardware items from Nexis Tech. You can switch the scope filter to view all shared API carts.'
              : 'There are currently no active carts held by customers in the database.'}
          </p>
          <div className="flex items-center gap-3 mt-2">
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(setSearchTerm(''))}
              >
                Clear Search
              </Button>
            )}
            {storeOnly && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => dispatch(setStoreOnly(false))}
              >
                Show All Shared Carts
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Active Carts List */}
      {!isLoading && !error && paginatedCarts.length > 0 && (
        <div className="space-y-4">
          {paginatedCarts.map((cart) => (
            <CartCard
              key={cart._id || cart.id}
              cart={cart}
              currency={currency}
              isExpanded={!!expandedCartIds[cart._id || cart.id]}
              onToggleExpand={toggleCartExpand}
              onOpenDetails={(c) => dispatch(setSelectedCart(c))}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalCarts > 0 && (
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={totalCarts}
          pageSize={pageSize}
          itemLabel="carts"
          onPageChange={(newPage) => dispatch(setPage(newPage))}
          className="p-4 bg-white dark:bg-[var(--color-dark-bg-card)] rounded-2xl border border-border-light dark:border-white/10 shadow-xs"
        />
      )}

      {/* Cart Detail Modal using Common Modal & Button */}
      <CartDetailModal
        cart={selectedCart}
        currency={currency}
        onClose={() => dispatch(setSelectedCart(null))}
      />
    </div>
  )
}
