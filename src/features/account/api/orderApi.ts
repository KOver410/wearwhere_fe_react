import { apiRequest } from '@/shared/api/apiClient'

/**
 * Authenticated checkout and order API client.
 *
 * These endpoints live under `/me/checkout...` and `/me/orders...` and require
 * the customer's Bearer token, so requests deliberately omit `skipAuth` to let
 * the shared apiClient attach the token and run its 401/refresh behavior. Paths
 * are relative; the apiClient prepends the `/api/v1` base URL.
 *
 * Types mirror the backend order handler/DTOs exactly
 * (internal/order/domain/dto.go, internal/order/domain/order.go,
 * internal/order/domain/enums.go and internal/order/handler/handler.go), so
 * field names, optionality, and the JSON envelopes match the Go `json:"..."`
 * struct tags without translation. In particular every money value is an
 * integer VND amount named `*_vnd`; the frontend never recomputes totals and
 * renders the backend values as-is.
 */

/** Payment method accepted by the backend (PaymentMethod enum). */
export type PaymentMethod = 'cod' | 'payos'

/** Payment status as returned by the backend (PaymentStatus enum). */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired'

/** Root order status (OrderStatus enum). */
export type OrderStatus = 'pending_payment' | 'processing' | 'cancelled' | 'completed'

/** Per-brand sub-order status (SubOrderStatus enum). */
export type SubOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

/** Brand reference embedded in checkout/order responses (BrandRef). */
export type BrandRef = {
  id: string
  slug: string
  name: string
}

/** Snapshot of the shipping address stored on the order (ShippingAddress). */
export type ShippingAddress = {
  recipient: string
  phone: string
  line1: string
  ward: string
  district: string
  city: string
}

/** A single line in the checkout preview (CheckoutPreviewItem). */
export type CheckoutPreviewItem = {
  variant_id: string
  product_id: string
  product_name: string
  variant_label: string
  /** Null when the product has no primary image. */
  image_url: string | null
  qty: number
  unit_price_vnd: number
  line_total_vnd: number
  available_qty: number
}

/** A per-brand group within the checkout preview (CheckoutPreviewSubOrder). */
export type CheckoutPreviewSubOrder = {
  brand: BrandRef
  items: CheckoutPreviewItem[]
  subtotal_vnd: number
  shipping_fee_vnd: number
  total_vnd: number
}

/**
 * Read-only checkout preview returned directly by the backend
 * (CheckoutPreviewResp). `address` is omitted when not resolvable.
 */
export type CheckoutPreview = {
  cart_empty: boolean
  /** Omitted by the backend when the address could not be resolved. */
  address?: ShippingAddress
  sub_orders: CheckoutPreviewSubOrder[]
  subtotal_vnd: number
  shipping_total_vnd: number
  grand_total_vnd: number
  min_order_value_vnd: number
  meets_min_order: boolean
  warnings: string[]
}

/** Request body for placing an order (PlaceOrderReq). */
export type PlaceOrderRequest = {
  address_id: string
  payment_method: PaymentMethod
  /** Optional customer note (max 500 chars on the backend). */
  notes?: string
}

/** Payment detail returned alongside a placed order (PaymentResp). */
export type Payment = {
  id: string
  method: PaymentMethod
  status: PaymentStatus
  amount_vnd: number
  /** Present for payos checkout; null for cod. */
  checkout_url: string | null
  /** Present for payos QR flows; null otherwise. */
  qr_code: string | null
  /** RFC3339 expiry for the payment; null when not applicable. */
  expired_at: string | null
}

/** A single order line (OrderItemResp). */
export type OrderItem = {
  id: string
  variant_id: string
  product_id: string
  product_name: string
  variant_label: string
  /** Null when the product has no primary image. */
  image_url: string | null
  qty: number
  unit_price_vnd: number
  line_total_vnd: number
}

/** A per-brand sub-order within an order (SubOrderResp). */
export type SubOrder = {
  id: string
  brand: BrandRef
  subtotal_vnd: number
  shipping_fee_vnd: number
  total_vnd: number
  status: SubOrderStatus
  /** Null until the brand assigns a tracking number. */
  tracking_no: string | null
  items: OrderItem[]
}

