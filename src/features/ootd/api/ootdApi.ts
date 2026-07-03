import { apiRequest } from '@/shared/api/apiClient'

import {
  assertCreatedId,
  assertOOTDCommentList,
  assertOOTDFeed,
  assertOOTDPost,
  type OOTDCommentList,
  type OOTDFeed,
  type OOTDPost,
} from './contracts'

/**
 * OOTD (outfit-of-the-day) social API. Paths are relative; the shared apiClient
 * prepends the `/api/v1` base URL. Read endpoints are public but keep the
 * default auth behavior so a logged-in caller's `liked_by_me` is populated;
 * write endpoints (like, comment, create) require the customer's token.
 */

export type OOTDListQuery = {
  page?: number
  limit?: number
}

function buildQuery(query: OOTDListQuery): string {
  const params = new URLSearchParams()
  if (query.page !== undefined) {
    params.append('page', String(query.page))
  }
  if (query.limit !== undefined) {
    params.append('limit', String(query.limit))
  }
  const search = params.toString()
  return search ? `?${search}` : ''
}

/** GET /ootd — the public paginated OOTD feed. */
export async function listFeed(query: OOTDListQuery = {}): Promise<OOTDFeed> {
  const response = await apiRequest<unknown>(`/ootd${buildQuery(query)}`, { method: 'GET' })
  return assertOOTDFeed(response)
}

/**
 * GET /users/{userId}/ootd — a paginated list of the given user's OOTD posts.
 * Used to render the authenticated customer's own posts on the account pages.
 */
export async function listUserOOTD(userId: string, query: OOTDListQuery = {}): Promise<OOTDFeed> {
  const path = `/users/${encodeURIComponent(userId)}/ootd${buildQuery(query)}`
  const response = await apiRequest<unknown>(path, { method: 'GET' })
  return assertOOTDFeed(response)
}

/** GET /ootd/{id} — full detail for a single post. */
export async function getPost(id: string): Promise<OOTDPost> {
  const response = await apiRequest<unknown>(`/ootd/${encodeURIComponent(id)}`, { method: 'GET' })
  return assertOOTDPost(response)
}

/** GET /ootd/{id}/comments — a paginated list of a post's comments. */
export async function listComments(id: string, query: OOTDListQuery = {}): Promise<OOTDCommentList> {
  const path = `/ootd/${encodeURIComponent(id)}/comments${buildQuery(query)}`
  const response = await apiRequest<unknown>(path, { method: 'GET' })
  return assertOOTDCommentList(response)
}

/** POST /ootd/{id}/like — like a post (idempotent on the backend). */
export async function likePost(id: string): Promise<void> {
  await apiRequest<unknown>(`/ootd/${encodeURIComponent(id)}/like`, { method: 'POST' })
}

/** DELETE /ootd/{id}/like — remove a like. */
export async function unlikePost(id: string): Promise<void> {
  await apiRequest<unknown>(`/ootd/${encodeURIComponent(id)}/like`, { method: 'DELETE' })
}

/** POST /ootd/{id}/comments — add a comment; returns the new comment id. */
export async function addComment(id: string, body: string): Promise<{ id: string }> {
  const response = await apiRequest<unknown>(`/ootd/${encodeURIComponent(id)}/comments`, {
    method: 'POST',
    body: { body },
  })
  return assertCreatedId(response)
}

export type CreateOOTDInput = {
  photos: File[]
  caption?: string
  productIds?: string[]
}

/**
 * POST /ootd — create a post from a multipart form (`photos`, `caption`,
 * repeated `product_ids`). Returns the new post id.
 */
export async function createPost(input: CreateOOTDInput): Promise<{ id: string }> {
  const form = new FormData()
  for (const photo of input.photos) {
    form.append('photos', photo)
  }
  if (input.caption !== undefined) {
    form.append('caption', input.caption)
  }
  for (const productId of input.productIds ?? []) {
    form.append('product_ids', productId)
  }

  const response = await apiRequest<unknown>('/ootd', { method: 'POST', body: form })
  return assertCreatedId(response)
}
