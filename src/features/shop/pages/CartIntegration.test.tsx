import { MemoryRouter, Route, Routes, type InitialEntry } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'

import type { ProductDetail } from '../api/contracts'
import type { CartResponse } from '@/features/account/api/cartApi'

import { ProductDetailPage } from './ProductDetailPage'
import { CartCheckoutPage } from './CartCheckoutPage'
import { Header } from '@/shared/components/Header'

const {
  getProductByIdMock,
  getWishlistContainsMock,
  addCartItemMock,
  getCartMock,
  updateCartItemMock,
  removeCartItemMock,
  clearCartMock,
  toastErrorMock,
  toastSuccessMock,
  navigateMock,
  authState,
} = vi.hoisted(() => ({
  getProductByIdMock: vi.fn(),
  getWishlistContainsMock: vi.fn(),
  addCartItemMock: vi.fn(),
  getCartMock: vi.fn(),
  updateCartItemMock: vi.fn(),
  removeCartItemMock: vi.fn(),
  clearCartMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  navigateMock: vi.fn(),
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
  getProductById: getProductByIdMock,
}))

vi.mock('@/features/account/api/cartApi', () => ({
  getCart: getCartMock,
  addCartItem: addCartItemMock,
  updateCartItem: updateCartItemMock,
  removeCartItem: removeCartItemMock,
  clearCart: clearCartMock,
}))

vi.mock('@/features/account/api/wishlistApi', () => ({
  getWishlistContains: getWishlistContainsMock,
  addWishlistProduct: vi.fn(),
  removeWishlistProduct: vi.fn(),
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => authState,
}))

vi.mock('sonner', () => ({
  toast: { error: toastErrorMock, message: vi.fn(), success: toastSuccessMock },
}))

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => navigateMock }
})

const PRODUCT_ID = '33333333-3333-3333-3333-333333333333'
const VARIANT_ID = '22222222-2222-2222-2222-222222222222'

function makeProductDetail(): ProductDetail {
  return {
    id: PRODUCT_ID,
    slug: 'denim-jacket',
    name: 'Vintage Denim Jacket',
    description: 'A jacket',
    status: 'active',
    currency: 'VND',
    brand: { id: 'b1', slug: 'acme', name: 'ACME Studio' },
    category: { id: 'c1', slug: 'jackets', name: 'Jackets' },
    style_tags: [],
    variants: [
      {
        id: VARIANT_ID,
        sku: 'SKU-1',
        size: 'M',
        color: 'Blue',
        color_hex: '#0000ff',
        price: 1500000,
        stock_qty: 5,
        is_active: true,
      },
    ],
    images: [
      { id: 'img1', url: 'https://cdn.example.com/denim.jpg', sort_order: 0, is_primary: true },
    ],
    created_at: '2026-01-01T00:00:00Z',
  }
}

function makeCart(overrides: Partial<CartResponse> = {}): CartResponse {
  return {
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
        variant: { id: VARIANT_ID, sku: 'SKU-1', size: 'M', color: 'Blue', color_hex: '#0000ff', stock_qty: 5 },
        product: { id: PRODUCT_ID, slug: 'denim-jacket', name: 'Vintage Denim Jacket', primary_image_url: 'https://cdn.example.com/denim.jpg' },
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
  getProductByIdMock.mockReset()
  getWishlistContainsMock.mockReset()
  addCartItemMock.mockReset()
  getCartMock.mockReset()
  updateCartItemMock.mockReset()
  removeCartItemMock.mockReset()
  clearCartMock.mockReset()
  toastErrorMock.mockReset()
  toastSuccessMock.mockReset()
  navigateMock.mockReset()

  getWishlistContainsMock.mockResolvedValue({ in_wishlist: {} })

  authState.isLoggedIn = false
  authState.user = null
  authState.role = null
  authState.promptLogin = vi.fn()
})

async function selectVariantAndOpen() {
  getProductByIdMock.mockResolvedValue({ product: makeProductDetail() })
  render(
    <MemoryRouter initialEntries={[`/product/${PRODUCT_ID}`]}>
      <LanguageProvider>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </LanguageProvider>
    </MemoryRouter>,
  )
  await screen.findByRole('heading', { name: /Vintage Denim Jacket/i })
  // Color auto-selects (single color). Pick the size to resolve the variant.
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: 'M' }))
  return user
}

