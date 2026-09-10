import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { changeOrderStatus } from '@/store/slices/ordersSlice'
import Dropdown from '@/components/common/Dropdown'
import Button from '@/components/common/Button'

const STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Returned',
]

const normalizeStatus = (s) => {
  if (!s) return 'Pending'
  const str = String(s).trim()
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function OrderDetailPanel({ order, currency = 'EGP', onClose, onUpdated }) {
  const dispatch = useDispatch()
  const [prevOrder, setPrevOrder] = useState(order)
  const [status, setStatus] = useState(normalizeStatus(order?.status))
  const [note, setNote] = useState(order?.adminNote || '')
  const [isSaving, setIsSaving] = useState(false)

  if (order !== prevOrder) {
    setPrevOrder(order)
    setStatus(normalizeStatus(order?.status))
    setNote(order?.adminNote || '')
  }

  if (!order) return null

  const orderId = order._id || order.originalId || (order.id?.startsWith?.('#') ? '' : order.id)
  const customerNote =
    order.customerNote || order.note || order.customer?.note || ''

  const shippingAddress = order.shipTo
    ? typeof order.shipTo === 'string'
      ? order.shipTo
      : [order.shipTo.address, order.shipTo.city, order.shipTo.country]
          .filter(Boolean)
          .join(', ')
    : '—'

  const handleSave = async () => {
    if (!orderId) {
      toast.error('Valid Order ID is missing')
      return
    }

    try {
      setIsSaving(true)

      const statusData = {
        status: status.toLowerCase().trim(),
      }
      if (note && note.trim()) {
        statusData.adminNote = note.trim()
      }

      const result = await dispatch(
        changeOrderStatus({ id: orderId, statusData })
      ).unwrap()

      toast.success('Order status updated successfully')
      onUpdated?.(result.data?.order || result.data)
      onClose?.()
    } catch (error) {
      toast.error(
        typeof error === 'string'
          ? error
          : error?.message || 'Failed to update order status'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <aside className="flex h-full w-full max-w-md flex-col bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-2xl dark:bg-[var(--color-dark-bg-card)] dark:text-white border-l border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/30">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/30 px-6 py-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)] dark:text-[var(--color-text-gold)]">
            Order Detail
          </p>
          <h2 className="mt-1 font-mono text-lg font-bold text-[var(--color-primary-dark)] dark:text-white">
            {order.id}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close order details"
          className="rounded-lg p-1 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-main)] hover:text-[var(--color-primary-dark)] dark:text-slate-400 dark:hover:bg-[var(--color-primary-medium)]/30 dark:hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Status and payment */}
      <div className="flex items-center justify-between border-b border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/30 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-[var(--color-primary-medium)]/15 px-3 py-1 text-xs font-bold text-[var(--color-primary-dark)] dark:bg-[var(--color-primary-medium)]/40 dark:text-emerald-300">
            ● {order.status || 'Pending'}
          </span>

          <span className="rounded-full bg-[var(--color-accent-gold)]/20 px-3 py-1 text-xs font-bold uppercase text-[var(--color-text-gold)]">
            {order.payment || 'Pending'}
          </span>
        </div>

        <span className="text-sm text-[var(--color-text-secondary)] dark:text-slate-300">
          {order.method || '—'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Info */}
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)] dark:text-[var(--color-text-gold)]">
          Info
        </p>

        <div className="space-y-3 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] p-4 dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/30">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--color-text-secondary)] dark:text-slate-400">Placed Date</span>
            <span className="text-right font-semibold text-[var(--color-text-primary)] dark:text-slate-100">
              {order.date || '—'}
            </span>
          </div>

          <div className="h-px bg-[var(--color-border-light)] dark:bg-[var(--color-primary-medium)]/25" />

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--color-text-secondary)] dark:text-slate-400">Customer</span>
            <span className="text-right font-semibold text-[var(--color-text-primary)] dark:text-white">
              {order.customerName || '—'}
            </span>
          </div>

          <div className="h-px bg-[var(--color-border-light)] dark:bg-[var(--color-primary-medium)]/25" />

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--color-text-secondary)] dark:text-slate-400">Email</span>
            <span className="max-w-[190px] truncate text-right font-semibold text-[var(--color-text-primary)] dark:text-white">
              {order.email || '—'}
            </span>
          </div>

          <div className="h-px bg-[var(--color-border-light)] dark:bg-[var(--color-primary-medium)]/25" />

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--color-text-secondary)] dark:text-slate-400">Ship to</span>
            <span className="text-right font-semibold text-[var(--color-text-primary)] dark:text-white">
              {shippingAddress || '—'}
            </span>
          </div>
        </div>

        {/* Items */}
        <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)] dark:text-[var(--color-text-gold)]">
          Items
        </p>

        <div className="space-y-3">
          {(order.items || []).length === 0 && (
            <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] p-4 text-sm text-[var(--color-text-secondary)] dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/30 dark:text-slate-400">
              No item details available for this order.
            </div>
          )}

          {(order.items || []).map((item, index) => (
            <div
              key={item._id || item.id || index}
              className="flex items-center gap-3 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] p-3 dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/30"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name || 'Product'}
                  className="h-12 w-12 rounded-xl bg-white object-contain p-1"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-bg-input)] text-xs text-[var(--color-text-secondary)] dark:bg-[var(--color-primary-medium)]/40 dark:text-slate-300">
                  —
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                  {item.name || item.productName || 'Product'}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] dark:text-slate-400">
                  x {item.qty || item.quantity || 1} ·{' '}
                  {item.unitPrice || item.price || '0.00'} {currency}
                </p>
              </div>

              <span className="text-sm font-bold text-[var(--color-text-primary)] dark:text-[var(--color-text-gold)]">
                {item.total || item.totalPrice || '0.00'} {currency}
              </span>
            </div>
          ))}
        </div>

        {/* Invoice details */}
        <div className="mt-6 space-y-3 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] p-4 dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-secondary)] dark:text-slate-400">Subtotal</span>
            <span className="font-semibold text-[var(--color-text-primary)] dark:text-white">
              {order.subtotal || '0.00'} {currency}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-secondary)] dark:text-slate-400">Shipping</span>
            <span className="font-semibold text-[var(--color-text-primary)] dark:text-white">
              {order.shipping || order.shippingFee || '0.00'} {currency}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-secondary)] dark:text-slate-400">Tax</span>
            <span className="font-semibold text-[var(--color-text-primary)] dark:text-white">
              {order.tax || '0.00'} {currency}
            </span>
          </div>

          <div className="h-px bg-[var(--color-border-light)] dark:bg-[var(--color-primary-medium)]/25" />

          <div className="flex items-center justify-between text-base font-bold">
            <span className="text-[var(--color-text-primary)] dark:text-white">Total</span>
            <span className="text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]">
              {order.total || order.totalPrice || '0.00'} {currency}
            </span>
          </div>
        </div>

        {/* Customer Note */}
        {customerNote && (
          <>
            <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)] dark:text-[var(--color-text-gold)]">
              Customer Note
            </p>

            <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] p-4 text-sm italic text-[var(--color-text-secondary)] dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/30 dark:text-slate-300">
              “{customerNote}”
            </div>
          </>
        )}

        {/* Update status */}
        <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)] dark:text-[var(--color-text-gold)]">
          Update Status
        </p>

        <div className="space-y-3">
          <Dropdown
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS.map((option) => ({
              value: option,
              label: option,
            }))}
            placeholder="All statuses"
            ariaLabel="Change order status"
          />

          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add a note..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-accent-gold)] dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/40 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="border-t border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/30 p-6">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          disabled={isSaving}
          isLoading={isSaving}
          className="w-full font-bold"
        >
          Save changes
        </Button>
      </div>
    </aside>
  )
}

export default OrderDetailPanel
