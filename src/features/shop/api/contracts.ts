import type { Pagination } from '@/shared/api/contracts'

/**
 * Public catalog API contracts.
 *
 * These types mirror the backend product/brand handlers exactly
 * (internal/product/domain/dto.go and internal/brand/domain/dto.go).
 * Field names, optionality, and JSON envelopes match the Go `json:"..."`
 * struct tags so the storefront can consume responses without translation.
 */

/** Reference to a brand embedded in product detail responses. */
export type BrandRef = {
  id: string
  slug: string
  name: string
}

/** Reference to a product category. */
export type CategoryRef = {
  id: string
  slug: string
  name: string
}

/** Reference to a style tag. */
export type StyleTagRef = {
  id: string
  slug: string
  name: string
}

/** A purchasable variant of a product (size/color/SKU). */
export type ProductVariant = {
  id: string
  sku: string
  size: string
  color: string
  /** Absent when the variant has no color swatch. */
  color_hex?: string
  /** Catalog prices are plain numbers; cart price strings are defined in account contracts. */
  price: number
  stock_qty: number
  is_active: boolean
  /** Absent when the variant is not linked to a specific image. */
  image_id?: string
}

/** A product image. */
export type ProductImage = {
  id: string
  url: string
  /** Absent when no alt text was provided. */
  alt_text?: string
  sort_order: number
  is_primary: boolean
}

/** Compact product representation returned by catalog listing. */
export type ProductSummary = {
  id: string
  slug: string
  name: string
  brand_slug: string
  brand_name: string
  currency: string
  min_price: number
  max_price: number
  in_stock: boolean
  /** Absent when the product has no primary image. */
  primary_image?: string
}

/** Full product representation returned by product detail. */
export type ProductDetail = {
  id: string
  slug: string
  name: string
  /** Absent when the product has no description. */
  description?: string
  status: string
  currency: string
  brand: BrandRef
  category: CategoryRef
  style_tags: StyleTagRef[]
  variants: ProductVariant[]
  images: ProductImage[]
  created_at: string
}

/**
 * Brand representation for both list and detail.
 * The backend returns no ratings, followers, founded year, styles, or categories.
 */
export type BrandSummary = {
  id: string
  slug: string
  name: string
  /** Absent when the brand has no story. */
  story?: string
  /** Absent when the brand has no logo. */
  logo_url?: string
  /** Absent when the brand has no banner. */
  banner_url?: string
  /** Absent when the brand has no website. */
  website_url?: string
  status: string
  created_at: string
}

/** A publicly visible brand address. */
export type BrandAddress = {
  id: string
  label: string
  address_line: string
  ward: string
  district: string
  city: string
  country: string
  /** Absent when no postal code is recorded. */
  postal_code?: string
  /** Absent when no phone is recorded. */
  phone?: string
  /** Absent when no coordinates are recorded. */
  latitude?: number
  /** Absent when no coordinates are recorded. */
  longitude?: number
  is_primary: boolean
  is_public: boolean
}

/** Response envelope for product listing. */
export type ProductListResponse = {
  items: ProductSummary[]
  pagination: Pagination
  /** Present only when the search produced spelling/term suggestions. */
  suggestions?: string[]
}

/** Response envelope for brand listing. */
export type BrandListResponse = {
  items: BrandSummary[]
  pagination: Pagination
}

/** Response envelope for brand detail. */
export type BrandDetailResponse = {
  brand: BrandSummary
  addresses: BrandAddress[]
}

/** Query parameters accepted by the product listing endpoint. */
export type ProductListQuery = {
  q?: string
  category?: string
  brand?: string
  style?: string[]
  size?: string[]
  color?: string[]
  price_min?: number
  price_max?: number
  sort?: string
  page?: number
  limit?: number
}

/** Query parameters accepted by the brand listing endpoint. */
export type BrandListQuery = {
  q?: string
  sort?: string
  page?: number
  limit?: number
}
