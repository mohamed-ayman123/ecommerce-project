import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UploadCloud,
  X,
  Plus,
  Image as ImageIcon,
  Sparkles,
  Check,
} from 'lucide-react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

const CATEGORIES = [
  { value: 'electronics', label: 'electronics' },
  { value: 'hardware', label: 'hardware' },
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

export default function ProductForm({
  initialData = null,
  mode = 'create',
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    name: initialData?.name || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    discountPrice: initialData?.discountPrice || '',
    stock: initialData?.stock || '',
    sku: initialData?.sku || '',
    category: initialData?.category || 'electronics',
    subcategory: initialData?.subcategory || 'laptops',
    brand: initialData?.brand || '',
    tags: initialData?.tags || ['electronics'],
    featured: initialData?.featured ?? false,
    isActive: initialData?.isActive ?? true,
  })

  const [tagInput, setTagInput] = useState('')
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState({})

  // Add Tag via Enter, Comma, or + Button
  const handleAddTag = (e) => {
    if (e) e.preventDefault()
    const trimmed = tagInput.trim().replace(/^,+|,+$/g, '')
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }))
      setTagInput('')
    }
  }

  const handleKeyDownTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      handleAddTag(e)
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }))
  }

  // Handle Multi-Image Upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const newImages = files.slice(0, 5 - images.length).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setImages((prev) => [...prev, ...newImages])
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }))
    }
  }

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => {
      const target = prev[indexToRemove]
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((_, idx) => idx !== indexToRemove)
    })
  }

  // Validation
  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Product name is required'
    if (!form.shortDescription.trim()) {
      errs.shortDescription = 'Short description is required'
    } else if (form.shortDescription.trim().length < 10) {
      errs.shortDescription = 'Minimum 10 characters required'
    }
    if (!form.description.trim()) {
      errs.description = 'Description is required'
    } else if (form.description.trim().length < 20) {
      errs.description = 'Minimum 20 characters required'
    }
    if (!form.price || Number(form.price) <= 0) {
      errs.price = 'Valid price is required'
    }
    if (form.discountPrice && Number(form.discountPrice) >= Number(form.price)) {
      errs.discountPrice = 'Must be less than regular price'
    }
    if (form.stock === '' || Number(form.stock) < 0) {
      errs.stock = 'Valid stock is required'
    }
    if (!form.sku.trim()) errs.sku = 'SKU is required'
    if (!form.brand.trim()) errs.brand = 'Brand is required'

    if (mode === 'create' && images.length === 0) {
      errs.images = 'Please upload at least one image'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const formData = new FormData()
    formData.append('name', form.name.trim())
    formData.append('shortDescription', form.shortDescription.trim())
    formData.append('description', form.description.trim())
    formData.append('price', String(form.price))
    if (form.discountPrice) {
      formData.append('discountPrice', String(form.discountPrice))
    }
    formData.append('stock', String(form.stock))
    formData.append('sku', form.sku.trim())
    formData.append('category', form.category)
    formData.append('subcategory', form.subcategory)
    formData.append('brand', form.brand.trim())
    formData.append('featured', String(form.featured))
    formData.append('isActive', String(form.isActive))

    form.tags.forEach((tag) => formData.append('tags', tag))
    images.forEach((img) => formData.append('images', img.file))

    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* 2-Column Responsive Grid matching design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Gallery & Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            {/* Gallery Header */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-black text-white flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-brand-black">Gallery</h3>
                <p className="text-[11px] text-brand-gray font-roboto">
                  Upload multiple images and preview instantly.
                </p>
              </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="space-y-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl overflow-hidden border border-slate-200 bg-brand-light group shadow-sm"
                  >
                    <img
                      src={img.previewUrl}
                      alt={`Product preview ${idx + 1}`}
                      className="w-full h-52 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-brand-black/90 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-white">
                      <span className="text-[10px] font-bold tracking-widest uppercase">
                        IMAGE {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 text-slate-300 hover:text-rose-400 transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors bg-brand-light/60 hover:bg-brand-light ${
                errors.images
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-300 hover:border-brand-black'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-brand-black flex items-center justify-center mx-auto mb-2.5 shadow-xs">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-brand-black">Upload images</p>
              <p className="text-[11px] text-brand-gray font-roboto mt-0.5">
                PNG, JPG, WEBP • multiple files supported
              </p>
            </div>
            {errors.images && (
              <p className="text-xs text-rose-600 font-medium">{errors.images}</p>
            )}
          </div>

          {/* UX Tip Card */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Senior UX</span>
            </div>
            <p className="text-xs text-brand-gray font-roboto leading-relaxed">
              Optimized product creation experience with responsive design and smooth interactions.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Fields (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {/* Product Name */}
          <Input
            label="Product Name"
            placeholder="iPhone 16 Pro"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />

          {/* Short Description */}
          <Input
            label="Short Description"
            placeholder="Minimum 10 characters"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            error={errors.shortDescription}
            required
          />

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-black uppercase tracking-wider">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Minimum 20 characters"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-brand-black placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-black ${
                errors.description ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Price & Discount Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              error={errors.price}
              required
            />
            <Input
              label="Discount Price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.discountPrice}
              onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
              error={errors.discountPrice}
            />
          </div>

          {/* Stock & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Stock"
              type="number"
              min="0"
              placeholder="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              error={errors.stock}
              required
            />
            <Input
              label="SKU"
              placeholder="e.g. LAP-MBP16-M3"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
              error={errors.sku}
              required
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-brand-black uppercase tracking-wider">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-brand-black uppercase tracking-wider">
                Subcategory
              </label>
              <select
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black"
              >
                {SUBCATEGORIES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Brand */}
          <Input
            label="Brand"
            placeholder="e.g. Apple, Sony, ASUS"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            error={errors.brand}
            required
          />

          {/* Tags Section matching design with + button */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-brand-light/50 space-y-3">
            <label className="block text-xs font-bold text-brand-black uppercase tracking-wider">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a tag and press +"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-brand-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-black"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2.5 bg-brand-black hover:bg-brand-charcoal text-white rounded-xl text-sm font-bold flex items-center justify-center transition-colors"
                aria-label="Add tag"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-brand-gray font-roboto">
              Add one or more tags to organize the product.
            </p>

            {/* Tag Pills */}
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-brand-black shadow-2xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured and Active Pills (exact style as screenshot) */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                form.featured
                  ? 'bg-brand-black text-white border-brand-black'
                  : 'bg-white text-brand-black border-slate-200 hover:bg-brand-light'
              }`}
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  form.featured
                    ? 'border-white bg-white text-brand-black'
                    : 'border-slate-400 bg-white'
                }`}
              >
                {form.featured && <Check className="w-3 h-3" />}
              </div>
              <span>Featured</span>
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                form.isActive
                  ? 'bg-brand-black text-white border-brand-black'
                  : 'bg-white text-brand-black border-slate-200 hover:bg-brand-light'
              }`}
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  form.isActive
                    ? 'border-white bg-white text-brand-black'
                    : 'border-slate-400 bg-white'
                }`}
              >
                {form.isActive && <Check className="w-3 h-3" />}
              </div>
              <span>Active</span>
            </button>
          </div>

          {/* Actions Bottom Bar */}
          <div className="flex items-center justify-start gap-3 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || (() => navigate(-1))}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="px-6 font-bold"
            >
              Create Product
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
