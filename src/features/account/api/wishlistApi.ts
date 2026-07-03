import { apiRequest } from '@/shared/api/apiClient'

import type { Pagination } from '@/shared/api/contracts'

/**
 * Authenticated wishlist API client.
 *
 * These endpoints live under `/me/...` and require the customer's Bearer token,
 * so requests deliberately omit `skipAuth` to let the shared apiClient attach
 * the token and run its 401/refresh behavior. Paths are relative; the apiClient
 * prepends the `/api/v1` base URL.
 *
 * Types mirror the backend wishlist handler/DTOs exactly
 * (internal/wishlist/domain/dto.go), so field names, optionality, and the JSON
 * envelopes match the Go `json:"..."` struct tags without translation.
 */

/** Brand reference embedded in a wishlist item. */
export type WishlistItemBrand = {
  id: string
  slug: string
  name: string
}

/** A single wishlist entry as returned by the backend. */
export type WishlistItem = {
  product_id: string
  product_slug: string
  product_name: string
  /** Absent when the product has no primary image. */
  primary_image_url?: string
  /** Absent when the product has no priced, active variant. */
  min_price?: number
  brand: WishlistItemBrand
  added_at: string
}

/** Response envelope for the wishlist listing. */
export type WishlistListResponse = {
  items: WishlistItem[]
  pagination: Pagination
}

/** Response shape for the contains check: product id -> membership flag. */
export type WishlistContainsResponse = {
  in_wishlist: Record<string, boolean>
}

/** GET /me/wishlist — list the customer's wishlist with pagination. */
export function listWishlist(page: number, limit: number): Promise<WishlistListResponse> {
  const params = new URLSearchParams()
  params.append('page', String(page))
  params.append('limit', String(limit))

  return apiRequest<WishlistListResponse>(`/me/wishlist?${params.toString()}`, {
    method: 'GET',
  })
}

/**
 * GET /me/wishlist/contains — check which of the given products are in the
 * wishlist. Sends one repeated `product_ids` key per id. Returns an empty map
 * without a request when no ids are supplied (the backend requires >= 1).
 */
export function getWishlistContains(
  productIds: string[],
): Promise<WishlistContainsResponse> {
  if (productIds.length === 0) {
    return Promise.resolve({ in_wishlist: {} })
  }

  const params = new URLSearchParams()
  for (const id of productIds) {
    params.append('product_ids', id)
  }

  return apiRequest<WishlistContainsResponse>(
    `/me/wishlist/contains?${params.toString()}`,
    { method: 'GET' },
  )
}

/** POST /me/wishlist/{product_id} — add a product to the wishlist. */
export function addWishlistProduct(productId: string): Promise<void> {
  return apiRequest<void>(`/me/wishlist/${encodeURIComponent(productId)}`, {
    method: 'POST',
  })
}

/** DELETE /me/wishlist/{product_id} — remove a product from the wishlist. */
export function removeWishlistProduct(productId: string): Promise<void> {
  return apiRequest<void>(`/me/wishlist/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
  })
}
