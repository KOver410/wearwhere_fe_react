import { MemoryRouter, Route, Routes, type InitialEntry } from 'react-router'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'

import type {
  BrandDetailResponse,
  BrandListResponse,
  ProductDetail,
  ProductListResponse,
} from '../api/contracts'

import { ShopPage } from './ShopPage'
import { SearchResultsPage } from './SearchResultsPage'
import { StylePage } from './StylePage'
import { AllBrandsPage } from './AllBrandsPage'
import { BrandStorefrontPage } from './BrandStorefrontPage'
import { ProductDetailPage } from './ProductDetailPage'

const {
  listProductsMock,
  getProductByIdMock,
  listCategoriesMock,
  listStyleTagsMock,
  listBrandsMock,
  getBrandMock,
  authState,
} = vi.hoisted(() => ({
  listProductsMock: vi.fn(),
  getProductByIdMock: vi.fn(),
  listCategoriesMock: vi.fn(),
  listStyleTagsMock: vi.fn(),
  listBrandsMock: vi.fn(),
  getBrandMock: vi.fn(),
  authState: {
    user: null as { email?: string | null } | null,
    role: null as string | null,
    isLoggedIn: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    restoreSession: vi.fn(),
    showLoginPrompt: false,
    promptLogin: vi.fn(),
    dismissPrompt: vi.fn(),
    pendingRedirect: null as string | null,
  },
}))

vi.mock('@/features/shop/api/catalogApi', () => ({
  listProducts: listProductsMock,
  getProductById: getProductByIdMock,
  listCategories: listCategoriesMock,
  listStyleTags: listStyleTagsMock,
  listBrands: listBrandsMock,
  getBrand: getBrandMock,
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => authState,
}))

// react-medium-image-zoom does not play well with jsdom; stub it.
vi.mock('react-medium-image-zoom', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

function makeProduct(overrides: Partial<ProductListResponse['items'][number]> = {}) {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    slug: 'denim-jacket',
    name: 'Vintage Denim Jacket',
    brand_slug: 'acme',
    brand_name: 'ACME Studio',
    currency: 'VND',
    min_price: 1500000,
    max_price: 1500000,
    in_stock: true,
    primary_image: 'https://cdn.example.com/denim.jpg',
    ...overrides,
  }
}

function makeProductListResponse(
  overrides: Partial<ProductListResponse> = {},
): ProductListResponse {
  return {
    items: [makeProduct()],
    pagination: { page: 1, limit: 20, total: 1, total_pages: 1, has_more: false },
    ...overrides,
  }
}

