import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Sliders,
  Bell,
  RotateCcw,
  Save,
  LayoutGrid,
} from 'lucide-react'
import { toast } from 'react-toastify'
import {
  toggleTheme,
  updatePreferences,
  resetPreferences,
} from '@/store/slices/uiSlice'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import Badge from '@/components/common/Badge'
import Dropdown from '@/components/common/Dropdown'

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold-hover)] ${
        checked
          ? 'bg-[var(--color-primary-dark)] dark:bg-[var(--color-text-gold)]'
          : 'bg-[var(--color-border-medium)] dark:bg-[var(--color-primary-medium)]/40'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}



function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-white dark:bg-[var(--color-dark-bg-card)] rounded-2xl border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs p-6 sm:p-7 space-y-5 transition-colors">
      <div className="flex items-start gap-3 pb-4 border-b border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/30">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-medium)]/15 dark:bg-[var(--color-primary-medium)]/30 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)] border border-[var(--color-primary-medium)]/25 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="space-y-0.5">
          <h2 className="text-base font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-[var(--color-text-secondary)] font-body">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function SettingRow({ label, hint, children, isFirst }) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 ${
        isFirst
          ? ''
          : 'border-t border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/20'
      }`}
    >
      <div className="space-y-0.5">
        <p className="text-sm font-semibold font-heading text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
          {label}
        </p>
        {hint && (
          <p className="text-xs text-[var(--color-text-secondary)] font-body">
            {hint}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.ui?.theme || 'light')
  const preferences = useSelector((state) => state.ui?.preferences)
  const isDarkMode = theme === 'dark'

  // Local form state initialized from Redux Single Source of Truth
  const [formData, setFormData] = useState({
    defaultLanding: preferences?.defaultLanding || '/dashboard',
    defaultPageSize: preferences?.defaultPageSize || 25,
    currency: preferences?.currency || 'EGP',
    toastPosition: preferences?.toastPosition || 'top-right',
    toastDuration: preferences?.toastDuration || 3000,
  })

  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const handleSelect = (name, val) => {
    const parsedValue =
      name === 'defaultPageSize' || name === 'toastDuration'
        ? Number(val)
        : val
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }))
    dispatch(updatePreferences({ [name]: parsedValue }))
  }

  const handleSaveAll = () => {
    dispatch(updatePreferences(formData))
    toast.success('Dashboard preferences saved successfully!')
  }

  const handleConfirmReset = () => {
    dispatch(resetPreferences())
    setFormData({
      defaultLanding: '/dashboard',
      defaultPageSize: 25,
      currency: 'EGP',
      toastPosition: 'top-right',
      toastDuration: 3000,
    })
    setIsResetModalOpen(false)
    toast.info('Preferences reset to standard defaults.')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[var(--color-dark-bg-card)] p-6 sm:p-8 rounded-3xl border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-dark)] text-white dark:bg-[var(--color-primary-medium)] flex items-center justify-center shrink-0 shadow-sm border border-[var(--color-primary-medium)]/30">
            <SettingsIcon className="w-6 h-6 text-[var(--color-text-gold)]" />
          </div>
          <div className="space-y-1">
            <Badge variant="primary" size="sm">
              PREFERENCES
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] tracking-tight">
              Dashboard Settings
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] font-body">
              Configure interface themes, landing views, table densities, and alerts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsResetModalOpen(true)}
            title="Reset to initial defaults"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Defaults
          </Button>
          <Button variant="primary" onClick={handleSaveAll}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Appearance & Navigation */}
        <SectionCard
          icon={Sliders}
          title="Appearance & Navigation"
          description="Control theme mode and configure where the dashboard opens."
        >
          <SettingRow
            isFirst
            label="Dark Mode Theme"
            hint="Switch between dark forest mode and light card mode."
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-[var(--color-text-gold)]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <Toggle
                checked={isDarkMode}
                onChange={() => dispatch(toggleTheme())}
                label="Toggle dark mode theme"
              />
            </div>
          </SettingRow>

          <SettingRow
            label="Default Landing Page"
            hint="The primary screen displayed when accessing the root dashboard."
          >
            <Dropdown
              value={formData.defaultLanding}
              onChange={(val) => handleSelect('defaultLanding', val)}
              options={[
                { value: '/dashboard', label: 'Dashboard Overview' },
                { value: '/dashboard/products', label: 'Products Catalog' },
                { value: '/dashboard/users', label: 'Users & Administrators' },
                { value: '/dashboard/orders', label: 'Orders Management' },
              ]}
              ariaLabel="Default Landing Page"
            />
          </SettingRow>
        </SectionCard>

        {/* Catalog & Data Preferences */}
        <SectionCard
          icon={LayoutGrid}
          title="Catalog & Data Density"
          description="Customize table pagination limits and default pricing display."
        >
          <SettingRow
            isFirst
            label="Default Rows Per Page"
            hint="Initial pagination record count for directory tables."
          >
            <Dropdown
              value={formData.defaultPageSize}
              onChange={(val) => handleSelect('defaultPageSize', val)}
              options={[
                { value: 10, label: '10 items per page' },
                { value: 25, label: '25 items per page' },
                { value: 50, label: '50 items per page' },
                { value: 100, label: '100 items per page' },
              ]}
              ariaLabel="Default Rows Per Page"
            />
          </SettingRow>

          <SettingRow
            label="Catalog Currency"
            hint="Default currency symbol used for pricing formats."
          >
            <Dropdown
              value={formData.currency}
              onChange={(val) => handleSelect('currency', val)}
              options={[
                { value: 'EGP', label: 'EGP (E£ - Egyptian Pound)' },
                { value: 'USD', label: 'USD ($ - US Dollar)' },
                { value: 'EUR', label: 'EUR (€ - Euro)' },
                { value: 'GBP', label: 'GBP (£ - British Pound)' },
              ]}
              ariaLabel="Catalog Currency"
            />
          </SettingRow>
        </SectionCard>

        {/* Notifications & Toast Alerts */}
        <SectionCard
          icon={Bell}
          title="Alerts & Toast Feedback"
          description="Control where on screen system notification popups appear and their duration."
        >
          <SettingRow
            isFirst
            label="Toast Popup Placement"
            hint="Position on the screen where confirmation and error toasts appear."
          >
            <Dropdown
              value={formData.toastPosition}
              onChange={(val) => handleSelect('toastPosition', val)}
              options={[
                { value: 'top-right', label: 'Top Right (Standard)' },
                { value: 'top-center', label: 'Top Center' },
                { value: 'bottom-right', label: 'Bottom Right' },
                { value: 'bottom-center', label: 'Bottom Center' },
              ]}
              ariaLabel="Toast Popup Placement"
            />
          </SettingRow>

          <SettingRow
            label="Toast Dismissal Timer"
            hint="How many seconds popup messages remain visible before automatically closing."
          >
            <Dropdown
              value={formData.toastDuration}
              onChange={(val) => handleSelect('toastDuration', val)}
              options={[
                { value: 2000, label: '2 Seconds (Fast)' },
                { value: 3000, label: '3 Seconds (Standard)' },
                { value: 5000, label: '5 Seconds (Extended)' },
              ]}
              ariaLabel="Toast Dismissal Timer"
            />
          </SettingRow>
        </SectionCard>
      </div>

      {/* Confirmation Modal for Resetting Defaults */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset All Preferences"
        maxWidth="max-w-md"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmReset}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Confirm Reset
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <p className="text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
            Are you sure you want to reset all dashboard settings to their standard defaults?
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] font-body leading-relaxed">
            This will reset your default landing page, catalog table page sizes, currency format, and notification positions.
          </p>
        </div>
      </Modal>
    </div>
  )
}
