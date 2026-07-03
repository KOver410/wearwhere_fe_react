import { MemoryRouter, Routes, Route, type InitialEntry } from 'react-router'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import { ApiError } from '@/shared/api/contracts'

import type {
  Order,
  OrderListItem,
  OrderListResponse,
  SubOrder,
} from '@/features/account/api/orderApi'

import { MyOrdersPage } from './MyOrdersPage'
import { OrderDetailPage } from './OrderDetailPage'
import { OrderSuccessPage } from '@/features/shop/pages/OrderSuccessPage'

const { listOrdersMock, getOrderMock, cancelOrderMock, toastErrorMock, toastSuccessMock } =
  vi.hoisted(() => ({
    listOrdersMock: vi.fn(),
    getOrderMock: vi.fn(),
    cancelOrderMock: vi.fn(),
    toastErrorMock: vi.fn(),
    toastSuccessMock: vi.fn(),
  }))

vi.mock('@/features/account/api/orderApi', () => ({
  listOrders: listOrdersMock,
  getOrder: getOrderMock,
  cancelOrder: cancelOrderMock,
}))

vi.mock('sonner', () => ({
  toast: { error: toastErrorMock, success: toastSuccessMock, message: vi.fn() },
}))

function makeListItem(overrides: Partial<OrderListItem> = {}): OrderListItem {
  return {
    id: 'list-id-1',
    order_no: 'WW-2026-0001',
    status: 'processing',
    payment_method: 'cod',
    payment_status: 'pending',
    grand_total_vnd: 3030000,
    item_count: 2,
    brand_count: 1,
    first_item_image: 'https://cdn.example.com/denim.jpg',
    first_item_name: 'Vintage Denim Jacket',
    created_at: '2026-06-01T00:00:00Z',
    ...overrides,
  }
}

function makeListResponse(overrides: Partial<OrderListResponse> = {}): OrderListResponse {
  return {
    data: [makeListItem()],
    page: 1,
    page_size: 10,
    total: 1,
    total_pages: 1,
    ...overrides,
  }
}

function makeSubOrder(overrides: Partial<SubOrder> = {}): SubOrder {
  return {
    id: 'sub-1',
    brand: { id: 'b1', slug: 'acme', name: 'ACME Studio' },
    subtotal_vnd: 3000000,
    shipping_fee_vnd: 30000,
    total_vnd: 3030000,
    status: 'pending',
    tracking_no: null,
    items: [
      {
        id: 'item-1',
        variant_id: 'v1',
        product_id: 'p1',
        product_name: 'Vintage Denim Jacket',
        variant_label: 'M / Blue',
        image_url: 'https://cdn.example.com/denim.jpg',
        qty: 2,
        unit_price_vnd: 1500000,
        line_total_vnd: 3000000,
      },
    ],
    ...overrides,
  }
}

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'order-id-1',
    order_no: 'WW-2026-0001',
    status: 'processing',
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
    sub_orders: [makeSubOrder()],
    created_at: '2026-06-01T00:00:00Z',
    paid_at: null,
    cancelled_at: null,
    ...overrides,
  }
}

function renderList(initialEntries: InitialEntry[] = ['/account/orders']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LanguageProvider>
        <MyOrdersPage />
      </LanguageProvider>
    </MemoryRouter>,
  )
}

function renderDetail(orderNo: string) {
  return render(
    <MemoryRouter initialEntries={[`/account/orders/${orderNo}`]}>
      <LanguageProvider>
        <Routes>
          <Route path="/account/orders/:id" element={<OrderDetailPage />} />
        </Routes>
      </LanguageProvider>
    </MemoryRouter>,
  )
}