function makeProductDetail(overrides: Partial<ProductDetail> = {}): ProductDetail {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    slug: 'denim-jacket',
    name: 'Vintage Denim Jacket',
    description: 'A timeless denim jacket made from premium cotton.',
    status: 'active',
    currency: 'VND',
    brand: { id: 'b1', slug: 'acme', name: 'ACME Studio' },
    category: { id: 'c1', slug: 'jackets', name: 'Jackets' },
    style_tags: [{ id: 's1', slug: 'vintage', name: 'Vintage' }],
    variants: [
      {
        id: 'v-blue-m',
        sku: 'DJ-BLUE-M',
        size: 'M',
        color: 'Blue',
        color_hex: '#4A6FA5',
        price: 1500000,
        stock_qty: 5,
        is_active: true,
      },
      {
        id: 'v-blue-l',
        sku: 'DJ-BLUE-L',
        size: 'L',
        color: 'Blue',
        color_hex: '#4A6FA5',
        price: 1700000,
        stock_qty: 0,
        is_active: true,
      },
    ],
    images: [
      { id: 'img2', url: 'https://cdn.example.com/2.jpg', sort_order: 2, is_primary: false },
      { id: 'img1', url: 'https://cdn.example.com/1.jpg', sort_order: 1, is_primary: true },
    ],
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function makeBrandListResponse(overrides: Partial<BrandListResponse> = {}): BrandListResponse {
  return {
    items: [
      {
        id: 'b1',
        slug: 'acme',
        name: 'ACME Studio',
        story: 'We craft sustainable streetwear.',
        logo_url: 'https://cdn.example.com/logo.jpg',
        banner_url: 'https://cdn.example.com/banner.jpg',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
      },
    ],
    pagination: { page: 1, limit: 24, total: 1, total_pages: 1, has_more: false },
    ...overrides,
  }
}

function makeBrandDetailResponse(
  overrides: Partial<BrandDetailResponse> = {},
): BrandDetailResponse {
  return {
    brand: {
      id: 'b1',
      slug: 'acme',
      name: 'ACME Studio',
      story: 'We craft sustainable streetwear.',
      logo_url: 'https://cdn.example.com/logo.jpg',
      banner_url: 'https://cdn.example.com/banner.jpg',
      website_url: 'https://acme.example.com',
      status: 'active',
      created_at: '2026-01-01T00:00:00Z',
    },
    addresses: [
      {
        id: 'a1',
        label: 'Flagship',
        address_line: '123 Le Loi',
        ward: 'Ben Nghe',
        district: 'District 1',
        city: 'Ho Chi Minh City',
        country: 'Vietnam',
        is_primary: true,
        is_public: true,
      },
    ],
    ...overrides,
  }
}

function renderWithRouter(ui: React.ReactNode, initialEntries: InitialEntry[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LanguageProvider>{ui}</LanguageProvider>
    </MemoryRouter>,
  )
}

function renderRoute(
  path: string,
  element: React.ReactNode,
  initialEntries: InitialEntry[],
) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LanguageProvider>
        <Routes>
          <Route path={path} element={element} />
        </Routes>
      </LanguageProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  listProductsMock.mockReset()
  getProductByIdMock.mockReset()
  listCategoriesMock.mockReset()
  listStyleTagsMock.mockReset()
  listBrandsMock.mockReset()
  getBrandMock.mockReset()

  listCategoriesMock.mockResolvedValue({
    items: [{ id: 'c1', slug: 'women', name: 'Women' }],
  })
  listStyleTagsMock.mockResolvedValue({
    items: [{ id: 's1', slug: 'vintage', name: 'Vintage' }],
  })
})

describe('ShopPage', () => {
  it('renders API products with VND prices', async () => {
    listProductsMock.mockResolvedValue(makeProductListResponse())

    renderWithRouter(<ShopPage />, ['/shop'])

    expect(await screen.findByText('Vintage Denim Jacket')).toBeInTheDocument()
    expect(screen.getByText('ACME Studio')).toBeInTheDocument()
    // formatVND output for 1,500,000 VND
    expect(screen.getByText(/1\.500\.000/)).toBeInTheDocument()
  })

  it('shows a loading state then content', async () => {
    let resolve: (value: ProductListResponse) => void = () => {}
    listProductsMock.mockReturnValue(
      new Promise<ProductListResponse>((r) => {
        resolve = r
      }),
    )

    renderWithRouter(<ShopPage />, ['/shop'])

    expect(screen.getByTestId('shop-loading')).toBeInTheDocument()

    resolve(makeProductListResponse())
    expect(await screen.findByText('Vintage Denim Jacket')).toBeInTheDocument()
  })

  it('renders an empty state when there are no products', async () => {
    listProductsMock.mockResolvedValue(
      makeProductListResponse({
        items: [],
        pagination: { page: 1, limit: 20, total: 0, total_pages: 0, has_more: false },
      }),
    )

    renderWithRouter(<ShopPage />, ['/shop'])

    expect(await screen.findByText(/no products found|không tìm thấy sản phẩm/i)).toBeInTheDocument()
  })

  it('renders a retryable error state and refetches on retry', async () => {
    const user = userEvent.setup()
    listProductsMock.mockRejectedValueOnce(new Error('Network down'))

    renderWithRouter(<ShopPage />, ['/shop'])

    const retry = await screen.findByRole('button', { name: /retry|thử lại/i })
    expect(retry).toBeInTheDocument()

    listProductsMock.mockResolvedValueOnce(makeProductListResponse())
    await user.click(retry)

    expect(await screen.findByText('Vintage Denim Jacket')).toBeInTheDocument()
  })

  it('loads category and style filter options from the backend', async () => {
    listProductsMock.mockResolvedValue(makeProductListResponse())

    renderWithRouter(<ShopPage />, ['/shop'])

    await waitFor(() => expect(listCategoriesMock).toHaveBeenCalled())
    expect(listStyleTagsMock).toHaveBeenCalled()
  })

  it('sends category/style/sort/page filters from the URL', async () => {
    listProductsMock.mockResolvedValue(makeProductListResponse())

    renderWithRouter(<ShopPage />, ['/shop?category=women&style=vintage&sort=price-low'])

    await waitFor(() => expect(listProductsMock).toHaveBeenCalled())
    const arg = listProductsMock.mock.calls.at(-1)?.[0]
    expect(arg.category).toBe('women')
    expect(arg.style).toEqual(['vintage'])
    expect(arg.sort).toBe('price_asc')
    expect(arg.page).toBe(1)
  })

  it('uses backend pagination for the page controls', async () => {
    listProductsMock.mockResolvedValue(
      makeProductListResponse({
        pagination: { page: 1, limit: 20, total: 60, total_pages: 3, has_more: true },
      }),
    )

    renderWithRouter(<ShopPage />, ['/shop'])

    await screen.findByText('Vintage Denim Jacket')
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
  })
})

