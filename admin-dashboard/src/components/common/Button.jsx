export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-heading font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const variants = {
    primary:
      'bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary-medium)] dark:bg-[var(--color-primary-medium)] dark:hover:bg-[var(--color-accent-gold-hover)] text-white focus:ring-[var(--color-primary-dark)] shadow-sm active:scale-[0.99]',
    secondary:
      'bg-[var(--color-bg-main)] hover:bg-[var(--color-border-medium)] dark:bg-[var(--color-dark-bg-main)] dark:hover:bg-[var(--color-primary-medium)]/40 text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] focus:ring-[var(--color-primary-medium)]',
    outline:
      'border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/50 hover:bg-[var(--color-bg-main)] dark:hover:bg-[var(--color-dark-bg-main)] text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] focus:ring-[var(--color-primary-medium)]',
    gold:
      'bg-[var(--color-text-gold)] hover:bg-[var(--color-accent-gold-hover)] text-white focus:ring-[var(--color-text-gold)] shadow-sm active:scale-[0.99]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm',
    ghost:
      'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-main)] dark:hover:bg-[var(--color-dark-bg-main)] hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-text-light)] focus:ring-[var(--color-primary-medium)]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
