import { useRef, useState } from 'react'
import {
  UploadCloud,
  X,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
} from 'lucide-react'

export default function ProductMediaGallery({
  allMediaItems = [],
  coverItem = null,
  supportingItems = [],
  onFilesSelected,
  onRemoveExisting,
  onRemoveNew,
  error = null,
}) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer?.files || [])
    if (files.length && onFilesSelected) {
      onFilesSelected(files)
    }
  }

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length && onFilesSelected) {
      onFilesSelected(files)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[var(--color-dark-bg-card)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs space-y-5">
      {/* Gallery Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-medium)]/15 text-[var(--color-primary-dark)] dark:bg-[var(--color-primary-medium)]/30 dark:text-[var(--color-text-gold)] border border-[var(--color-primary-medium)]/20 flex items-center justify-center shadow-2xs">
            <ImageIcon className="w-5 h-5 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
              Studio Media Gallery
            </h3>
            <p className="text-[11px] text-[var(--color-text-secondary)] font-body">
              Upload up to 5 photos. Slot #1 is the primary storefront cover photo.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-heading bg-[var(--color-bg-main)] dark:bg-[var(--color-dark-bg-main)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]">
          {allMediaItems.length} / 5 Photos
        </span>
      </div>

      {/* Empty State Dropzone */}
      {allMediaItems.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-150 ${
            isDragging
              ? 'border-[var(--color-primary-medium)] bg-[var(--color-primary-medium)]/10 scale-[0.99]'
              : error
              ? 'border-rose-400 bg-rose-50/30'
              : 'border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 dark:hover:border-[var(--color-text-gold)] bg-[var(--color-bg-main)]/40 hover:bg-[var(--color-bg-input)]/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[var(--color-dark-bg-card)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
            Click to browse photos or drag and drop files here
          </p>
          <p className="text-[11px] text-[var(--color-text-secondary)] font-body mt-1">
            Supports PNG, JPG, WEBP • Upload up to 5 photos • Max 4MB total
          </p>
        </div>
      ) : (
        /* 2D Studio Gallery: Primary Cover + Supporting 2x2/4 Grid */
        <div className="space-y-4">
          {/* Slot #1: Large Primary Cover Hero */}
          {coverItem && (
            <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40 bg-[var(--color-bg-main)]/60 dark:bg-[var(--color-dark-bg-main)] group shadow-xs">
              <img
                src={coverItem.url}
                alt="Main storefront cover"
                className="w-full h-56 sm:h-64 object-cover object-center"
              />
              {/* Top Badges & Controls */}
              <div className="absolute inset-x-0 top-0 p-3.5 flex items-center justify-between bg-gradient-to-b from-black/70 via-black/20 to-transparent">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-primary-dark)]/90 backdrop-blur-sm border border-[var(--color-text-gold)]/40 text-[10px] font-bold tracking-wider text-[var(--color-text-gold)] uppercase font-heading shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  Primary Storefront Cover
                </span>
                <button
                  type="button"
                  onClick={() =>
                    coverItem.type === 'existing'
                      ? onRemoveExisting(coverItem.index)
                      : onRemoveNew(coverItem.index)
                  }
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white/90 hover:text-white backdrop-blur-sm transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Bottom Info Bar */}
              <div className="absolute inset-x-0 bottom-0 bg-[var(--color-primary-dark)]/90 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-white text-[11px] font-body">
                <span className="text-[10px] font-bold tracking-wider uppercase font-heading text-white/80">
                  {coverItem.type === 'existing'
                    ? 'Current Cloudinary Asset'
                    : 'New Image Ready To Upload'}
                </span>
                <span className="text-[10px] text-[var(--color-text-gold)] font-mono font-bold">
                  COVER PHOTO (SLOT 1)
                </span>
              </div>
            </div>
          )}

          {/* Slots #2–#5: Supporting Photos Grid */}
          {supportingItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[var(--color-primary-medium)] dark:text-[var(--color-text-gold)] uppercase tracking-wider block font-heading">
                Supporting Gallery Angles ({supportingItems.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {supportingItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="relative rounded-xl overflow-hidden border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40 bg-[var(--color-bg-main)]/60 dark:bg-[var(--color-dark-bg-main)] group shadow-2xs aspect-4/3 sm:aspect-square"
                  >
                    <img
                      src={item.url}
                      alt={`Gallery angle ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 sm:inset-0 sm:bg-black/45 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-end sm:justify-center p-1 sm:p-2 z-10">
                      <button
                        type="button"
                        onClick={() =>
                          item.type === 'existing'
                            ? onRemoveExisting(item.index)
                            : onRemoveNew(item.index)
                        }
                        className="p-1 sm:p-1.5 rounded-lg bg-black/60 sm:bg-rose-600/90 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-xs"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-bold font-mono text-[var(--color-text-gold)]">
                      SLOT {idx + 2}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compact Dropzone when slots < 5 */}
          {allMediaItems.length < 5 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-150 flex items-center justify-center gap-3.5 ${
                isDragging
                  ? 'border-[var(--color-primary-medium)] bg-[var(--color-primary-medium)]/10 scale-[0.99]'
                  : 'border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 bg-[var(--color-bg-main)]/30 hover:bg-[var(--color-bg-input)]/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                onChange={handleInputChange}
                className="hidden"
              />
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-[var(--color-dark-bg-card)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)] flex items-center justify-center shadow-2xs shrink-0">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
                  Add more photos ({5 - allMediaItems.length} slot
                  {5 - allMediaItems.length > 1 ? 's' : ''} available)
                </p>
                <p className="text-[10px] text-[var(--color-text-secondary)] font-body">
                  Click to browse or drop additional angles here
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-500 font-medium font-body flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
