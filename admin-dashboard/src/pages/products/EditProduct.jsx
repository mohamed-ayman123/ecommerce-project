import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Edit3, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import ProductForm from '@/components/products/ProductForm'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import {
  fetchProductById,
  updateExistingProduct,
} from '@/store/slices/productsSlice'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedProduct, isLoading, error } = useSelector(
    (state) => state.products
  )

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }
  }, [id, dispatch])

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(
      updateExistingProduct({ id, formData })
    )
    if (updateExistingProduct.fulfilled.match(resultAction)) {
      toast.success(
        resultAction.payload?.message || 'Product updated successfully!'
      )
      navigate('/dashboard/products')
    } else {
      toast.error(
        resultAction.payload || 'Failed to update product. Please verify fields.'
      )
    }
  }

  // Loading state when initially fetching the product to edit
  if (isLoading && !selectedProduct) {
    return (
      <div className="max-w-6xl mx-auto py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]" />
        <p className="text-sm font-heading font-medium text-[var(--color-text-secondary)]">
          Loading product specifications...
        </p>
      </div>
    )
  }

  // Error / Not Found state
  if (error && !selectedProduct) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-white dark:bg-[var(--color-dark-bg-card)] p-8 rounded-3xl border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
          Product Not Found
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] font-body">
          {error || 'Unable to retrieve the requested product details.'}
        </p>
        <div className="pt-2">
          <Button variant="primary" onClick={() => navigate('/dashboard/products')}>
            Back to Products Catalog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Back button pill */}
      <div>
        <Link
          to="/dashboard/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[var(--color-dark-bg-card)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40 text-xs font-semibold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] hover:bg-[var(--color-bg-main)]/60 hover:border-[var(--color-primary-medium)] shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-white via-[var(--color-bg-main)]/30 to-white dark:from-[var(--color-dark-bg-card)] dark:via-[var(--color-dark-bg-main)]/40 dark:to-[var(--color-dark-bg-card)] p-6 sm:p-8 rounded-3xl border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-dark)] text-white dark:bg-[var(--color-primary-medium)] flex items-center justify-center shrink-0 shadow-sm border border-[var(--color-primary-medium)]/30">
            <Edit3 className="w-6 h-6 text-[var(--color-text-gold)]" />
          </div>
          <div className="space-y-1.5">
            <Badge variant="primary" size="sm">
              EDIT PRODUCT
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] tracking-tight">
              {selectedProduct?.name ? `Edit: ${selectedProduct.name}` : 'Update Product'}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] font-body">
              Modify hardware specifications, pricing, inventory stock, and image gallery.
            </p>
          </div>
        </div>

        {/* Right Status Card */}
        <div className="p-4 rounded-2xl bg-[var(--color-bg-main)]/80 dark:bg-[var(--color-dark-bg-main)]/60 border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 min-w-[200px] space-y-1">
          <span className="text-[10px] font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)] tracking-widest uppercase font-heading">
            EDITING LIVE ENTRY
          </span>
          <p className="text-xs text-[var(--color-text-secondary)] font-body">
            Saving changes will synchronize immediately with the storefront.
          </p>
        </div>
      </div>

      {/* Reusable Product Form */}
      <ProductForm
        key={selectedProduct?._id || id}
        initialData={selectedProduct}
        mode="edit"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/products')}
        isLoading={isLoading}
      />
    </div>
  )
}
