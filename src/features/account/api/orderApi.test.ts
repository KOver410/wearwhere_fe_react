import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiRequestMock = vi.fn()

vi.mock('@/shared/api/apiClient', () => ({
  apiRequest: apiRequestMock,
}))

const shippingAddress = {
  recipient: 'Linh Ba',
  phone: '+84901234567',
  line1: '123 Le Loi',
  ward: 'Ben Nghe',
  district: 'District 1',
  city: 'Ho Chi Minh City',
}

const checkoutPreview = {
  cart_empty: false,
  address: shippingAddress,
  sub_orders: [
    {
      brand: { id: 'b1', slug: 'acme', name: 'ACME Studio' },
      items: [
        {
          variant_id: '22222222-2222-2222-2222-222222222222',
          product_id: '33333333-3333-3333-3333-333333333333',
          product_name: 'Vintage Denim Jacket',
          variant_label: 'M / Blue',
          image_url: 'https://cdn.example.com/denim.jpg',
          qty: 2,
          unit_price_vnd: 1500000,
          line_total_vnd: 3000000,
          available_qty: 5,
        },
      ],
      subtotal_vnd: 3000000,
      shipping_fee_vnd: 30000,
      total_vnd: 3030000,
    },
  ],
  subtotal_vnd: 3000000,
  shipping_total_vnd: 30000,
  grand_total_vnd: 3030000,
  min_order_value_vnd: 100000,
  meets_min_order: true,
  warnings: [],
}

const placeOrderResponse = {
  order: {
    id: '44444444-4444-4444-4444-444444444444',
    order_no: 'WW-20260605-0001',
    status: 'pending_payment',
    payment_method: 'payos',
    payment_status: 'pending',
    subtotal_vnd: 3000000,
    shipping_total_vnd: 30000,
    grand_total_vnd: 3030000,
    shipping_address: shippingAddress,
    notes: 'Leave at the door',
    sub_orders: [],
    created_at: '2026-06-05T00:00:00Z',
    paid_at: null,
    cancelled_at: null,
  },
  payment: {
    id: '55555555-5555-5555-5555-555555555555',
    method: 'payos',
    status: 'pending',
    amount_vnd: 3030000,
    checkout_url: 'https://pay.payos.vn/web/abc',
    qr_code: null,
    expired_at: '2026-06-05T01:00:00Z',
  },
}

const orderListResponse = {
  data: [
    {
      id: '44444444-4444-4444-4444-444444444444',
      order_no: 'WW-20260605-0001',
      status: 'processing',
      payment_method: 'cod',
      payment_status: 'pending',
      grand_total_vnd: 3030000,
      item_count: 2,
      brand_count: 1,
      first_item_image: 'https://cdn.example.com/denim.jpg',
      first_item_name: 'Vintage Denim Jacket',
      created_at: '2026-06-05T00:00:00Z',
    },
  ],
  page: 1,
  page_size: 20,
  total: 1,
  total_pages: 1,
}

const orderDetail = placeOrderResponse.order

