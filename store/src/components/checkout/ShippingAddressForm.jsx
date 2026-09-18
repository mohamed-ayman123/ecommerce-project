import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User, Phone, MapPin, Building, FileText, CheckCircle2 } from 'lucide-react'
import Input from '@/components/common/Input'
import Dropdown from '@/components/common/Dropdown'
import Badge from '@/components/common/Badge'
import {
  selectShippingAddress,
  updateShippingField,
  validateEgyptianPhone,
} from '@/store/slices/checkoutSlice'

export const EGYPT_CITIES = [
  'Cairo',
  'Giza',
  'Alexandria',
  'Qalyubia',
  'Sharqia',
  'Dakahlia',
  'Gharbia',
  'Menofia',
  'Beheira',
  'Kafr El Sheikh',
  'Damietta',
  'Port Said',
  'Ismailia',
  'Suez',
  'Fayoum',
  'Beni Suef',
  'Minya',
  'Asyut',
  'Sohag',
  'Qena',
  'Luxor',
  'Aswan',
  'Red Sea (Hurghada)',
  'South Sinai (Sharm El Sheikh)',
  'Matrouh',
]

/**
 * ShippingAddressForm Component
 * Renders the customer delivery address and contact details form.
 * Directly wired to the Redux checkoutSlice for clean state management.
 *
 * @param {Object} props
 * @param {boolean} [props.showErrors=false] - Whether to highlight validation errors on submit attempt
 */
export default function ShippingAddressForm({ showErrors = false }) {
  const dispatch = useDispatch()
  const shippingAddress = useSelector(selectShippingAddress)
  const user = useSelector((state) => state.auth?.user)

  // Auto-fill from user profile if address fields are blank
  useEffect(() => {
    if (user && !shippingAddress.fullName && user.username) {
      dispatch(updateShippingField({ field: 'fullName', value: user.username }))
    }
    if (user && !shippingAddress.phone && user.phone) {
      dispatch(updateShippingField({ field: 'phone', value: user.phone }))
    }
  }, [user, shippingAddress.fullName, shippingAddress.phone, dispatch])

  const handleChange = (field, value) => {
    dispatch(updateShippingField({ field, value }))
  }

  const isPhoneValid = validateEgyptianPhone(shippingAddress.phone)
  const isNameValid = Boolean(shippingAddress.fullName && shippingAddress.fullName.trim().length >= 2)
  const isCityValid = Boolean(shippingAddress.city && shippingAddress.city.trim().length >= 2)
  const isAddressValid = Boolean(shippingAddress.address && shippingAddress.address.trim().length >= 5)

  return (
    <div className="bg-bg-card dark:bg-dark-bg-card rounded-2xl border border-border-light dark:border-primary-medium/30 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-primary-medium/30">
        <div>
          <h2 className="text-lg sm:text-xl font-heading font-bold text-primary-dark dark:text-text-light">
            Shipping & Delivery Details
          </h2>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
            Please enter your accurate address to ensure prompt delivery across Egypt
          </p>
        </div>
        <Badge variant="gold" size="sm" dot>
          Egypt Delivery
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Full Name */}
        <div className="sm:col-span-1">
          <Input
            label="Full Name *"
            placeholder="e.g. Mohamed Ahmed"
            value={shippingAddress.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            icon={User}
            required
            error={showErrors && !isNameValid ? 'Please enter your full name (at least 2 characters)' : undefined}
          />
        </div>

        {/* Phone Number with Egyptian Format Hint */}
        <div className="sm:col-span-1">
          <Input
            label="Phone Number *"
            type="tel"
            placeholder="01012345678 or +20..."
            value={shippingAddress.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            icon={Phone}
            required
            helperText={!shippingAddress.phone ? 'Egyptian mobile numbers (Vodafone, Orange, Etisalat, WE)' : undefined}
            error={
              showErrors && !isPhoneValid
                ? 'Valid Egyptian phone required (e.g. 01012345678 or +2010...)'
                : undefined
            }
          />
        </div>

        {/* City / Governorate Dropdown */}
        <div className="sm:col-span-1 space-y-1.5">
          <label className="block text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading">
            City / Governorate *
          </label>
          <Dropdown
            value={shippingAddress.city}
            onChange={(val) => handleChange('city', val)}
            options={EGYPT_CITIES}
            placeholder="Select your governorate"
            className="w-full"
          />
          {showErrors && !isCityValid && (
            <p className="text-xs text-rose-500 font-medium">Please select your city or governorate</p>
          )}
        </div>

        {/* Country (Fixed to Egypt) */}
        <div className="sm:col-span-1 space-y-1.5">
          <label className="block text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading">
            Country
          </label>
          <div className="h-11 px-4 rounded-xl bg-bg-main/60 dark:bg-dark-bg-main border border-border-light dark:border-primary-medium/30 flex items-center justify-between text-sm font-medium text-text-primary dark:text-text-light">
            <span className="flex items-center gap-2">
              <span className="text-base">🇪🇬</span> Egypt
            </span>
            <span className="text-xs text-text-secondary dark:text-slate-400">Domestic Delivery</span>
          </div>
        </div>

        {/* Detailed Address */}
        <div className="sm:col-span-2">
          <Input
            label="Street Address & Building / Apartment *"
            placeholder="e.g. 14 El-Tahrir St, Building 4, Apt 12, Floor 3"
            value={shippingAddress.address}
            onChange={(e) => handleChange('address', e.target.value)}
            icon={MapPin}
            required
            error={
              showErrors && !isAddressValid
                ? 'Detailed address required (street, building, apartment)'
                : undefined
            }
          />
        </div>

        {/* Postal Code (Optional) */}
        <div className="sm:col-span-1">
          <Input
            label="Postal Code (Optional)"
            placeholder="e.g. 11511"
            value={shippingAddress.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            icon={Building}
          />
        </div>

        {/* Delivery Note */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading">
            Delivery Notes & Instructions (Optional)
          </label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="e.g. Please call upon arrival, leave with security, or deliver after 3 PM..."
              value={shippingAddress.customerNote || ''}
              onChange={(e) => handleChange('customerNote', e.target.value)}
              className="w-full rounded-xl bg-bg-card dark:bg-dark-bg-card border border-border-medium dark:border-primary-medium/40 p-3.5 text-sm text-text-primary dark:text-text-light placeholder:text-text-secondary/60 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-gold/40 focus:border-accent-gold transition-all duration-200 resize-none font-sans"
            />
            <FileText className="w-4 h-4 text-text-secondary/50 absolute bottom-3 right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Validation Status Indicator */}
      {isNameValid && isPhoneValid && isCityValid && isAddressValid && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Shipping address complete and verified for Egyptian courier dispatch.</span>
        </div>
      )}
    </div>
  )
}
