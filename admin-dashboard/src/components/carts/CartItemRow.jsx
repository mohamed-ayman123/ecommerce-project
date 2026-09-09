import { Package } from 'lucide-react'

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%23888" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'

export default function CartItemRow({ item, currency = 'EGP' }) {
  const itemTotal = (item.price || 0) * (item.quantity || 1)

  return (
    <div className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-border-light dark:border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = FALLBACK_IMAGE
              }}
            />
          ) : (
            <Package className="w-5 h-5 text-text-secondary dark:text-slate-400" />
          )}
        </div>
        <div className="min-w-0">
          <h5 className="text-sm font-semibold text-primary-dark dark:text-white truncate">
            {item.name || 'Unnamed Product'}
          </h5>
          <p className="text-xs text-text-secondary dark:text-slate-400">
            Unit Price: {item.price?.toLocaleString()} {currency}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-xs font-semibold text-text-secondary dark:text-slate-400">
          Qty: <span className="text-primary-dark dark:text-white font-bold">{item.quantity}</span>
        </div>
        <div className="text-sm font-bold text-primary-dark dark:text-white font-heading">
          {itemTotal.toLocaleString()} {currency}
        </div>
      </div>
    </div>
  )
}