describe('orderApi', () => {
  beforeEach(() => {
    vi.resetModules()
    apiRequestMock.mockReset()
  })

  describe('previewCheckout', () => {
    it('GETs /me/checkout/preview with an address_id query param', async () => {
      apiRequestMock.mockResolvedValue(checkoutPreview)
      const { previewCheckout } = await import('./orderApi')

      await expect(
        previewCheckout('11111111-1111-1111-1111-111111111111'),
      ).resolves.toEqual(checkoutPreview)

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(path).toBe(
        '/me/checkout/preview?address_id=11111111-1111-1111-1111-111111111111',
      )
      expect(options).toEqual({ method: 'GET' })
    })

    it('does not pass skipAuth (checkout is authenticated)', async () => {
      apiRequestMock.mockResolvedValue(checkoutPreview)
      const { previewCheckout } = await import('./orderApi')

      await previewCheckout('11111111-1111-1111-1111-111111111111')

      const [, options] = apiRequestMock.mock.calls[0]
      expect(options).not.toHaveProperty('skipAuth')
    })
  })

  describe('placeOrder', () => {
    it('POSTs /me/orders with address_id/payment_method/notes and returns {order, payment}', async () => {
      apiRequestMock.mockResolvedValue(placeOrderResponse)
      const { placeOrder } = await import('./orderApi')

      await expect(
        placeOrder({
          address_id: '11111111-1111-1111-1111-111111111111',
          payment_method: 'payos',
          notes: 'Leave at the door',
        }),
      ).resolves.toEqual(placeOrderResponse)

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/orders')
      expect(options.method).toBe('POST')
      expect(options.body).toEqual({
        address_id: '11111111-1111-1111-1111-111111111111',
        payment_method: 'payos',
        notes: 'Leave at the door',
      })
      expect(options).not.toHaveProperty('skipAuth')
    })

    it('supports the cod payment method', async () => {
      apiRequestMock.mockResolvedValue(placeOrderResponse)
      const { placeOrder } = await import('./orderApi')

      await placeOrder({
        address_id: '11111111-1111-1111-1111-111111111111',
        payment_method: 'cod',
      })

      const [, options] = apiRequestMock.mock.calls[0]
      expect(options.body).toEqual({
        address_id: '11111111-1111-1111-1111-111111111111',
        payment_method: 'cod',
      })
    })
  })

  describe('listOrders', () => {
    it('serializes status/from/to/page/page_size', async () => {
      apiRequestMock.mockResolvedValue(orderListResponse)
      const { listOrders } = await import('./orderApi')

      await expect(
        listOrders({
          status: 'processing',
          from: '2026-01-01',
          to: '2026-06-05',
          page: 2,
          page_size: 10,
        }),
      ).resolves.toEqual(orderListResponse)

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(path).toBe(
        '/me/orders?status=processing&from=2026-01-01&to=2026-06-05&page=2&page_size=10',
      )
      expect(options).toEqual({ method: 'GET' })
    })

    it('omits empty/undefined query params', async () => {
      apiRequestMock.mockResolvedValue(orderListResponse)
      const { listOrders } = await import('./orderApi')

      await listOrders({})

      const [path] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/orders')
    })

    it('serializes only the provided params', async () => {
      apiRequestMock.mockResolvedValue(orderListResponse)
      const { listOrders } = await import('./orderApi')

      await listOrders({ page: 3 })

      const [path] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/orders?page=3')
    })
  })

  describe('getOrder', () => {
    it('GETs /me/orders/{order_no} using the order number, not a UUID', async () => {
      apiRequestMock.mockResolvedValue(orderDetail)
      const { getOrder } = await import('./orderApi')

      await expect(getOrder('WW-20260605-0001')).resolves.toEqual(orderDetail)

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/orders/WW-20260605-0001')
      expect(options).toEqual({ method: 'GET' })
    })

    it('URL-encodes the order_no path segment', async () => {
      apiRequestMock.mockResolvedValue(orderDetail)
      const { getOrder } = await import('./orderApi')

      await getOrder('WW 2026/0001')

      const [path] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/orders/WW%202026%2F0001')
    })
  })

  describe('cancelOrder', () => {
    it('POSTs /me/orders/{order_no}/cancel with a {reason} body', async () => {
      const cancelled = { ...orderDetail, status: 'cancelled' }
      apiRequestMock.mockResolvedValue(cancelled)
      const { cancelOrder } = await import('./orderApi')

      await expect(
        cancelOrder('WW-20260605-0001', 'Changed my mind'),
      ).resolves.toEqual(cancelled)

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/orders/WW-20260605-0001/cancel')
      expect(options.method).toBe('POST')
      expect(options.body).toEqual({ reason: 'Changed my mind' })
      expect(options).not.toHaveProperty('skipAuth')
    })

    it('URL-encodes the order_no path segment', async () => {
      apiRequestMock.mockResolvedValue(orderDetail)
      const { cancelOrder } = await import('./orderApi')

      await cancelOrder('WW 2026/0001', 'reason')

      const [path] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/orders/WW%202026%2F0001/cancel')
    })
  })
})
