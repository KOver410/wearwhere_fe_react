import { apiRequest } from '@/shared/api/apiClient'

import type {
  BrandDetailResponse,
  BrandListQuery,
  BrandListResponse,
  CategoryRef,
  ProductDetail,
  ProductListQuery,
  ProductListResponse,
  StyleTagRef,
} from './contracts'

/**
 * Public catalog API client.
 *
 * Every endpoint here is unauthenticated, so requests pass `skipAuth: true`
 * to avoid attaching tokens or triggering refresh on 401. Paths are relative;
 * the shared apiClient prepends the `/api/v1` base URL.
 */

const GET_PUBLIC = { method: 'GET', skipAuth: true } as const

/** Append a single scalar param when it has a non-empty value. */
function appendScalar(
  params: URLSearchParams,
  key: string,
  value: string | number | undefined,
): void {
  if (value === undefined) {
    return
  }
  if (typeof value === 'string' && value.length === 0) {
    return
  }
  params.append(key, String(value))
}

/** Append a repeated param (one key per non-empty entry). */
function appendRepeated(
  params: URLSearchParams,
  key: string,
  values: string[] | undefined,
): void {
  if (!values) {
    return
  }
  for (const value of values) {
    if (value.length > 0) {
      params.append(key, value)
    }
  }
}

/** Build a `path?query` string, omitting the `?` when no params are present. */
function withQuery(path: string, params: URLSearchParams): string {
  const search = params.toString()
  return search ? `${path}?${search}` : path
}

/** GET /products — list catalog products with filters, sorting, and pagination. */
export function listProducts(query: ProductListQuery): Promise<ProductListResponse> {
  const params = new URLSearchParams()
  appendScalar(params, 'q', query.q)
  appendScalar(params, 'category', query.category)
  appendScalar(params, 'brand', query.brand)
  appendRepeated(params, 'style', query.style)
  appendRepeated(params, 'size', query.size)
  appendRepeated(params, 'color', query.color)
  appendScalar(params, 'price_min', query.price_min)
  appendScalar(params, 'price_max', query.price_max)
  appendScalar(params, 'sort', query.sort)
  appendScalar(params, 'page', query.page)
  appendScalar(params, 'limit', query.limit)

  return apiRequest<ProductListResponse>(withQuery('/products', params), GET_PUBLIC)
}

/** GET /products/by-id/{id} — fetch a single product detail by id. */
export function getProductById(id: string): Promise<{ product: ProductDetail }> {
  return apiRequest<{ product: ProductDetail }>(
    `/products/by-id/${encodeURIComponent(id)}`,
    GET_PUBLIC,
  )
}

/** GET /categories — list all product categories. */
export function listCategories(): Promise<{ items: CategoryRef[] }> {
  return apiRequest<{ items: CategoryRef[] }>('/categories', GET_PUBLIC)
}

/** GET /style-tags — list all style tags. */
export function listStyleTags(): Promise<{ items: StyleTagRef[] }> {
  return apiRequest<{ items: StyleTagRef[] }>('/style-tags', GET_PUBLIC)
}

/** GET /brands — list brands with search, sorting, and pagination. */
export function listBrands(query: BrandListQuery): Promise<BrandListResponse> {
  const params = new URLSearchParams()
  appendScalar(params, 'q', query.q)
  appendScalar(params, 'sort', query.sort)
  appendScalar(params, 'page', query.page)
  appendScalar(params, 'limit', query.limit)

  return apiRequest<BrandListResponse>(withQuery('/brands', params), GET_PUBLIC)
}

/** GET /brands/{slug} — fetch a brand and its public addresses by slug. */
export function getBrand(slug: string): Promise<BrandDetailResponse> {
  return apiRequest<BrandDetailResponse>(
    `/brands/${encodeURIComponent(slug)}`,
    GET_PUBLIC,
  )
}
