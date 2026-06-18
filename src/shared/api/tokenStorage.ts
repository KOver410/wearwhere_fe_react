import { isAuthTokens, type AuthTokens } from './contracts'

const STORAGE_KEY = 'wearwhere.auth.tokens'

export type TokenPersistence = 'local' | 'session'

export type TokenSnapshot = {
  tokens: AuthTokens
  persistence: TokenPersistence
}

function selectedTokenEntry(): { persistence: TokenPersistence; value: string } | null {
  const localValue = localStorage.getItem(STORAGE_KEY)
  if (localValue !== null) {
    return { persistence: 'local', value: localValue }
  }

  const sessionValue = sessionStorage.getItem(STORAGE_KEY)
  if (sessionValue !== null) {
    return { persistence: 'session', value: sessionValue }
  }

  return null
}

function parseTokens(value: string): AuthTokens | null {
  try {
    const tokens: unknown = JSON.parse(value)
    return isAuthTokens(tokens) ? tokens : null
  } catch {
    return null
  }
}

export function saveTokens(tokens: AuthTokens, persistent: boolean): void {
  if (!isAuthTokens(tokens)) {
    clearTokens()
    throw new TypeError('Invalid auth tokens')
  }

  const serializedTokens = JSON.stringify(tokens)

  if (persistent) {
    localStorage.setItem(STORAGE_KEY, serializedTokens)
    sessionStorage.removeItem(STORAGE_KEY)
    return
  }

  sessionStorage.setItem(STORAGE_KEY, serializedTokens)
  localStorage.removeItem(STORAGE_KEY)
}

export function readTokens(): AuthTokens | null {
  return readTokenSnapshot()?.tokens ?? null
}

export function readTokenPersistence(): TokenPersistence | null {
  return readTokenSnapshot()?.persistence ?? null
}

export function readTokenSnapshot(): TokenSnapshot | null {
  const entry = selectedTokenEntry()
  if (!entry) {
    return null
  }

  const tokens = parseTokens(entry.value)
  if (!tokens) {
    clearTokens()
    return null
  }

  return { tokens, persistence: entry.persistence }
}

export function clearTokens(): void {
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}
