import { MemoryRouter, type InitialEntry } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'

import type { ProductListResponse } from '../api/contracts'
import type { WishlistListResponse } from '@/features/account/api/wishlistApi'

import { ShopPage } from './ShopPage'
import { WishlistPage } from './WishlistPage'

const {
  listProductsMock,
  listCategoriesMock,
  listStyleTagsMock,
  listWishlistMock,
  getWishlistContainsMock,
  addWishlistProductMock,
  removeWishlistProductMock,
  toastErrorMock,
  authState,
} = vi.hoisted(() => ({
  listProductsMock: vi.fn(),
  listCategoriesMock: vi.fn(),
  listStyleTagsMock: vi.fn(),
  listWishlistMock: vi.fn(),
  getWishlistContainsMock: vi.fn(),
  addWishlistProductMock: vi.fn(),
  removeWishlistProductMock: vi.fn(),
  toastErrorMock: vi.fn(),
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
  listCategories: listCategoriesMock,
  listStyleTags: listStyleTagsMock,
}))

vi.mock('@/features/account/api/wishlistApi', () => ({
  listWishlist: listWishlistMock,
  getWishlistContains: getWishlistContainsMock,
  addWishlistProduct: addWishlistProductMock,
  removeWishlistProduct: removeWishlistProductMock,
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => authState,
}))

vi.mock('sonner', () => ({
  toast: { error: toastErrorMock, message: vi.fn(), success: vi.fn() },
}))

const PRODUCT_ID = '11111111-1111-1111-1111-111111111111'

