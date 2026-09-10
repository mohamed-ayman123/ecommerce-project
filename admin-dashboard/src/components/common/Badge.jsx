/**
 * Shared Badge Component
 * Consistently renders status pills and category badges with light/dark theme contrast.
 */

const STATUS_VARIANTS = {
  pending: 'warning',
  processing: 'violet',
  confirmed: 'info',
  shipped: 'cyan',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'neutral',
  paid: 'success',
  failed: 'danger',
  refunded: 'neutral',
  draft: 'draft',
  inactive: 'draft',
}

const VARIANTS = {
  primary:
    'bg-primary-medium/15 text-primary-dark dark:text-text-gold border-primary-medium/25',
  gold:
    'bg-accent-gold/15 text-accent-gold-hover dark:text-text-gold border-accent-gold/30',
  success:
    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  warning:
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
  danger:
    'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25',
  info:
    'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25',
  violet:
    'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25',
  cyan:
    'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25',
  neutral:
    'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25',
  draft:
    'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-slate-700 shadow-2xs',
}

const SIZES = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export default function Badge({
  children,
  variant,
  status,
  size = 'md',
  dot = false,
  rounded = 'full',
  className = '',
  ...props
}) {
  const normalizedStatus = status ? String(status).toLowerCase().trim() : null
  const selectedVariant =
    variant || (normalizedStatus && STATUS_VARIANTS[normalizedStatus]) || 'neutral'
  const variantStyles = VARIANTS[selectedVariant] || VARIANTS.neutral
  const sizeStyles = SIZES[size] || SIZES.md
  const roundedStyle = rounded === 'md' ? 'rounded-md' : 'rounded-full'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider border transition-colors ${roundedStyle} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />}
      {children || status}
    </span>
  )
}
