import { DollarSign } from 'lucide-react'
import Input from '@/components/common/Input'

export default function ProductPricingInventory({
  form,
  onChange,
  currency = 'EGP',
  errors = {},
}) {
  const regularPrice = parseFloat(form.price)
  const discountPrice = parseFloat(form.discountPrice)
  const isDiscountValid =
    !isNaN(regularPrice) &&
    !isNaN(discountPrice) &&
    discountPrice > 0 &&
    regularPrice > 0 &&
    discountPrice < regularPrice

  const discountPercent = isDiscountValid
    ? Math.round(((regularPrice - discountPrice) / regularPrice) * 100)
    : 0

  const discountSavings = isDiscountValid
    ? (regularPrice - discountPrice).toFixed(2)
    : 0

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[var(--color-dark-bg-card)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-medium)]/15 text-[var(--color-primary-dark)] dark:bg-[var(--color-primary-medium)]/30 dark:text-[var(--color-text-gold)] border border-[var(--color-primary-medium)]/20 flex items-center justify-center shadow-2xs">
          <DollarSign className="w-5 h-5 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]" />
        </div>
        <div>
          <h3 className="text-sm font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
            Pricing & Inventory
          </h3>
          <p className="text-[11px] text-[var(--color-text-secondary)] font-body">
            Configure catalog retail price, promotional discounts, and stock quantities.
          </p>
        </div>
      </div>

      {/* Price & Discount Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={`Regular Price (${currency})`}
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={form.price}
          onChange={(e) => onChange('price', e.target.value)}
          error={errors.price}
          required
        />
        <div className="space-y-1.5">
          <Input
            label={`Discount Price (${currency})`}
            type="number"
            step="0.01"
            min="0"
            placeholder="Optional promotional price"
            value={form.discountPrice}
            onChange={(e) => onChange('discountPrice', e.target.value)}
            error={errors.discountPrice}
          />
          {isDiscountValid && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40 w-fit">
              <span>Save {discountPercent}%</span>
              <span className="text-[10px] text-emerald-700/70 dark:text-emerald-300/70">
                ({currency} {discountSavings} off regular price)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stock & SKU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Stock Quantity"
          type="number"
          min="0"
          placeholder="0"
          value={form.stock}
          onChange={(e) => onChange('stock', e.target.value)}
          error={errors.stock}
          required
        />
        <Input
          label="SKU Code"
          placeholder="e.g. LAP-MBP16-M3"
          value={form.sku}
          onChange={(e) => onChange('sku', e.target.value.toUpperCase())}
          error={errors.sku}
          required
        />
      </div>
    </div>
  )
}
