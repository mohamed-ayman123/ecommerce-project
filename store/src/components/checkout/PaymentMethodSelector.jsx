import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Banknote, CreditCard, Lock, Info } from 'lucide-react'
import Badge from '@/components/common/Badge'
import Input from '@/components/common/Input'
import { selectPaymentMethod, setPaymentMethod } from '@/store/slices/checkoutSlice'

const PAYMENT_METHODS = [
  {
    id: 'cash',
    title: 'Cash on Delivery (COD)',
    description: 'Pay safely in cash to the courier upon delivery at your doorstep.',
    icon: Banknote,
    badge: 'Cash',
    badgeVariant: 'gold',
  },
  {
    id: 'stripe',
    title: 'Credit / Debit Card (Stripe)',
    description: 'Pay online via Credit / Debit Card (Stripe design preview).',
    icon: CreditCard,
    badge: 'Card',
    badgeVariant: 'neutral',
  },
]

/**
 * PaymentMethodSelector Component
 * Accessible radio selection for checkout payment methods.
 * Note: Card payments (Stripe) are presented as a high-fidelity design simulation per requirements.
 */
export default function PaymentMethodSelector() {
  const dispatch = useDispatch()
  const selectedMethod = useSelector(selectPaymentMethod)

  // Mock card state for design visualization only
  const [mockCard, setMockCard] = useState({
    number: '4242 •••• •••• 4242',
    name: 'MOHAMED AHMED',
    expiry: '12/28',
    cvc: '•••',
  })

  return (
    <div className="bg-bg-card dark:bg-dark-bg-card rounded-2xl border border-border-light dark:border-primary-medium/30 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-primary-medium/30">
        <div>
          <h2 className="text-lg sm:text-xl font-heading font-bold text-primary-dark dark:text-text-light">
            Payment Method
          </h2>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
            Select your preferred payment option to complete your order
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>SSL 256-Bit Encrypted</span>
        </div>
      </div>

      <div className="space-y-3.5">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id
          const Icon = method.icon

          return (
            <div
              key={method.id}
              onClick={() => dispatch(setPaymentMethod(method.id))}
              className={`relative p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-accent-gold bg-accent-gold/5 dark:bg-accent-gold/10 shadow-sm'
                  : 'border-border-light dark:border-primary-medium/30 hover:border-border-medium dark:hover:border-primary-medium/60 bg-bg-card dark:bg-dark-bg-card'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-accent-gold text-primary-dark font-bold'
                        : 'bg-bg-main dark:bg-dark-bg-main text-text-secondary dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-primary-dark dark:text-text-light">
                        {method.title}
                      </h3>
                      {method.badge && (
                        <Badge variant={method.badgeVariant} size="sm">
                          {method.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
                      {method.description}
                    </p>
                  </div>
                </div>

                {/* Radio Indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isSelected
                      ? 'border-accent-gold bg-accent-gold'
                      : 'border-border-medium dark:border-primary-medium/60'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-primary-dark" />}
                </div>
              </div>

              {/* Simulated Card Form (Displayed ONLY when Stripe is selected) */}
              {isSelected && method.id === 'stripe' && (
                <div className="mt-5 pt-5 border-t border-accent-gold/20 space-y-4">
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Design Preview:</strong> Card details form is presented for visual demonstration. Orders are handled directly as cash on the backend.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2">
                      <Input
                        label="Cardholder Name"
                        placeholder="Name on card"
                        value={mockCard.name}
                        onChange={(e) => setMockCard({ ...mockCard, name: e.target.value })}
                        disabled
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        label="Card Number"
                        placeholder="•••• •••• •••• ••••"
                        value={mockCard.number}
                        onChange={(e) => setMockCard({ ...mockCard, number: e.target.value })}
                        icon={CreditCard}
                        disabled
                      />
                    </div>
                    <div>
                      <Input
                        label="Expiration Date"
                        placeholder="MM / YY"
                        value={mockCard.expiry}
                        onChange={(e) => setMockCard({ ...mockCard, expiry: e.target.value })}
                        disabled
                      />
                    </div>
                    <div>
                      <Input
                        label="Security Code (CVC)"
                        placeholder="CVC"
                        value={mockCard.cvc}
                        onChange={(e) => setMockCard({ ...mockCard, cvc: e.target.value })}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
