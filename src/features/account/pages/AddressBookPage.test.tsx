import { MemoryRouter } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'

import type { CustomerAddress } from '@/features/account/api/addressApi'

import { AddressBookPage } from './AddressBookPage'

const {
  listAddressesMock,
  createAddressMock,
  updateAddressMock,
  deleteAddressMock,
  toastSuccessMock,
  toastErrorMock,
} = vi.hoisted(() => ({
  listAddressesMock: vi.fn(),
  createAddressMock: vi.fn(),
  updateAddressMock: vi.fn(),
  deleteAddressMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}))

vi.mock('@/features/account/api/addressApi', () => ({
  listAddresses: listAddressesMock,
  createAddress: createAddressMock,
  updateAddress: updateAddressMock,
  deleteAddress: deleteAddressMock,
}))

vi.mock('sonner', () => ({
  toast: { success: toastSuccessMock, error: toastErrorMock, message: vi.fn() },
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({ logout: vi.fn() }),
}))

const ADDRESS_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

function makeAddress(overrides: Partial<CustomerAddress> = {}): CustomerAddress {
  return {
    id: ADDRESS_ID,
    label: 'Home',
    recipient_name: 'Nguyen Van A',
    recipient_phone: '+84901234567',
    address_line: '123 Le Loi',
    ward: 'Ben Nghe',
    district: 'District 1',
    city: 'Ho Chi Minh City',
    country: 'VN',
    postal_code: '700000',
    note: 'Ring the bell',
    is_default: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/account/addresses']}>
      <LanguageProvider>
        <AddressBookPage />
      </LanguageProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.setItem('ww-lang', 'en')
  listAddressesMock.mockReset()
  createAddressMock.mockReset()
  updateAddressMock.mockReset()
  deleteAddressMock.mockReset()
  toastSuccessMock.mockReset()
  toastErrorMock.mockReset()
})

