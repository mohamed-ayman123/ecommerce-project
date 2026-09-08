import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { updateOrderStatus } from '@/api/orders'
import Dropdown from '@/components/common/Dropdown'

const STATUS_OPTIONS = [
  
  'Pending',
  'Confirmed',
  'Shipped',
  'Delivered',
  'Cancelled',
]

function OrderDetailPanel({ order, onClose, onUpdated }) {
  const [prevOrder, setPrevOrder] = useState(order)
  const [status, setStatus] = useState(order?.status || 'Pending')
  const [note, setNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  if (order !== prevOrder) {
    setPrevOrder(order)
    setStatus(order?.status || 'Pending')
    setNote('')
  }

  if (!order) return null

  const orderId = order.originalId || order._id || order.id
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
      toast.error('Order ID is missing')
      return
    }

    try {
      setIsSaving(true)

      const updatedOrder = await updateOrderStatus(orderId, {
        status,
        note,
      })

      toast.success('Order status updated successfully')
      onUpdated?.(updatedOrder)
      onClose?.()
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update order status',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const isDelivered = order.status?.toLowerCase() === 'delivered'

  return (
    <aside className="flex h-full w-full max-w-md flex-col bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-2xl dark:bg-[var(--color-dark-bg-card)]">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[var(--color-border-light)] px-6 py-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]  ">
            Order Detail
          </p>
          <h2 className="mt-1 font-mono text-lg font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)] ">
            {order.id}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close order details"
          className="rounded-lg p-1 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-main)] hover:text-[var(--color-primary-dark)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Status and payment */}
      <div className="flex items-center justify-between border-b border-[var(--color-border-light)] px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-[var(--color-primary-medium)]/15 px-3 py-1 text-xs font-bold text-[var(--color-primary-dark)] dark:bg-[var(--color-bg-main)]">
            ● {order.status || 'Pending'}
          </span>

          <span className="rounded-full bg-[var(--color-accent-gold)]/20 px-3 py-1 text-xs font-bold uppercase text-[var(--color-text-gold)]">
            {order.payment || 'Pending'}
          </span>
        </div>

        <span className="text-sm text-[var(--color-text-secondary)]">
          {order.method || '—'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Info */}
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          Info
        </p>

        <div className="space-y-3 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] p-4">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--color-text-secondary)]">Placed</span>
            <span className="text-right font-semibold text-[var(--color-text-primary)]">
              {order.date || '—'}
            </span>
          </div>

          <div className="h-px bg-[var(--color-border-light)]" />

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--color-text-secondary)]">Customer</span>
            <span className="text-right font-semibold text-[var(--color-text-primary)]">
              {order.customerName || '—'}
            </span>
          </div>

          <div className="h-px bg-[var(--color-border-light)]" />

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--color-text-secondary)]">Email</span>
            <span className="max-w-[190px] truncate text-right font-semibold text-[var(--color-text-primary)]">
              {order.email || '—'}
            </span>
          </div>

          <div className="h-px bg-[var(--color-border-light)]" />

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--color-text-secondary)]">Ship to</span>
            <span className="text-right font-semibold text-[var(--color-text-primary)]">
              {shippingAddress || '—'}
            </span>
          </div>
        </div>

        {/* Items */}
        <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          Items
        </p>

        <div className="space-y-3">
          {(order.items || []).length === 0 && (
            <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] p-4 text-sm text-[var(--color-text-secondary)]">
              No item details available for this order.
            </div>
          )}

          {(order.items || []).map((item, index) => (
            <div
              key={item._id || item.id || index}
              className="flex items-center gap-3 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] p-3"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name || 'Product'}
                  className="h-12 w-12 rounded-xl bg-white object-contain p-1"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-bg-input)] text-xs text-[var(--color-text-secondary)]">
                  —
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                  {item.name || item.productName || 'Product'}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  x {item.qty || item.quantity || 1} ·{' '}
                  {item.unitPrice || item.price || '0.00'} EGP
                </p>
              </div>

              <span className="text-sm font-bold text-[var(--color-text-primary)]">
                {item.total || item.totalPrice || '0.00'} EGP
              </span>
            </div>
          ))}
        </div>

        {/* Invoice details */}
        <div className="mt-6 space-y-3 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">Subtotal</span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              {order.subtotal || '0.00'} EGP
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">Shipping</span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              {order.shipping || order.shippingFee || '0.00'} EGP
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">Tax</span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              {order.tax || '0.00'} EGP
            </span>
          </div>

          <div className="h-px bg-[var(--color-border-light)]" />

          <div className="flex items-center justify-between text-base font-bold">
            <span className="text-[var(--color-text-primary)]">Total</span>
            <span className="text-[var(--color-primary-dark)]">
              {order.total || order.totalPrice || '0.00'} EGP
            </span>
          </div>
        </div>

        {/* Customer Note: يظهر فقط عند Delivered */}
        {isDelivered && (
          <>
            <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
              Customer Note
            </p>

            <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] p-4 text-sm italic text-[var(--color-text-secondary)]">
              {customerNote ? `“${customerNote}”` : 'No customer note available.'}
            </div>
          </>
        )}

        {/* Update status */}
        <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
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
            className="w-full resize-none rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-accent-gold)] dark:bg-[var(--color-bg-main)] dark:text-[var(--color-text-primary)]"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="border-t border-[var(--color-border-light)] p-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full rounded-2xl bg-[var(--color-accent-gold)] py-3 text-sm font-bold text-[var(--color-text-primary)] transition hover:bg-[var(--color-accent-gold-hover)] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[var(--color-primary-medium)]"
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </aside>
  )
}

export default OrderDetailPanel
