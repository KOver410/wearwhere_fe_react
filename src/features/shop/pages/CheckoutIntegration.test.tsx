import { MemoryRouter, type InitialEntry } from 'react-router'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'

import type { CartResponse } from '@/features/account/api/cartApi'
import type { AddressListResponse } from '@/features/account/api/addressApi'
import type { CheckoutPreview, PlaceOrderResponse } from '@/features/account/api/orderApi'

import { CartCheckoutPage } from './CartCheckoutPage'

const {
  getCartMock,
  updateCartItemMock,
  removeCartItemMock,
  clearCartMock,
  listAddressesMock,
  previewCheckoutMock,
  placeOrderMock,
  toastErrorMock,
  toastMessageMock,
  toastSuccessMock,
  navigateMock,
} = vi.hoisted(() => ({
  getCartMock: vi.fn(),
  updateCartItemMock: vi.fn(),
  removeCartItemMock: vi.fn(),
  clearCartMock: vi.fn(),
  listAddressesMock: vi.fn(),
  previewCheckoutMock: vi.fn(),
  placeOrderMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastMessageMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  navigateMock: vi.fn(),
}))

vi.mock('@/features/account/api/cartApi', () => ({
  getCart: getCartMock,
  updateCartItem: updateCartItemMock,
  removeCartItem: removeCartItemMock,
  clearCart: clearCartMock,
}))

vi.mock('@/features/account/api/addressApi', () => ({
  listAddresses: listAddressesMock,
}))

vi.mock('@/features/account/api/orderApi', () => ({
  previewCheckout: previewCheckoutMock,
  placeOrder: placeOrderMock,
}))

vi.mock('sonner', () => ({
  toast: { error: toastErrorMock, message: toastMessageMock, success: toastSuccessMock },
}))

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => navigateMock }
})

const VARIANT_ID = '22222222-2222-2222-2222-222222222222'
const PRODUCT_ID = '33333333-3333-3333-3333-333333333333'
const ADDR_DEFAULT = 'addr-default-1111'
const ADDR_OTHER = 'addr-other-2222'

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

