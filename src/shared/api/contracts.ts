export type Pagination = {
  page: number
  limit: number
  total: number
  total_pages: number
  has_more: boolean
}

export type AuthTokens = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_at: string
}

export function isAuthTokens(value: unknown): value is AuthTokens {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const tokens = value as Record<string, unknown>
  return (
    typeof tokens.access_token === 'string' &&
    tokens.access_token.trim().length > 0 &&
    typeof tokens.refresh_token === 'string' &&
    tokens.refresh_token.trim().length > 0 &&
    typeof tokens.token_type === 'string' &&
    tokens.token_type.trim().length > 0 &&
    typeof tokens.expires_at === 'string' &&
    tokens.expires_at.trim().length > 0
  )
}

export type ApiErrorEnvelope = {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
