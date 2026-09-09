/**
 * Builds fast lookup sets for all Nexis Tech products.
 * Derived directly from live backend products in Redux state (state.products.items).
 *
 * @param {Array} reduxProducts - Live products from state.products.items
 * @returns {{ ids: Set<string>, names: Set<string> }}
 */
export function buildStoreCatalogLookup(reduxProducts = []) {
  const ids = new Set()
  const names = new Set()

  if (Array.isArray(reduxProducts)) {
    reduxProducts.forEach((p) => {
      const id = String(p._id || p.id || '')
      if (id) ids.add(id)
      const name = p.name?.trim().toLowerCase()
      if (name) names.add(name)
    })
  }

  return { ids, names }
}

/**
 * Validates whether a line item belongs to Nexis Tech's catalog.
 *
 * @param {object} item - Item object { product, name, price, quantity, ... }
 * @param {{ ids: Set<string>, names: Set<string> }} lookup
 * @returns {boolean}
 */
export function isStoreItem(item, lookup) {
  if (!item || !lookup) return false
  const productId = String(item.product?._id || item.product || '')
  const name = (item.name || item.title || '').trim().toLowerCase()
  return lookup.ids.has(productId) || lookup.names.has(name)
}

/**
 * Determines whether an order belongs to Nexis Tech.
 *
 * @param {object} order
 * @param {{ ids: Set<string>, names: Set<string> }} lookup
 * @returns {boolean}
 */
export function isStoreOrder(order, lookup) {
  if (!order || !Array.isArray(order.items) || order.items.length === 0) return false
  return order.items.some((item) => isStoreItem(item, lookup))
}

/**
 * Filters an order's items to only include Nexis Tech products,
 * recalculating subtotal and total to reflect store revenue accurately.
 *
 * @param {object} order
 * @param {{ ids: Set<string>, names: Set<string> }} lookup
 * @returns {object}
 */
export function filterStoreOrder(order, lookup) {
  if (!order) return order
  const storeItems = (order.items || []).filter((item) => isStoreItem(item, lookup))
  const subtotal = storeItems.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  )
  const shippingFee = Number(order.shippingFee) || 0
  const tax = Number(order.tax) || 0
  const discount = Number(order.discount) || 0
  const totalPrice = Math.max(0, subtotal + shippingFee + tax - discount)

  return {
    ...order,
    items: storeItems,
    subtotal,
    totalPrice,
    total: totalPrice,
  }
}

/**
 * Determines whether a cart belongs to Nexis Tech.
 *
 * @param {object} cart
 * @param {{ ids: Set<string>, names: Set<string> }} lookup
 * @returns {boolean}
 */
export function isStoreCart(cart, lookup) {
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) return false
  return cart.items.some((item) => isStoreItem(item, lookup))
}

/**
 * Filters a cart's items to only include Nexis Tech products,
 * recalculating subtotal and item count.
 *
 * @param {object} cart
 * @param {{ ids: Set<string>, names: Set<string> }} lookup
 * @returns {object}
 */
export function filterStoreCart(cart, lookup) {
  if (!cart) return cart
  const storeItems = (cart.items || []).filter((item) => isStoreItem(item, lookup))
  const subtotal = storeItems.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  )
  const itemCount = storeItems.reduce(
    (sum, it) => sum + (Number(it.quantity) || 1),
    0
  )

  return {
    ...cart,
    items: storeItems,
    subtotal,
    itemCount,
  }
}
