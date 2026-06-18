import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiRequestMock = vi.fn()

vi.mock('@/shared/api/apiClient', () => ({
  apiRequest: apiRequestMock,
}))

const cartResponse = {
  items: [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      qty: 2,
      price_snapshot: '1500000.00',
      current_price: '1500000.00',
      price_changed: false,
      subtotal_snapshot: '3000000.00',
      subtotal_current: '3000000.00',
      currency: 'VND',
      unavailable: false,
      added_at: '2026-01-01T00:00:00Z',
      variant: {
        id: '22222222-2222-2222-2222-222222222222',
        sku: 'SKU-1',
        size: 'M',
        color: 'Blue',
        color_hex: '#0000ff',
        stock_qty: 5,
      },
      product: {
        id: '33333333-3333-3333-3333-333333333333',
        slug: 'denim-jacket',
        name: 'Vintage Denim Jacket',
        primary_image_url: 'https://cdn.example.com/denim.jpg',
      },
      brand: { id: 'b1', slug: 'acme', name: 'ACME Studio' },
    },
  ],
  summary: {
    item_count: 1,
    total_qty: 2,
    total_snapshot: '3000000.00',
    total_current: '3000000.00',
    currency: 'VND',
    has_price_changes: false,
    has_unavailable: false,
  },
}

describe('cartApi', () => {
  beforeEach(() => {
    vi.resetModules()
    apiRequestMock.mockReset()
  })

  describe('getCart', () => {
    it('GETs /me/cart and returns the envelope', async () => {
      apiRequestMock.mockResolvedValue(cartResponse)
      const { getCart } = await import('./cartApi')

      await expect(getCart()).resolves.toEqual(cartResponse)

      expect(apiRequestMock).toHaveBeenCalledWith('/me/cart', { method: 'GET' })
    })

    it('does not pass skipAuth (cart is authenticated)', async () => {
      apiRequestMock.mockResolvedValue(cartResponse)
      const { getCart } = await import('./cartApi')

      await getCart()

      const [, options] = apiRequestMock.mock.calls[0]
      expect(options).not.toHaveProperty('skipAuth')
    })
  })

  describe('addCartItem', () => {
    it('POSTs /me/cart/items with a variant_id/qty body', async () => {
      apiRequestMock.mockResolvedValue({ id: 'item-1', qty: 3 })
      const { addCartItem } = await import('./cartApi')

      await expect(
        addCartItem('22222222-2222-2222-2222-222222222222', 3),
      ).resolves.toEqual({ id: 'item-1', qty: 3 })

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/cart/items')
      expect(options.method).toBe('POST')
      expect(options.body).toEqual({
        variant_id: '22222222-2222-2222-2222-222222222222',
        qty: 3,
      })
    })
  })

  describe('updateCartItem', () => {
    it('PATCHes /me/cart/items/{item_id} with a qty body', async () => {
      apiRequestMock.mockResolvedValue({ id: 'item-1', qty: 4 })
      const { updateCartItem } = await import('./cartApi')

      await expect(updateCartItem('item-1', 4)).resolves.toEqual({
        id: 'item-1',
        qty: 4,
      })

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/cart/items/item-1')
      expect(options.method).toBe('PATCH')
      expect(options.body).toEqual({ qty: 4 })
    })

    it('encodes the item id path segment', async () => {
      apiRequestMock.mockResolvedValue({ id: 'a b/c', qty: 1 })
      const { updateCartItem } = await import('./cartApi')

      await updateCartItem('a b/c', 1)

      const [path] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/cart/items/a%20b%2Fc')
    })
  })

  describe('removeCartItem', () => {
    it('DELETEs /me/cart/items/{item_id}', async () => {
      apiRequestMock.mockResolvedValue(undefined)
      const { removeCartItem } = await import('./cartApi')

      await removeCartItem('item-1')

      expect(apiRequestMock).toHaveBeenCalledWith('/me/cart/items/item-1', {
        method: 'DELETE',
      })
    })
  })

  describe('clearCart', () => {
    it('DELETEs /me/cart', async () => {
      apiRequestMock.mockResolvedValue(undefined)
      const { clearCart } = await import('./cartApi')

      await clearCart()

      expect(apiRequestMock).toHaveBeenCalledWith('/me/cart', {
        method: 'DELETE',
      })
    })
  })
})
