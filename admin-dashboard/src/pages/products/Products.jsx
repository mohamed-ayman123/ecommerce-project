import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Package,
  AlertCircle,
  Trash2,
  Plus,
  RefreshCw,
  SearchX,
} from 'lucide-react'
import { toast } from 'react-toastify'

import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Pagination from '@/components/common/Pagination'
import Badge from '@/components/common/Badge'

import ProductStats from '@/components/products/ProductStats'
import ProductFilterBar from '@/components/products/ProductFilterBar'
import ProductCard from '@/components/products/ProductCard'
import ProductDetails from '@/components/products/ProductDetails'
import ProductQuickEditModal from '@/components/products/ProductQuickEditModal'

import {
  fetchProducts,
  deleteProductById,
  selectProductCatalogStats,
} from '@/store/slices/productsSlice'
import { isElectronicsOrHardwareProduct } from '@/constants/categories'

export default function Products() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Store slices as single source of truth
  const { items = [], isLoading, error } = useSelector((state) => state.products)
  const preferences = useSelector((state) => state.ui?.preferences)

  const currency = preferences?.currency || 'EGP'
  const pageSize = Number(preferences?.defaultPageSize) || 25

  // Local UI filters & pagination state
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Modals state
  const [selectedProductForDetails, setSelectedProductForDetails] = useState(null)
  const [selectedProductForQuickEdit, setSelectedProductForQuickEdit] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Reset page when filter or search changes
  const handleSearchChange = (val) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const handleFilterChange = (val) => {
    setFilter(val)
    setCurrentPage(1)
  }

  // Memoized catalog statistics from Redux SSOT
  const catalogStats = useSelector(selectProductCatalogStats)
  const filterCounts = catalogStats.counts

  // Filter products client-side for immediate responsive search/chip filtering
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((product) => {
      // Strict category filter: Electronics & Hardware ONLY
      if (!isElectronicsOrHardwareProduct(product)) return false

      const name = (product.name || '').toLowerCase()
      const category = (product.category || '').toLowerCase()
      const brand = (product.brand || '').toLowerCase()
      const tags = Array.isArray(product.tags)
        ? product.tags.join(' ').toLowerCase()
        : ''

      const matchesSearch =
        query === '' ||
        name.includes(query) ||
        category.includes(query) ||
        brand.includes(query) ||
        tags.includes(query)

      let matchesFilter = true
      if (filter === 'featured') {
        matchesFilter = Boolean(product.featured)
      } else if (filter === 'inStock') {
        matchesFilter = Number(product.stock) > 0
      } else if (filter === 'outOfStock') {
        matchesFilter = Number(product.stock) === 0
      } else if (filter === 'draft') {
        matchesFilter = product.isActive === false
      }

      return matchesSearch && matchesFilter
    })
  }, [items, search, filter])

  // Pagination calculations based on store preferences (defaultPageSize)
  const totalItems = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(currentPage, totalPages)

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, safePage, pageSize])

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  // Actions
  const handleView = (product) => {
    setSelectedProductForDetails(product)
  }

  const handleEdit = (product) => {
    const id = product._id || product.id
    navigate(`/dashboard/products/${id}/edit`)
  }

  const handleQuickEdit = (product) => {
    setSelectedProductForQuickEdit(product)
  }

  const handleDelete = (product) => {
    setProductToDelete(product)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    const id = productToDelete._id || productToDelete.id
    setIsDeleting(true)

    const resultAction = await dispatch(deleteProductById(id))
    setIsDeleting(false)

    if (deleteProductById.fulfilled.match(resultAction)) {
      toast.success(
        resultAction.payload?.message || 'Product deleted successfully'
      )
      setProductToDelete(null)
    } else {
      toast.error(
        resultAction.payload || 'Failed to delete product. Please try again.'
      )
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-white via-bg-main/30 to-white dark:from-dark-bg-card dark:via-dark-bg-main/40 dark:to-dark-bg-card p-6 sm:p-8 rounded-3xl border border-border-medium dark:border-primary-medium/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-dark text-white dark:bg-primary-medium flex items-center justify-center shrink-0 shadow-sm border border-primary-medium/30">
            <Package className="w-6 h-6 text-text-gold" />
          </div>
          <div>
            <Badge variant="primary" size="sm">
              CATALOG MANAGEMENT
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-primary-dark dark:text-text-light tracking-tight">
              Products Catalog
            </h1>
            <p className="text-xs text-text-secondary font-body">
              Manage inventories, update pricing and discounts, and promote key items.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(fetchProducts())}
            isLoading={isLoading && items.length > 0}
            title="Refresh product list"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard/products/new')}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Product
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <ProductStats stats={catalogStats} />

      {/* Error Alert if any */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between gap-3 text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-semibold">{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(fetchProducts())}
            className="border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <ProductFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        filter={filter}
        onFilterChange={handleFilterChange}
        totalResults={totalItems}
        counts={filterCounts}
      />

      {/* Loading Skeleton State */}
      {isLoading && items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border-medium bg-white dark:bg-dark-bg-card dark:border-primary-medium/30 p-4 space-y-3 animate-pulse"
            >
              <div className="h-44 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/3 rounded-sm bg-slate-200 dark:bg-slate-800" />
              <div className="h-5 w-3/4 rounded-sm bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-full rounded-sm bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-1/2 rounded-sm bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      ) : paginatedProducts.length > 0 ? (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              currency={currency}
              onView={handleView}
              onEdit={handleEdit}
              onQuickEdit={handleQuickEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-border-medium bg-white p-12 text-center shadow-xs dark:border-primary-medium/30 dark:bg-dark-bg-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-main text-text-secondary dark:bg-dark-bg-main dark:text-slate-400">
            <SearchX className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-bold font-heading text-primary-dark dark:text-white">
            No products found
          </h3>
          <p className="mt-1 text-xs text-text-secondary max-w-sm mx-auto font-body">
            {search || filter !== 'all'
              ? 'Try adjusting your search terms or clearing current filter selections.'
              : 'Your inventory catalog is currently empty. Get started by adding your first product.'}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            {search || filter !== 'all' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('')
                  setFilter('all')
                }}
              >
                Reset Filters
              </Button>
            ) : null}
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/products/new')}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Product
            </Button>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        itemLabel="products"
        onPageChange={goToPage}
        className="pt-4 border-t border-border-light dark:border-primary-medium/20"
      />

      {/* Product Details Modal */}
      <ProductDetails
        isOpen={Boolean(selectedProductForDetails)}
        onClose={() => setSelectedProductForDetails(null)}
        product={selectedProductForDetails}
        currency={currency}
        onEdit={handleEdit}
      />

      {/* Product Quick Edit Modal */}
      <ProductQuickEditModal
        isOpen={Boolean(selectedProductForQuickEdit)}
        onClose={() => setSelectedProductForQuickEdit(null)}
        product={selectedProductForQuickEdit}
        currency={currency}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(productToDelete)}
        onClose={() => !isDeleting && setProductToDelete(null)}
        title="Confirm Product Deletion"
        maxWidth="max-w-md"
        footer={
          <div className="flex w-full items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setProductToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={confirmDelete}
              isLoading={isDeleting}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete Product
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-text-primary dark:text-text-light">
            Are you sure you want to delete{' '}
            <strong className="font-bold text-primary-dark dark:text-text-gold">
              {productToDelete?.name}
            </strong>
            ?
          </p>
          <p className="text-xs text-text-secondary">
            This action will permanently remove this item from your catalog and API responses.
          </p>
        </div>
      </Modal>
    </div>
  )
}