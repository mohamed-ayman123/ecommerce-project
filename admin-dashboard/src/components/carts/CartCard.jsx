import { useState } from 'react'
import {
  Mail,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Tag,
} from 'lucide-react'
import CartItemRow from './CartItemRow'
import { formatDate, formatPrice } from '@/utils/formatters'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'

const formatRelativeTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function CartCard({
  cart,
  currency = 'EGP',
  isExpanded,
  onToggleExpand,
  onOpenDetails,
}) {
  const [copiedId, setCopiedId] = useState(null)
  const cartId = cart._id || cart.id
  const items = cart.items || []
  const subtotal =
    cart.subtotal ??
    items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0)
  const itemCount =
    cart.itemCount ?? items.reduce((sum, it) => sum + (it.quantity || 1), 0)
  const user = cart.user || cart.customer || {}
  const customerName =
    user.username ||
    user.name ||
    (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '') ||
    cart.customerName ||
    'Guest Customer'
  const customerEmail = user.email || cart.email || 'No email associated'
  const initials =
    customerName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'C'

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="bg-white dark:bg-[var(--color-dark-bg-card)] rounded-2xl border border-border-light dark:border-white/10 shadow-xs hover:border-primary-medium/30 transition-all overflow-hidden">
      {/* Card Header */}
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Customer Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary-dark text-white font-bold flex items-center justify-center shrink-0 shadow-xs font-heading">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-primary-dark dark:text-white font-heading">
                {customerName}
              </h3>
              <Badge variant="success" size="sm" dot>
                Active Cart
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-secondary dark:text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {customerEmail}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatRelativeTime(cart.updatedAt || cart.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Cart Summary & Actions */}
        <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-border-light dark:border-white/10">
          <div className="text-left md:text-right">
            <div className="text-xs text-text-secondary dark:text-slate-400">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </div>
            <div className="text-lg font-bold text-primary-dark dark:text-white font-heading">
              {formatPrice(subtotal)}{' '}
              <span className="text-xs font-semibold text-accent-gold">{currency}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenDetails(cart)}
              title="View Full Details"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Details</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onToggleExpand(cartId)}
            >
              {isExpanded ? (
                <>
                  <span>Hide Items</span>
                  <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  <span>View Items ({items.length})</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Subheader Details Bar */}
      <div className="px-5 py-2.5 bg-bg-main/30 dark:bg-white/2 border-t border-border-light dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-text-secondary dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Cart ID:</span>
          <code className="font-mono bg-white dark:bg-white/5 px-2 py-0.5 rounded border border-border-light dark:border-white/10 text-primary-dark dark:text-white text-[11px]">
            {cartId}
          </code>
          <button
            onClick={() => handleCopyId(cartId)}
            className="text-text-secondary hover:text-primary-dark dark:hover:text-white transition-colors cursor-pointer"
            title="Copy Cart ID"
          >
            {copiedId === cartId ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-4">
          {cart.coupon?.code && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-gold">
              <Tag className="w-3 h-3" />
              Coupon: {cart.coupon.code} (-{cart.coupon.discountValue}%)
            </span>
          )}
          <span>Last active: {formatDate(cart.updatedAt || cart.createdAt)}</span>
        </div>
      </div>

      {/* Collapsible Items Breakdown */}
      {isExpanded && (
        <div className="p-5 border-t border-border-light dark:border-white/10 bg-white/50 dark:bg-white/1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400 mb-3">
            Cart Contents ({items.length} unique products)
          </h4>

          {items.length === 0 ? (
            <p className="text-xs text-text-secondary dark:text-slate-400 italic">
              No items currently in this cart.
            </p>
          ) : (
            <div className="divide-y divide-border-light dark:divide-white/5">
              {items.map((item, idx) => (
                <CartItemRow
                  key={item._id || item.id || `item-${idx}`}
                  item={item}
                  currency={currency}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
