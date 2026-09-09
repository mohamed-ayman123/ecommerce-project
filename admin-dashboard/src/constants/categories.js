/**
 * Strict category definitions and validation for Nexis Tech:
 * Electronics & Hardware Products Only.
 */

export const ALLOWED_CATEGORIES = ['electronics', 'hardware']

export const ALLOWED_SUBCATEGORIES = [
  'laptops',
  'smartphones',
  'tablets',
  'audio',
  'gaming',
  'wearables',
  'monitors',
  'accessories',
  'cameras',
  'television',
  'tv',
  'computers',
  'pc',
  'macbook',
  'phones',
  'hardware',
]

// Unrelated categories from other shared-API projects that must always be filtered out
export const EXCLUDED_CATEGORIES = [
  'car',
  'cars',
  'vehicle',
  'vehicles',
  'clothing',
  'clothes',
  'fashion',
  'shoes',
  'apparel',
  'beauty',
  'food',
  'furniture',
  'real estate',
  'books',
  'toys',
]

/**
 * Validates whether a product strictly belongs to Electronics & Hardware.
 * Rejects any unrelated third-party seeded items (e.g. cars, clothes).
 *
 * @param {object} product
 * @returns {boolean}
 */
export function isElectronicsOrHardwareProduct(product) {
  if (!product || typeof product !== 'object') return false

  const category = (product.category || '').trim().toLowerCase()
  const subcategory = (product.subcategory || '').trim().toLowerCase()

  // 1. Explicit exclusion check
  if (
    EXCLUDED_CATEGORIES.some(
      (exc) =>
        category === exc ||
        category.includes(exc) ||
        subcategory === exc ||
        subcategory.includes(exc)
    )
  ) {
    return false
  }

  // 2. Direct match on main allowed categories
  if (ALLOWED_CATEGORIES.includes(category)) {
    return true
  }

  // 3. Match on allowed subcategories
  if (
    ALLOWED_SUBCATEGORIES.includes(subcategory) ||
    ALLOWED_SUBCATEGORIES.includes(category)
  ) {
    return true
  }

  // 4. Tag inspection for electronics keywords
  if (Array.isArray(product.tags)) {
    const hasElectronicsTag = product.tags.some((tag) => {
      const t = String(tag).trim().toLowerCase()
      return ALLOWED_CATEGORIES.includes(t) || ALLOWED_SUBCATEGORIES.includes(t)
    })
    if (hasElectronicsTag) return true
  }

  return false
}