describe('AddressBookPage', () => {
  it('shows a loading state while fetching', () => {
    listAddressesMock.mockReturnValue(new Promise(() => {}))

    renderPage()

    expect(screen.getByTestId('address-loading')).toBeInTheDocument()
  })

  it('renders backend addresses', async () => {
    listAddressesMock.mockResolvedValue({ items: [makeAddress()] })

    renderPage()

    expect(await screen.findByText('Nguyen Van A')).toBeInTheDocument()
    expect(screen.getByText('123 Le Loi')).toBeInTheDocument()
    expect(screen.getByText('+84901234567')).toBeInTheDocument()
    expect(screen.getByText('DEFAULT')).toBeInTheDocument()
  })

  it('renders an empty state when there are no addresses', async () => {
    listAddressesMock.mockResolvedValue({ items: [] })

    renderPage()

    expect(
      await screen.findByText(/no addresses yet/i),
    ).toBeInTheDocument()
  })

  it('renders a retryable error state and refetches on retry', async () => {
    const user = userEvent.setup()
    listAddressesMock.mockRejectedValueOnce(new Error('Boom'))

    renderPage()

    expect(await screen.findByText('Boom')).toBeInTheDocument()

    listAddressesMock.mockResolvedValueOnce({ items: [makeAddress()] })
    await user.click(screen.getByRole('button', { name: /retry/i }))

    expect(await screen.findByText('Nguyen Van A')).toBeInTheDocument()
    expect(listAddressesMock).toHaveBeenCalledTimes(2)
  })

  it('creates an address with mapped BE fields, re-fetches, and toasts success', async () => {
    const user = userEvent.setup()
    listAddressesMock.mockResolvedValue({ items: [] })
    createAddressMock.mockResolvedValue(makeAddress())

    renderPage()

    await screen.findByText(/no addresses yet/i)

    await user.click(screen.getByRole('button', { name: /add address/i }))

    await user.type(screen.getByLabelText(/label/i), 'Home')
    await user.type(screen.getByLabelText(/recipient name/i), 'Nguyen Van A')
    await user.type(screen.getByLabelText(/recipient phone/i), '+84901234567')
    await user.type(screen.getByLabelText(/address line/i), '123 Le Loi')
    await user.type(screen.getByLabelText(/^ward/i), 'Ben Nghe')
    await user.type(screen.getByLabelText(/district/i), 'District 1')
    await user.type(screen.getByLabelText(/^city/i), 'Ho Chi Minh City')
    // country defaults to VN
    await user.click(screen.getByLabelText(/set as default address/i))

    listAddressesMock.mockResolvedValue({ items: [makeAddress()] })
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    await waitFor(() => expect(createAddressMock).toHaveBeenCalledTimes(1))
    expect(createAddressMock).toHaveBeenCalledWith({
      label: 'Home',
      recipient_name: 'Nguyen Van A',
      recipient_phone: '+84901234567',
      address_line: '123 Le Loi',
      ward: 'Ben Nghe',
      district: 'District 1',
      city: 'Ho Chi Minh City',
      country: 'VN',
      is_default: true,
    })
    await waitFor(() => expect(toastSuccessMock).toHaveBeenCalled())
    // re-fetch: once on mount, once after create.
    await waitFor(() => expect(listAddressesMock).toHaveBeenCalledTimes(2))
  })

  it('surfaces a backend validation error via toast without adding a fake address', async () => {
    const user = userEvent.setup()
    listAddressesMock.mockResolvedValue({ items: [] })
    createAddressMock.mockRejectedValue(new Error('recipient_phone must be E.164'))

    renderPage()

    await screen.findByText(/no addresses yet/i)

    await user.click(screen.getByRole('button', { name: /add address/i }))
    await user.type(screen.getByLabelText(/label/i), 'Home')
    await user.type(screen.getByLabelText(/recipient name/i), 'Nguyen Van A')
    await user.type(screen.getByLabelText(/recipient phone/i), '0901234567')
    await user.type(screen.getByLabelText(/address line/i), '123 Le Loi')
    await user.type(screen.getByLabelText(/^ward/i), 'Ben Nghe')
    await user.type(screen.getByLabelText(/district/i), 'District 1')
    await user.type(screen.getByLabelText(/^city/i), 'Ho Chi Minh City')

    await user.click(screen.getByRole('button', { name: /^save$/i }))

    await waitFor(() =>
      expect(toastErrorMock).toHaveBeenCalledWith('recipient_phone must be E.164'),
    )
    // No fake address created locally; the empty state remains.
    expect(screen.getByText(/no addresses yet/i)).toBeInTheDocument()
    // Only the initial mount fetch happened (no re-fetch on failure).
    expect(listAddressesMock).toHaveBeenCalledTimes(1)
  })

  it('deletes an address, re-fetches, and toasts success', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    listAddressesMock.mockResolvedValue({ items: [makeAddress({ is_default: false })] })
    deleteAddressMock.mockResolvedValue(undefined)

    renderPage()

    await screen.findByText('Nguyen Van A')

    listAddressesMock.mockResolvedValue({ items: [] })
    await user.click(screen.getByRole('button', { name: /delete address/i }))

    await waitFor(() => expect(deleteAddressMock).toHaveBeenCalledWith(ADDRESS_ID))
    await waitFor(() => expect(toastSuccessMock).toHaveBeenCalled())
    await waitFor(() => expect(listAddressesMock).toHaveBeenCalledTimes(2))

    confirmSpy.mockRestore()
  })

  it('pre-populates the edit form and updates the address, then re-fetches', async () => {
    const user = userEvent.setup()
    listAddressesMock.mockResolvedValue({ items: [makeAddress()] })
    updateAddressMock.mockResolvedValue(makeAddress({ label: 'House' }))

    renderPage()

    await screen.findByText('Nguyen Van A')

    await user.click(screen.getByRole('button', { name: /edit address/i }))

    // Form is pre-populated from the existing address.
    const labelInput = screen.getByLabelText(/label/i) as HTMLInputElement
    expect(labelInput.value).toBe('Home')
    expect((screen.getByLabelText(/recipient name/i) as HTMLInputElement).value).toBe('Nguyen Van A')

    await user.clear(labelInput)
    await user.type(labelInput, 'House')

    listAddressesMock.mockResolvedValue({ items: [makeAddress({ label: 'House' })] })
    await user.click(screen.getByRole('button', { name: /^update$/i }))

    await waitFor(() => expect(updateAddressMock).toHaveBeenCalledTimes(1))
    expect(updateAddressMock).toHaveBeenCalledWith(
      ADDRESS_ID,
      expect.objectContaining({ label: 'House', recipient_name: 'Nguyen Van A' }),
    )
    // re-fetch: once on mount, once after update.
    await waitFor(() => expect(listAddressesMock).toHaveBeenCalledTimes(2))
  })

  it('sets a non-default address as default and re-fetches', async () => {
    const user = userEvent.setup()
    listAddressesMock.mockResolvedValue({ items: [makeAddress({ is_default: false })] })
    updateAddressMock.mockResolvedValue(makeAddress({ is_default: true }))

    renderPage()

    await screen.findByText('Nguyen Van A')

    listAddressesMock.mockResolvedValue({ items: [makeAddress({ is_default: true })] })
    await user.click(screen.getByRole('button', { name: /set as default/i }))

    await waitFor(() =>
      expect(updateAddressMock).toHaveBeenCalledWith(ADDRESS_ID, { is_default: true }),
    )
    await waitFor(() => expect(toastSuccessMock).toHaveBeenCalled())
    // re-fetch: once on mount, once after setting default.
    await waitFor(() => expect(listAddressesMock).toHaveBeenCalledTimes(2))
  })

  it('does not delete when the confirmation is dismissed', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    listAddressesMock.mockResolvedValue({ items: [makeAddress({ is_default: false })] })

    renderPage()

    await screen.findByText('Nguyen Van A')

    await user.click(screen.getByRole('button', { name: /delete address/i }))

    expect(confirmSpy).toHaveBeenCalled()
    expect(deleteAddressMock).not.toHaveBeenCalled()
    // Only the initial mount fetch happened.
    expect(listAddressesMock).toHaveBeenCalledTimes(1)

    confirmSpy.mockRestore()
  })

  it('deletes when the confirmation is accepted, then re-fetches', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    listAddressesMock.mockResolvedValue({ items: [makeAddress({ is_default: false })] })
    deleteAddressMock.mockResolvedValue(undefined)

    renderPage()

    await screen.findByText('Nguyen Van A')

    listAddressesMock.mockResolvedValue({ items: [] })
    await user.click(screen.getByRole('button', { name: /delete address/i }))

    await waitFor(() => expect(deleteAddressMock).toHaveBeenCalledWith(ADDRESS_ID))
    await waitFor(() => expect(listAddressesMock).toHaveBeenCalledTimes(2))

    confirmSpy.mockRestore()
  })

  it('maps the default checkbox to is_default=false when unchecked on create', async () => {
    const user = userEvent.setup()
    listAddressesMock.mockResolvedValue({ items: [] })
    createAddressMock.mockResolvedValue(makeAddress({ is_default: false }))

    renderPage()

    await screen.findByText(/no addresses yet/i)

    await user.click(screen.getByRole('button', { name: /add address/i }))
    await user.type(screen.getByLabelText(/label/i), 'Office')
    await user.type(screen.getByLabelText(/recipient name/i), 'Tran Thi B')
    await user.type(screen.getByLabelText(/recipient phone/i), '+84909999999')
    await user.type(screen.getByLabelText(/address line/i), '99 Nguyen Hue')
    await user.type(screen.getByLabelText(/^ward/i), 'Ben Nghe')
    await user.type(screen.getByLabelText(/district/i), 'District 1')
    await user.type(screen.getByLabelText(/^city/i), 'Ho Chi Minh City')

    await user.click(screen.getByRole('button', { name: /^save$/i }))

    await waitFor(() => expect(createAddressMock).toHaveBeenCalledTimes(1))
    expect(createAddressMock.mock.calls[0][0]).toMatchObject({ is_default: false })
  })
})
