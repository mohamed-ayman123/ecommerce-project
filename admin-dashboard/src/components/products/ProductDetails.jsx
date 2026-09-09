import { useState } from 'react'
import {
  Tag,
  Layers,
  Sparkles,
  PackageCheck,
  PackageX,
  Edit3,
} from 'lucide-react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'

export default function ProductDetails({
  isOpen,
  onClose,
  product,
  currency = 'EGP',
  onEdit,
}) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0)

  if (!product) return null

  const {
    _id,
    id,
    name = 'Unnamed Product',
    category = 'General',
    brand = 'Nexis',
    description = '',
    price = 0,
    discountPrice,
    stock = 0,
    images = [],
    tags = [],
    featured = false,
  } = product

  const productId = _id || id

  const normalizeImage = (img) => {
    if (!img) return null
    if (typeof img === 'string') return img
    if (typeof img === 'object' && img !== null) {
      return img.url || img.secure_url || null
    }
    return null
  }

  const rawImages =
    Array.isArray(images) && images.length > 0
      ? images
      : typeof images === 'string' && images
        ? [images]
        : product.image
          ? [product.image]
          : []

  const imageList = rawImages.map(normalizeImage).filter(Boolean)
  if (imageList.length === 0) {
    imageList.push('https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600')
  }

  const activeImage = imageList[selectedImgIndex] || imageList[0]

  const hasDiscount =
    discountPrice !== null &&
    discountPrice !== undefined &&
    Number(discountPrice) > 0 &&
    Number(discountPrice) < Number(price)

  const discountPercentage = hasDiscount
    ? Math.round(((Number(price) - Number(discountPrice)) / Number(price)) * 100)
    : 0

  const displayPrice = hasDiscount ? discountPrice : price
  const isOutOfStock = Number(stock) === 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Details"
      maxWidth="max-w-2xl"
      footer={
        <div className="flex w-full items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose?.()
              onEdit?.(product)
            }}
          >
            <Edit3 className="mr-1.5 h-3.5 w-3.5" />
            Edit Full Product
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Section: Gallery & Quick Info */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Gallery Preview */}
          <div className="space-y-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[var(--color-border-medium)] bg-[var(--color-bg-input)]/40 dark:border-[var(--color-primary-medium)]/30 dark:bg-[var(--color-dark-bg-main)]">
              <img
                src={activeImage}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600'
                }}
              />
              {featured && (
                <div className="absolute left-3 top-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-950 px-2.5 h-6 text-[11px] font-extrabold font-heading tracking-wide shadow-md border border-amber-300/80 backdrop-blur-xs">
                    <Sparkles className="h-3 w-3 fill-slate-950 text-slate-950" />
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails if multiple */}
            {imageList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imageList.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                      selectedImgIndex === idx
                        ? 'border-[var(--color-primary-medium)] dark:border-[var(--color-text-gold)] ring-2 ring-[var(--color-primary-medium)]/20'
                        : 'border-[var(--color-border-medium)] opacity-60 hover:opacity-100 dark:border-white/10'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${name} thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-bg-input)] px-2.5 py-1 text-xs font-bold text-[var(--color-primary-medium)] dark:bg-[var(--color-primary-medium)]/30 dark:text-[var(--color-text-gold)]">
                  <Layers className="h-3 w-3" />
                  {category}
                </span>
                <span className="rounded-lg bg-[var(--color-bg-input)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] dark:bg-[var(--color-dark-bg-main)] dark:text-slate-300">
                  {brand}
                </span>
              </div>

              <h2 className="text-xl font-bold font-heading text-[var(--color-primary-dark)] dark:text-white leading-tight">
                {name}
              </h2>

              {/* Price Display */}
              <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)]/50 p-3 dark:border-[var(--color-primary-medium)]/20 dark:bg-[var(--color-dark-bg-main)]/50">
                <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase">
                  Price
                </div>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]">
                    {displayPrice}{' '}
                    <span className="text-sm font-semibold">{currency}</span>
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-[var(--color-text-secondary)] line-through">
                        {price} {currency}
                      </span>
                      <span className="inline-flex items-center justify-center h-5 px-2 rounded-full bg-rose-600 text-[10px] font-bold font-heading tabular-nums text-white leading-none shadow-xs">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Inventory Status */}
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
                    <PackageX className="h-3.5 w-3.5" />
                    Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <PackageCheck className="h-3.5 w-3.5" />
                    {stock} in stock
                  </span>
                )}
              </div>
            </div>

            {/* Product ID Pill */}
            {productId && (
              <div className="rounded-xl bg-[var(--color-bg-input)]/40 p-2.5 text-[11px] font-mono text-[var(--color-text-secondary)] dark:bg-[var(--color-dark-bg-main)]/40">
                <span className="font-semibold font-sans">Product ID: </span>
                {productId}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 border-t border-[var(--color-border-light)] pt-4 dark:border-[var(--color-primary-medium)]/20">
          <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-text-secondary)]">
            Description
          </h4>
          <p className="text-xs leading-relaxed text-[var(--color-text-primary)] dark:text-slate-200 font-body whitespace-pre-line">
            {description || 'No detailed description provided.'}
          </p>
        </div>

        {/* Tags */}
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="space-y-2 border-t border-[var(--color-border-light)] pt-4 dark:border-[var(--color-primary-medium)]/20">
            <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-[var(--color-text-secondary)]">
              Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-bg-input)]/80 px-2.5 py-1 text-xs font-medium text-[var(--color-text-primary)] dark:bg-[var(--color-primary-medium)]/30 dark:text-slate-200"
                >
                  <Tag className="h-3 w-3 text-[var(--color-text-secondary)]" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