function renderSuccess(search: string) {
  return render(
    <MemoryRouter initialEntries={[`/order/success${search}`]}>
      <LanguageProvider>
        <Routes>
          <Route path="/order/success" element={<OrderSuccessPage />} />
        </Routes>
      </LanguageProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  listOrdersMock.mockReset()
  getOrderMock.mockReset()
  cancelOrderMock.mockReset()
  toastErrorMock.mockReset()
  toastSuccessMock.mockReset()

  listOrdersMock.mockResolvedValue(makeListResponse())
  getOrderMock.mockResolvedValue(makeOrder())
  cancelOrderMock.mockResolvedValue(makeOrder({ status: 'cancelled' }))
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('MyOrdersPage (order list)', () => {
  it('loads backend data, renders VND, and links use order_no', async () => {
    renderList()

    await waitFor(() => expect(listOrdersMock).toHaveBeenCalled())
    expect(await screen.findByText('Vintage Denim Jacket')).toBeInTheDocument()
    expect(screen.getByText('WW-2026-0001')).toBeInTheDocument()
    // VND amount rendered (3.030.000), not USD.
    expect(screen.getByText(/3\.030\.000/)).toBeInTheDocument()
    // Detail link uses order_no.
    const link = screen.getByRole('link', { name: /details|chi tiết/i })
    expect(link).toHaveAttribute('href', '/account/orders/WW-2026-0001')
  })

  it('first request sends no status (All tab)', async () => {
    renderList()
    await waitFor(() => expect(listOrdersMock).toHaveBeenCalled())
    const firstArg = listOrdersMock.mock.calls[0][0]
    expect(firstArg.status).toBeUndefined()
  })

  it('status tabs send only BE root statuses', async () => {
    const user = userEvent.setup()
    renderList()
    await screen.findByText('Vintage Denim Jacket')

    await user.click(screen.getByRole('button', { name: /^pending payment$|chờ thanh toán/i }))
    await waitFor(() =>
      expect(listOrdersMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: 'pending_payment' }),
      ),
    )

    await user.click(screen.getByRole('button', { name: /^processing$|đang xử lý/i }))
    await waitFor(() =>
      expect(listOrdersMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: 'processing' }),
      ),
    )

    await user.click(screen.getByRole('button', { name: /^completed$|hoàn thành/i }))
    await waitFor(() =>
      expect(listOrdersMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: 'completed' }),
      ),
    )

    await user.click(screen.getByRole('button', { name: /^cancelled$|đã hủy/i }))
    await waitFor(() =>
      expect(listOrdersMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: 'cancelled' }),
      ),
    )
  })

  it('uses BE pagination fields and requests the next page', async () => {
    listOrdersMock.mockResolvedValue(
      makeListResponse({ page: 1, page_size: 10, total: 25, total_pages: 3 }),
    )
    const user = userEvent.setup()
    renderList()
    await screen.findByText('Vintage Denim Jacket')

    // Pagination reflects total_pages.
    expect(screen.getByTestId('orders-pagination')).toHaveTextContent(/3/)

    await user.click(screen.getByRole('button', { name: /next|sau/i }))
    await waitFor(() =>
      expect(listOrdersMock).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })),
    )
  })

  it('renders an empty state when there are no orders', async () => {
    listOrdersMock.mockResolvedValue(makeListResponse({ data: [], total: 0, total_pages: 0 }))
    renderList()
    await waitFor(() => expect(listOrdersMock).toHaveBeenCalled())
    expect(await screen.findByText(/no orders|không tìm thấy|chưa có đơn/i)).toBeInTheDocument()
  })

  it('renders an error state with retry', async () => {
    listOrdersMock.mockRejectedValueOnce(new Error('boom'))
    const user = userEvent.setup()
    renderList()
    const retry = await screen.findByRole('button', { name: /retry|thử lại/i })
    listOrdersMock.mockResolvedValue(makeListResponse())
    await user.click(retry)
    expect(await screen.findByText('Vintage Denim Jacket')).toBeInTheDocument()
  })

  it('ignores a stale response that resolves after a newer tab change', async () => {
    // Tab A (All) — slow request whose resolver we capture.
    let resolveA: (r: OrderListResponse) => void = () => {}
    const promiseA = new Promise<OrderListResponse>((resolve) => {
      resolveA = resolve
    })
    // Tab B (Processing) — newer request, resolves first.
    let resolveB: (r: OrderListResponse) => void = () => {}
    const promiseB = new Promise<OrderListResponse>((resolve) => {
      resolveB = resolve
    })

    const staleResponse = makeListResponse({
      data: [makeListItem({ id: 'stale', order_no: 'WW-STALE', first_item_name: 'STALE Jacket' })],
    })
    const freshResponse = makeListResponse({
      data: [makeListItem({ id: 'fresh', order_no: 'WW-FRESH', first_item_name: 'FRESH Tee' })],
    })

    listOrdersMock
      .mockImplementationOnce(() => promiseA) // initial All-tab load
      .mockImplementationOnce(() => promiseB) // after switching to Processing

    const user = userEvent.setup()
    renderList()
    await waitFor(() => expect(listOrdersMock).toHaveBeenCalledTimes(1))

    // Switch to the Processing tab — fires the newer request.
    await user.click(screen.getByRole('button', { name: /^processing$|đang xử lý/i }))
    await waitFor(() => expect(listOrdersMock).toHaveBeenCalledTimes(2))

    // Newer (tab B) resolves first, then the stale (tab A) resolves late.
    resolveB(freshResponse)
    expect(await screen.findByText('FRESH Tee')).toBeInTheDocument()
    resolveA(staleResponse)

    // Stale data must never overwrite the fresh tab's data.
    await waitFor(() => expect(screen.getByText('FRESH Tee')).toBeInTheDocument())
    expect(screen.queryByText('STALE Jacket')).not.toBeInTheDocument()
  })
})

