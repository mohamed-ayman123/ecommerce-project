import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Box } from 'lucide-react'
import { toast } from 'react-toastify'
import ProductForm from '@/components/products/ProductForm'
import { addNewProduct } from '@/store/slices/productsSlice'

export default function AddProduct() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.products)

  const handleCreate = async (formData) => {
    const resultAction = await dispatch(addNewProduct(formData))

    if (addNewProduct.fulfilled.match(resultAction)) {
      toast.success(
        resultAction.payload.message || 'Product created successfully!'
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
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-brand-black hover:bg-brand-light shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to products</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-black text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Box className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-brand-gray tracking-[0.18em] uppercase">
              CREATE PRODUCT
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
              Launch a polished product entry
            </h1>
            <p className="text-xs text-brand-gray font-roboto">
              Add products with validation, image previews, multi-upload support, and smooth UX.
            </p>
          </div>
        </div>

        {/* Right Status Card */}
        <div className="p-4 rounded-2xl bg-brand-light border border-slate-200/80 min-w-[200px] space-y-0.5">
          <span className="text-[10px] font-bold text-brand-black tracking-widest uppercase">
            READY
          </span>
          <p className="text-xs text-brand-gray font-roboto">
            Create, validate, and save with one click.
          </p>
        </div>
      </div>

      {/* Main 2-Column Product Form */}
      <ProductForm mode="create" onSubmit={handleCreate} isLoading={isLoading} />
    </div>
  )
}
