import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, ChevronLeft, ChevronRight, Sparkles, CreditCard, Banknote, Wallet } from 'lucide-react'
import OrderDetailPanel from '@/components/orders/OrderDetailPanel'
import { fetchAdminOrders, setOrders } from '@/store/slices/ordersSlice'
import { fetchProducts } from '@/store/slices/productsSlice'
import {
  buildStoreCatalogLookup,
  isStoreOrder,
  filterStoreOrder,
} from '@/utils/storeCatalog'
import Dropdown from '@/components/common/Dropdown'

const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700',
  Confirmed: 'bg-sky-50 text-sky-600',
  Processing: 'bg-violet-50 text-violet-600',
  Shipped: 'bg-cyan-50 text-cyan-600',
  Delivered: 'bg-emerald-50 text-emerald-600',
  Cancelled: 'bg-rose-50 text-rose-600',
  Returned: 'bg-slate-100 text-slate-600',
}

const paymentBadgeStyles = {
  paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
  failed: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25',
  refunded: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25',
}

const renderPaymentMethodIcon = (method) => {
  const m = String(method || '').toLowerCase()
  if (m.includes('stripe') || m.includes('card')) {
    return <CreditCard className="w-3.5 h-3.5 shrink-0 text-sky-500" />
  }
  if (m.includes('paypal') || m.includes('paymob') || m.includes('wallet')) {
    return <Wallet className="w-3.5 h-3.5 shrink-0 text-violet-500" />
  }
  return <Banknote className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
}

const PAYMENT_OPTIONS = [
  'All payments',
  'Pending',
  'Paid',
  'Failed',
]
const METHODS_OPTIONS = [
  'All methods',
  'Cash',
  'Stripe',
]
const STATUS_OPTIONS = [
  'All statuses',
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Returned',
]
const PAGE_SIZE = 15