describe('OrderDetailPage', () => {
  it('loads route :id as order_no and renders flattened items + labels', async () => {
    getOrderMock.mockResolvedValue(
      makeOrder({
        sub_orders: [
          makeSubOrder({
            id: 'sub-a',
            brand: { id: 'b1', slug: 'acme', name: 'ACME Studio' },
            status: 'pending',
            items: [
              {
                id: 'item-a',
                variant_id: 'va',
                product_id: 'pa',
                product_name: 'Vintage Denim Jacket',
                variant_label: 'M / Blue',
                image_url: null,
                qty: 1,
                unit_price_vnd: 1000000,
                line_total_vnd: 1000000,
              },
            ],
          }),
          makeSubOrder({
            id: 'sub-b',
            brand: { id: 'b2', slug: 'beta', name: 'Beta Brand' },
            status: 'confirmed',
            tracking_no: 'TRK-123',
            items: [
              {
                id: 'item-b',
                variant_id: 'vb',
                product_id: 'pb',
                product_name: 'Cotton Tee',
                variant_label: 'L / White',
                image_url: null,
                qty: 2,
                unit_price_vnd: 500000,
                line_total_vnd: 1000000,
              },
            ],
          }),
        ],
      }),
    )

    renderDetail('WW-2026-0001')
    await waitFor(() => expect(getOrderMock).toHaveBeenCalledWith('WW-2026-0001'))

    // Flattened items across both sub-orders.
    expect(await screen.findByText('Vintage Denim Jacket')).toBeInTheDocument()
    expect(screen.getByText('Cotton Tee')).toBeInTheDocument()
    // Brand labels preserved.
    expect(screen.getByText('ACME Studio')).toBeInTheDocument()
    expect(screen.getByText('Beta Brand')).toBeInTheDocument()
    // Tracking number visible.
    expect(screen.getByText(/TRK-123/)).toBeInTheDocument()
    // Shipping snapshot.
    expect(screen.getByText('Alice Default')).toBeInTheDocument()
  })

  it('shows the cancel control for an all-pending unpaid order and cancels with a reason', async () => {
    const user = userEvent.setup()
    renderDetail('WW-2026-0001')
    await screen.findByText('Vintage Denim Jacket')

    const cancelBtn = await screen.findByRole('button', { name: /cancel order|hủy đơn/i })
    await user.click(cancelBtn)

    const reasonInput = await screen.findByTestId('cancel-reason')
    await user.type(reasonInput, 'Changed my mind')
    await user.click(screen.getByRole('button', { name: /confirm cancel|xác nhận hủy/i }))

    await waitFor(() =>
      expect(cancelOrderMock).toHaveBeenCalledWith('WW-2026-0001', 'Changed my mind'),
    )
    // Reload after cancellation.
    await waitFor(() => expect(getOrderMock).toHaveBeenCalledTimes(2))
  })

  it('surfaces CANCEL_NOT_ALLOWED from the backend', async () => {
    cancelOrderMock.mockRejectedValueOnce(
      new ApiError(409, 'CANCEL_NOT_ALLOWED', 'Order can no longer be cancelled'),
    )
    const user = userEvent.setup()
    renderDetail('WW-2026-0001')
    await screen.findByText('Vintage Denim Jacket')

    await user.click(await screen.findByRole('button', { name: /cancel order|hủy đơn/i }))
    await screen.findByTestId('cancel-reason')
    await user.click(screen.getByRole('button', { name: /confirm cancel|xác nhận hủy/i }))

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalled())
  })

  it('hides cancel for a completed order', async () => {
    getOrderMock.mockResolvedValue(makeOrder({ status: 'completed' }))
    renderDetail('WW-2026-0001')
    await screen.findByText('Vintage Denim Jacket')
    expect(screen.queryByRole('button', { name: /cancel order|hủy đơn/i })).not.toBeInTheDocument()
  })

  it('hides cancel when a sub-order is not pending', async () => {
    getOrderMock.mockResolvedValue(
      makeOrder({ sub_orders: [makeSubOrder({ status: 'confirmed' })] }),
    )
    renderDetail('WW-2026-0001')
    await screen.findByText('Vintage Denim Jacket')
    expect(screen.queryByRole('button', { name: /cancel order|hủy đơn/i })).not.toBeInTheDocument()
  })

  it('hides cancel for a paid PayOS order', async () => {
    getOrderMock.mockResolvedValue(
      makeOrder({ payment_method: 'payos', payment_status: 'paid' }),
    )
    renderDetail('WW-2026-0001')
    await screen.findByText('Vintage Denim Jacket')
    expect(screen.queryByRole('button', { name: /cancel order|hủy đơn/i })).not.toBeInTheDocument()
  })

  it('keeps Return and Buy Again visible but disabled with Chưa hỗ trợ', async () => {
    renderDetail('WW-2026-0001')
    await screen.findByText('Vintage Denim Jacket')

    const ret = screen.getByRole('button', { name: /return|đổi trả/i })
    const buyAgain = screen.getByRole('button', { name: /buy again|mua lại/i })
    expect(ret).toBeDisabled()
    expect(buyAgain).toBeDisabled()
    expect(screen.getAllByText(/chưa hỗ trợ/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders an error state when the order fails to load', async () => {
    getOrderMock.mockRejectedValueOnce(new Error('boom'))
    renderDetail('WW-2026-0001')
    expect(await screen.findByText(/error|lỗi|not found|không tìm thấy/i)).toBeInTheDocument()
  })

  it('shows the Copied! badge only on the row whose tracking was copied', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    getOrderMock.mockResolvedValue(
      makeOrder({
        sub_orders: [
          makeSubOrder({
            id: 'sub-a',
            brand: { id: 'b1', slug: 'acme', name: 'ACME Studio' },
            status: 'shipped',
            tracking_no: 'TRK-AAA',
            items: [
              {
                id: 'item-a',
                variant_id: 'va',
                product_id: 'pa',
                product_name: 'Vintage Denim Jacket',
                variant_label: 'M / Blue',
                image_url: null,
                qty: 1,
                unit_price_vnd: 1000000,
                line_total_vnd: 1000000,
              },
            ],
          }),
          makeSubOrder({
            id: 'sub-b',
            brand: { id: 'b2', slug: 'beta', name: 'Beta Brand' },
            status: 'shipped',
            tracking_no: 'TRK-BBB',
            items: [
              {
                id: 'item-b',
                variant_id: 'vb',
                product_id: 'pb',
                product_name: 'Cotton Tee',
                variant_label: 'L / White',
                image_url: null,
                qty: 2,
                unit_price_vnd: 500000,
                line_total_vnd: 1000000,
              },
            ],
          }),
        ],
      }),
    )

    const user = userEvent.setup()
    renderDetail('WW-2026-0001')
    await screen.findByText('Vintage Denim Jacket')

    // Resolve each tracking row by its visible tracking number text.
    const rowA = screen.getByText('TRK-AAA').closest('div') as HTMLElement
    const rowB = screen.getByText('TRK-BBB').closest('div') as HTMLElement

    // Click copy on the first row only.
    await user.click(within(rowA).getByRole('button'))

    // Only the first row shows "Copied!".
    expect(within(rowA).getByText(/copied!|đã sao chép/i)).toBeInTheDocument()
    expect(within(rowB).queryByText(/copied!|đã sao chép/i)).not.toBeInTheDocument()
  })
})