function makeProduct(overrides: Partial<ProductListResponse['items'][number]> = {}) {
  return {
    id: PRODUCT_ID,
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

function makeProductListResponse(): ProductListResponse {
  return {
    items: [makeProduct()],
    pagination: { page: 1, limit: 20, total: 1, total_pages: 1, has_more: false },
  }
}

function makeWishlistResponse(
  overrides: Partial<WishlistListResponse> = {},
): WishlistListResponse {
  return {
    items: [
      {
        product_id: PRODUCT_ID,
        product_slug: 'denim-jacket',
        product_name: 'Vintage Denim Jacket',
        primary_image_url: 'https://cdn.example.com/denim.jpg',
        min_price: 1500000,
        brand: { id: 'b1', slug: 'acme', name: 'ACME Studio' },
        added_at: '2026-01-01T00:00:00Z',
      },
    ],
    pagination: { page: 1, limit: 24, total: 1, total_pages: 1, has_more: false },
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

beforeEach(() => {
  listProductsMock.mockReset()
  listCategoriesMock.mockReset()
  listStyleTagsMock.mockReset()
  listWishlistMock.mockReset()
  getWishlistContainsMock.mockReset()
  addWishlistProductMock.mockReset()
  removeWishlistProductMock.mockReset()
  toastErrorMock.mockReset()

  listCategoriesMock.mockResolvedValue({ items: [] })
  listStyleTagsMock.mockResolvedValue({ items: [] })
  getWishlistContainsMock.mockResolvedValue({ in_wishlist: {} })

  authState.isLoggedIn = false
  authState.user = null
  authState.role = null
  authState.promptLogin = vi.fn()
})

describe('WishlistPage', () => {
  it('renders backend wishlist items with VND prices and product links', async () => {
    listWishlistMock.mockResolvedValue(makeWishlistResponse())

    renderWithRouter(<WishlistPage />, ['/wishlist'])

    expect(await screen.findByText('Vintage Denim Jacket')).toBeInTheDocument()
    expect(screen.getByText('ACME Studio')).toBeInTheDocument()
    expect(screen.getByText(/1\.500\.000/)).toBeInTheDocument()

    const link = screen.getAllByRole('link', { name: /Vintage Denim Jacket/i })[0]
    expect(link).toHaveAttribute('href', `/product/${PRODUCT_ID}`)
  })

  it('renders an empty state when the wishlist is empty', async () => {
    listWishlistMock.mockResolvedValue(
      makeWishlistResponse({
        items: [],
        pagination: { page: 1, limit: 24, total: 0, total_pages: 0, has_more: false },
      }),
    )

    renderWithRouter(<WishlistPage />, ['/wishlist'])

    expect(
      await screen.findByText(/your wishlist is empty|danh sách yêu thích trống/i),
    ).toBeInTheDocument()
  })

  it('optimistically removes an item and calls the backend', async () => {
    const user = userEvent.setup()
    listWishlistMock.mockResolvedValue(makeWishlistResponse())
    removeWishlistProductMock.mockResolvedValue(undefined)

    renderWithRouter(<WishlistPage />, ['/wishlist'])

    await screen.findByText('Vintage Denim Jacket')

    const removeButton = screen.getByRole('button', { name: /remove|xóa khỏi/i })
    await user.click(removeButton)

    expect(removeWishlistProductMock).toHaveBeenCalledWith(PRODUCT_ID)
    await waitFor(() =>
      expect(screen.queryByText('Vintage Denim Jacket')).not.toBeInTheDocument(),
    )
  })

  it('restores the item and toasts when removal fails', async () => {
    const user = userEvent.setup()
    listWishlistMock.mockResolvedValue(makeWishlistResponse())
    removeWishlistProductMock.mockRejectedValue(new Error('Server error'))

    renderWithRouter(<WishlistPage />, ['/wishlist'])

    await screen.findByText('Vintage Denim Jacket')

    const removeButton = screen.getByRole('button', { name: /remove|xóa khỏi/i })
    await user.click(removeButton)

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalled())
    // The item is restored after rollback.
    expect(screen.getByText('Vintage Denim Jacket')).toBeInTheDocument()
  })
})

describe('Product heart controls', () => {
  it('queries contains for visible products when logged in', async () => {
    authState.isLoggedIn = true
    authState.user = { email: 'c@example.com' }
    authState.role = 'customer'
    listProductsMock.mockResolvedValue(makeProductListResponse())
    getWishlistContainsMock.mockResolvedValue({ in_wishlist: { [PRODUCT_ID]: false } })

    renderWithRouter(<ShopPage />, ['/shop'])

    await screen.findByText('Vintage Denim Jacket')
    await waitFor(() =>
      expect(getWishlistContainsMock).toHaveBeenCalledWith([PRODUCT_ID]),
    )
  })

  it('does not query contains when logged out', async () => {
    listProductsMock.mockResolvedValue(makeProductListResponse())

    renderWithRouter(<ShopPage />, ['/shop'])

    await screen.findByText('Vintage Denim Jacket')
    expect(getWishlistContainsMock).not.toHaveBeenCalled()
  })

  it('toggles add optimistically and calls the backend when logged in', async () => {
    const user = userEvent.setup()
    authState.isLoggedIn = true
    authState.user = { email: 'c@example.com' }
    authState.role = 'customer'
    listProductsMock.mockResolvedValue(makeProductListResponse())
    getWishlistContainsMock.mockResolvedValue({ in_wishlist: { [PRODUCT_ID]: false } })
    addWishlistProductMock.mockResolvedValue(undefined)

    renderWithRouter(<ShopPage />, ['/shop'])

    await screen.findByText('Vintage Denim Jacket')

    const heart = await screen.findByRole('button', {
      name: /add to wishlist|thêm vào yêu thích/i,
    })
    await user.click(heart)

    expect(addWishlistProductMock).toHaveBeenCalledWith(PRODUCT_ID)
  })

  it('prompts login on heart click when logged out and sends no request', async () => {
    const user = userEvent.setup()
    listProductsMock.mockResolvedValue(makeProductListResponse())

    renderWithRouter(<ShopPage />, ['/shop?category=women'])

    await screen.findByText('Vintage Denim Jacket')

    const heart = await screen.findByRole('button', {
      name: /add to wishlist|thêm vào yêu thích/i,
    })
    await user.click(heart)

    expect(authState.promptLogin).toHaveBeenCalledWith('/shop?category=women')
    expect(addWishlistProductMock).not.toHaveBeenCalled()
  })

  it('ignores a rapid second click on the same heart while the add is in flight', async () => {
    const user = userEvent.setup()
    authState.isLoggedIn = true
    authState.user = { email: 'c@example.com' }
    authState.role = 'customer'
    listProductsMock.mockResolvedValue(makeProductListResponse())
    getWishlistContainsMock.mockResolvedValue({ in_wishlist: { [PRODUCT_ID]: false } })

    // Keep the add request unresolved so the heart stays pending across clicks.
    let resolveAdd: () => void = () => {}
    addWishlistProductMock.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveAdd = resolve
      }),
    )

    renderWithRouter(<ShopPage />, ['/shop'])

    await screen.findByText('Vintage Denim Jacket')

    const heart = await screen.findByRole('button', {
      name: /add to wishlist|thêm vào yêu thích/i,
    })

    // First click fires the add and flips the heart to the "remove" state.
    await user.click(heart)
    expect(addWishlistProductMock).toHaveBeenCalledTimes(1)

    const removeHeart = await screen.findByRole('button', {
      name: /remove from wishlist|xóa khỏi/i,
    })
    expect(removeHeart).toBeDisabled()

    // Second click while pending must be ignored: no duplicate request.
    await user.click(removeHeart)
    expect(addWishlistProductMock).toHaveBeenCalledTimes(1)
    expect(removeWishlistProductMock).not.toHaveBeenCalled()

    // Resolve the request; the heart settles in the added state and re-enables.
    resolveAdd()
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /remove from wishlist|xóa khỏi/i }),
      ).toBeEnabled(),
    )
  })

  it('rolls back the same-id heart on failure and accepts a subsequent click', async () => {
    const user = userEvent.setup()
    authState.isLoggedIn = true
    authState.user = { email: 'c@example.com' }
    authState.role = 'customer'
    listProductsMock.mockResolvedValue(makeProductListResponse())
    getWishlistContainsMock.mockResolvedValue({ in_wishlist: { [PRODUCT_ID]: false } })
    addWishlistProductMock.mockRejectedValueOnce(new Error('Server error'))

    renderWithRouter(<ShopPage />, ['/shop'])

    await screen.findByText('Vintage Denim Jacket')

    const heart = await screen.findByRole('button', {
      name: /add to wishlist|thêm vào yêu thích/i,
    })
    await user.click(heart)

    // Membership rolls back to off and an error toast fires.
    await waitFor(() => expect(toastErrorMock).toHaveBeenCalled())
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /add to wishlist|thêm vào yêu thích/i }),
      ).toBeInTheDocument(),
    )

    // Pending was cleared in finally, so a subsequent click works.
    addWishlistProductMock.mockResolvedValueOnce(undefined)
    const heartAgain = screen.getByRole('button', {
      name: /add to wishlist|thêm vào yêu thích/i,
    })
    expect(heartAgain).toBeEnabled()
    await user.click(heartAgain)
    expect(addWishlistProductMock).toHaveBeenCalledTimes(2)
  })

  it('rolls back and toasts when a toggle request fails', async () => {
    const user = userEvent.setup()
    authState.isLoggedIn = true
    authState.user = { email: 'c@example.com' }
    authState.role = 'customer'
    listProductsMock.mockResolvedValue(makeProductListResponse())
    getWishlistContainsMock.mockResolvedValue({ in_wishlist: { [PRODUCT_ID]: false } })
    addWishlistProductMock.mockRejectedValue(new Error('Server error'))

    renderWithRouter(<ShopPage />, ['/shop'])

    await screen.findByText('Vintage Denim Jacket')

    const heart = await screen.findByRole('button', {
      name: /add to wishlist|thêm vào yêu thích/i,
    })
    await user.click(heart)

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalled())
  })
})
