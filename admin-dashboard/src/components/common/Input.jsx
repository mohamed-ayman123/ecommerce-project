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
          className="block text-xs font-bold text-brand-black uppercase tracking-wider"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        required={required}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-brand-black placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-black focus:border-transparent ${
          error
            ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        } ${className}`}
        {...props}
      />

      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-[11px] text-brand-gray font-roboto">{helperText}</p>
      )}

    </div>
  )
}
