import { Layers, Tag, Plus, X } from 'lucide-react'
import Input from '@/components/common/Input'
import Dropdown from '@/components/common/Dropdown'

const CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'hardware', label: 'Hardware' },
]

const SUBCATEGORIES = [
  { value: 'laptops', label: 'Laptops' },
  { value: 'smartphones', label: 'Smartphones' },
  { value: 'audio', label: 'Audio' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'wearables', label: 'Wearables' },
  { value: 'tablets', label: 'Tablets' },
  { value: 'cameras', label: 'Cameras' },
  { value: 'accessories', label: 'Accessories' },
]

export default function ProductOrganizationCard({
  category,
  subcategory,
  brand,
  tags = [],
  tagInput = '',
  onCategoryChange,
  onSubcategoryChange,
  onBrandChange,
  onTagInputChange,
  onAddTag,
  onKeyDownTag,
  onRemoveTag,
  errors = {},
}) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[var(--color-dark-bg-card)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]" />
        <h3 className="text-xs font-bold uppercase tracking-wider font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
          Organization
        </h3>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider font-heading">
          Category
        </label>
        <Dropdown
          value={category}
          onChange={onCategoryChange}
          options={CATEGORIES}
          ariaLabel="Category"
        />
      </div>

      {/* Subcategory */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider font-heading">
          Subcategory
        </label>
        <Dropdown
          value={subcategory}
          onChange={onSubcategoryChange}
          options={SUBCATEGORIES}
          ariaLabel="Subcategory"
        />
      </div>

      {/* Brand */}
      <Input
        label="Brand"
        placeholder="e.g. Apple, Sony, Dell, Lenovo"
        value={brand}
        onChange={(e) => onBrandChange(e.target.value)}
        error={errors.brand}
        required
      />

      {/* Tags Section */}
      <div className="space-y-2 pt-2 border-t border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/20">
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-[var(--color-primary-medium)] dark:text-[var(--color-text-gold)]" />
          <label className="block text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider font-heading">
            Product Tags
          </label>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add tag and press +"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onKeyDownTag}
            className="flex-1 px-3 py-2 bg-[var(--color-bg-main)]/50 dark:bg-[var(--color-dark-bg-main)] border border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] rounded-xl text-xs text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-secondary)]/60 font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] shadow-2xs"
          />
          <button
            type="button"
            onClick={onAddTag}
            className="px-3 py-2 bg-[var(--color-primary-medium)] hover:bg-[var(--color-primary-dark)] dark:bg-[var(--color-primary-medium)] dark:hover:bg-[var(--color-accent-gold-hover)] text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="Add tag"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tag Pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-bg-main)] dark:bg-[var(--color-dark-bg-main)] border border-[var(--color-primary-medium)]/30 text-[11px] font-semibold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] font-body shadow-2xs"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="text-[var(--color-text-secondary)] hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
