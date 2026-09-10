/**
 * Shared Formatting Utilities for Admin Dashboard
 */

export const formatDate = (value, includeTime = false) => {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return date.toLocaleDateString('en-GB', options)
}

export const formatPrice = (amount) => {
  const num = Number(amount) || 0
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const formatCurrency = (amount, currency = 'EGP') => {
  return `${formatPrice(amount)} ${currency}`
}

