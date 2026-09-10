import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-md',
  closeOnBackdrop = true,
}) {
  // Close on Escape key and lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
    >
      {/* Backdrop overlay */}
      <div
        role="presentation"
        onClick={closeOnBackdrop ? onClose : undefined}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-fade-in"
      />

      {/* Modal Surface */}
      <div
        className={`relative w-full ${maxWidth} max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col rounded-2xl bg-white dark:bg-dark-bg-card border border-border-medium dark:border-primary-medium/30 shadow-2xl z-10 overflow-hidden transform transition-all duration-200 animate-scale-in my-auto`}
      >
        {/* Modal Header */}
        {(title || onClose) && (
          <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border-medium/60 dark:border-primary-medium/30 bg-white/95 dark:bg-dark-bg-card/95 backdrop-blur-xs z-20">
            {title && (
              <h3 className="text-sm sm:text-base font-bold font-heading text-primary-dark dark:text-text-light truncate pr-2">
                {title}
              </h3>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-text-secondary hover:text-rose-500 hover:bg-bg-main dark:text-slate-300 dark:hover:bg-primary-medium/30 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-5 text-sm text-text-primary dark:text-text-light font-body">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="shrink-0 flex items-center justify-end gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-bg-main/30 dark:bg-dark-bg-main/40 border-t border-border-medium/60 dark:border-primary-medium/30 z-20">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
