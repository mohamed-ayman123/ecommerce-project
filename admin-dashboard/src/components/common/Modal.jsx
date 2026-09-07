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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop overlay */}
      <div
        role="presentation"
        onClick={closeOnBackdrop ? onClose : undefined}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200 animate-fade-in"
      />

      {/* Modal Surface */}
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-white dark:bg-[var(--color-dark-bg-card)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-2xl z-10 overflow-hidden transform transition-all duration-200 animate-scale-in`}
      >
        {/* Modal Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-medium)]/60 dark:border-[var(--color-primary-medium)]/30">
            {title && (
              <h3 className="text-base font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
                {title}
              </h3>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:text-rose-500 hover:bg-[var(--color-bg-main)]/50 dark:hover:bg-[var(--color-dark-bg-main)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="px-6 py-5 text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] font-body">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[var(--color-bg-main)]/30 dark:bg-[var(--color-dark-bg-main)]/40 border-t border-[var(--color-border-medium)]/60 dark:border-[var(--color-primary-medium)]/30">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
