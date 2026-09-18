import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react'
import { toast } from 'react-toastify'
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector'
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary'
import Button from '@/components/common/Button'
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartCoupon,
  clearCart,
} from '@/store/slices/cartSlice'
import {
  selectShippingAddress,
  selectPaymentMethod,
  selectIsAddressValid,
  resetCheckoutDraft,
} from '@/store/slices/checkoutSlice'
import {
  placeOrderThunk,
  selectIsPlacingOrder,
} from '@/store/slices/ordersSlice'

/**
 * PaymentPage (Step 2: Payment Method & Order Submission)
 * Enforces address validation guard, binds payment selection, and executes order placement.
 */
export default function PaymentPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cartItems = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const discount = useSelector(selectCartDiscount)
  const couponCode = useSelector(selectCartCoupon)

  const shippingAddress = useSelector(selectShippingAddress)
  const paymentMethod = useSelector(selectPaymentMethod)
  const isAddressValid = useSelector(selectIsAddressValid)
  const isPlacingOrder = useSelector(selectIsPlacingOrder)

  // Guard: If address is invalid or empty, redirect back to Step 1
  useEffect(() => {
    if (!isAddressValid) {
      toast.info('Please complete your shipping address details first.')
      navigate('/checkout', { replace: true })
    }
  }, [isAddressValid, navigate])

  // Guard: If cart is empty, return to products
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/40 flex items-center justify-center text-accent-gold">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-bold text-primary-dark dark:text-text-light">
            No Items to Checkout
          </h2>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
            Your shopping cart is currently empty.
          </p>
        </div>
        <Link to="/products">
          <Button variant="gold" size="md">
            Return to Store
          </Button>
        </Link>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    if (!isAddressValid) {
      toast.warning('Shipping address is incomplete.')
      navigate('/checkout')
      return
    }

    // Prepare API order payload conforming to backend swagger schema
    const orderPayload = {
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        country: 'Egypt',
        city: shippingAddress.city.trim(),
        address: shippingAddress.address.trim(),
        postalCode: shippingAddress.postalCode?.trim() || '',
      },
      // Backend handles orders as cash; Stripe option is a design preview
      paymentMethod: 'cash',
      customerNote: shippingAddress.customerNote?.trim() || undefined,
    }

    try {
      const resultAction = await dispatch(placeOrderThunk(orderPayload))

      if (placeOrderThunk.fulfilled.match(resultAction)) {
        const orderData = resultAction.payload?.order || resultAction.payload?.data || resultAction.payload
        const orderId = orderData?._id || orderData?.id

        toast.success('Order placed successfully!')

        // Clean up client active cart & draft state
        dispatch(clearCart())
        dispatch(resetCheckoutDraft())

        // Navigate to Order Confirmation with fallback state
        navigate(`/order-success/${orderId || ''}`, {
          replace: true,
          state: {
            order: {
              ...orderData,
              paymentMethod: paymentMethod === 'stripe' ? 'stripe' : 'cash',
            },
          },
        })
      } else {
        const errorMsg = resultAction.payload || 'Failed to place order. Please try again.'
        toast.error(errorMsg)
      }
    } catch (err) {
      toast.error(err.message || 'An unexpected error occurred.')
    }
  }

  const paymentLabels = {
    cash: 'Cash on Delivery',
    stripe: 'Credit / Debit Card (Stripe)',
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Navigation breadcrumb back to Shipping */}
      <div>
        <Link
          to="/checkout"
          className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-primary-dark dark:text-slate-400 dark:hover:text-accent-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shipping Details</span>
        </Link>
      </div>

      {/* Main Grid: Payment Selector (left) + Order Summary (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Step 2: Payment Method */}
        <div className="lg:col-span-2 space-y-6">
          <PaymentMethodSelector />

          {/* Guaranteed Security Card */}
          <div className="p-4 rounded-2xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/30 flex items-center gap-3.5 text-xs text-text-secondary dark:text-slate-400">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-semibold text-primary-dark dark:text-text-light">
                Buyer Protection & Quality Guarantee
              </p>
              <p className="text-[11px] mt-0.5">
                Inspect your items upon arrival. You only pay for hardware you are 100% satisfied with.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <CheckoutOrderSummary
            items={cartItems}
            subtotal={subtotal}
            discount={discount}
            couponCode={couponCode}
            onAction={handlePlaceOrder}
            actionLabel="Place Order"
            isLoading={isPlacingOrder}
            disabled={!isAddressValid}
            shippingAddress={shippingAddress}
            paymentMethod={paymentLabels[paymentMethod] || 'Cash on Delivery'}
          />
        </div>
      </div>
    </div>
  )
}
