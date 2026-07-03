import { apiRequest } from '@/shared/api/apiClient'

/**
 * Authenticated customer address API client.
 *
 * These endpoints live under `/me/addresses...` and require the customer's
 * Bearer token, so requests deliberately omit `skipAuth` to let the shared
 * apiClient attach the token and run its 401/refresh behavior. Paths are
 * relative; the apiClient prepends the `/api/v1` base URL.
 *
 * Types mirror the backend customer-address handler/DTOs exactly
 * (internal/customeraddr/domain/dto.go and
 * internal/customeraddr/handler/handler.go), so field names, optionality, and
 * the JSON envelopes match the Go `json:"..."` struct tags without translation.
 * List returns a `{ items }` envelope; Create/Update return the address object
 * directly; Delete returns 204 No Content.
 */

/** A customer address as returned by the backend. */
export type CustomerAddress = {
  id: string
  label: string
  recipient_name: string
  /** E.164 formatted phone, e.g. `+84901234567`. */
  recipient_phone: string
  address_line: string
  ward: string
  district: string
  city: string
  /** ISO 3166-1 alpha-2 country code, e.g. `VN`. */
  country: string
  /** Absent when no postal code was supplied. */
  postal_code?: string
  /** Absent when no note was supplied. */
  note?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

/** Response envelope for the address listing. */
export type AddressListResponse = {
  items: CustomerAddress[]
}

/**
 * Body for creating an address. Mirrors CreateAddressRequest:
 * label, recipient_name, recipient_phone (E.164) and the location fields are
 * required by the backend; country defaults to a valid ISO alpha-2 code;
 * postal_code and note are optional; is_default toggles the default address.
 */
export type CreateAddressRequest = {
  label: string
  recipient_name: string
  recipient_phone: string
  address_line: string
  ward: string
  district: string
  city: string
  country: string
  postal_code?: string
  note?: string
  is_default: boolean
}

/**
 * Body for updating an address. Mirrors UpdateAddressRequest: every field is
 * optional (PATCH semantics); only supplied fields are changed.
 */
export type UpdateAddressRequest = {
  label?: string
  recipient_name?: string
  recipient_phone?: string
  address_line?: string
  ward?: string
  district?: string
  city?: string
  country?: string
  postal_code?: string
  note?: string
  is_default?: boolean
}

/** GET /me/addresses — list the authenticated customer's addresses. */
export function listAddresses(): Promise<AddressListResponse> {
  return apiRequest<AddressListResponse>('/me/addresses', { method: 'GET' })
}

/** POST /me/addresses — create a new address; returns the created address. */
export function createAddress(
  input: CreateAddressRequest,
): Promise<CustomerAddress> {
  return apiRequest<CustomerAddress>('/me/addresses', {
    method: 'POST',
    body: input,
  })
}

/** PATCH /me/addresses/{id} — update an address; returns the updated address. */
export function updateAddress(
  id: string,
  input: UpdateAddressRequest,
): Promise<CustomerAddress> {
  return apiRequest<CustomerAddress>(
    `/me/addresses/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: input },
  )
}

/** DELETE /me/addresses/{id} — remove an address. Returns 204 No Content. */
export function deleteAddress(id: string): Promise<void> {
  return apiRequest<void>(`/me/addresses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
