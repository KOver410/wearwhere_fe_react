import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthTokens } from './contracts'

const STORAGE_KEY = 'wearwhere.auth.tokens'
const API_BASE_URL = 'http://localhost:8080/api/v1'

const oldTokens: AuthTokens = {
  access_token: 'old-access',
  refresh_token: 'refresh-token',
  token_type: 'Bearer',
  expires_at: '2026-06-05T00:00:00.000Z',
}

const newTokens: AuthTokens = {
  access_token: 'new-access',
  refresh_token: 'new-refresh',
  token_type: 'Bearer',
  expires_at: '2026-06-06T00:00:00.000Z',
}

const replacementTokens: AuthTokens = {
  access_token: 'replacement-access',
  refresh_token: 'replacement-refresh',
  token_type: 'Bearer',
  expires_at: '2026-06-07T00:00:00.000Z',
}

function rotatedTokens(step: number): AuthTokens {
  return {
    access_token: `access-${step}`,
    refresh_token: `refresh-${step}`,
    token_type: 'Bearer',
    expires_at: `2026-06-${String(step + 10).padStart(2, '0')}T00:00:00.000Z`,
  }
}

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

function jsonResponse(body: unknown, status = 200, statusText = '') {
  return new Response(JSON.stringify(body), { status, statusText })
}

function emptyResponse(status = 204, statusText = '') {
  return new Response(null, { status, statusText })
}

function requestHeaders(fetchMock: ReturnType<typeof vi.fn>, callIndex = 0) {
  const init = fetchMock.mock.calls[callIndex]?.[1] as RequestInit | undefined
  return new Headers(init?.headers)
}

