import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AlertCircle, ShoppingBag, Loader2 } from 'lucide-react'
import OrderSuccessCard from '@/components/checkout/OrderSuccessCard'
import Button from '@/components/common/Button'
import {
  fetchMyOrderByIdThunk,
  selectCurrentOrder,
  selectOrdersLoading,
} from '@/store/slices/ordersSlice'

/**
 * OrderSuccessPage Component
 * Accessible at /order-success/:orderId (and /order-success).
 * Features instant cached display via location.state, with resilient background fetching on page reload.
 */
export default function OrderSuccessPage() {
  const { orderId: paramOrderId } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()

  const reduxCurrentOrder = useSelector(selectCurrentOrder)
  const isLoading = useSelector(selectOrdersLoading)

  // Prioritize cached order from router transition state for instant paint
  const initialCachedOrder =
    location.state?.order &&
    (!paramOrderId ||
      location.state.order._id === paramOrderId ||
      location.state.order.id === paramOrderId)
      ? location.state.order
      : null

  const [order, setOrder] = useState(initialCachedOrder || reduxCurrentOrder)
  const [fetchAttempted, setFetchAttempted] = useState(false)

  const targetOrderId =
    paramOrderId || order?._id || order?.id || reduxCurrentOrder?._id

  useEffect(() => {
    // If order is not present in local state and we have an ID, fetch from backend
    if (!order && targetOrderId) {
      dispatch(fetchMyOrderByIdThunk(targetOrderId))
        .unwrap()
        .then((res) => {
          const fetched = res?.order || res?.data || res
          if (fetched) {
            setOrder(fetched)
          }
        })
        .catch(() => {
          // Handled via fetchAttempted state
        })
        .finally(() => {
          setFetchAttempted(true)
        })
    } else if (order) {
      setFetchAttempted(true)
    }
  }, [dispatch, order, targetOrderId])

  // 1. Loading State
  if (isLoading && !order) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <Loader2 className="w-10 h-10 text-accent-gold animate-spin mx-auto" />
        <p className="font-heading font-semibold text-sm text-primary-dark dark:text-text-light">
          Retrieving your order confirmation...
        </p>
      </div>
    )
  }

  // 2. Not Found / Invalid State (Guard requirement)
  if ((fetchAttempted && !order) || (!targetOrderId && !order)) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center text-rose-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-heading font-bold text-primary-dark dark:text-text-light">
            Order Not Found
          </h2>
          <p className="text-xs text-text-secondary dark:text-slate-400">
            We couldn't retrieve the details for this order. It may have expired or the order reference is invalid.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link to="/products">
            <Button variant="primary" size="md" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Return to Shop</span>
            </Button>
          </Link>
          <Link to="/profile/orders">
            <Button variant="outline" size="md">
              View Order History
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // 3. Success State
  return (
    <div className="py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Main Order Success Hero & Details Card */}
      <OrderSuccessCard order={order} />
    </div>
  )
}
