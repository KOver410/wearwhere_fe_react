import { ApiError } from '@/shared/api/contracts'

/**
 * OOTD (outfit-of-the-day) social API contracts.
 *
 * Types mirror the backend OOTD handler/DTOs exactly
 * (internal/ootd/domain/dto.go: PostResponse, ProductTagResponse, Pagination),
 * so field names and optionality match the Go `json:"..."` struct tags. The
 * list endpoints wrap items in `{ items, pagination }`.
 */

/** A product tagged in an OOTD post (ProductTagResponse). */
export type OOTDProductTag = {
  product_id: string
  slug: string
  name: string
}

/**
 * A single OOTD post (PostResponse). `caption` is omitted by the backend when
 * empty; it is normalized to `null` here. `photo_urls` and `tags` are always
 * present (possibly empty arrays).
 */
export type OOTDPost = {
  id: string
  author_name: string
  caption: string | null
  photo_urls: string[]
  like_count: number
  comment_count: number
  liked_by_me: boolean
  tags: OOTDProductTag[]
  created_at: string
}

/** A single comment on a post (CommentResponse). */
export type OOTDComment = {
  id: string
  author_name: string
  body: string
  created_at: string
}

/** Pagination envelope (Pagination). */
export type OOTDPagination = {
  page: number
  limit: number
  total: number
  total_pages: number
}

/** A paginated list of OOTD posts (`{ items, pagination }`). */
export type OOTDFeed = {
  items: OOTDPost[]
  pagination: OOTDPagination
}

/** A paginated list of comments (`{ items, pagination }`). */
export type OOTDCommentList = {
  items: OOTDComment[]
  pagination: OOTDPagination
}

function invalidContractError(code: string, message: string): ApiError {
  return new ApiError(500, code, message)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string')
}

export function isOOTDProductTag(value: unknown): value is OOTDProductTag {
  return (
    isRecord(value) &&
    typeof value.product_id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.name === 'string'
  )
}

export function isOOTDPost(value: unknown): value is OOTDPost {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    value.id.trim().length > 0 &&
    typeof value.author_name === 'string' &&
    // caption is omitempty on the backend: absent, null, or a string.
    (value.caption === undefined || value.caption === null || typeof value.caption === 'string') &&
    isStringArray(value.photo_urls) &&
    typeof value.like_count === 'number' &&
    typeof value.comment_count === 'number' &&
    typeof value.liked_by_me === 'boolean' &&
    Array.isArray(value.tags) &&
    value.tags.every(isOOTDProductTag) &&
    typeof value.created_at === 'string'
  )
}

/** Narrow a raw post to `OOTDPost`, normalizing an absent caption to `null`. */
function normalizePost(value: OOTDPost): OOTDPost {
  return {
    ...value,
    caption: value.caption ?? null,
  }
}

export function isOOTDPagination(value: unknown): value is OOTDPagination {
  return (
    isRecord(value) &&
    typeof value.page === 'number' &&
    typeof value.limit === 'number' &&
    typeof value.total === 'number' &&
    typeof value.total_pages === 'number'
  )
}

export function assertOOTDFeed(value: unknown): OOTDFeed {
  if (
    !isRecord(value) ||
    !Array.isArray(value.items) ||
    !value.items.every(isOOTDPost) ||
    !isOOTDPagination(value.pagination)
  ) {
    throw invalidContractError('INVALID_OOTD_FEED', 'Invalid OOTD feed response')
  }

  return {
    items: value.items.map(normalizePost),
    pagination: value.pagination,
  }
}

export function assertOOTDPost(value: unknown): OOTDPost {
  if (!isOOTDPost(value)) {
    throw invalidContractError('INVALID_OOTD_POST', 'Invalid OOTD post response')
  }

  return normalizePost(value)
}

export function isOOTDComment(value: unknown): value is OOTDComment {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    value.id.trim().length > 0 &&
    typeof value.author_name === 'string' &&
    typeof value.body === 'string' &&
    typeof value.created_at === 'string'
  )
}

export function assertOOTDCommentList(value: unknown): OOTDCommentList {
  if (
    !isRecord(value) ||
    !Array.isArray(value.items) ||
    !value.items.every(isOOTDComment) ||
    !isOOTDPagination(value.pagination)
  ) {
    throw invalidContractError('INVALID_OOTD_COMMENTS', 'Invalid OOTD comments response')
  }

  return {
    items: value.items as OOTDComment[],
    pagination: value.pagination,
  }
}

/** Narrow a `{ id }` creation envelope (Create/AddComment return `{ id }`). */
export function assertCreatedId(value: unknown): { id: string } {
  if (!isRecord(value) || typeof value.id !== 'string' || value.id.trim().length === 0) {
    throw invalidContractError('INVALID_CREATED_RESPONSE', 'Invalid create response')
  }

  return { id: value.id }
}
