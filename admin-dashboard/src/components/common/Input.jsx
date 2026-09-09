export default function Input({
  label,
  error,
  helperText,
  id,
  type = 'text',
  className = '',
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider font-heading"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        required={required}
        className={`w-full px-3.5 py-2.5 bg-white dark:bg-[var(--color-dark-bg-main)] border rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-secondary)]/60 dark:placeholder:text-slate-300 font-body transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] focus:border-transparent ${
          error
            ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
            : 'border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 dark:hover:border-[var(--color-text-gold)] shadow-2xs'
        } ${className}`}
        {...props}
      />

      {error && <p className="text-[11px] text-rose-500 font-medium font-body">{error}</p>}
      {!error && helperText && (
        <p className="text-[11px] text-[var(--color-text-secondary)] font-body">{helperText}</p>
      )}
    </div>
  )
}