/** Full order detail (OrderResp). */
export type Order = {
  id: string
  order_no: string
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  subtotal_vnd: number
  shipping_total_vnd: number
  grand_total_vnd: number
  shipping_address: ShippingAddress
  notes: string
  /** Omitted by the backend unless the order was cancelled. */
  cancel_reason?: string
  sub_orders: SubOrder[]
  created_at: string
  /** RFC3339 paid timestamp; null until paid. */
  paid_at: string | null
  /** RFC3339 cancellation timestamp; null unless cancelled. */
  cancelled_at: string | null
}

/**
 * Response envelope for placing an order. The backend returns
 * `{ order, payment }` (gin.H wrapper around OrderResp + PaymentResp).
 */
export type PlaceOrderResponse = {
  order: Order
  payment: Payment
}

/** A condensed order row for list views (OrderListItem). */
export type OrderListItem = {
  id: string
  order_no: string
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  grand_total_vnd: number
  item_count: number
  brand_count: number
  /** Null when the first item has no image. */
  first_item_image: string | null
  first_item_name: string
  created_at: string
}

/**
 * Paginated order list response (OrderListResp). The backend uses
 * page/page_size/total/total_pages, which differs from the shared Pagination
 * shape, so it is mirrored exactly here rather than force-fit.
 */
export type OrderListResponse = {
  data: OrderListItem[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

/** Query parameters accepted by the order listing endpoint. */
export type OrderListQuery = {
  /** Comma-separated status filter (backend splits on `,`). */
  status?: string
  /** Inclusive lower bound for created_at (backend `from`). */
  from?: string
  /** Inclusive upper bound for created_at (backend `to`). */
  to?: string
  page?: number
  page_size?: number
}

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

/** Build a `path?query` string, omitting the `?` when no params are present. */
function withQuery(path: string, params: URLSearchParams): string {
  const search = params.toString()
  return search ? `${path}?${search}` : path
}

/**
 * GET /me/checkout/preview?address_id=<uuid> — read-only snapshot of what the
 * order would look like for the given address. Returns CheckoutPreviewResp
 * directly.
 */
export function previewCheckout(addressId: string): Promise<CheckoutPreview> {
  const params = new URLSearchParams()
  params.append('address_id', addressId)
  return apiRequest<CheckoutPreview>(withQuery('/me/checkout/preview', params), {
    method: 'GET',
  })
}

/**
 * POST /me/orders — atomically place an order. Returns `{ order, payment }`.
 * `payment_method` is constrained to the backend's `cod | payos` enum.
 */
export function placeOrder(input: PlaceOrderRequest): Promise<PlaceOrderResponse> {
  return apiRequest<PlaceOrderResponse>('/me/orders', {
    method: 'POST',
    body: input,
  })
}

/**
 * GET /me/orders — paginated list of the customer's orders. Serializes
 * status/from/to/page/page_size, omitting empty values. Returns OrderListResp
 * directly.
 */
export function listOrders(query: OrderListQuery): Promise<OrderListResponse> {
  const params = new URLSearchParams()
  appendScalar(params, 'status', query.status)
  appendScalar(params, 'from', query.from)
  appendScalar(params, 'to', query.to)
  appendScalar(params, 'page', query.page)
  appendScalar(params, 'page_size', query.page_size)

  return apiRequest<OrderListResponse>(withQuery('/me/orders', params), {
    method: 'GET',
  })
}

/**
 * GET /me/orders/{order_no} — full order detail addressed by the human-readable
 * order number (not the UUID). Returns OrderResp directly.
 */
export function getOrder(orderNo: string): Promise<Order> {
  return apiRequest<Order>(`/me/orders/${encodeURIComponent(orderNo)}`, {
    method: 'GET',
  })
}

/**
 * POST /me/orders/{order_no}/cancel — cancel an order by its order number.
 * Sends a `{ reason }` body and returns the updated OrderResp directly.
 */
export function cancelOrder(orderNo: string, reason: string): Promise<Order> {
  return apiRequest<Order>(
    `/me/orders/${encodeURIComponent(orderNo)}/cancel`,
    { method: 'POST', body: { reason } },
  )
}
