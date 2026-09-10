import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import { Package, ShoppingCart } from 'lucide-react'
import { formatDate, formatCurrency } from '@/utils/formatters'

export default function CartDetailModal({ cart, currency = 'EGP', onClose }) {
  if (!cart) return null

  const items = cart.items || []
  const subtotal =
    cart.subtotal ??
    items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0)

  const user = cart.user || cart.customer || {}
  const customerName =
    user.username ||
    user.name ||
    (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '') ||
    cart.customerName ||
    'Guest Customer'
  const customerEmail = user.email || cart.email || 'N/A'

  return (
    <Modal
      isOpen={!!cart}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-accent-gold" />
          Cart Details ({cart._id || cart.id})
        </span>
      }
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold text-text-secondary dark:text-slate-400">
            Total Items: <span className="font-bold text-primary-dark dark:text-white">{items.length}</span>
          </span>
          <Button variant="primary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Customer profile */}
        <div className="p-4 rounded-2xl bg-bg-main/30 dark:bg-white/5 border border-border-light dark:border-white/10 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400">
            Customer Profile
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-text-secondary dark:text-slate-400 block">
                Name:
              </span>
              <span className="font-semibold text-primary-dark dark:text-white">
                {customerName}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-secondary dark:text-slate-400 block">
                Email:
              </span>
              <span className="font-semibold text-primary-dark dark:text-white">
                {customerEmail}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-secondary dark:text-slate-400 block">
                Session Started:
              </span>
              <span className="text-primary-dark dark:text-white">
                {formatDate(cart.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-secondary dark:text-slate-400 block">
                Last Activity:
              </span>
              <span className="text-primary-dark dark:text-white">
                {formatDate(cart.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400 mb-3">
            Items Breakdown ({items.length})
          </h4>
          <div className="border border-border-light dark:border-white/10 rounded-2xl overflow-hidden divide-y divide-border-light dark:divide-white/5">
            {items.map((item, idx) => (
              <div
                key={item._id || idx}
                className="p-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden shrink-0 flex items-center justify-center border border-border-light dark:border-white/10">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-text-secondary" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-primary-dark dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-xs text-text-secondary dark:text-slate-400">
                      Unit: {formatCurrency(item.price, currency)} × {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-bold text-primary-dark dark:text-white font-heading">
                  {formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 1), currency)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total calculation */}
        <div className="p-4 rounded-2xl bg-bg-main/30 dark:bg-white/5 border border-border-light dark:border-white/10 flex justify-between items-center">
          <span className="font-semibold text-primary-dark dark:text-white text-sm">
            Total Cart Value:
          </span>
          <span className="text-xl font-bold text-accent-gold font-heading">
            {formatCurrency(subtotal, currency)}
          </span>
        </div>
      </div>
    </Modal>
  )
}
