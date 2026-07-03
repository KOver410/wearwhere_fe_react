import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiRequestMock = vi.fn()

vi.mock('@/shared/api/apiClient', () => ({
  apiRequest: apiRequestMock,
}))

const listResponse = {
  items: [
    {
      product_id: '11111111-1111-1111-1111-111111111111',
      product_slug: 'denim-jacket',
      product_name: 'Vintage Denim Jacket',
      primary_image_url: 'https://cdn.example.com/denim.jpg',
      min_price: 1500000,
      brand: { id: 'b1', slug: 'acme', name: 'ACME Studio' },
      added_at: '2026-01-01T00:00:00Z',
    },
  ],
  pagination: { page: 1, limit: 24, total: 1, total_pages: 1, has_more: false },
}

describe('wishlistApi', () => {
  beforeEach(() => {
    vi.resetModules()
    apiRequestMock.mockReset()
  })

  describe('listWishlist', () => {
    it('GETs /me/wishlist with page and limit and returns the envelope', async () => {
      apiRequestMock.mockResolvedValue(listResponse)
      const { listWishlist } = await import('./wishlistApi')

      await expect(listWishlist(2, 12)).resolves.toEqual(listResponse)

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(options).toEqual({ method: 'GET' })

      const [base, search] = (path as string).split('?')
      expect(base).toBe('/me/wishlist')
      const params = new URLSearchParams(search)
      expect(params.get('page')).toBe('2')
      expect(params.get('limit')).toBe('12')
    })

    it('does not pass skipAuth (wishlist is authenticated)', async () => {
      apiRequestMock.mockResolvedValue(listResponse)
      const { listWishlist } = await import('./wishlistApi')

      await listWishlist(1, 24)

      const [, options] = apiRequestMock.mock.calls[0]
      expect(options).not.toHaveProperty('skipAuth')
    })
  })

  describe('getWishlistContains', () => {
    it('sends repeated product_ids query keys', async () => {
      apiRequestMock.mockResolvedValue({ in_wishlist: {} })
      const { getWishlistContains } = await import('./wishlistApi')

      await getWishlistContains([
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
      ])

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(options).toEqual({ method: 'GET' })

      const [base, search] = (path as string).split('?')
      expect(base).toBe('/me/wishlist/contains')
      const params = new URLSearchParams(search)
      expect(params.getAll('product_ids')).toEqual([
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
      ])
    })

    it('returns the in_wishlist map unchanged', async () => {
      const response = {
        in_wishlist: {
          '11111111-1111-1111-1111-111111111111': true,
          '22222222-2222-2222-2222-222222222222': false,
        },
      }
      apiRequestMock.mockResolvedValue(response)
      const { getWishlistContains } = await import('./wishlistApi')

      await expect(
        getWishlistContains([
          '11111111-1111-1111-1111-111111111111',
          '22222222-2222-2222-2222-222222222222',
        ]),
      ).resolves.toEqual(response)
    })

    it('skips the request and returns an empty map for no ids', async () => {
      const { getWishlistContains } = await import('./wishlistApi')

      await expect(getWishlistContains([])).resolves.toEqual({ in_wishlist: {} })
      expect(apiRequestMock).not.toHaveBeenCalled()
    })
  })

  describe('addWishlistProduct', () => {
    it('POSTs /me/wishlist/{product_id}', async () => {
      apiRequestMock.mockResolvedValue(undefined)
      const { addWishlistProduct } = await import('./wishlistApi')

      await addWishlistProduct('11111111-1111-1111-1111-111111111111')

      expect(apiRequestMock).toHaveBeenCalledWith(
        '/me/wishlist/11111111-1111-1111-1111-111111111111',
        { method: 'POST' },
      )
    })

    it('encodes the product id path segment', async () => {
      apiRequestMock.mockResolvedValue(undefined)
      const { addWishlistProduct } = await import('./wishlistApi')

      await addWishlistProduct('a b/c')

      expect(apiRequestMock).toHaveBeenCalledWith('/me/wishlist/a%20b%2Fc', {
        method: 'POST',
      })
    })
  })

  describe('removeWishlistProduct', () => {
    it('DELETEs /me/wishlist/{product_id}', async () => {
      apiRequestMock.mockResolvedValue(undefined)
      const { removeWishlistProduct } = await import('./wishlistApi')

      await removeWishlistProduct('11111111-1111-1111-1111-111111111111')

      expect(apiRequestMock).toHaveBeenCalledWith(
        '/me/wishlist/11111111-1111-1111-1111-111111111111',
        { method: 'DELETE' },
      )
    })
  })
})
