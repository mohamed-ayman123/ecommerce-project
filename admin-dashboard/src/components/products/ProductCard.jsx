import { useState } from 'react'
import {
  Eye,
  Edit3,
  SlidersHorizontal,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Badge from '@/components/common/Badge'

export default function ProductCard({
  product,
  currency = 'EGP',
  onView,
  onEdit,
  onQuickEdit,
  onDelete,
}) {
  const {
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

  const getImageUrl = (img) => {
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

  const imageList = rawImages.map(getImageUrl).filter(Boolean)
  if (imageList.length === 0) {
    imageList.push(
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600'
    )
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const currentImage = imageList[currentImageIndex] || imageList[0]

  const handlePrevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1
    )
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1
    )
  }

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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border-medium)] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-[var(--color-primary-medium)]/30 dark:bg-[var(--color-dark-bg-card)]">
      {/* Product Image Banner & Slider */}
      <div className="relative h-52 w-full overflow-hidden bg-[var(--color-bg-input)]/40 dark:bg-[var(--color-dark-bg-main)] select-none">
        <img
          key={currentImageIndex}
          src={currentImage}
          alt={`${name} - image ${currentImageIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600'
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Navigation Arrows (rendered when multiple images exist) */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 hover:bg-black/80 hover:scale-110 cursor-pointer shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 hover:bg-black/80 hover:scale-110 cursor-pointer shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Slider Dots Indicator */}
            <div className="absolute bottom-2.5 right-3 z-20 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-xs">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(idx)
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentImageIndex === idx
                      ? 'w-3 bg-[var(--color-text-gold)]'
                      : 'w-1.5 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Featured Badge (Top-Left) */}
        {featured && (
          <div className="absolute left-3 top-3 z-10">
            <Badge
              variant="gold"
              size="sm"
              className="bg-amber-400 text-slate-950 border-amber-300/80 shadow-md backdrop-blur-xs font-heading font-extrabold"
            >
              <Star className="h-3 w-3 fill-slate-950 text-slate-950" />
              Featured
            </Badge>
          </div>
        )}

        {/* Discount Badge (Top-Right, always consistent) */}
        {hasDiscount && (
          <div className="absolute right-3 top-3 z-10">
            <Badge
              variant="danger"
              size="sm"
              className="bg-rose-600 text-white border-rose-500 shadow-md font-heading tabular-nums"
            >
              -{discountPercentage}%
            </Badge>
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute bottom-3 left-3">
          {isOutOfStock ? (
            <Badge
              variant="danger"
              size="sm"
              className="bg-rose-600/90 text-white border-rose-500/80 shadow-sm backdrop-blur-xs"
            >
              Out of stock
            </Badge>
          ) : (
            <Badge
              variant="success"
              size="sm"
              className="bg-emerald-600/90 text-white border-emerald-500/80 shadow-sm backdrop-blur-xs"
            >
              {stock} in stock
            </Badge>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category & Brand */}
        <div className="mb-2 flex items-center justify-between gap-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-[var(--color-primary-medium)] dark:text-[var(--color-text-gold)]">
            {category}
          </span>
          <span className="text-[var(--color-text-secondary)] truncate">
            {brand}
          </span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-1 text-base font-bold font-heading text-[var(--color-text-primary)] dark:text-white" title={name}>
          {name}
        </h3>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-relaxed text-[var(--color-text-secondary)] font-body">
          {description || 'No description available for this product.'}
        </p>

        {/* Pricing */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-black font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]">
            {displayPrice} <span className="text-xs font-semibold">{currency}</span>
          </span>
          {hasDiscount && (
            <span className="text-xs text-[var(--color-text-secondary)] line-through">
              {price} {currency}
            </span>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="rounded-lg bg-[var(--color-bg-input)]/60 px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-secondary)] dark:bg-[var(--color-primary-medium)]/30 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/20 grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => onView?.(product)}
            className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-xs font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-input)]/60 hover:text-[var(--color-text-primary)] dark:text-slate-300 dark:hover:bg-[var(--color-primary-medium)]/30 dark:hover:text-white cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
            <span className="text-[10px]">View</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit?.(product)}
            className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-xs font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-input)]/60 hover:text-[var(--color-text-primary)] dark:text-slate-300 dark:hover:bg-[var(--color-primary-medium)]/30 dark:hover:text-white cursor-pointer"
            title="Edit Full Product"
          >
            <Edit3 className="h-4 w-4" />
            <span className="text-[10px]">Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickEdit?.(product)}
            className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-xs font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-input)]/60 hover:text-[var(--color-text-primary)] dark:text-slate-300 dark:hover:bg-[var(--color-primary-medium)]/30 dark:hover:text-white cursor-pointer"
            title="Quick Edit"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-[10px]">Quick</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(product)}
            className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40 cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-[10px]">Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}