describe('ProductDetail add-to-cart', () => {
  it('adds the selected variant with quantity, toasts, and dispatches the event', async () => {
    authState.isLoggedIn = true
    authState.user = { email: 'c@example.com' }
    authState.role = 'customer'
    addCartItemMock.mockResolvedValue({ id: 'item-1', qty: 1 })
    const eventSpy = vi.fn()
    window.addEventListener('wearwhere:cart-updated', eventSpy)

    const user = await selectVariantAndOpen()
    await user.click(screen.getByRole('button', { name: /add to cart|thêm vào giỏ/i }))

    await waitFor(() => expect(addCartItemMock).toHaveBeenCalledWith(VARIANT_ID, 1))
    await waitFor(() => expect(toastSuccessMock).toHaveBeenCalled())
    expect(eventSpy).toHaveBeenCalled()
    window.removeEventListener('wearwhere:cart-updated', eventSpy)
  })

  it('prompts login when logged out and sends no request', async () => {
    const user = await selectVariantAndOpen()
    await user.click(screen.getByRole('button', { name: /add to cart|thêm vào giỏ/i }))

    expect(authState.promptLogin).toHaveBeenCalledWith(`/product/${PRODUCT_ID}`)
    expect(addCartItemMock).not.toHaveBeenCalled()
  })
})