describe('SearchResultsPage', () => {
  it('reads q from the URL and queries the backend', async () => {
    listProductsMock.mockResolvedValue(makeProductListResponse())

    renderWithRouter(<SearchResultsPage />, ['/search?q=denim'])

    await waitFor(() => expect(listProductsMock).toHaveBeenCalled())
    const arg = listProductsMock.mock.calls.at(-1)?.[0]
    expect(arg.q).toBe('denim')
    expect(await screen.findByText('Vintage Denim Jacket')).toBeInTheDocument()
  })

  it('renders backend suggestions when present', async () => {
    listProductsMock.mockResolvedValue(
      makeProductListResponse({ suggestions: ['denim jacket', 'denim skirt'] }),
    )

    renderWithRouter(<SearchResultsPage />, ['/search?q=denm'])

    expect(await screen.findByText('denim jacket')).toBeInTheDocument()
    expect(screen.getByText('denim skirt')).toBeInTheDocument()
  })
})

describe('StylePage', () => {
  it('sends the route slug as style:[slug]', async () => {
    listProductsMock.mockResolvedValue(makeProductListResponse())

    renderRoute('/style/:slug', <StylePage />, ['/style/vintage'])

    await waitFor(() => expect(listProductsMock).toHaveBeenCalled())
    const arg = listProductsMock.mock.calls.at(-1)?.[0]
    expect(arg.style).toEqual(['vintage'])
    expect(await screen.findByText('Vintage Denim Jacket')).toBeInTheDocument()
  })
})

describe('AllBrandsPage', () => {
  it('renders backend brands without fabricated metrics', async () => {
    listBrandsMock.mockResolvedValue(makeBrandListResponse())

    renderWithRouter(<AllBrandsPage />, ['/brands'])

    expect(await screen.findByText('ACME Studio')).toBeInTheDocument()
    // No fabricated follower/rating metrics.
    expect(screen.queryByText(/followers|người theo dõi/i)).not.toBeInTheDocument()
  })

  it('maps search to q and sends only a-z or newest sort', async () => {
    const user = userEvent.setup()
    listBrandsMock.mockResolvedValue(makeBrandListResponse())

    renderWithRouter(<AllBrandsPage />, ['/brands'])

    await screen.findByText('ACME Studio')

    await user.type(screen.getByPlaceholderText(/search brands|tìm thương hiệu/i), 'acme')

    await waitFor(() => {
      const arg = listBrandsMock.mock.calls.at(-1)?.[0]
      expect(arg.q).toBe('acme')
    })

    const sortArgs = listBrandsMock.mock.calls.map((c) => c[0]?.sort).filter(Boolean)
    for (const s of sortArgs) {
      expect(['a-z', 'newest']).toContain(s)
    }
  })
})