function makeAddresses(overrides: Partial<AddressListResponse> = {}): AddressListResponse {
  return {
    items: [
      {
        id: ADDR_OTHER,
        label: 'Office',
        recipient_name: 'Bob Other',
        recipient_phone: '+84900000002',
        address_line: '99 Second St',
        ward: 'Ward 2',
        district: 'District 2',
        city: 'Hanoi',
        country: 'VN',
        is_default: false,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      {
        id: ADDR_DEFAULT,
        label: 'Home',
        recipient_name: 'Alice Default',
        recipient_phone: '+84900000001',
        address_line: '1 First St',
        ward: 'Ward 1',
        district: 'District 1',
        city: 'Ho Chi Minh',
        country: 'VN',
        is_default: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ],
    ...overrides,
  }
}

function makePreview(overrides: Partial<CheckoutPreview> = {}): CheckoutPreview {
  return {
    cart_empty: false,
    address: {
      recipient: 'Alice Default',
      phone: '+84900000001',
      line1: '1 First St',
      ward: 'Ward 1',
      district: 'District 1',
      city: 'Ho Chi Minh',
    },
    sub_orders: [
      {
        brand: { id: 'b1', slug: 'acme', name: 'ACME Studio' },
        items: [
          {
            variant_id: VARIANT_ID,
            product_id: PRODUCT_ID,
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
    ...overrides,
  }
}

function makePlaceResponse(overrides: Partial<PlaceOrderResponse> = {}): PlaceOrderResponse {
  return {
    order: {
      id: 'order-id-1',
      order_no: 'WW-2026-0001',
      status: 'pending_payment',
      payment_method: 'cod',
      payment_status: 'pending',
      subtotal_vnd: 3000000,
      shipping_total_vnd: 30000,
      grand_total_vnd: 3030000,
      shipping_address: {
        recipient: 'Alice Default',
        phone: '+84900000001',
        line1: '1 First St',
        ward: 'Ward 1',
        district: 'District 1',
        city: 'Ho Chi Minh',
      },
      notes: '',
      sub_orders: [],
      created_at: '2026-06-05T00:00:00Z',
      paid_at: null,
      cancelled_at: null,
    },
    payment: {
      id: 'pay-1',
      method: 'cod',
      status: 'pending',
      amount_vnd: 3030000,
      checkout_url: null,
      qr_code: null,
      expired_at: null,
    },
    ...overrides,
  }
}

function renderPage(initialEntries: InitialEntry[] = ['/cart']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LanguageProvider>
        <CartCheckoutPage />
      </LanguageProvider>
    </MemoryRouter>,
  )
}

/** Click through cart -> shipping. Waits for the cart to load first. */
async function goToShipping(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByText('Vintage Denim Jacket')
  await user.click(screen.getByRole('button', { name: /continue to shipping|tiếp tục đến giao hàng/i }))
}

beforeEach(() => {
  getCartMock.mockReset()
  updateCartItemMock.mockReset()
  removeCartItemMock.mockReset()
  clearCartMock.mockReset()
  listAddressesMock.mockReset()
  previewCheckoutMock.mockReset()
  placeOrderMock.mockReset()
  toastErrorMock.mockReset()
  toastMessageMock.mockReset()
  toastSuccessMock.mockReset()
  navigateMock.mockReset()

  getCartMock.mockResolvedValue(makeCart())
  listAddressesMock.mockResolvedValue(makeAddresses())
  previewCheckoutMock.mockResolvedValue(makePreview())
  placeOrderMock.mockResolvedValue(makePlaceResponse())
})

describe('Checkout shipping step (saved addresses)', () => {
  it('loads saved addresses and selects the default address first', async () => {
    const user = userEvent.setup()
    renderPage()
    await goToShipping(user)

    await waitFor(() => expect(listAddressesMock).toHaveBeenCalled())
    // Both addresses render.
    expect(await screen.findByText('Alice Default')).toBeInTheDocument()
    expect(screen.getByText('Bob Other')).toBeInTheDocument()

    // The default address triggers a preview (auto-selected first).
    await waitFor(() => expect(previewCheckoutMock).toHaveBeenCalledWith(ADDR_DEFAULT))
  })

  it('blocks continuing with no addresses and links to /account/addresses', async () => {
    listAddressesMock.mockResolvedValue({ items: [] })
    const user = userEvent.setup()
    renderPage()
    await goToShipping(user)

    await waitFor(() => expect(listAddressesMock).toHaveBeenCalled())
    const empty = await screen.findByTestId('no-addresses')
    const link = within(empty).getByRole('link', { name: /address|địa chỉ/i })
    expect(link).toHaveAttribute('href', '/account/addresses')
    expect(previewCheckoutMock).not.toHaveBeenCalled()
    // No place-order is reachable: continue-to-payment is disabled.
    expect(
      screen.getByRole('button', { name: /continue to payment|tiếp tục thanh toán/i }),
    ).toBeDisabled()
  })

  it('calls previewCheckout(address.id) when selecting a non-default address', async () => {
    const user = userEvent.setup()
    renderPage()
    await goToShipping(user)

    await screen.findByText('Bob Other')
    await waitFor(() => expect(previewCheckoutMock).toHaveBeenCalledWith(ADDR_DEFAULT))

    await user.click(screen.getByText('Bob Other'))
    await waitFor(() => expect(previewCheckoutMock).toHaveBeenCalledWith(ADDR_OTHER))
  })
})

describe('Checkout preview rendering', () => {
  it('renders sub-orders, warnings, shipping, and grand total from the backend', async () => {
    previewCheckoutMock.mockResolvedValue(
      makePreview({ warnings: ['Vintage Denim Jacket is low on stock'] }),
    )
    const user = userEvent.setup()
    renderPage()
    await goToShipping(user)

    await screen.findByText('Alice Default')
    const summary = await screen.findByTestId('preview-summary')
    // Sub-order brand + item (scoped to the preview, not the left cart column).
    expect(within(summary).getByText('Vintage Denim Jacket')).toBeInTheDocument()
    expect(within(summary).getByText('ACME Studio')).toBeInTheDocument()
    // Warning surfaced.
    expect(await screen.findByText(/low on stock/i)).toBeInTheDocument()
    // Shipping total and grand total in VND.
    expect(within(summary).getByTestId('preview-shipping')).toHaveTextContent(/30\.000/)
    expect(within(summary).getByTestId('preview-grand-total')).toHaveTextContent(/3\.030\.000/)
    expect(within(summary).getByTestId('preview-subtotal')).toHaveTextContent(/3\.000\.000/)
  })
})

describe('Checkout payment controls', () => {
  it('keeps card, paypal, and voucher visible but disabled with Chưa hỗ trợ', async () => {
    const user = userEvent.setup()
    renderPage()
    await goToShipping(user)

    await screen.findByText('Alice Default')
    await waitFor(() => expect(previewCheckoutMock).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: /continue to payment|tiếp tục thanh toán/i }))

    // Supported.
    expect(screen.getByRole('radio', { name: /cash on delivery|cod|thanh toán khi nhận/i })).toBeEnabled()
    expect(screen.getByRole('radio', { name: /payos/i })).toBeEnabled()

    // Unsupported: disabled + Chưa hỗ trợ.
    const card = screen.getByRole('radio', { name: /card|thẻ/i })
    const paypal = screen.getByRole('radio', { name: /paypal/i })
    const voucher = screen.getByRole('radio', { name: /voucher/i })
    expect(card).toBeDisabled()
    expect(paypal).toBeDisabled()
    expect(voucher).toBeDisabled()
    expect(screen.getAllByText(/chưa hỗ trợ/i).length).toBeGreaterThanOrEqual(3)
  })
})

describe('Checkout order placement', () => {
  async function reachPayment(user: ReturnType<typeof userEvent.setup>) {
    await goToShipping(user)
    await screen.findByText('Alice Default')
    await waitFor(() => expect(previewCheckoutMock).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: /continue to payment|tiếp tục thanh toán/i }))
  }

  it('places a COD order and navigates to /order/success with the order_no', async () => {
    const user = userEvent.setup()
    renderPage()
    await reachPayment(user)

    await user.click(screen.getByRole('button', { name: /place order|đặt hàng/i }))

    await waitFor(() =>
      expect(placeOrderMock).toHaveBeenCalledWith({
        address_id: ADDR_DEFAULT,
        payment_method: 'cod',
        notes: '',
      }),
    )
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/order/success?orderNo=WW-2026-0001'),
    )
  })

  it('redirects to the PayOS checkout_url on a payos order', async () => {
    placeOrderMock.mockResolvedValue(
      makePlaceResponse({
        order: { ...makePlaceResponse().order, payment_method: 'payos', payment_status: 'pending' },
        payment: { ...makePlaceResponse().payment, method: 'payos', checkout_url: 'https://payos.test/checkout/abc' },
      }),
    )
    const originalLocation = window.location
    const hrefSetter = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, set href(v: string) { hrefSetter(v) }, get href() { return '' } },
    })

    const user = userEvent.setup()
    renderPage()
    await reachPayment(user)

    await user.click(screen.getByRole('radio', { name: /payos/i }))
    await user.click(screen.getByRole('button', { name: /place order|đặt hàng/i }))

    await waitFor(() =>
      expect(placeOrderMock).toHaveBeenCalledWith({
        address_id: ADDR_DEFAULT,
        payment_method: 'payos',
        notes: '',
      }),
    )
    await waitFor(() => expect(hrefSetter).toHaveBeenCalledWith('https://payos.test/checkout/abc'))
    expect(navigateMock).not.toHaveBeenCalled()

    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
  })

  it('shows an error and does not navigate when a payos order has no checkout_url', async () => {
    placeOrderMock.mockResolvedValue(
      makePlaceResponse({
        order: { ...makePlaceResponse().order, payment_method: 'payos' },
        payment: { ...makePlaceResponse().payment, method: 'payos', checkout_url: null },
      }),
    )
    const user = userEvent.setup()
    renderPage()
    await reachPayment(user)

    await user.click(screen.getByRole('radio', { name: /payos/i }))
    await user.click(screen.getByRole('button', { name: /place order|đặt hàng/i }))

    await waitFor(() => expect(placeOrderMock).toHaveBeenCalled())
    await waitFor(() => expect(toastErrorMock).toHaveBeenCalled())
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('prevents duplicate placement while a submit is in flight', async () => {
    let resolvePlace!: (v: PlaceOrderResponse) => void
    placeOrderMock.mockReturnValue(new Promise<PlaceOrderResponse>((r) => { resolvePlace = r }))
    const user = userEvent.setup()
    renderPage()
    await reachPayment(user)

    const placeBtn = screen.getByRole('button', { name: /place order|đặt hàng/i })
    await user.click(placeBtn)
    // Button becomes disabled while submitting.
    await waitFor(() => expect(placeBtn).toBeDisabled())
    await user.click(placeBtn)

    expect(placeOrderMock).toHaveBeenCalledTimes(1)
    resolvePlace(makePlaceResponse())
    await waitFor(() => expect(navigateMock).toHaveBeenCalled())
  })

  it('disables placement when the preview reports warnings', async () => {
    previewCheckoutMock.mockResolvedValue(
      makePreview({ warnings: ['Item unavailable'] }),
    )
    const user = userEvent.setup()
    renderPage()
    await goToShipping(user)
    await screen.findByText('Alice Default')
    await waitFor(() => expect(previewCheckoutMock).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: /continue to payment|tiếp tục thanh toán/i }))

    expect(screen.getByRole('button', { name: /place order|đặt hàng/i })).toBeDisabled()
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})
