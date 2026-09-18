import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import ShippingAddressForm from '@/components/checkout/ShippingAddressForm'
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary'
import Button from '@/components/common/Button'
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartCoupon,
} from '@/store/slices/cartSlice'
import { selectIsAddressValid } from '@/store/slices/checkoutSlice'

/**
 * CheckoutPage (Step 1: Shipping & Delivery)
 * Captures customer address details with strict validation and connects to the payment step.
 */
export default function CheckoutPage() {
  const navigate = useNavigate()
  const [showErrors, setShowErrors] = useState(false)

  const cartItems = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const discount = useSelector(selectCartDiscount)
  const couponCode = useSelector(selectCartCoupon)
  const isAddressValid = useSelector(selectIsAddressValid)

  // Empty cart fallback
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/40 flex items-center justify-center text-accent-gold">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-bold text-primary-dark dark:text-text-light">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
            Add some genuine electronics or hardware gear to proceed to checkout.
          </p>
        </div>
        <Link to="/products">
          <Button variant="gold" size="md">
            Browse Products
          </Button>
        </Link>
      </div>
    )
  }

  const handleProceedToPayment = () => {
    if (!isAddressValid) {
      setShowErrors(true)
      toast.warning('Please complete all required address fields with a valid Egyptian phone number.')
      return
    }
    navigate('/checkout/payment')
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Navigation breadcrumb back to Cart */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-primary-dark dark:text-slate-400 dark:hover:text-accent-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>
      </div>

      {/* Main Grid: Form (left) + Summary (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Step 1: Shipping Address Form */}
        <div className="lg:col-span-2">
          <ShippingAddressForm showErrors={showErrors} />
        </div>

        {/* Order Summary Sticky Sidebar */}
        <div className="lg:col-span-1">
          <CheckoutOrderSummary
            items={cartItems}
            subtotal={subtotal}
            discount={discount}
            couponCode={couponCode}
            onAction={handleProceedToPayment}
            actionLabel="Continue to Payment"
          />
        </div>
      </div>
    </div>
  )
}
