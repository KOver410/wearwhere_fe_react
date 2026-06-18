import {
  ApiError,
  isAuthTokens,
  type ApiErrorEnvelope,
  type AuthTokens,
} from './contracts'
import {
  clearTokens,
  readTokenSnapshot,
  saveTokens,
  type TokenSnapshot,
} from './tokenStorage'

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  skipAuth?: boolean
  skipRefresh?: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'
const NON_REFRESHABLE_AUTH_PATHS = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
])

class StaleSessionError extends Error {}

type RequestContext = {
  allowedSnapshotKeys: Set<string>
  registered: boolean
}

let unauthorizedHandler: (() => unknown) | null = null
let noSessionUnauthorizedNotified = false
let activeRequestContexts = new Set<RequestContext>()
let refreshPromisesBySnapshotKey = new Map<string, Promise<AuthTokens>>()

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler
}

function joinApiPath(path: string): string {
  return `${API_BASE_URL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

function isNonRefreshableAuthPath(path: string): boolean {
  const normalizedPath = `/${path.replace(/^\/+/, '')}`.split(/[?#]/, 1)[0]
  return NON_REFRESHABLE_AUTH_PATHS.has(normalizedPath)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  if (!isRecord(value) || !isRecord(value.error)) {
    return false
  }

  return typeof value.error.code === 'string' && typeof value.error.message === 'string'
}

function parseJsonSafely(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

function sessionsMatch(left: TokenSnapshot | null, right: TokenSnapshot | null): boolean {
  return (
    left !== null &&
    right !== null &&
    left.persistence === right.persistence &&
    left.tokens.access_token === right.tokens.access_token &&
    left.tokens.refresh_token === right.tokens.refresh_token &&
    left.tokens.token_type === right.tokens.token_type &&
    left.tokens.expires_at === right.tokens.expires_at
  )
}

function currentSessionMatches(snapshot: TokenSnapshot): boolean {
  return sessionsMatch(snapshot, readTokenSnapshot())
}

function snapshotKey(snapshot: TokenSnapshot): string {
  return JSON.stringify([
    snapshot.persistence,
    snapshot.tokens.access_token,
    snapshot.tokens.refresh_token,
    snapshot.tokens.token_type,
    snapshot.tokens.expires_at,
  ])
}

function trackAllowedSnapshot(
  requestContext: RequestContext | null,
  snapshot: TokenSnapshot | null,
): void {
  if (!requestContext || !snapshot) {
    return
  }

  requestContext.allowedSnapshotKeys.add(snapshotKey(snapshot))
  if (!requestContext.registered) {
    requestContext.registered = true
    activeRequestContexts.add(requestContext)
  }
}

function requestContextAllowsSnapshot(
  requestContext: RequestContext | null,
  snapshot: TokenSnapshot | null,
): boolean {
  return Boolean(
    requestContext &&
      requestContext.registered &&
      snapshot &&
      requestContext.allowedSnapshotKeys.has(snapshotKey(snapshot)),
  )
}

function propagateRefreshedSnapshot(from: TokenSnapshot, to: TokenSnapshot): void {
  const fromKey = snapshotKey(from)
  const toKey = snapshotKey(to)

  for (const requestContext of activeRequestContexts) {
    if (requestContext.allowedSnapshotKeys.has(fromKey)) {
      requestContext.allowedSnapshotKeys.add(toKey)
    }
  }
}

function staleSessionResponseError(): ApiError {
  return new ApiError(409, 'STALE_SESSION_RESPONSE', 'Stale session response')
}

function assertFreshAuthenticatedResponse(requestContext: RequestContext | null): void {
  if (!requestContext?.registered) {
    return
  }

  if (!requestContextAllowsSnapshot(requestContext, readTokenSnapshot())) {
    throw staleSessionResponseError()
  }
}

function invokeUnauthorizedHandler(): void {
  try {
    const result = unauthorizedHandler?.()
    if (result && typeof result === 'object' && 'then' in result && typeof result.then === 'function') {
      void Promise.resolve(result).catch(() => {
        // Authentication state cleanup must not be replaced by an async handler failure.
      })
    }
  } catch {
    // Authentication state cleanup must not be replaced by a handler failure.
  }
}

function clearAndNotifyIfCurrent(snapshot: TokenSnapshot | null): boolean {
  const currentSnapshot = readTokenSnapshot()

  if (snapshot === null) {
    if (currentSnapshot !== null || noSessionUnauthorizedNotified) {
      return false
    }

    noSessionUnauthorizedNotified = true
    clearTokens()
    invokeUnauthorizedHandler()
    return true
  }

  if (!sessionsMatch(snapshot, currentSnapshot)) {
    return false
  }

  noSessionUnauthorizedNotified = true
  clearTokens()
  invokeUnauthorizedHandler()
  return true
}

async function toApiError(response: Response): Promise<ApiError> {
  const text = await response.text()
  const parsedBody = text ? parseJsonSafely(text) : undefined

  if (isApiErrorEnvelope(parsedBody)) {
    const details = isRecord(parsedBody.error.details) ? parsedBody.error.details : undefined
    return new ApiError(response.status, parsedBody.error.code, parsedBody.error.message, details)
  }

  return new ApiError(response.status, 'HTTP_ERROR', response.statusText)
}

async function parseSuccessfulResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

async function performRefresh(snapshot: TokenSnapshot): Promise<AuthTokens> {
  try {
    const response = await fetch(joinApiPath('/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: snapshot.tokens.refresh_token }),
    })

    if (!response.ok) {
      throw await toApiError(response)
    }

    const result = await parseSuccessfulResponse<unknown>(response)
    if (!isRecord(result) || !isAuthTokens(result.tokens)) {
      throw new ApiError(response.status, 'INVALID_REFRESH_RESPONSE', 'Invalid refresh response')
    }

    if (!currentSessionMatches(snapshot)) {
      throw new StaleSessionError()
    }

    const refreshedSnapshot: TokenSnapshot = {
      tokens: result.tokens,
      persistence: snapshot.persistence,
    }

    saveTokens(result.tokens, snapshot.persistence === 'local')
    propagateRefreshedSnapshot(snapshot, refreshedSnapshot)
    noSessionUnauthorizedNotified = false
    return result.tokens
  } catch (error) {
    if (!(error instanceof StaleSessionError)) {
      clearAndNotifyIfCurrent(snapshot)
    }
    throw error
  }
}

async function refreshTokens(snapshot: TokenSnapshot): Promise<AuthTokens> {
  const key = snapshotKey(snapshot)
  const existingRefresh = refreshPromisesBySnapshotKey.get(key)
  if (existingRefresh) {
    return existingRefresh
  }

  const pendingRefresh = performRefresh(snapshot)
  refreshPromisesBySnapshotKey.set(key, pendingRefresh)

  try {
    return await pendingRefresh
  } finally {
    if (refreshPromisesBySnapshotKey.get(key) === pendingRefresh) {
      refreshPromisesBySnapshotKey.delete(key)
    }
  }
}

async function performRequest<T>(
  path: string,
  options: ApiRequestOptions,
  hasRetried: boolean,
  requestContext: RequestContext | null,
  requiredSnapshot: TokenSnapshot | null = null,
  staleError: ApiError | null = null,
): Promise<T> {
  const { body, skipAuth = false, skipRefresh = false, ...requestInit } = options
  const storedSnapshot = skipAuth ? null : readTokenSnapshot()
  const headers = new Headers(requestInit.headers)
  const explicitAuthorization = headers.has('Authorization')

  if (requiredSnapshot && !sessionsMatch(requiredSnapshot, storedSnapshot)) {
    throw staleError ?? new ApiError(401, 'UNAUTHORIZED', 'Unauthorized')
  }

  const requestSnapshot = requiredSnapshot ?? storedSnapshot
  const authenticatedRequestSnapshot =
    !skipAuth && !explicitAuthorization && requestSnapshot ? requestSnapshot : null
  trackAllowedSnapshot(requestContext, authenticatedRequestSnapshot)

  if (requestSnapshot) {
    noSessionUnauthorizedNotified = false
  }

  if (!skipAuth && !explicitAuthorization && requestSnapshot?.tokens.access_token) {
    headers.set('Authorization', `Bearer ${requestSnapshot.tokens.access_token}`)
  }

  let serializedBody: BodyInit | undefined
  if (body !== undefined) {
    serializedBody = JSON.stringify(body)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }

  const response = await fetch(joinApiPath(path), {
    ...requestInit,
    headers,
    body: serializedBody,
  })

  if (response.ok) {
    const parsedResponse = await parseSuccessfulResponse<T>(response)
    assertFreshAuthenticatedResponse(requestContext)
    return parsedResponse
  }

  const error = await toApiError(response)
  if (response.status === 401 && hasRetried) {
    clearAndNotifyIfCurrent(requestSnapshot)
    throw error
  }

  const canRefresh =
    response.status === 401 &&
    !skipAuth &&
    !skipRefresh &&
    !explicitAuthorization &&
    !isNonRefreshableAuthPath(path)

  if (!canRefresh) {
    throw error
  }

  const currentSnapshot = readTokenSnapshot()
  if (!requestSnapshot) {
    if (!currentSnapshot) {
      clearAndNotifyIfCurrent(null)
    }
    throw error
  }

  if (!sessionsMatch(requestSnapshot, currentSnapshot)) {
    if (requestContextAllowsSnapshot(requestContext, currentSnapshot)) {
      return performRequest<T>(
        path,
        options,
        true,
        requestContext,
        currentSnapshot,
        error,
      )
    }

    throw error
  }

  try {
    const refreshedTokens = await refreshTokens(requestSnapshot)
    const retrySnapshot: TokenSnapshot = {
      tokens: refreshedTokens,
      persistence: requestSnapshot.persistence,
    }

    if (!currentSessionMatches(retrySnapshot)) {
      throw new StaleSessionError()
    }

    return performRequest<T>(
      path,
      options,
      true,
      requestContext,
      retrySnapshot,
      error,
    )
  } catch {
    throw error
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const requestContext: RequestContext = {
    allowedSnapshotKeys: new Set<string>(),
    registered: false,
  }

  try {
    return await performRequest<T>(path, options, false, requestContext)
  } finally {
    if (requestContext.registered) {
      activeRequestContexts.delete(requestContext)
    }
  }
}
