import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { compressImageFile } from '@/utils/imageCompression'
import ProductGeneralInfo from './form/ProductGeneralInfo'
import ProductMediaGallery from './form/ProductMediaGallery'
import ProductPricingInventory from './form/ProductPricingInventory'
import ProductStatusCard from './form/ProductStatusCard'
import ProductOrganizationCard from './form/ProductOrganizationCard'
import ProductReadinessChecklist from './form/ProductReadinessChecklist'

export default function ProductForm({
  initialData = null,
  mode = 'create',
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const navigate = useNavigate()
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
    tags: Array.isArray(initialData?.tags) ? initialData.tags : ['electronics', 'hardware'],
    featured: initialData?.featured ?? false,
    isActive: initialData?.isActive ?? true,
  })

  const [tagInput, setTagInput] = useState('')
  const [images, setImages] = useState([]) // New files to upload: { file, previewUrl }
  const [existingImages, setExistingImages] = useState(
    Array.isArray(initialData?.images) ? initialData.images : []
  )
  const [deletedImages, setDeletedImages] = useState([]) // public_ids to delete
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  // Tag Handlers
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

  // Multi-Image Upload & Compression
  const handleFilesSelected = async (fileList) => {
    const validImageFiles = fileList.filter((f) => f.type.startsWith('image/'))
    if (!validImageFiles.length) return

    const totalAllowed = 5 - (existingImages.length + images.length)
    if (totalAllowed <= 0) return

    const selectedFiles = validImageFiles.slice(0, totalAllowed)
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

  // Unified Media Array for Gallery
  const allMediaItems = [
    ...existingImages.map((img, idx) => ({
      type: 'existing',
      index: idx,
      id: img.public_id || `existing-${idx}`,
      url: img.url || img,
    })),
    ...images.map((img, idx) => ({
      type: 'new',
      index: idx,
      id: `new-${idx}`,
      url: img.previewUrl,
      file: img.file,
    })),
  ]

  const coverItem = allMediaItems[0] || null
  const supportingItems = allMediaItems.slice(1)

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
    if (
      form.discountPrice !== '' &&
      form.discountPrice !== null &&
      form.discountPrice !== undefined
    ) {
      formData.append('discountPrice', String(form.discountPrice))
    }
    formData.append('stock', String(form.stock))
    formData.append('sku', form.sku.trim())
    formData.append('category', form.category)
    formData.append('subcategory', form.subcategory)
    formData.append('brand', form.brand.trim())
    formData.append('featured', String(form.featured))
    formData.append('isActive', String(form.isActive))

    // Guarantee tags are parsed as an Array by backend Multer multipart parser.
    // If only 1 item is appended to FormData, Multer parses it as a primitive string, causing "tags must be an array" validator rejection.
    let tagsToSend = Array.isArray(form.tags) ? [...form.tags] : []
    if (tagsToSend.length === 0) {
      tagsToSend = [form.category || 'electronics', form.subcategory || 'gadgets']
    } else if (tagsToSend.length === 1) {
      const fallback = form.subcategory || form.category || 'hardware'
      if (!tagsToSend.includes(fallback)) {
        tagsToSend.push(fallback)
      } else {
        tagsToSend.push(form.category !== fallback ? form.category : 'tech')
      }
    }

    tagsToSend.forEach((tag) => formData.append('tags', tag))
    images.forEach((img) => formData.append('images', img.file))

    if (deletedImages.length > 0) {
      formData.append('deletedImages', JSON.stringify(deletedImages))
    }

    if (onSubmit) {
      onSubmit(formData)
    }
  }

  // Catalog Quality Checklist
  const checklist = [
    {
      label: 'General Information',
      desc: 'Name & specifications',
      done:
        Boolean(form.name.trim()) &&
        form.shortDescription.trim().length >= 10 &&
        form.description.trim().length >= 20,
    },
    {
      label: 'Media Gallery',
      desc: 'At least 1 photo uploaded',
      done: existingImages.length + images.length > 0,
    },
    {
      label: 'Pricing & Inventory',
      desc: 'Price, stock & SKU',
      done:
        Boolean(form.price) &&
        Number(form.price) > 0 &&
        form.stock !== '' &&
        Number(form.stock) >= 0 &&
        Boolean(form.sku.trim()),
    },
    {
      label: 'Taxonomy',
      desc: 'Brand & category assigned',
      done: Boolean(form.brand.trim()) && Boolean(form.category),
    },
  ]
  const completedChecklistCount = checklist.filter((item) => item.done).length

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Main Content Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <ProductGeneralInfo
            form={form}
            onChange={handleChange}
            errors={errors}
          />

          <ProductMediaGallery
            allMediaItems={allMediaItems}
            coverItem={coverItem}
            supportingItems={supportingItems}
            onFilesSelected={handleFilesSelected}
            onRemoveExisting={handleRemoveExistingImage}
            onRemoveNew={handleRemoveNewImage}
            error={errors.images}
          />

          <ProductPricingInventory
            form={form}
            onChange={handleChange}
            currency={currency}
            errors={errors}
          />
        </div>

        {/* Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <ProductStatusCard
            isActive={form.isActive}
            featured={form.featured}
            onToggleActive={() => handleChange('isActive', !form.isActive)}
            onToggleFeatured={() => handleChange('featured', !form.featured)}
            onCancel={onCancel || (() => navigate('/dashboard/products'))}
            isLoading={isLoading}
            mode={mode}
          />

          <ProductOrganizationCard
            category={form.category}
            subcategory={form.subcategory}
            brand={form.brand}
            tags={form.tags}
            tagInput={tagInput}
            onCategoryChange={(val) => handleChange('category', val)}
            onSubcategoryChange={(val) => handleChange('subcategory', val)}
            onBrandChange={(val) => handleChange('brand', val)}
            onTagInputChange={setTagInput}
            onAddTag={handleAddTag}
            onKeyDownTag={handleKeyDownTag}
            onRemoveTag={handleRemoveTag}
            errors={errors}
          />

          <ProductReadinessChecklist
            checklist={checklist}
            completedCount={completedChecklistCount}
          />
        </div>
      </div>
    </form>
  )
}
