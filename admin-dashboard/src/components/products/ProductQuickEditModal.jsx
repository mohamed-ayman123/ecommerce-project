import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { updateExistingProduct } from '@/store/slices/productsSlice'

function QuickEditForm({ product, currency, onClose }) {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.products)

  const [formData, setFormData] = useState(() => ({
    price: product?.price ?? '',
    discountPrice:
      product?.discountPrice !== null && product?.discountPrice !== undefined
        ? product.discountPrice
        : '',
    stock: product?.stock ?? 0,
    featured: Boolean(product?.featured),
    isActive: product?.isActive ?? true,
  }))

  const productId = product?._id || product?.id

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      price: Number(formData.price),
      discountPrice:
        formData.discountPrice !== '' ? Number(formData.discountPrice) : null,
      stock: Number(formData.stock),
      featured: formData.featured,
      isActive: formData.isActive,
    }

    if (payload.price < 0 || payload.stock < 0) {
      toast.error('Price and stock cannot be negative')
      return
    }

    if (
      payload.discountPrice !== null &&
      payload.discountPrice >= payload.price
    ) {
      toast.error('Discount price must be less than regular price')
      return
    }

    const result = await dispatch(
      updateExistingProduct({
        id: productId,
        formData: payload,
      })
    )

    if (updateExistingProduct.fulfilled.match(result)) {
      toast.success('Product updated successfully!')
      onClose?.()
    } else {
      toast.error(result.payload || 'Failed to update product')
    }
  }

  return (
    <form id="quick-edit-form" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h4 className="text-sm font-bold font-heading text-[var(--color-primary-dark)] dark:text-white truncate">
          {product?.name}
        </h4>
        <p className="text-xs text-[var(--color-text-secondary)] font-body">
          Update pricing, inventory, and promotional highlights quickly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label={`Price (${currency})`}
          type="number"
          min="0"
          step="0.01"
          required
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
        />

        <Input
          label={`Discount Price (${currency})`}
          type="number"
          min="0"
          step="0.01"
          placeholder="Optional"
          value={formData.discountPrice}
          onChange={(e) =>
            setFormData({ ...formData, discountPrice: e.target.value })
          }
        />
      </div>

      <Input
        label="Stock Quantity"
        type="number"
        min="0"
        step="1"
        required
        value={formData.stock}
        onChange={(e) =>
          setFormData({ ...formData, stock: e.target.value })
        }
      />

      <div className="pt-2 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="h-4 w-4 rounded border-[var(--color-border-medium)] text-[var(--color-primary-medium)] focus:ring-[var(--color-primary-medium)] dark:border-white/20 dark:bg-[var(--color-dark-bg-main)]"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold font-heading text-[var(--color-primary-dark)] dark:text-white">
              Active in Store
            </span>
            <span className="text-[11px] text-[var(--color-text-secondary)] font-body">
              Make product live and visible to customers across the catalog
            </span>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="h-4 w-4 rounded border-[var(--color-border-medium)] text-[var(--color-primary-medium)] focus:ring-[var(--color-primary-medium)] dark:border-white/20 dark:bg-[var(--color-dark-bg-main)]"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold font-heading text-[var(--color-primary-dark)] dark:text-white">
              Featured Product
            </span>
            <span className="text-[11px] text-[var(--color-text-secondary)] font-body">
              Show this product on promotional and featured dashboard sections
            </span>
          </div>
        </label>
      </div>

      <div className="flex w-full items-center justify-end gap-2.5 pt-4 border-t border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/20">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          type="submit"
          isLoading={isLoading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  )
}

export default function ProductQuickEditModal({
  isOpen,
  onClose,
  product,
  currency = 'EGP',
}) {
  if (!product) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Edit Product"
      maxWidth="max-w-md"
    >
      <QuickEditForm
        key={product?._id || product?.id}
        product={product}
        currency={currency}
        onClose={onClose}
      />
    </Modal>
  )
}