describe('BrandStorefrontPage', () => {
  it('loads brand detail and products using brand:slug', async () => {
    getBrandMock.mockResolvedValue(makeBrandDetailResponse())
    listProductsMock.mockResolvedValue(makeProductListResponse())

    renderRoute('/brands/:slug', <BrandStorefrontPage />, ['/brands/acme'])

    expect(await screen.findByText('ACME Studio')).toBeInTheDocument()
    expect(getBrandMock).toHaveBeenCalledWith('acme')

    await waitFor(() => expect(listProductsMock).toHaveBeenCalled())
    const arg = listProductsMock.mock.calls.at(-1)?.[0]
    expect(arg.brand).toBe('acme')

    expect(await screen.findByText('Vintage Denim Jacket')).toBeInTheDocument()
  })

  it('keeps the follow control visible but disabled', async () => {
    getBrandMock.mockResolvedValue(makeBrandDetailResponse())
    listProductsMock.mockResolvedValue(makeProductListResponse())

    renderRoute('/brands/:slug', <BrandStorefrontPage />, ['/brands/acme'])

    const follow = await screen.findByRole('button', { name: /(follow|theo dõi).+chưa hỗ trợ/i })
    expect(follow).toBeDisabled()
  })
})

describe('ProductDetailPage', () => {
  it('loads the route UUID and displays backend content', async () => {
    getProductByIdMock.mockResolvedValue({ product: makeProductDetail() })

    renderRoute('/product/:id', <ProductDetailPage />, [
      '/product/11111111-1111-1111-1111-111111111111',
    ])

    expect(
      await screen.findByRole('heading', { name: /Vintage Denim Jacket/i }),
    ).toBeInTheDocument()
    expect(getProductByIdMock).toHaveBeenCalledWith('11111111-1111-1111-1111-111111111111')
    expect(
      screen.getByText(/A timeless denim jacket made from premium cotton/i),
    ).toBeInTheDocument()
  })

  it('disables a size whose combination has stock_qty=0', async () => {
    const user = userEvent.setup()
    getProductByIdMock.mockResolvedValue({ product: makeProductDetail() })

    renderRoute('/product/:id', <ProductDetailPage />, [
      '/product/11111111-1111-1111-1111-111111111111',
    ])

    await screen.findByRole('heading', { name: /Vintage Denim Jacket/i })

    // Color Blue is preselected (single color). Size M in stock, size L out of stock.
    const sizeM = screen.getByRole('button', { name: 'M' })
    const sizeL = screen.getByRole('button', { name: 'L' })
    expect(sizeM).not.toBeDisabled()
    expect(sizeL).toBeDisabled()

    await user.click(sizeM)
    // Selected variant price (1,500,000 VND) shown.
    expect(screen.getByText(/1\.500\.000/)).toBeInTheDocument()
  })

  it('shows a retryable error state when the product fails to load', async () => {
    const user = userEvent.setup()
    getProductByIdMock.mockRejectedValueOnce(new Error('Not found'))

    renderRoute('/product/:id', <ProductDetailPage />, [
      '/product/11111111-1111-1111-1111-111111111111',
    ])

    const retry = await screen.findByRole('button', { name: /retry|thử lại/i })
    getProductByIdMock.mockResolvedValueOnce({ product: makeProductDetail() })
    await user.click(retry)

    expect(
      await screen.findByRole('heading', { name: /Vintage Denim Jacket/i }),
    ).toBeInTheDocument()
  })
})
