import { Package } from 'lucide-react'
import Input from '@/components/common/Input'

export default function ProductGeneralInfo({ form, onChange, errors }) {
  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[var(--color-dark-bg-card)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-medium)]/15 text-[var(--color-primary-dark)] dark:bg-[var(--color-primary-medium)]/30 dark:text-[var(--color-text-gold)] border border-[var(--color-primary-medium)]/20 flex items-center justify-center shadow-2xs">
          <Package className="w-5 h-5 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]" />
        </div>
        <div>
          <h3 className="text-sm font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
            General Information
          </h3>
          <p className="text-[11px] text-[var(--color-text-secondary)] font-body">
            Core product title, short summary, and comprehensive specifications.
          </p>
        </div>
      </div>

      {/* Product Name */}
      <Input
        label="Product Name"
        placeholder="e.g. MacBook Pro 16 M3 Max"
        value={form.name}
        onChange={(e) => onChange('name', e.target.value)}
        error={errors.name}
        required
      />

      {/* Short Description */}
      <Input
        label="Short Description"
        placeholder="Minimum 10 characters (brief summary)"
        value={form.shortDescription}
        onChange={(e) => onChange('shortDescription', e.target.value)}
        error={errors.shortDescription}
        required
      />

      {/* Detailed Description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider font-heading">
            Detailed Specifications <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] text-[var(--color-text-secondary)] font-body">
            {form.description.length} chars (min 20)
          </span>
        </div>
        <textarea
          rows={4}
          placeholder="Detailed specifications, technical features, package contents, and warranty details..."
          value={form.description}
          onChange={(e) => onChange('description', e.target.value)}
          className={`w-full px-3.5 py-2.5 bg-white dark:bg-[var(--color-dark-bg-main)] border rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-secondary)]/60 font-body transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] ${
            errors.description
              ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20'
              : 'border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 dark:hover:border-[var(--color-text-gold)] shadow-2xs'
          }`}
        />
        {errors.description && (
          <p className="text-[11px] text-rose-500 font-medium font-body">
            {errors.description}
          </p>
        )}
      </div>
    </div>
  )
}
