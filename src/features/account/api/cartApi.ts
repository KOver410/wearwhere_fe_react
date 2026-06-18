import { apiRequest } from '@/shared/api/apiClient'

/**
 * Authenticated shopping cart API client.
 *
 * These endpoints live under `/me/cart...` and require the customer's Bearer
 * token, so requests deliberately omit `skipAuth` to let the shared apiClient
 * attach the token and run its 401/refresh behavior. Paths are relative; the
 * apiClient prepends the `/api/v1` base URL.
 *
 * Types mirror the backend cart handler/DTOs exactly
 * (internal/cart/domain/dto.go and internal/cart/handler/handler.go), so field
 * names, optionality, and JSON envelopes match the Go `json:"..."` struct tags
 * without translation. In particular every money value is a STRING; the
 * frontend never recomputes cart totals and renders the backend values as-is.
 */

/** Brand reference embedded in a cart item. */
export type CartItemBrand = {
  id: string
  slug: string
  name: string
}

/** Product reference embedded in a cart item. */
export type CartItemProduct = {
  id: string
  slug: string
  name: string
  /** Absent when the product has no primary image. */
  primary_image_url?: string
}

/** Variant reference embedded in a cart item. */
export type CartItemVariant = {
  id: string
  sku: string
  size: string
  color: string
  /** Absent when the variant has no color swatch. */
  color_hex?: string
  stock_qty: number
}

/** A single cart line as returned by the backend. Money fields are strings. */
export type CartItem = {
  id: string
  qty: number
  price_snapshot: string
  current_price: string
  price_changed: boolean
  subtotal_snapshot: string
  subtotal_current: string
  currency: string
  unavailable: boolean
  /** Present only when the line is unavailable and a reason was supplied. */
  unavailable_reason?: string
  added_at: string
  variant: CartItemVariant
  product: CartItemProduct
  brand: CartItemBrand
}

/** Cart-level rollup. Money fields are strings; the frontend renders them. */
export type CartSummary = {
  item_count: number
  total_qty: number
  total_snapshot: string
  total_current: string
  currency: string
  has_price_changes: boolean
  has_unavailable: boolean
}

/** Response envelope for the cart listing. */
export type CartResponse = {
  items: CartItem[]
  summary: CartSummary
}

/** Minimal mutation result returned by add/update. */
export type CartMutationResult = {
  id: string
  qty: number
}

/** GET /me/cart — fetch the authenticated customer's cart. */
export function getCart(): Promise<CartResponse> {
  return apiRequest<CartResponse>('/me/cart', { method: 'GET' })
}

/** POST /me/cart/items — add a variant to the cart. Body uses variant_id/qty. */
export function addCartItem(
  variantId: string,
  qty: number,
): Promise<CartMutationResult> {
  return apiRequest<CartMutationResult>('/me/cart/items', {
    method: 'POST',
    body: { variant_id: variantId, qty },
  })
}

/** PATCH /me/cart/items/{item_id} — change a line's quantity. Body uses qty. */
export function updateCartItem(
  itemId: string,
  qty: number,
): Promise<CartMutationResult> {
  return apiRequest<CartMutationResult>(
    `/me/cart/items/${encodeURIComponent(itemId)}`,
    { method: 'PATCH', body: { qty } },
  )
}

/** DELETE /me/cart/items/{item_id} — remove a single line. */
export function removeCartItem(itemId: string): Promise<void> {
  return apiRequest<void>(`/me/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
  })
}

/** DELETE /me/cart — empty the entire cart. */
export function clearCart(): Promise<void> {
  return apiRequest<void>('/me/cart', { method: 'DELETE' })
}