describe('CartCheckoutPage', () => {
  it('renders backend items with VND subtotal and total', async () => {
    getCartMock.mockResolvedValue(makeCart())

    renderWithRouter(<CartCheckoutPage />, ['/cart'])

    expect(await screen.findByText('Vintage Denim Jacket')).toBeInTheDocument()
    expect(screen.getByText('ACME Studio')).toBeInTheDocument()
    expect(screen.getByTestId('cart-total')).toHaveTextContent(/3\.000\.000/)
    // No USD anywhere.
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument()
  })

  it('shows price-changed and unavailable warnings from the backend', async () => {
    getCartMock.mockResolvedValue(
      makeCart({
        items: [
          {
            ...makeCart().items[0],
            price_changed: true,
            current_price: '1600000.00',
            subtotal_current: '3200000.00',
            unavailable: true,
            unavailable_reason: 'Out of stock',
          },
        ],
        summary: { ...makeCart().summary, has_price_changes: true, has_unavailable: true },
      }),
    )

    renderWithRouter(<CartCheckoutPage />, ['/cart'])

    await screen.findByText('Vintage Denim Jacket')
    expect(screen.getByTestId('price-changed-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')).toBeInTheDocument()
    expect(screen.getByText('Out of stock')).toBeInTheDocument()
    // Continue is blocked when there are unavailable items.
    expect(screen.getByTestId('cart-blocked')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue to shipping|tiếp tục/i })).toBeDisabled()
  })

  it('renders an empty state when the cart has no items', async () => {
    getCartMock.mockResolvedValue(
      makeCart({
        items: [],
        summary: { item_count: 0, total_qty: 0, total_snapshot: '0.00', total_current: '0.00', currency: 'VND', has_price_changes: false, has_unavailable: false },
      }),
    )

    renderWithRouter(<CartCheckoutPage />, ['/cart'])

    expect(await screen.findByText(/your cart is empty|giỏ hàng trống/i)).toBeInTheDocument()
  })

  it('updates a quantity then re-fetches authoritative totals', async () => {
    const user = userEvent.setup()
    getCartMock
      .mockResolvedValueOnce(makeCart())
      .mockResolvedValueOnce(
        makeCart({
          items: [{ ...makeCart().items[0], qty: 3, subtotal_current: '4500000.00' }],
          summary: { ...makeCart().summary, total_qty: 3, total_current: '4500000.00' },
        }),
      )
    updateCartItemMock.mockResolvedValue({ id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', qty: 3 })

    renderWithRouter(<CartCheckoutPage />, ['/cart'])

    await screen.findByText('Vintage Denim Jacket')
    await user.click(screen.getByRole('button', { name: /increase quantity|tăng số lượng/i }))

    await waitFor(() =>
      expect(updateCartItemMock).toHaveBeenCalledWith('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3),
    )
    await waitFor(() => expect(getCartMock).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(screen.getByTestId('cart-total')).toHaveTextContent(/4\.500\.000/))
  })

  it('removes an item then re-fetches', async () => {
    const user = userEvent.setup()
    getCartMock
      .mockResolvedValueOnce(makeCart())
      .mockResolvedValueOnce(
        makeCart({
          items: [],
          summary: { item_count: 0, total_qty: 0, total_snapshot: '0.00', total_current: '0.00', currency: 'VND', has_price_changes: false, has_unavailable: false },
        }),
      )
    removeCartItemMock.mockResolvedValue(undefined)

    renderWithRouter(<CartCheckoutPage />, ['/cart'])

    await screen.findByText('Vintage Denim Jacket')
    await user.click(screen.getByRole('button', { name: /^remove$|^xóa$/i }))

    await waitFor(() =>
      expect(removeCartItemMock).toHaveBeenCalledWith('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    )
    await waitFor(() => expect(getCartMock).toHaveBeenCalledTimes(2))
  })

  it('ignores a stale out-of-order getCart() response and keeps the latest state', async () => {
    const user = userEvent.setup()

    // Deferred refresh responses so we control resolution order. Two independent
    // mutations (update + clear) drive two concurrent refreshes; their gates are
    // separate (pendingIds vs clearing) so both getCart() calls stay in flight.
    let resolveFirst!: (v: CartResponse) => void
    let resolveSecond!: (v: CartResponse) => void
    const firstRefresh = new Promise<CartResponse>((r) => { resolveFirst = r })
    const secondRefresh = new Promise<CartResponse>((r) => { resolveSecond = r })

    // Older snapshot (total 4.5m) belongs to the FIRST-issued refresh.
    const olderCart = makeCart({
      items: [{ ...makeCart().items[0], qty: 3, subtotal_current: '4500000.00' }],
      summary: { ...makeCart().summary, total_qty: 3, total_current: '4500000.00' },
    })
    // Newer snapshot (total 6m) belongs to the SECOND-issued refresh.
    const newerCart = makeCart({
      items: [{ ...makeCart().items[0], qty: 4, subtotal_current: '6000000.00' }],
      summary: { ...makeCart().summary, total_qty: 4, total_current: '6000000.00' },
    })

    getCartMock
      .mockResolvedValueOnce(makeCart()) // initial load
      .mockReturnValueOnce(firstRefresh) // update mutation's refresh
      .mockReturnValueOnce(secondRefresh) // clear mutation's refresh
    updateCartItemMock.mockResolvedValue({ id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', qty: 3 })
    clearCartMock.mockResolvedValue(undefined)

    renderWithRouter(<CartCheckoutPage />, ['/cart'])

    await screen.findByText('Vintage Denim Jacket')

    // Issue refresh #1 (update quantity). Its getCart stays pending.
    await user.click(screen.getByRole('button', { name: /increase quantity|tăng số lượng/i }))
    await waitFor(() => expect(getCartMock).toHaveBeenCalledTimes(2))

    // Issue refresh #2 (clear cart) concurrently. Its getCart stays pending too.
    await user.click(screen.getByRole('button', { name: /clear cart|xóa giỏ hàng/i }))
    await waitFor(() => expect(getCartMock).toHaveBeenCalledTimes(3))

    // Resolve out of order: SECOND-issued (newer) first, then FIRST-issued (older).
    resolveSecond(newerCart)
    await waitFor(() => expect(screen.getByTestId('cart-total')).toHaveTextContent(/6\.000\.000/))
    resolveFirst(olderCart)

    // The stale older response must NOT overwrite the newer state.
    await waitFor(() => expect(clearCartMock).toHaveBeenCalledTimes(1))
    expect(screen.getByTestId('cart-total')).toHaveTextContent(/6\.000\.000/)
    expect(screen.getByTestId('cart-total')).not.toHaveTextContent(/4\.500\.000/)
  })

  it('surfaces a toast and leaves the rendered cart unchanged when a mutation fails', async () => {
    const user = userEvent.setup()
    getCartMock.mockResolvedValue(makeCart())
    updateCartItemMock.mockRejectedValue(new Error('Update failed'))

    renderWithRouter(<CartCheckoutPage />, ['/cart'])

    await screen.findByText('Vintage Denim Jacket')
    expect(screen.getByTestId('cart-total')).toHaveTextContent(/3\.000\.000/)

    await user.click(screen.getByRole('button', { name: /increase quantity|tăng số lượng/i }))

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalled())
    // No refresh happened (mutation rejected before refreshCart), so only the
    // initial load ran and the total is unchanged.
    expect(getCartMock).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('cart-total')).toHaveTextContent(/3\.000\.000/)
  })
})

describe('Header cart badge', () => {
  it('shows summary.total_qty when logged in and refreshes on the cart-updated event', async () => {
    authState.isLoggedIn = true
    authState.user = { email: 'c@example.com' }
    authState.role = 'customer'
    getCartMock
      .mockResolvedValueOnce(makeCart())
      .mockResolvedValueOnce(makeCart({ summary: { ...makeCart().summary, total_qty: 7 } }))

    renderWithRouter(<Header />, ['/'])

    const badge = await screen.findByTestId('cart-badge')
    expect(badge).toHaveTextContent('2')

    window.dispatchEvent(new Event('wearwhere:cart-updated'))
    await waitFor(() => expect(screen.getByTestId('cart-badge')).toHaveTextContent('7'))
  })

  it('hides the badge when the cart is empty', async () => {
    authState.isLoggedIn = true
    authState.user = { email: 'c@example.com' }
    authState.role = 'customer'
    getCartMock.mockResolvedValue(
      makeCart({ summary: { ...makeCart().summary, total_qty: 0 } }),
    )

    renderWithRouter(<Header />, ['/'])

    await waitFor(() => expect(getCartMock).toHaveBeenCalled())
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument()
  })

  it('shows no badge and makes no request when logged out', async () => {
    renderWithRouter(<Header />, ['/'])

    expect(getCartMock).not.toHaveBeenCalled()
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument()
  })
})
