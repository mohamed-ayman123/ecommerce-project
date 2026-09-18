import { ShieldCheck, Truck, ArrowRight, RotateCcw, Tag } from 'lucide-react'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import { formatCurrency } from '@/utils/formatters'

/**
 * CheckoutOrderSummary Component
 * Sticky sidebar displaying line items preview, order totals (subtotal, 14% tax, shipping, discounts),
 * and primary checkout action buttons.
 *
 * @param {Object} props
 * @param {Array} props.items - Cart items
 * @param {number} props.subtotal - Subtotal amount
 * @param {number} [props.discount=0] - Discount amount from coupon
 * @param {string} [props.couponCode] - Active coupon code
 * @param {Function} props.onAction - Primary action callback
 * @param {string} props.actionLabel - Primary button label
 * @param {boolean} [props.isLoading=false] - Button loading state
 * @param {boolean} [props.disabled=false] - Button disabled state
 * @param {Object} [props.shippingAddress] - Optional shipping address to display in review
 * @param {string} [props.paymentMethod] - Selected payment method label
 */
export default function CheckoutOrderSummary({
  items = [],
  subtotal = 0,
  discount = 0,
  couponCode = null,
  onAction,
  actionLabel = 'Proceed to Payment',
  isLoading = false,
  disabled = false,
  shippingAddress = null,
  paymentMethod = null,
}) {
  // Backend swagger rules: Free shipping above 1000 EGP, standard shipping = 50 EGP
  const shippingFee = subtotal >= 1000 || subtotal === 0 ? 0 : 50

  // 14% Egyptian VAT per backend order specification
  const tax = Math.round(subtotal * 0.14)

  const finalTotal = Math.max(0, subtotal - discount + tax + shippingFee)

  return (
    <div className="bg-bg-card dark:bg-dark-bg-card rounded-2xl border border-border-light dark:border-primary-medium/30 p-6 shadow-sm space-y-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-primary-medium/30">
        <h3 className="font-heading font-bold text-lg text-primary-dark dark:text-text-light">
          Order Summary
        </h3>
        <Badge variant="neutral" size="sm">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {/* Line Items Preview */}
      <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-border-light/60 dark:divide-primary-medium/20">
        {items.map((item, idx) => {
          const title = item.title || item.name || 'Electronics Product'
          const price = Number(item.price) || 0
          const qty = Number(item.quantity) || 1
          const image = item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'

          return (
            <div key={item.productId || item._id || idx} className="flex items-center gap-3 pt-3 first:pt-0">
              <img
                src={image}
                alt={title}
                className="w-12 h-12 rounded-lg object-cover bg-bg-main dark:bg-dark-bg-main border border-border-light dark:border-primary-medium/30 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary dark:text-text-light truncate">
                  {title}
                </p>
                <p className="text-[11px] text-text-secondary dark:text-slate-400 mt-0.5">
                  Qty: {qty} × {formatCurrency(price)}
                </p>
              </div>
              <span className="text-xs font-heading font-bold text-primary-dark dark:text-text-light shrink-0">
                {formatCurrency(price * qty)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Delivery Destination Summary (When on Payment Step) */}
      {shippingAddress && shippingAddress.address && (
        <div className="p-3 rounded-xl bg-bg-main/60 dark:bg-dark-bg-main border border-border-light dark:border-primary-medium/30 text-xs space-y-1">
          <div className="flex items-center justify-between font-heading font-semibold text-primary-dark dark:text-text-light">
            <span>Deliver to:</span>
            <span className="text-[11px] text-accent-gold font-bold">{shippingAddress.city}</span>
          </div>
          <p className="text-text-secondary dark:text-slate-400 truncate">
            {shippingAddress.fullName} • {shippingAddress.phone}
          </p>
          <p className="text-text-secondary dark:text-slate-400 truncate">
            {shippingAddress.address}
          </p>
          {paymentMethod && (
            <p className="text-emerald-600 dark:text-emerald-400 font-medium pt-1 border-t border-border-light/60 dark:border-primary-medium/20">
              Payment: {paymentMethod}
            </p>
          )}
        </div>
      )}

      {/* Calculations */}
      <div className="space-y-2.5 pt-2 border-t border-border-light dark:border-primary-medium/30 text-xs">
        <div className="flex items-center justify-between text-text-secondary dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-medium text-text-primary dark:text-text-light">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Discount {couponCode ? `(${couponCode})` : ''}</span>
            </span>
            <span className="font-semibold">-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-text-secondary dark:text-slate-400">
          <span>Estimated 14% VAT</span>
          <span className="font-medium text-text-primary dark:text-text-light">
            +{formatCurrency(tax)}
          </span>
        </div>

        <div className="flex items-center justify-between text-text-secondary dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>Shipping</span>
            {shippingFee === 0 && (
              <Badge variant="success" size="sm">
                FREE
              </Badge>
            )}
          </div>
          <span className="font-medium text-text-primary dark:text-text-light">
            {shippingFee === 0 ? '0.00 EGP' : formatCurrency(shippingFee)}
          </span>
        </div>

        {subtotal < 1000 && (
          <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg">
            Add {formatCurrency(1000 - subtotal)} more to qualify for <strong>FREE express delivery</strong>!
          </p>
        )}

        {/* Final Total */}
        <div className="pt-3 border-t border-border-light dark:border-primary-medium/40 flex items-center justify-between">
          <div>
            <span className="text-sm font-heading font-bold text-primary-dark dark:text-text-light">
              Total Amount
            </span>
            <p className="text-[10px] text-text-secondary dark:text-slate-500">Includes VAT & Delivery</p>
          </div>
          <span className="text-lg sm:text-xl font-heading font-extrabold text-accent-gold">
            {formatCurrency(finalTotal)}
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <Button
        variant="gold"
        size="lg"
        onClick={onAction}
        isLoading={isLoading}
        disabled={disabled || items.length === 0}
        className="w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
      >
        <span className="bg-gradient-to-r from-white via-slate-100 to-white/80 bg-clip-text text-transparent font-bold drop-shadow-xs">
          {actionLabel}
        </span>
        {!isLoading && <ArrowRight className="w-4 h-4 text-white drop-shadow-xs" />}
      </Button>

      {/* Trust & Guarantee Badges */}
      <div className="pt-4 border-t border-border-light dark:border-primary-medium/20 space-y-2.5">
        <div className="flex items-center gap-2.5 text-[11px] text-text-secondary dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-accent-gold shrink-0" />
          <span>2-Year Official Nexis Tech Hardware Warranty</span>
        </div>
        <div className="flex items-center gap-2.5 text-[11px] text-text-secondary dark:text-slate-400">
          <RotateCcw className="w-4 h-4 text-accent-gold shrink-0" />
          <span>14-Day Easy Return & Replacement Guarantee</span>
        </div>
        <div className="flex items-center gap-2.5 text-[11px] text-text-secondary dark:text-slate-400">
          <Truck className="w-4 h-4 text-accent-gold shrink-0" />
          <span>Fast Doorstep Delivery Across Egypt</span>
        </div>
      </div>
    </div>
  )
}
