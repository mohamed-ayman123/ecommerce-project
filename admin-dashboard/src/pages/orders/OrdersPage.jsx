import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Search, Sparkles, CreditCard, Banknote, Wallet, FileText, MessageSquare } from 'lucide-react'
import OrderDetailPanel from '@/components/orders/OrderDetailPanel'
import { fetchAdminOrders } from '@/store/slices/ordersSlice'
import { fetchProducts } from '@/store/slices/productsSlice'
import {
  buildStoreCatalogLookup,
  isStoreOrder,
  filterStoreOrder,
} from '@/utils/storeCatalog'
import Dropdown from '@/components/common/Dropdown'
import Badge from '@/components/common/Badge'
import Pagination from '@/components/common/Pagination'
import { formatDate } from '@/utils/formatters'
import { getAdminNote } from '@/utils/orderNotes'

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
  const localNote =
    getAdminNote(orderId) ||
    getAdminNote(order.id) ||
    getAdminNote(order._id) ||
    getAdminNote(order.originalId)
  const adminNote = (
    order.adminNote !== undefined && order.adminNote !== null
      ? order.adminNote
      : localNote
  ).trim()
  const customerNote = (order.customerNote || order.note || order.customer?.note || '').trim()

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
    adminNote,
    customerNote,
  }
}

const SCOPE_OPTIONS = [
  'Nexis Tech (Electronics Only)',
  'All Shared Orders',
]

