import { apiRequest } from '@/shared/api/apiClient'

import { assertOOTDFeed, type OOTDFeed } from './contracts'

/**
 * Public OOTD read API. Paths are relative; the shared apiClient prepends the
 * `/api/v1` base URL. These are public read endpoints, but requests keep the
 * default auth behavior so a logged-in caller's `liked_by_me` is populated.
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

/**
 * GET /users/{userId}/ootd — a paginated list of the given user's OOTD posts.
 * Used to render the authenticated customer's own posts on the account pages.
 */
export async function listUserOOTD(userId: string, query: OOTDListQuery = {}): Promise<OOTDFeed> {
  const path = `/users/${encodeURIComponent(userId)}/ootd${buildQuery(query)}`
  const response = await apiRequest<unknown>(path, { method: 'GET' })
  return assertOOTDFeed(response)
}
