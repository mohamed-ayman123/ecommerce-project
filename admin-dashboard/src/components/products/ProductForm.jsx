import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
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

export default function ProductForm({
  initialData = null,
  mode = 'create',
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const preferences = useSelector((state) => state.ui?.preferences)
  const currency = preferences?.currency || 'EGP'

  const [form, setForm] = useState({
    name: initialData?.name || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    price: initialData?.price ?? '',
    discountPrice: initialData?.discountPrice ?? '',
    stock: initialData?.stock !== undefined ? initialData.stock : '',
    sku: initialData?.sku || '',
    category: initialData?.category || 'electronics',
    subcategory: initialData?.subcategory || 'laptops',
    brand: initialData?.brand || '',
    tags: Array.isArray(initialData?.tags) ? initialData.tags : ['electronics'],
    featured: initialData?.featured ?? false,
    isActive: initialData?.isActive ?? true,
  })

  const [tagInput, setTagInput] = useState('')
  const [images, setImages] = useState([]) // New files to upload
  const [existingImages, setExistingImages] = useState(
    Array.isArray(initialData?.images) ? initialData.images : []
  )
  const [deletedImages, setDeletedImages] = useState([]) // public_ids to delete
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

  // Client-side image compression to prevent Vercel 4.5MB payload edge rejections
  const compressImageFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return file
    if (file.size <= 500 * 1024) return file

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const maxWidth = 1600
          const maxHeight = 1600
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width)
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height)
              height = maxHeight
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                resolve(file)
              } else {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, '.jpg'),
                  {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  }
                )
                resolve(compressedFile)
              }
            },
            'image/jpeg',
            0.85
          )
        }
        img.onerror = () => resolve(file)
        img.src = e.target.result
      }
      reader.onerror = () => resolve(file)
      reader.readAsDataURL(file)
    })
  }

  // Handle Multi-Image Upload
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const totalAllowed = 5 - (existingImages.length + images.length)
    if (totalAllowed <= 0) return

    const selectedFiles = files.slice(0, totalAllowed)
    const processedImages = await Promise.all(
      selectedFiles.map(async (file) => {
        const processedFile = await compressImageFile(file)
        return {
          file: processedFile,
          previewUrl: URL.createObjectURL(processedFile),
        }
      })
    )

    setImages((prev) => [...prev, ...processedImages])
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }))
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveNewImage = (indexToRemove) => {
    setImages((prev) => {
      const target = prev[indexToRemove]
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((_, idx) => idx !== indexToRemove)
    })
  }

  const handleRemoveExistingImage = (indexToRemove) => {
    const target = existingImages[indexToRemove]
    if (target?.public_id) {
      setDeletedImages((prev) => [...prev, target.public_id])
    }
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove))
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

    // At least one image required across existing or new
    if (images.length === 0 && existingImages.length === 0) {
      errs.images = 'Please provide at least one product image'
    } else {
      const totalBytes = images.reduce(
        (sum, img) => sum + (img.file?.size || 0),
        0
      )
      if (totalBytes > 4 * 1024 * 1024) {
        errs.images =
          'Total uploaded images exceed 4MB limit. Please upload fewer or smaller images.'
      }
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
    if (form.discountPrice !== '' && form.discountPrice !== null && form.discountPrice !== undefined) {
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

    if (deletedImages.length > 0) {
      formData.append('deletedImages', JSON.stringify(deletedImages))
    }

    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT COLUMN: Gallery & Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-[var(--color-dark-bg-card)] p-6 rounded-2xl border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs space-y-4">
            {/* Gallery Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-medium)]/15 text-[var(--color-primary-dark)] dark:bg-[var(--color-primary-medium)]/40 dark:text-[var(--color-text-gold)] border border-[var(--color-primary-medium)]/20 flex items-center justify-center shadow-2xs">
                <ImageIcon className="w-5 h-5 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
                  Product Gallery
                </h3>
                <p className="text-[11px] text-[var(--color-text-secondary)] font-body">
                  Upload multiple photos with instant previews.
                </p>
              </div>
            </div>

            {/* Previews: Existing Cloudinary Images */}
            {existingImages.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[var(--color-primary-medium)] dark:text-[var(--color-text-gold)] uppercase tracking-wider block font-heading">
                  Current Cloudinary Images ({existingImages.length})
                </span>
                {existingImages.map((img, idx) => (
                  <div
                    key={img.public_id || idx}
                    className="relative rounded-2xl overflow-hidden border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40 bg-[var(--color-bg-main)]/60 dark:bg-[var(--color-dark-bg-main)] group shadow-xs"
                  >
                    <img
                      src={img.url || img}
                      alt={`Current product ${idx + 1}`}
                      className="w-full h-48 sm:h-52 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-[var(--color-primary-dark)]/90 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-white">
                      <span className="text-[10px] font-bold tracking-widest uppercase font-heading text-[var(--color-text-gold)]">
                        IMAGE {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        className="p-1 text-white/80 hover:text-rose-400 transition-colors cursor-pointer"
                        aria-label="Remove image"
                        title="Delete image on save"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Previews: New Selected Files */}
            {images.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold text-[var(--color-primary-medium)] dark:text-[var(--color-text-gold)] uppercase tracking-wider block font-heading">
                  New Images To Upload ({images.length})
                </span>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-primary-medium)]/70 bg-[var(--color-bg-main)]/60 dark:bg-[var(--color-dark-bg-main)] group shadow-xs"
                  >
                    <img
                      src={img.previewUrl}
                      alt={`New preview ${idx + 1}`}
                      className="w-full h-48 sm:h-52 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-[var(--color-primary-dark)]/90 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-white">
                      <span className="text-[10px] font-bold tracking-widest uppercase font-heading text-[var(--color-text-gold)]">
                        NEW IMAGE {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(idx)}
                        className="p-1 text-white/80 hover:text-rose-400 transition-colors cursor-pointer"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Dropzone */}
            {existingImages.length + images.length < 5 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-7 sm:p-8 text-center cursor-pointer transition-all duration-150 bg-[var(--color-bg-main)]/50 hover:bg-[var(--color-bg-input)]/70 dark:bg-[var(--color-dark-bg-main)]/60 dark:hover:bg-[var(--color-primary-medium)]/20 ${
                  errors.images
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 dark:hover:border-[var(--color-text-gold)]'
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
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-[var(--color-dark-bg-card)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)] flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
                  Click to browse photos
                </p>
                <p className="text-[11px] text-[var(--color-text-secondary)] font-body mt-0.5">
                  PNG, JPG, WEBP • max 5 images total
                </p>
              </div>
            )}
            {errors.images && (
              <p className="text-xs text-rose-500 font-medium font-body">{errors.images}</p>
            )}
          </div>

          {/* UX Tip Card */}
          <div className="p-4 rounded-2xl border border-[var(--color-border-medium)] bg-gradient-to-br from-[var(--color-bg-main)]/70 via-white/50 to-[var(--color-bg-input)]/40 dark:from-[var(--color-dark-bg-card)] dark:via-[var(--color-dark-bg-card)] dark:to-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/30 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]">
              <Sparkles className="w-4 h-4 text-[var(--color-text-gold)]" />
              <span>Catalog Best Practice</span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-border-medium)] font-body leading-relaxed">
              Include high-resolution product photography with transparent or clean studio backgrounds for optimum marketplace conversion.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Fields (7 cols) */}
        <div className="lg:col-span-7 bg-[var(--color-bg-card)] dark:bg-[var(--color-dark-bg-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs space-y-5">
          {/* Product Name */}
          <Input
            label="Product Name"
            placeholder="e.g. MacBook Pro 16 M3 Max"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />

          {/* Short Description */}
          <Input
            label="Short Description"
            placeholder="Minimum 10 characters (brief summary)"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            error={errors.shortDescription}
            required
          />

          {/* Detailed Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider font-heading">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Minimum 20 characters detailing specs, features, and warranty..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-white dark:bg-[var(--color-dark-bg-main)] border rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-secondary)]/60 font-body transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] ${
                errors.description
                  ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20'
                  : 'border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 dark:hover:border-[var(--color-text-gold)] shadow-2xs'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 font-medium font-body">{errors.description}</p>
            )}
          </div>

          {/* Price & Discount Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={`Price (${currency})`}
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
              label={`Discount Price (${currency})`}
              type="number"
              step="0.01"
              min="0"
              placeholder="Optional discount price"
              value={form.discountPrice}
              onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
              error={errors.discountPrice}
            />
          </div>

          {/* Stock & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Stock Quantity"
              type="number"
              min="0"
              placeholder="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              error={errors.stock}
              required
            />
            <Input
              label="SKU Code"
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
              <label className="block text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider font-heading">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[var(--color-dark-bg-main)] border border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] cursor-pointer shadow-2xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-white dark:bg-[var(--color-dark-bg-main)] text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider font-heading">
                Subcategory
              </label>
              <select
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[var(--color-dark-bg-main)] border border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] cursor-pointer shadow-2xs"
              >
                {SUBCATEGORIES.map((s) => (
                  <option key={s.value} value={s.value} className="bg-white dark:bg-[var(--color-dark-bg-main)] text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Brand */}
          <Input
            label="Brand"
            placeholder="e.g. Apple, Sony, Dell, Lenovo"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            error={errors.brand}
            required
          />

          {/* Tags Section */}
          <div className="p-4 rounded-2xl border border-[var(--color-border-medium)] bg-[var(--color-bg-main)]/50 dark:bg-[var(--color-dark-bg-main)]/40 space-y-3">
            <label className="block text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider font-heading">
              Product Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type tag name and press +"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                className="flex-1 px-3.5 py-2.5 bg-white dark:bg-[var(--color-dark-bg-main)] border border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-secondary)]/60 font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] shadow-2xs"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2.5 bg-[var(--color-primary-medium)] hover:bg-[var(--color-primary-dark)] dark:bg-[var(--color-primary-medium)] dark:hover:bg-[var(--color-accent-gold-hover)] text-white rounded-xl text-sm font-bold flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                aria-label="Add tag"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)] font-body">
              Add keywords to enhance search discoverability across the store catalog.
            </p>

            {/* Tag Pills */}
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[var(--color-dark-bg-card)] border border-[var(--color-primary-medium)]/30 text-xs font-semibold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] shadow-2xs font-body"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[var(--color-text-secondary)] hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured and Active Pills */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold font-heading transition-all cursor-pointer ${
                form.featured
                  ? 'bg-[var(--color-primary-dark)] text-white border-[var(--color-primary-dark)] shadow-xs'
                  : 'bg-[var(--color-bg-main)]/60 text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-input)]/70 dark:bg-[var(--color-dark-bg-main)] dark:text-[var(--color-text-light)] border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40'
              }`}
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  form.featured
                    ? 'border-white bg-white text-[var(--color-primary-dark)]'
                    : 'border-[var(--color-primary-medium)] bg-white dark:bg-[var(--color-dark-bg-card)]'
                }`}
              >
                {form.featured && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Featured on Homepage</span>
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold font-heading transition-all cursor-pointer ${
                form.isActive
                  ? 'bg-[var(--color-primary-dark)] text-white border-[var(--color-primary-dark)] shadow-xs'
                  : 'bg-[var(--color-bg-main)]/60 text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-input)]/70 dark:bg-[var(--color-dark-bg-main)] dark:text-[var(--color-text-light)] border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40'
              }`}
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  form.isActive
                    ? 'border-white bg-white text-[var(--color-primary-dark)]'
                    : 'border-[var(--color-primary-medium)] bg-white dark:bg-[var(--color-dark-bg-card)]'
                }`}
              >
                {form.isActive && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Active in Store</span>
            </button>
          </div>

          {/* Actions Bottom Bar */}
          <div className="flex items-center justify-start gap-3 pt-6 border-t border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || (() => navigate('/dashboard/products'))}
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
              {mode === 'edit' ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