function OrdersPage() {
  const dispatch = useDispatch()
  const { items, isLoading, error } = useSelector(
    (state) => state.orders,
  )
  const products = useSelector((state) => state.products.items || [])
  const preferences = useSelector((state) => state.ui?.preferences)
  const pageSize = Number(preferences?.defaultPageSize || preferences?.itemsPerPage) || PAGE_SIZE
  const currency = preferences?.currency || 'EGP'

  const [searchParams, setSearchParams] = useSearchParams()
  const orderIdParam = searchParams.get('orderId')

  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [hoveredNote, setHoveredNote] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [scopeFilter, setScopeFilter] = useState('Nexis Tech (Electronics Only)')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [paymentFilter, setPaymentFilter] = useState('All payments')
  const [methodFilter, setMethodFilter] = useState('All methods')

  // Dismiss floating note tooltip on any scroll
  useEffect(() => {
    const handleScroll = () => setHoveredNote(null)
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [])

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

  // Synchronously derive selectedOrder from URL param or active click selection
  const activeOrderId = selectedOrderId || orderIdParam
  const selectedOrder = useMemo(() => {
    if (!activeOrderId) return null
    return (
      orders.find(
        (o) =>
          o.originalId === activeOrderId ||
          o._id === activeOrderId ||
          o.id === activeOrderId ||
          o.id === `#${String(activeOrderId).slice(-8).toUpperCase()}`
      ) || null
    )
  }, [activeOrderId, orders])

  const handleOpenOrder = (order) => {
    const targetId = order.originalId || order._id || order.id
    setSelectedOrderId(targetId)
    if (targetId) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('orderId', targetId)
      setSearchParams(newParams, { replace: true })
    }
  }

  const handleCloseOrder = () => {
    setSelectedOrderId(null)
    if (searchParams.has('orderId')) {
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('orderId')
      setSearchParams(newParams, { replace: true })
    }
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / pageSize),
  )
  const safePage = Math.min(currentPage, totalPages)

  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
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
              <Badge variant="success" size="sm">
                <Sparkles className="w-3 h-3" />
                Nexis Tech Store Orders (Electronics Only)
              </Badge>
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
            <div className="grid grid-cols-6 gap-4 bg-[var(--color-bg-main)] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] dark:bg-[var(--color-dark-bg-main)] dark:text-[var(--color-text-gold)] text-center">
              <span>Order</span>
              <span>Customer</span>
              <span>Date</span>
              <span>Status</span>
              <span>Payment</span>
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
                onClick={() => handleOpenOrder(order)}
                className="grid w-full grid-cols-6 items-center gap-4 whitespace-nowrap border-t border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/20 px-6 py-4 text-center transition-colors hover:bg-[var(--color-bg-main)] dark:bg-[var(--color-dark-bg-card)] dark:hover:bg-[var(--color-primary-medium)]/25 group cursor-pointer"
              >
                {/* 1. Order ID & Note Indicator */}
                <div className="flex items-center justify-center gap-1.5 min-w-0">
                  <span className="font-mono text-sm font-semibold text-[var(--color-text-gold)]">
                    {order.id}
                  </span>

                  {(order.adminNote || order.customerNote) && (
                    <div className="inline-flex items-center justify-center">
                      <span
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          setHoveredNote({
                            order,
                            rect: {
                              top: rect.top,
                              bottom: rect.bottom,
                              left: rect.left,
                              right: rect.right,
                              width: rect.width,
                              height: rect.height,
                            },
                          })
                        }}
                        onMouseLeave={() => setHoveredNote(null)}
                        className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--color-accent-gold)]/15 text-[var(--color-accent-gold)] border border-[var(--color-accent-gold)]/30 hover:bg-[var(--color-accent-gold)]/25 transition-colors cursor-help"
                      >
                        <FileText className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Customer Avatar */}
                <div className="flex items-center justify-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-input)] text-sm font-bold text-[var(--color-primary-dark)] dark:bg-[var(--color-primary-medium)]/50 dark:text-white">
                    {order.customer}
                  </span>
                </div>

                {/* 3. Date */}
                <span className="text-sm font-medium text-[var(--color-text-secondary)] dark:text-slate-200 text-center">
                  {order.date}
                </span>

                {/* 4. Order Status */}
                <div className="flex items-center justify-center">
                  <Badge status={order.status} dot />
                </div>

                {/* 5. Payment */}
                <div className="flex flex-col items-center justify-center gap-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)] dark:text-white">
                    {renderPaymentMethodIcon(order.method)}
                    <span>{order.method || 'Cash'}</span>
                  </div>

                  <Badge status={order.payment || 'pending'} rounded="md" size="sm" />
                </div>

                {/* 6. Total */}
                <span className="text-sm font-bold text-[var(--color-text-primary)] dark:text-white text-center">
                  {order.total} {currency}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredOrders.length > 0 && (
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          itemLabel="orders"
          onPageChange={goToPage}
        />
      )}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={handleCloseOrder}
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
          onClose={handleCloseOrder}
        />
      </div>

      {/* Floating Note Tooltip rendered into document.body to avoid table overflow clipping */}
      {hoveredNote &&
        typeof document !== 'undefined' &&
        createPortal(
          (() => {
            const showBelow = hoveredNote.rect.top < 220
            const top = showBelow
              ? hoveredNote.rect.bottom + 10
              : hoveredNote.rect.top - 10
            const centerX = hoveredNote.rect.left + hoveredNote.rect.width / 2
            const clampedX = Math.max(140, Math.min(window.innerWidth - 140, centerX))

            return (
              <div
                className="pointer-events-none fixed z-50 flex flex-col items-start w-64 p-3 rounded-2xl bg-white/95 dark:bg-[var(--color-dark-bg-card)]/95 backdrop-blur-md text-[var(--color-text-primary)] dark:text-white text-xs shadow-[0_18px_38px_-6px_rgba(47,72,66,0.22)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.65)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40 ring-1 ring-black/5 dark:ring-white/10 transition-all text-left"
                style={{
                  top: `${top}px`,
                  left: `${clampedX}px`,
                  transform: showBelow
                    ? 'translate(-50%, 0)'
                    : 'translate(-50%, -100%)',
                }}
              >
                {/* Header bar */}
                <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/30 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] dark:text-slate-400 font-heading">
                  <span>Order Notes</span>
                  <span className="text-[var(--color-text-gold)] font-mono font-semibold">
                    {hoveredNote.order.id}
                  </span>
                </div>

                {/* Admin Note Card */}
                {hoveredNote.order.adminNote && (
                  <div className="w-full rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 p-2.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="flex h-4 w-4 items-center justify-center rounded-md bg-amber-500/20 text-amber-700 dark:text-[var(--color-text-gold)]">
                        <FileText className="w-2.5 h-2.5" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-[var(--color-text-gold)] font-heading">
                        Internal Admin Note
                      </span>
                    </div>
                    <p className="line-clamp-3 text-slate-800 dark:text-slate-200 mt-0.5 whitespace-normal font-normal text-xs leading-relaxed">
                      {hoveredNote.order.adminNote}
                    </p>
                  </div>
                )}

                {/* Customer Note Card */}
                {hoveredNote.order.customerNote && (
                  <div
                    className={`w-full rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 p-2.5 shadow-2xs ${hoveredNote.order.adminNote ? 'mt-2' : ''}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="flex h-4 w-4 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                        <MessageSquare className="w-2.5 h-2.5" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-heading">
                        Customer Note
                      </span>
                    </div>
                    <p className="line-clamp-3 text-slate-800 dark:text-slate-200 mt-0.5 whitespace-normal italic font-normal text-xs leading-relaxed">
                      “{hoveredNote.order.customerNote}”
                    </p>
                  </div>
                )}

                {/* Tooltip arrow matching light and dark surface + border */}
                {showBelow ? (
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white dark:bg-[var(--color-dark-bg-card)] border-l border-t border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40" />
                ) : (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white dark:bg-[var(--color-dark-bg-card)] border-r border-b border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40" />
                )}
              </div>
            )
          })(),
          document.body,
        )}
    </div>
  )
}

export default OrdersPage