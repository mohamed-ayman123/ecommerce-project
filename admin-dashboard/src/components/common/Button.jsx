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
  const hasDisplay = /\b(hidden|flex|inline-flex|block|inline|grid|inline-block)\b/.test(className)
  const baseStyles = `${hasDisplay ? '' : 'inline-flex '}items-center justify-center font-heading font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`

  const variants = {
    primary:
      'bg-primary-dark hover:bg-primary-medium dark:bg-primary-medium dark:hover:bg-accent-gold-hover text-white focus:ring-primary-dark shadow-sm active:scale-[0.99]',
    secondary:
      'bg-bg-main hover:bg-border-medium dark:bg-dark-bg-main dark:hover:bg-primary-medium/40 text-text-primary dark:text-text-light focus:ring-primary-medium',
    outline:
      'border border-border-medium dark:border-primary-medium/50 hover:bg-bg-main dark:hover:bg-dark-bg-main text-text-primary dark:text-text-light focus:ring-primary-medium',
    gold:
      'bg-text-gold hover:bg-accent-gold-hover text-white focus:ring-text-gold shadow-sm active:scale-[0.99]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm',
    ghost:
      'text-text-secondary hover:bg-bg-main dark:hover:bg-dark-bg-main hover:text-text-primary dark:hover:text-text-light focus:ring-primary-medium',
    subtle:
      'bg-bg-main dark:bg-dark-bg-main border border-border-medium dark:border-primary-medium/40 text-primary-dark dark:text-text-gold hover:border-accent-gold-hover hover:bg-border-light dark:hover:bg-primary-medium/30 focus:ring-primary-medium shadow-2xs',
    none: '',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    none: '',
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
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
