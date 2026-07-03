import { MemoryRouter } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import type { Order, PaymentStatus, PaymentMethod } from '@/features/account/api/orderApi'

import { OrderSuccessPage } from './OrderSuccessPage'

const { getOrderMock } = vi.hoisted(() => ({ getOrderMock: vi.fn() }))

vi.mock('@/features/account/api/orderApi', () => ({
  getOrder: getOrderMock,
}))

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'order-1',
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
    sub_orders: [
      {
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
            image_url: null,
            qty: 2,
            unit_price_vnd: 1500000,
            line_total_vnd: 3000000,
          },
        ],
      },
    ],
    created_at: '2026-06-05T00:00:00Z',
    paid_at: null,
    cancelled_at: null,
    ...overrides,
  }
}

function renderPage(orderNo = 'WW-2026-0001') {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[`/order/success?orderNo=${orderNo}`]}>
        <OrderSuccessPage />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('OrderSuccessPage payment status', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    getOrderMock.mockReset()
  })

  it('confirms a COD order (pending payment, paid on delivery)', async () => {
    getOrderMock.mockResolvedValue(makeOrder())
    renderPage()
    expect(await screen.findByText(/order confirmed/i)).toBeInTheDocument()
  })

  it('confirms a paid PayOS order', async () => {
    getOrderMock.mockResolvedValue(
      makeOrder({ payment_method: 'payos' as PaymentMethod, payment_status: 'paid' as PaymentStatus, status: 'processing' }),
    )
    renderPage()
    expect(await screen.findByText(/order confirmed/i)).toBeInTheDocument()
  })

  it.each(['pending', 'cancelled', 'failed', 'expired'] as PaymentStatus[])(
    'does NOT show a false confirmation when a PayOS payment is %s',
    async (status) => {
      getOrderMock.mockResolvedValue(
        makeOrder({ payment_method: 'payos' as PaymentMethod, payment_status: status }),
      )
      renderPage()

      // Must not declare success for an unpaid/aborted PayOS payment.
      await waitFor(() => expect(getOrderMock).toHaveBeenCalled())
      expect(screen.queryByText(/order confirmed/i)).not.toBeInTheDocument()
      expect(await screen.findByText(/payment not completed/i)).toBeInTheDocument()
    },
  )
})
