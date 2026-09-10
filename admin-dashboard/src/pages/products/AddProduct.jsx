import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Box } from 'lucide-react'
import { toast } from 'react-toastify'
import ProductForm from '@/components/products/ProductForm'
import Badge from '@/components/common/Badge'
import { addNewProduct } from '@/store/slices/productsSlice'

export default function AddProduct() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.products)

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(addNewProduct(formData))
    if (addNewProduct.fulfilled.match(resultAction)) {
      toast.success(
        resultAction.payload?.message || 'Product created successfully!'
      )
      navigate('/dashboard/products')
    } else {
      toast.error(
        resultAction.payload || 'Failed to create product. Please verify fields.'
      )
    }
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
            <Box className="w-6 h-6 text-[var(--color-text-gold)]" />
          </div>
          <div className="space-y-1.5">
            <Badge variant="primary" size="sm">
              NEW PRODUCT
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] tracking-tight">
              Create New Product
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] font-body">
              Add a new item with detailed specifications, pricing, inventory, and gallery assets.
            </p>
          </div>
        </div>

        {/* Right Status Card */}
        <div className="p-4 rounded-2xl bg-[var(--color-bg-main)]/80 dark:bg-[var(--color-dark-bg-main)]/60 border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 min-w-[200px] space-y-1">
          <span className="text-[10px] font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)] tracking-widest uppercase font-heading">
            CATALOG STATUS: READY
          </span>
          <p className="text-xs text-[var(--color-text-secondary)] font-body">
            Fill required details and publish directly to the storefront.
          </p>
        </div>
      </div>

      {/* Reusable Product Form */}
      <ProductForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/products')}
        isLoading={isLoading}
      />
    </div>
  )
}