describe('apiRequest', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.resetModules()
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('constructs an ApiError with the expected Error behavior', async () => {
    const { ApiError } = await import('./contracts')

    const error = new ApiError(422, 'INVALID', 'Invalid request', { field: 'email' })

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.name).toBe('ApiError')
    expect(error.message).toBe('Invalid request')
    expect(error.status).toBe(422)
    expect(error.code).toBe('INVALID')
    expect(error.details).toEqual({ field: 'email' })
  })

  it.each([
    ['/products', `${API_BASE_URL}/products`],
    ['products', `${API_BASE_URL}/products`],
  ])('joins the API base URL and path %s without duplicate slashes', async (path, expected) => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }))
    const { apiRequest } = await import('./apiClient')

    await apiRequest(path)

    expect(fetchMock).toHaveBeenCalledWith(expected, expect.any(Object))
  })

  it('JSON serializes a defined body, sets content type, and preserves caller headers', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }))
    const { apiRequest } = await import('./apiClient')

    await apiRequest('/products', {
      method: 'POST',
      body: { name: 'Jacket' },
      headers: { 'X-Request-ID': 'request-1' },
    })

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit
    expect(init.body).toBe(JSON.stringify({ name: 'Jacket' }))
    expect(requestHeaders(fetchMock).get('Content-Type')).toBe('application/json')
    expect(requestHeaders(fetchMock).get('X-Request-ID')).toBe('request-1')
  })

  it('adds the stored access token as a bearer header', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }))
    const { apiRequest } = await import('./apiClient')

    await apiRequest('/products')

    expect(requestHeaders(fetchMock).get('Authorization')).toBe('Bearer old-access')
  })

  it('does not add auth when skipAuth is true', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }))
    const { apiRequest } = await import('./apiClient')

    await apiRequest('/products', { skipAuth: true })

    expect(requestHeaders(fetchMock).has('Authorization')).toBe(false)
  })

  it('does not overwrite an explicit caller Authorization header', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }))
    const { apiRequest } = await import('./apiClient')

    await apiRequest('/products', { headers: { Authorization: 'Custom token' } })

    expect(requestHeaders(fetchMock).get('Authorization')).toBe('Custom token')
  })

  it.each([
    ['204 response', emptyResponse(204)],
    ['empty successful body', new Response('', { status: 200 })],
  ])('returns undefined for an %s', async (_name, response) => {
    fetchMock.mockResolvedValue(response)
    const { apiRequest } = await import('./apiClient')

    await expect(apiRequest('/products')).resolves.toBeUndefined()
  })

  it('parses a successful JSON response', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 'product-1' }))
    const { apiRequest } = await import('./apiClient')

    await expect(apiRequest<{ id: string }>('/products/product-1')).resolves.toEqual({
      id: 'product-1',
    })
  })

  it('converts a backend error envelope into ApiError without relying on content type', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: { name: 'required' } } },
        422,
        'Unprocessable Entity',
      ),
    )
    const { apiRequest } = await import('./apiClient')
    const { ApiError } = await import('./contracts')

    await expect(apiRequest('/products')).rejects.toEqual(
      new ApiError(422, 'VALIDATION_ERROR', 'Invalid input', { name: 'required' }),
    )
  })

  it('uses a generic ApiError for non-envelope failures without exposing the response body', async () => {
    fetchMock.mockResolvedValue(
      new Response('private server details', { status: 500, statusText: 'Internal Server Error' }),
    )
    const { apiRequest } = await import('./apiClient')
    const { ApiError } = await import('./contracts')

    await expect(apiRequest('/products')).rejects.toEqual(
      new ApiError(500, 'HTTP_ERROR', 'Internal Server Error'),
    )
  })

  it.each(['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'])(
    'never refreshes recursively for %s',
    async (path) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
      fetchMock.mockResolvedValue(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Denied' } }, 401))
      const { apiRequest } = await import('./apiClient')

      await expect(apiRequest(path, { method: 'POST' })).rejects.toMatchObject({
        status: 401,
        code: 'UNAUTHORIZED',
      })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    },
  )

  it('does not refresh when skipRefresh is true', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    fetchMock.mockResolvedValue(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Denied' } }, 401))
    const { apiRequest } = await import('./apiClient')

    await expect(apiRequest('/products', { skipRefresh: true })).rejects.toMatchObject({ status: 401 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('refreshes, saves tokens in the same persistence mode, and retries once with the new token', async () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      .mockResolvedValueOnce(jsonResponse({ tokens: newTokens }))
      .mockResolvedValueOnce(jsonResponse({ id: 'product-1' }))
    const { apiRequest } = await import('./apiClient')

    await expect(apiRequest<{ id: string }>('/products/product-1')).resolves.toEqual({ id: 'product-1' })

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(fetchMock.mock.calls[1]?.[0]).toBe(`${API_BASE_URL}/auth/refresh`)
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
      method: 'POST',
      body: JSON.stringify({ refresh_token: oldTokens.refresh_token }),
    })
    expect(requestHeaders(fetchMock, 2).get('Authorization')).toBe('Bearer new-access')
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(newTokens))
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('shares one refresh request across two concurrent 401 responses', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    let protectedRequestCount = 0
    fetchMock.mockImplementation((url: string, init?: RequestInit) => {
      if (url.endsWith('/auth/refresh')) {
        return Promise.resolve(jsonResponse({ tokens: newTokens }))
      }

      protectedRequestCount += 1
      if (protectedRequestCount <= 2) {
        return Promise.resolve(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      }

      return Promise.resolve(jsonResponse({ authorization: new Headers(init?.headers).get('Authorization') }))
    })
    const { apiRequest } = await import('./apiClient')

    const results = await Promise.all([apiRequest('/products/one'), apiRequest('/products/two')])

    expect(results).toEqual([
      { authorization: 'Bearer new-access' },
      { authorization: 'Bearer new-access' },
    ])
    expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh'))).toHaveLength(1)
  })

  it('retries a late 401 with the rotated session applied by an earlier request refresh', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const secondInitialResponse = deferred<Response>()
    const retryAuthorizations: string[] = []
    let firstRequestCount = 0
    let secondRequestCount = 0

    fetchMock.mockImplementation((url: string, init?: RequestInit) => {
      if (url.endsWith('/auth/refresh')) {
        return Promise.resolve(jsonResponse({ tokens: newTokens }))
      }

      const authorization = new Headers(init?.headers).get('Authorization')
      if (url.endsWith('/products/one')) {
        firstRequestCount += 1
        if (firstRequestCount === 1) {
          return Promise.resolve(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
        }

        retryAuthorizations.push(authorization ?? '')
        return Promise.resolve(jsonResponse({ id: 'one' }))
      }

      secondRequestCount += 1
      if (secondRequestCount === 1) {
        return secondInitialResponse.promise
      }

      retryAuthorizations.push(authorization ?? '')
      return Promise.resolve(jsonResponse({ id: 'two' }))
    })
    const { apiRequest } = await import('./apiClient')

    const firstRequest = apiRequest<{ id: string }>('/products/one')
    const secondRequest = apiRequest<{ id: string }>('/products/two')
    await expect(firstRequest).resolves.toEqual({ id: 'one' })

    secondInitialResponse.resolve(
      jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired later' } }, 401),
    )

    await expect(secondRequest).resolves.toEqual({ id: 'two' })
    expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh'))).toHaveLength(1)
    expect(retryAuthorizations).toEqual(['Bearer new-access', 'Bearer new-access'])
  })

  it('clears tokens and invokes the unauthorized handler once when a shared refresh fails', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const unauthorizedHandler = vi.fn()
    fetchMock.mockImplementation((url: string) =>
      Promise.resolve(
        url.endsWith('/auth/refresh')
          ? jsonResponse({ error: { code: 'INVALID_REFRESH', message: 'Refresh denied' } }, 401)
          : jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401),
      ),
    )
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    const results = await Promise.allSettled([apiRequest('/products/one'), apiRequest('/products/two')])

    expect(results.every((result) => result.status === 'rejected')).toBe(true)
    expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh'))).toHaveLength(1)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(unauthorizedHandler).toHaveBeenCalledTimes(1)
  })

  it('does not refresh again when the original request retry returns 401', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const unauthorizedHandler = vi.fn()
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      .mockResolvedValueOnce(jsonResponse({ tokens: newTokens }))
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Still denied' } }, 401))
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    await expect(apiRequest('/products')).rejects.toMatchObject({
      status: 401,
      message: 'Still denied',
    })
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(unauthorizedHandler).toHaveBeenCalledTimes(1)
  })

  it('clears tokens, invokes the unauthorized handler once, and throws the original 401 when no refresh token exists', async () => {
    const tokensWithoutRefresh = { ...oldTokens, refresh_token: '' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokensWithoutRefresh))
    const unauthorizedHandler = vi.fn()
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { code: 'ACCESS_EXPIRED', message: 'Access expired' } }, 401),
    )
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    await expect(apiRequest('/products')).rejects.toMatchObject({
      status: 401,
      code: 'ACCESS_EXPIRED',
      message: 'Access expired',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(unauthorizedHandler).toHaveBeenCalledTimes(1)
  })

  it('does not overwrite, clear, notify, or replay under a replacement login while refresh is pending', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const refreshResponse = deferred<Response>()
    const unauthorizedHandler = vi.fn()
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      .mockReturnValueOnce(refreshResponse.promise)
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    const request = apiRequest('/products')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(replacementTokens))
    refreshResponse.resolve(jsonResponse({ tokens: newTokens }))

    await expect(request).rejects.toMatchObject({ status: 401, message: 'Expired' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(replacementTokens))
    expect(unauthorizedHandler).not.toHaveBeenCalled()
  })

  it('does not let a hung stale refresh block a replacement session refresh and retry', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const staleRefreshResponse = deferred<Response>()
    const currentRefreshResponse = deferred<Response>()
    const currentSessionRefreshedTokens = rotatedTokens(20)
    const unauthorizedHandler = vi.fn()
    let currentRequestCount = 0

    fetchMock.mockImplementation((url: string, init?: RequestInit) => {
      if (url.endsWith('/auth/refresh')) {
        const refreshToken = JSON.parse(String(init?.body ?? '{}')).refresh_token as string
        if (refreshToken === oldTokens.refresh_token) {
          return staleRefreshResponse.promise
        }

        if (refreshToken === replacementTokens.refresh_token) {
          return currentRefreshResponse.promise
        }
      }

      if (url.endsWith('/products/stale')) {
        return Promise.resolve(
          jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired stale session' } }, 401),
        )
      }

      currentRequestCount += 1
      if (currentRequestCount === 1) {
        return Promise.resolve(
          jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired replacement session' } }, 401),
        )
      }

      return Promise.resolve(
        jsonResponse({
          id: 'current-session',
          authorization: new Headers(init?.headers).get('Authorization'),
        }),
      )
    })
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    const staleRequest = apiRequest('/products/stale')
    await vi.waitFor(() =>
      expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh'))).toHaveLength(1),
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(replacementTokens))
    const currentRequest = apiRequest<{ id: string; authorization: string | null }>('/products/current')

    await vi.waitFor(() =>
      expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh'))).toHaveLength(2),
    )

    currentRefreshResponse.resolve(jsonResponse({ tokens: currentSessionRefreshedTokens }))

    await expect(currentRequest).resolves.toEqual({
      id: 'current-session',
      authorization: `Bearer ${currentSessionRefreshedTokens.access_token}`,
    })

    staleRefreshResponse.resolve(jsonResponse({ tokens: newTokens }))

    await expect(staleRequest).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Expired stale session',
    })
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(currentSessionRefreshedTokens))
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(unauthorizedHandler).not.toHaveBeenCalled()
  })

  it('does not clear or notify a replacement login when a stale refresh fails', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const refreshResponse = deferred<Response>()
    const unauthorizedHandler = vi.fn()
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      .mockReturnValueOnce(refreshResponse.promise)
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    const request = apiRequest('/products')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(replacementTokens))
    refreshResponse.resolve(jsonResponse({ error: { code: 'INVALID_REFRESH', message: 'Denied' } }, 401))

    await expect(request).rejects.toMatchObject({ status: 401, message: 'Expired' })
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(replacementTokens))
    expect(unauthorizedHandler).not.toHaveBeenCalled()
  })

  it('does not refresh, clear, notify, or replay when a stale original request returns 401', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const originalResponse = deferred<Response>()
    const unauthorizedHandler = vi.fn()
    fetchMock.mockReturnValueOnce(originalResponse.promise)
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    const request = apiRequest('/products')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(replacementTokens))
    originalResponse.resolve(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))

    await expect(request).rejects.toMatchObject({ status: 401, message: 'Expired' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(replacementTokens))
    expect(unauthorizedHandler).not.toHaveBeenCalled()
  })

  it('does not clear or notify a replacement login when a stale post-refresh retry returns 401', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const retryResponse = deferred<Response>()
    const unauthorizedHandler = vi.fn()
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      .mockResolvedValueOnce(jsonResponse({ tokens: newTokens }))
      .mockReturnValueOnce(retryResponse.promise)
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    const request = apiRequest('/products')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(replacementTokens))
    retryResponse.resolve(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Still denied' } }, 401))

    await expect(request).rejects.toMatchObject({ status: 401, message: 'Still denied' })
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(replacementTokens))
    expect(unauthorizedHandler).not.toHaveBeenCalled()
  })

  it('rejects a late authenticated 2xx response after the session is replaced', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const protectedResponse = deferred<Response>()
    const unauthorizedHandler = vi.fn()
    fetchMock.mockReturnValueOnce(protectedResponse.promise)
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    const request = apiRequest('/products')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(replacementTokens))
    protectedResponse.resolve(jsonResponse({ id: 'product-1' }))

    await expect(request).rejects.toMatchObject({
      status: 409,
      code: 'STALE_SESSION_RESPONSE',
      message: 'Stale session response',
    })
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(replacementTokens))
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(unauthorizedHandler).not.toHaveBeenCalled()
  })

  it('rejects a streamed authenticated 2xx response when the session changes before the body finishes', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const unauthorizedHandler = vi.fn()
    const encoder = new TextEncoder()
    let streamController!: ReadableStreamDefaultController<Uint8Array>
    const streamedResponse = new Response(
      new ReadableStream<Uint8Array>({
        start(controller) {
          streamController = controller
        },
      }),
      { status: 200 },
    )
    fetchMock.mockResolvedValueOnce(streamedResponse)
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    const request = apiRequest<{ id: string }>('/products')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(replacementTokens))
    streamController.enqueue(encoder.encode(JSON.stringify({ id: 'product-1' })))
    streamController.close()

    await expect(request).rejects.toMatchObject({
      status: 409,
      code: 'STALE_SESSION_RESPONSE',
      message: 'Stale session response',
    })
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(replacementTokens))
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(unauthorizedHandler).not.toHaveBeenCalled()
  })

  it('accepts a late authenticated 2xx response after a legitimate refresh lineage rotates the session', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const firstProtectedResponse = deferred<Response>()
    let firstRequestCount = 0
    let secondRequestCount = 0

    fetchMock.mockImplementation((url: string) => {
      if (url.endsWith('/auth/refresh')) {
        return Promise.resolve(jsonResponse({ tokens: newTokens }))
      }

      if (url.endsWith('/products/one')) {
        firstRequestCount += 1
        if (firstRequestCount === 1) {
          return firstProtectedResponse.promise
        }

        return Promise.resolve(jsonResponse({ id: 'one' }))
      }

      secondRequestCount += 1
      if (secondRequestCount === 1) {
        return Promise.resolve(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      }

      return Promise.resolve(jsonResponse({ id: 'two' }))
    })
    const { apiRequest } = await import('./apiClient')

    const firstRequest = apiRequest<{ id: string }>('/products/one')
    const secondRequest = apiRequest<{ id: string }>('/products/two')
    await expect(secondRequest).resolves.toEqual({ id: 'two' })
    firstProtectedResponse.resolve(jsonResponse({ id: 'one' }))

    await expect(firstRequest).resolves.toEqual({ id: 'one' })
  })

  it('accepts a late authenticated 2xx response after more than ten sequential legitimate refresh descendants', async () => {
    const lineageTokens = Array.from({ length: 11 }, (_value, index) => rotatedTokens(index))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineageTokens[0]))
    const originalProtectedResponse = deferred<Response>()

    let originalRequestCount = 0
    let refreshCount = 0
    const stepRequestCounts = new Map<string, number>()

    fetchMock.mockImplementation((url: string) => {
      if (url.endsWith('/auth/refresh')) {
        refreshCount += 1
        return Promise.resolve(jsonResponse({ tokens: lineageTokens[refreshCount] }))
      }

      if (url.endsWith('/products/original')) {
        originalRequestCount += 1
        if (originalRequestCount === 1) {
          return originalProtectedResponse.promise
        }

        return Promise.resolve(jsonResponse({ id: 'original-retry' }))
      }

      const requestCount = (stepRequestCounts.get(url) ?? 0) + 1
      stepRequestCounts.set(url, requestCount)

      if (requestCount === 1) {
        return Promise.resolve(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      }

      return Promise.resolve(jsonResponse({ id: String(url).split('/').at(-1) }))
    })
    const { apiRequest } = await import('./apiClient')

    const originalRequest = apiRequest<{ id: string }>('/products/original')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    for (let index = 1; index < lineageTokens.length; index += 1) {
      await expect(apiRequest<{ id: string }>(`/products/step-${index}`)).resolves.toEqual({
        id: `step-${index}`,
      })
    }

    originalProtectedResponse.resolve(jsonResponse({ id: 'original' }))

    await expect(originalRequest).resolves.toEqual({ id: 'original' })
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(lineageTokens.at(-1)))
    expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh'))).toHaveLength(10)
  })

  it('does not reuse settled historical lineage for a later replacement session', async () => {
    const lineageTokens = Array.from({ length: 11 }, (_value, index) => rotatedTokens(index))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineageTokens[0]))
    const delayedUnauthorizedResponse = deferred<Response>()
    let refreshCount = 0
    const requestCounts = new Map<string, number>()

    fetchMock.mockImplementation((url: string) => {
      if (url.endsWith('/auth/refresh')) {
        refreshCount += 1
        return Promise.resolve(jsonResponse({ tokens: lineageTokens[refreshCount] }))
      }

      if (url.endsWith('/products/pruned-lineage')) {
        const requestCount = (requestCounts.get(url) ?? 0) + 1
        requestCounts.set(url, requestCount)

        if (requestCount === 1) {
          return delayedUnauthorizedResponse.promise
        }

        return Promise.resolve(jsonResponse({ id: 'unexpected-retry' }))
      }

      const requestCount = (requestCounts.get(url) ?? 0) + 1
      requestCounts.set(url, requestCount)

      if (requestCount === 1) {
        return Promise.resolve(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      }

      return Promise.resolve(jsonResponse({ id: String(url).split('/').at(-1) }))
    })
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    const unauthorizedHandler = vi.fn()
    setUnauthorizedHandler(unauthorizedHandler)

    for (let index = 1; index < lineageTokens.length; index += 1) {
      await expect(apiRequest<{ id: string }>(`/products/history-${index}`)).resolves.toEqual({
        id: `history-${index}`,
      })
    }

    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(lineageTokens.at(-1)))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const request = apiRequest('/products/pruned-lineage')
    await vi.waitFor(() =>
      expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/products/pruned-lineage'))).toHaveLength(1),
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineageTokens.at(-1)))
    delayedUnauthorizedResponse.resolve(
      jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired new login' } }, 401),
    )

    await expect(request).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Expired new login',
    })
    expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/products/pruned-lineage'))).toHaveLength(1)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(lineageTokens.at(-1)))
    expect(unauthorizedHandler).not.toHaveBeenCalled()
  })

  it('still rejects a late authenticated 2xx response after long refresh lineage when the session is replaced by an unrelated login', async () => {
    const lineageTokens = Array.from({ length: 11 }, (_value, index) => rotatedTokens(index))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineageTokens[0]))
    const originalProtectedResponse = deferred<Response>()

    let originalRequestCount = 0
    let refreshCount = 0
    const stepRequestCounts = new Map<string, number>()

    fetchMock.mockImplementation((url: string) => {
      if (url.endsWith('/auth/refresh')) {
        refreshCount += 1
        return Promise.resolve(jsonResponse({ tokens: lineageTokens[refreshCount] }))
      }

      if (url.endsWith('/products/original')) {
        originalRequestCount += 1
        if (originalRequestCount === 1) {
          return originalProtectedResponse.promise
        }

        return Promise.resolve(jsonResponse({ id: 'original-retry' }))
      }

      const requestCount = (stepRequestCounts.get(url) ?? 0) + 1
      stepRequestCounts.set(url, requestCount)

      if (requestCount === 1) {
        return Promise.resolve(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      }

      return Promise.resolve(jsonResponse({ id: String(url).split('/').at(-1) }))
    })
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    const unauthorizedHandler = vi.fn()
    setUnauthorizedHandler(unauthorizedHandler)

    const originalRequest = apiRequest<{ id: string }>('/products/original')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    for (let index = 1; index < lineageTokens.length; index += 1) {
      await expect(apiRequest<{ id: string }>(`/products/step-${index}`)).resolves.toEqual({
        id: `step-${index}`,
      })
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(replacementTokens))
    originalProtectedResponse.resolve(jsonResponse({ id: 'original' }))

    await expect(originalRequest).rejects.toMatchObject({
      status: 409,
      code: 'STALE_SESSION_RESPONSE',
      message: 'Stale session response',
    })
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(replacementTokens))
    expect(unauthorizedHandler).not.toHaveBeenCalled()
  })

  it.each([
    ['204 response', emptyResponse(204)],
    ['empty successful body', new Response('', { status: 200 })],
  ])('rejects a late authenticated %s after the session is replaced', async (_name, response) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const protectedResponse = deferred<Response>()
    const unauthorizedHandler = vi.fn()
    fetchMock.mockReturnValueOnce(protectedResponse.promise)
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    const request = apiRequest('/products')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(replacementTokens))
    protectedResponse.resolve(response)

    await expect(request).rejects.toMatchObject({
      status: 409,
      code: 'STALE_SESSION_RESPONSE',
      message: 'Stale session response',
    })
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(replacementTokens))
    expect(unauthorizedHandler).not.toHaveBeenCalled()
  })

  it('fails a malformed successful refresh safely and clears only the initiating session', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const unauthorizedHandler = vi.fn()
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      .mockResolvedValueOnce(jsonResponse({ tokens: { access_token: 'partial' } }))
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    await expect(apiRequest('/products')).rejects.toMatchObject({ status: 401, message: 'Expired' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(unauthorizedHandler).toHaveBeenCalledTimes(1)
  })

  it('preserves the intended API error when the unauthorized handler throws', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const unauthorizedHandler = vi.fn(() => {
      throw new Error('handler failed')
    })
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      .mockResolvedValueOnce(jsonResponse({ tokens: newTokens }))
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Still denied' } }, 401))
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    await expect(apiRequest('/products')).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Still denied',
    })
    expect(unauthorizedHandler).toHaveBeenCalledTimes(1)
  })

  it('preserves the intended API error when the unauthorized handler rejects asynchronously', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldTokens))
    const unauthorizedHandler = vi.fn(async () => {
      throw new Error('async handler failed')
    })
    const unhandledRejections: unknown[] = []
    const onUnhandledRejection = (reason: unknown) => {
      unhandledRejections.push(reason)
    }
    process.on('unhandledRejection', onUnhandledRejection)
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Expired' } }, 401))
      .mockResolvedValueOnce(jsonResponse({ tokens: newTokens }))
      .mockResolvedValueOnce(jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Still denied' } }, 401))
    const { apiRequest, setUnauthorizedHandler } = await import('./apiClient')
    setUnauthorizedHandler(unauthorizedHandler)

    try {
      await expect(apiRequest('/products')).rejects.toMatchObject({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Still denied',
      })
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(unhandledRejections).toEqual([])
    } finally {
      process.off('unhandledRejection', onUnhandledRejection)
    }

    expect(unauthorizedHandler).toHaveBeenCalledTimes(1)
  })
})
