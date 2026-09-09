/**
 * Official category definitions for Nexis Tech:
 * Electronics & Hardware Store Only.
 */

export const ALLOWED_CATEGORIES = ['electronics', 'hardware']

export const ALLOWED_SUBCATEGORIES = [
  'laptops',
  'smartphones',
  'tablets',
  'audio',
  'gaming',
  'wearables',
  'cameras',
  'accessories',
]

/**
 * Validates whether a product belongs to Nexis Tech's categories.
 *
 * @param {object} product
 * @returns {boolean}
 */
export function isElectronicsOrHardwareProduct(product) {
  if (!product || typeof product !== 'object') return false

  const category = (product.category || '').trim().toLowerCase()
  const subcategory = (product.subcategory || '').trim().toLowerCase()

  // Match official categories or subcategories
  if (
    ALLOWED_CATEGORIES.includes(category) ||
    ALLOWED_CATEGORIES.includes(subcategory) ||
    ALLOWED_SUBCATEGORIES.includes(subcategory) ||
    ALLOWED_SUBCATEGORIES.includes(category)
  ) {
    return true
  }

  // Match tags if specified
  if (Array.isArray(product.tags)) {
    return product.tags.some((tag) => {
      const t = String(tag).trim().toLowerCase()
      return ALLOWED_CATEGORIES.includes(t) || ALLOWED_SUBCATEGORIES.includes(t)
    })
  }

  return false
}
