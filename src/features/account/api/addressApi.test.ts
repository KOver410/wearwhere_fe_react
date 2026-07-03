import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiRequestMock = vi.fn()

vi.mock('@/shared/api/apiClient', () => ({
  apiRequest: apiRequestMock,
}))

const sampleAddress = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
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
}

describe('addressApi', () => {
  beforeEach(() => {
    vi.resetModules()
    apiRequestMock.mockReset()
  })

  describe('listAddresses', () => {
    it('GETs /me/addresses and returns the { items } envelope', async () => {
      apiRequestMock.mockResolvedValue({ items: [sampleAddress] })
      const { listAddresses } = await import('./addressApi')

      await expect(listAddresses()).resolves.toEqual({ items: [sampleAddress] })

      expect(apiRequestMock).toHaveBeenCalledWith('/me/addresses', {
        method: 'GET',
      })
    })

    it('does not pass skipAuth (addresses are authenticated)', async () => {
      apiRequestMock.mockResolvedValue({ items: [] })
      const { listAddresses } = await import('./addressApi')

      await listAddresses()

      const [, options] = apiRequestMock.mock.calls[0]
      expect(options).not.toHaveProperty('skipAuth')
    })
  })

  describe('createAddress', () => {
    it('POSTs /me/addresses with the exact backend field set', async () => {
      apiRequestMock.mockResolvedValue(sampleAddress)
      const { createAddress } = await import('./addressApi')

      const input = {
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
      }

      await expect(createAddress(input)).resolves.toEqual(sampleAddress)

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/addresses')
      expect(options.method).toBe('POST')
      expect(options.body).toEqual({
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
      })
    })
  })

  describe('updateAddress', () => {
    it('PATCHes /me/addresses/{id} with the provided fields', async () => {
      apiRequestMock.mockResolvedValue({ ...sampleAddress, label: 'Office' })
      const { updateAddress } = await import('./addressApi')

      const input = { label: 'Office', is_default: false }

      await expect(
        updateAddress('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', input),
      ).resolves.toEqual({ ...sampleAddress, label: 'Office' })

      expect(apiRequestMock).toHaveBeenCalledTimes(1)
      const [path, options] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/addresses/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      expect(options.method).toBe('PATCH')
      expect(options.body).toEqual({ label: 'Office', is_default: false })
    })

    it('encodes the id path segment', async () => {
      apiRequestMock.mockResolvedValue(sampleAddress)
      const { updateAddress } = await import('./addressApi')

      await updateAddress('a b/c', { label: 'X' })

      const [path] = apiRequestMock.mock.calls[0]
      expect(path).toBe('/me/addresses/a%20b%2Fc')
    })
  })

  describe('deleteAddress', () => {
    it('DELETEs /me/addresses/{id}', async () => {
      apiRequestMock.mockResolvedValue(undefined)
      const { deleteAddress } = await import('./addressApi')

      await deleteAddress('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')

      expect(apiRequestMock).toHaveBeenCalledWith(
        '/me/addresses/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        { method: 'DELETE' },
      )
    })
  })
})