const formatDate = (value) => {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatOrder = (order) => {
  const customer = order.customer || order.user || order.createdBy || {}
  const customerName =
    customer.username ||
    customer.name ||
    order.customerName ||
    order.username ||
    '—'

  const rawStatus = order.status || 'Pending'
  const rawPayment = order.paymentStatus || order.payment || 'Pending'
  const rawMethod = order.paymentMethod || order.method || '—'

  const orderId = order._id || order.id || ''

  return {
    ...order,
    id: orderId ? `#${String(orderId).slice(-8).toUpperCase()}` : '#—',
    customer: customerName.charAt(0).toUpperCase() || 'U',
    customerName,
    email: customer.email || order.email || '—',
    shipTo: order.shippingAddress || order.shipTo || null,
    date: formatDate(order.createdAt || order.orderDate || order.date),
    status: String(rawStatus).charAt(0).toUpperCase() + String(rawStatus).slice(1).toLowerCase(),
    payment: String(rawPayment).charAt(0).toUpperCase() + String(rawPayment).slice(1).toLowerCase(),
    method: rawMethod === '—'? '—': String(rawMethod).charAt(0).toUpperCase() + String(rawMethod).slice(1).toLowerCase(),
    total: order.total ?? order.totalAmount ?? order.totalPrice ?? order.amount ?? '0.00',
    originalId: orderId,
  }
}

const SCOPE_OPTIONS = [
  'Nexis Tech (Electronics Only)',
  'All Shared Orders',
]

function OrdersPage() {
  const dispatch = useDispatch()
  const { items, total, isLoading, error } = useSelector(
    (state) => state.orders,
  )
  const products = useSelector((state) => state.products.items || [])
  const preferences = useSelector((state) => state.ui?.preferences)
  const pageSize = Number(preferences?.defaultPageSize || preferences?.itemsPerPage) || PAGE_SIZE
  const currency = preferences?.currency || 'EGP'

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [scopeFilter, setScopeFilter] = useState('Nexis Tech (Electronics Only)')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [paymentFilter, setPaymentFilter] = useState('All payments')
  const [methodFilter, setMethodFilter] = useState('All methods')

  useEffect(() => {
    dispatch(fetchAdminOrders())
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: 100 }))
    }
  }, [dispatch, products.length])

  // Build catalog lookup for store-level filtering
  const storeCatalogLookup = useMemo(
    () => buildStoreCatalogLookup(products),
    [products]
  )

  // Scope orders to Nexis Tech Electronics merchandise when scopeFilter is active
  const storeScopedOrders = useMemo(() => {
    if (scopeFilter !== 'Nexis Tech (Electronics Only)') {
      return items
    }

    return items
      .filter((order) => isStoreOrder(order, storeCatalogLookup))
      .map((order) => filterStoreOrder(order, storeCatalogLookup))
  }, [items, scopeFilter, storeCatalogLookup])

  const orders = useMemo(
    () => storeScopedOrders.map(formatOrder),
    [storeScopedOrders],
  )

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesSearch =
        term === '' ||
        order.id.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term)

      const matchesStatus =
        statusFilter === 'All statuses' || order.status === statusFilter

      const matchesPayment =
        paymentFilter === 'All payments' || order.payment === paymentFilter

      const matchesMethod =
        methodFilter === 'All methods' || order.method === methodFilter

      return matchesSearch && matchesStatus && matchesPayment && matchesMethod
    })
  }, [orders, searchTerm, statusFilter, paymentFilter, methodFilter])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / pageSize),
  )

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handlePaymentChange = (value) => {
    setPaymentFilter(value)
    setCurrentPage(1)
  }

  const handleMethodChange = (value) => {
    setMethodFilter(value)
    setCurrentPage(1)
  }

  return (
    <div className="relative space-y-6 pb-12">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-text-gold)]">
              Admin · Management
            </p>
            {scopeFilter === 'Nexis Tech (Electronics Only)' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                Nexis Tech Store Orders (Electronics Only)
              </span>
            )}
          </div>
          <h1 className="mt-1 text-4xl font-black text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
            Orders
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Manage customer orders, payment status, and delivery progress.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] px-6 py-3 shadow-sm dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/30">
          <span className="text-2xl font-black text-[var(--color-text-primary)] dark:text-white">
            {orders.length}
          </span>
          <span className="ml-2 text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-gold)]">
            {scopeFilter === 'Nexis Tech (Electronics Only)' ? 'store orders' : 'total orders'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search ID, customer..."
            className="w-full rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] py-3 pl-11 pr-4 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-gold)] dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/30 dark:placeholder:text-slate-300 dark:text-white"
          />
        </div>

        <Dropdown
          value={scopeFilter}
          onChange={(val) => {
            setScopeFilter(val)
            setCurrentPage(1)
          }}
          options={SCOPE_OPTIONS.map((option) => ({
            value: option,
            label: option,
          }))}
          placeholder="Filter by Store Scope"
          ariaLabel="Filter by Store Scope"
        />

        <Dropdown
          value={statusFilter}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS.map((option) => ({
            value: option,
            label: option,
          }))}
          placeholder="All statuses"
          ariaLabel="Filter by order status"
        />

        <Dropdown
          value={paymentFilter}
          onChange={handlePaymentChange}
          options={PAYMENT_OPTIONS.map((option) => ({
            value: option,
            label: option,
          }))}
          placeholder="All payments"
          ariaLabel="Filter by order payments"
        />

        <Dropdown
          value={methodFilter}
          onChange={handleMethodChange}
          options={METHODS_OPTIONS.map((option) => ({
            value: option,
            label: option,
          }))}
          placeholder="All methods"
          ariaLabel="Filter by order methods"
        />
      </div>

      {isLoading && (
        <div className="rounded-2xl bg-[var(--color-bg-card)] dark:bg-[var(--color-dark-bg-card)] px-6 py-12 text-center text-sm text-[var(--color-text-secondary)] dark:text-slate-400 shadow-sm border border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/30">
          Loading orders...
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-2xl bg-[var(--color-bg-card)] dark:bg-[var(--color-dark-bg-card)] px-6 py-12 text-center text-sm text-red-500 shadow-sm border border-red-200 dark:border-red-900/40">
          {error}
        </div>
      )}

      
      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] shadow-sm dark:border-[var(--color-primary-medium)]/30 dark:bg-[var(--color-dark-bg-card)]">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-6 gap-4 bg-[var(--color-bg-main)] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] dark:bg-[var(--color-dark-bg-main)] dark:text-[var(--color-text-gold)]">
              <span>Order</span>
              <span>Customer</span>
              <span>Date</span>
              <span>Status</span>
              <span className="text-center">Payment</span>
              <span>Total</span>
            </div>

            {paginatedOrders.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-[var(--color-text-secondary)] dark:text-slate-400 dark:bg-[var(--color-dark-bg-card)]">
                No orders match your search or filters.
              </div>
            )}

            {paginatedOrders.map((order) => (
              <button
                key={order.originalId || order.id}
                type="button"
                onClick={() => setSelectedOrder(order)}
                className="grid w-full grid-cols-6 items-center gap-4 whitespace-nowrap border-t border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/20 px-6 py-4 text-left transition-colors hover:bg-[var(--color-bg-main)] dark:bg-[var(--color-dark-bg-card)] dark:hover:bg-[var(--color-primary-medium)]/25 group cursor-pointer"
              >
                <span className="font-mono text-sm font-semibold text-[var(--color-text-gold)]">
                  {order.id}
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-input)] text-sm font-bold text-[var(--color-primary-dark)] dark:bg-[var(--color-primary-medium)]/50 dark:text-white">
                  {order.customer}
                </span>

                <span className="text-sm font-medium text-[var(--color-text-secondary)] dark:text-slate-200">
                  {order.date}
                </span>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                    statusStyles[order.status] ||
                    'bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] dark:bg-[var(--color-primary-medium)]/40 dark:text-slate-300'
                  }`}
                >
                  ● {order.status}
                </span>

                <div className="flex flex-col items-center justify-center gap-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)] dark:text-white">
                    {renderPaymentMethodIcon(order.method)}
                    <span>{order.method || 'Cash'}</span>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      paymentBadgeStyles[(order.payment || 'pending').toLowerCase()] || paymentBadgeStyles.pending
                    }`}
                  >
                    {order.payment || 'Pending'}
                  </span>
                </div>

                <span className="text-sm font-bold text-[var(--color-text-primary)] dark:text-white">
                  {order.total} {currency}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredOrders.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className="text-sm text-[var(--color-text-secondary)] dark:text-slate-400">
            Showing{' '}
            <span className="font-semibold text-[var(--color-text-primary)] dark:text-white">
              {(currentPage - 1) * pageSize + 1}
            </span>{' '}
            -{' '}
            <span className="font-semibold text-[var(--color-text-primary)] dark:text-white">
              {Math.min(currentPage * pageSize, filteredOrders.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[var(--color-text-primary)] dark:text-white">
              {filteredOrders.length}
            </span>{' '}
            orders
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-main)] dark:bg-[var(--color-dark-bg-card)] dark:border-[var(--color-primary-medium)]/40 dark:text-slate-300 dark:hover:bg-[var(--color-primary-medium)]/30 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold cursor-pointer transition-colors ${
                    page === currentPage
                      ? 'bg-[var(--color-primary-dark)] text-white dark:bg-[var(--color-text-gold)] dark:text-[var(--color-primary-dark)] shadow-sm'
                      : 'border border-[var(--color-border-light)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-main)] dark:bg-[var(--color-dark-bg-card)] dark:border-[var(--color-primary-medium)]/40 dark:text-slate-300 dark:hover:bg-[var(--color-primary-medium)]/30'
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-main)] dark:bg-[var(--color-dark-bg-card)] dark:border-[var(--color-primary-medium)]/40 dark:text-slate-300 dark:hover:bg-[var(--color-primary-medium)]/30 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setSelectedOrder(null)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 transform shadow-2xl transition-transform duration-300 ease-out ${
          selectedOrder ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <OrderDetailPanel
          order={selectedOrder}
          currency={currency}
          onClose={() => setSelectedOrder(null)}
          onUpdated={(updated) => {
            const rawUpdated = updated?.order || updated
            const newStatus = rawUpdated?.status
            if (newStatus && selectedOrder) {
              const formattedStatus =
                String(newStatus).charAt(0).toUpperCase() + String(newStatus).slice(1).toLowerCase()
              setSelectedOrder((prev) => (prev ? { ...prev, status: formattedStatus } : null))
              const updatedItems = items.map((item) => {
                const id = item._id || item.id
                const targetId = selectedOrder.originalId || selectedOrder._id || selectedOrder.id
                return id === targetId ? { ...item, status: newStatus } : item
              })
              dispatch(setOrders({ orders: updatedItems, total }))
            }
          }}
        />
      </div>
    </div>
  )
}

export default OrdersPage