describe('OrderSuccessPage', () => {
  it('reads orderNo from query params and loads the real order', async () => {
    renderSuccess('?orderNo=WW-2026-0001')
    await waitFor(() => expect(getOrderMock).toHaveBeenCalledWith('WW-2026-0001'))

    expect(await screen.findByText('WW-2026-0001')).toBeInTheDocument()
    expect(screen.getByText('Vintage Denim Jacket')).toBeInTheDocument()
    expect(screen.getByText(/3\.030\.000/)).toBeInTheDocument()

    // Links to detail and list (exact names avoid ambiguity).
    const detailLink = screen.getByRole('link', { name: /^xem đơn hàng$|^view order$/i })
    expect(detailLink).toHaveAttribute('href', '/account/orders/WW-2026-0001')
    const listLink = screen.getByRole('link', { name: /^đơn hàng của tôi$|^my orders$/i })
    expect(listLink).toHaveAttribute('href', '/account/orders')
  })

  it('renders a clear error and links to /account/orders when orderNo is missing', async () => {
    renderSuccess('')
    expect(getOrderMock).not.toHaveBeenCalled()
    expect(await screen.findByText(/error|lỗi|missing|không/i)).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /orders|đơn hàng/i })
    expect(link).toHaveAttribute('href', '/account/orders')
  })

  it('does not render mock recommendations', async () => {
    renderSuccess('?orderNo=WW-2026-0001')
    await screen.findByText('Vintage Denim Jacket')
    expect(screen.queryByText(/recommended for you|gợi ý cho bạn/i)).not.toBeInTheDocument()
  })
})
