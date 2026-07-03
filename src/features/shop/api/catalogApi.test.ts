import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiRequestMock = vi.fn()

vi.mock('@/shared/api/apiClient', () => ({
  apiRequest: apiRequestMock,
}))

const pagination = {
  page: 1,
  limit: 24,
  total: 0,
  total_pages: 1,
  has_more: false,
}

describe('catalogApi', () => {
  beforeEach(() => {
    vi.resetModules()
    apiRequestMock.mockReset()
  })

  describe('listProducts', () => {
    it('serializes all supported query params with repeated array keys', async () => {
      apiRequestMock.mockResolvedValue({ items: [], pagination })
      const { listProducts } = await import('./catalogApi')

      await listProducts({
        q: 'shirt',
        category: 'tops',
        brand: 'acme',
        style: ['minimal', 'street'],
        size: ['s', 'm'],
        color: ['black', 'white'],
        price_min: 10,
        price_max: 200,
        sort: 'newest',
        page: 2,
        limit: 12,
      })

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(options).toEqual({ method: 'GET', skipAuth: true })

      const [base, search] = (path as string).split('?')
      expect(base).toBe('/products')

      const params = new URLSearchParams(search)
      expect(params.get('q')).toBe('shirt')
      expect(params.get('category')).toBe('tops')
      expect(params.get('brand')).toBe('acme')
      expect(params.getAll('style')).toEqual(['minimal', 'street'])
      expect(params.getAll('size')).toEqual(['s', 'm'])
      expect(params.getAll('color')).toEqual(['black', 'white'])
      expect(params.get('price_min')).toBe('10')
      expect(params.get('price_max')).toBe('200')
      expect(params.get('sort')).toBe('newest')
      expect(params.get('page')).toBe('2')
      expect(params.get('limit')).toBe('12')
    })

    it('omits undefined and empty values', async () => {
      apiRequestMock.mockResolvedValue({ items: [], pagination })
      const { listProducts } = await import('./catalogApi')

      await listProducts({
        q: '',
        category: undefined,
        style: [],
        size: ['', 'm'],
        page: 1,
      })

      const [path] = apiRequestMock.mock.calls[0]
      const [base, search] = (path as string).split('?')
      expect(base).toBe('/products')
      const params = new URLSearchParams(search ?? '')

      expect(params.has('q')).toBe(false)
      expect(params.has('category')).toBe(false)
      expect(params.has('brand')).toBe(false)
      expect(params.has('style')).toBe(false)
      expect(params.getAll('size')).toEqual(['m'])
      expect(params.has('price_min')).toBe(false)
      expect(params.has('price_max')).toBe(false)
      expect(params.has('sort')).toBe(false)
      expect(params.get('page')).toBe('1')
    })

    it('requests /products with no query string when the query is empty', async () => {
      apiRequestMock.mockResolvedValue({ items: [], pagination })
      const { listProducts } = await import('./catalogApi')

      await listProducts({})

      expect(apiRequestMock).toHaveBeenCalledWith('/products', {
        method: 'GET',
        skipAuth: true,
      })
    })

    it('returns the items and pagination envelope unchanged', async () => {
      const response = {
        items: [
          {
            id: 'p1',
            slug: 'tee',
            name: 'Tee',
            brand_slug: 'acme',
            brand_name: 'Acme',
            currency: 'VND',
            min_price: 100,
            max_price: 200,
            in_stock: true,
            primary_image: 'https://img/1.jpg',
          },
        ],
        pagination,
      }
      apiRequestMock.mockResolvedValue(response)
      const { listProducts } = await import('./catalogApi')

      await expect(listProducts({})).resolves.toEqual(response)
    })
  })

  describe('getProductById', () => {
    it('calls /products/by-id/{id} and returns the product envelope', async () => {
      const response = { product: { id: 'p1', slug: 'tee', name: 'Tee' } }
      apiRequestMock.mockResolvedValue(response)
      const { getProductById } = await import('./catalogApi')

      await expect(getProductById('p1')).resolves.toEqual(response)

      expect(apiRequestMock).toHaveBeenCalledWith('/products/by-id/p1', {
        method: 'GET',
        skipAuth: true,
      })
    })

    it('encodes the product id path segment', async () => {
      apiRequestMock.mockResolvedValue({ product: {} })
      const { getProductById } = await import('./catalogApi')

      await getProductById('a b/c')

      expect(apiRequestMock).toHaveBeenCalledWith('/products/by-id/a%20b%2Fc', {
        method: 'GET',
        skipAuth: true,
      })
    })
  })

  describe('listCategories', () => {
    it('calls /categories and returns the items envelope', async () => {
      const response = { items: [{ id: 'c1', slug: 'tops', name: 'Tops' }] }
      apiRequestMock.mockResolvedValue(response)
      const { listCategories } = await import('./catalogApi')

      await expect(listCategories()).resolves.toEqual(response)

      expect(apiRequestMock).toHaveBeenCalledWith('/categories', {
        method: 'GET',
        skipAuth: true,
      })
    })
  })

  describe('listStyleTags', () => {
    it('calls /style-tags and returns the items envelope', async () => {
      const response = { items: [{ id: 's1', slug: 'minimal', name: 'Minimal' }] }
      apiRequestMock.mockResolvedValue(response)
      const { listStyleTags } = await import('./catalogApi')

      await expect(listStyleTags()).resolves.toEqual(response)

      expect(apiRequestMock).toHaveBeenCalledWith('/style-tags', {
        method: 'GET',
        skipAuth: true,
      })
    })
  })

  describe('listBrands', () => {
    it('serializes q, sort, page, and limit', async () => {
      apiRequestMock.mockResolvedValue({ items: [], pagination })
      const { listBrands } = await import('./catalogApi')

      await listBrands({ q: 'ac', sort: 'newest', page: 3, limit: 12 })

      const [path, options] = apiRequestMock.mock.calls[0]
      expect(options).toEqual({ method: 'GET', skipAuth: true })

      const [base, search] = (path as string).split('?')
      expect(base).toBe('/brands')
      const params = new URLSearchParams(search)
      expect(params.get('q')).toBe('ac')
      expect(params.get('sort')).toBe('newest')
      expect(params.get('page')).toBe('3')
      expect(params.get('limit')).toBe('12')
    })

    it('omits undefined and empty brand query values', async () => {
      apiRequestMock.mockResolvedValue({ items: [], pagination })
      const { listBrands } = await import('./catalogApi')

      await listBrands({ q: '', sort: undefined })

      expect(apiRequestMock).toHaveBeenCalledWith('/brands', {
        method: 'GET',
        skipAuth: true,
      })
    })
  })

  describe('getBrand', () => {
    it('calls /brands/{slug} and returns the brand and addresses envelope', async () => {
      const response = {
        brand: { id: 'b1', slug: 'acme', name: 'Acme', status: 'active', created_at: '2026-01-01T00:00:00Z' },
        addresses: [],
      }
      apiRequestMock.mockResolvedValue(response)
      const { getBrand } = await import('./catalogApi')

      await expect(getBrand('acme')).resolves.toEqual(response)

      expect(apiRequestMock).toHaveBeenCalledWith('/brands/acme', {
        method: 'GET',
        skipAuth: true,
      })
    })

    it('encodes the brand slug path segment', async () => {
      apiRequestMock.mockResolvedValue({ brand: {}, addresses: [] })
      const { getBrand } = await import('./catalogApi')

      await getBrand('a/b')

      expect(apiRequestMock).toHaveBeenCalledWith('/brands/a%2Fb', {
        method: 'GET',
        skipAuth: true,
      })
    })
  })
})
