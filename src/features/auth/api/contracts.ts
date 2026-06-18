import { ApiError, isAuthTokens, type AuthTokens } from '@/shared/api/contracts'

export type AuthUserRole = 'customer' | string

export type AuthUser = {
  id: string
  email?: string | null
  phone?: string | null
  name: string
  role: AuthUserRole
  status: string
  avatar_url?: string | null
  bio?: string | null
  email_verified: boolean
  phone_verified: boolean
  created_at: string
}

export type AuthResponse = {
  user: AuthUser
  tokens: AuthTokens
}

export type MeResponse = {
  user: AuthUser
}

export type OtpMessageResponse = {
  message: string
}

export type RefreshSessionResponse = {
  tokens: AuthTokens
}

export type LoginCustomerInput = {
  email: string
  password: string
}

export type RegisterCustomerInput = {
  name: string
  email: string
  password: string
}

export type VerifyEmailOtpInput = {
  email: string
  otp: string
}

export type ResetPasswordInput = {
  email: string
  otp: string
  newPassword: string
}

export type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
}

export type UpdateProfileInput = {
  name?: string
  bio?: string
}

function invalidContractError(code: string, message: string): ApiError {
  return new ApiError(500, code, message)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isAuthUser(value: unknown): value is AuthUser {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    value.id.trim().length > 0 &&
    (value.email === undefined || value.email === null || typeof value.email === 'string') &&
    (value.phone === undefined || value.phone === null || typeof value.phone === 'string') &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    typeof value.role === 'string' &&
    value.role.trim().length > 0 &&
    typeof value.status === 'string' &&
    value.status.trim().length > 0 &&
    (value.avatar_url === undefined ||
      value.avatar_url === null ||
      typeof value.avatar_url === 'string') &&
    (value.bio === undefined || value.bio === null || typeof value.bio === 'string') &&
    typeof value.email_verified === 'boolean' &&
    typeof value.phone_verified === 'boolean' &&
    typeof value.created_at === 'string' &&
    value.created_at.trim().length > 0
  )
}

export function assertAuthResponse(value: unknown): AuthResponse {
  if (!isRecord(value) || !isAuthUser(value.user) || !isAuthTokens(value.tokens)) {
    throw invalidContractError('INVALID_AUTH_RESPONSE', 'Invalid auth response')
  }

  return {
    user: value.user,
    tokens: value.tokens,
  }
}

export function assertMeResponse(value: unknown): MeResponse {
  if (!isRecord(value) || !isAuthUser(value.user)) {
    throw invalidContractError('INVALID_ME_RESPONSE', 'Invalid authenticated user response')
  }

  return {
    user: value.user,
  }
}

export function assertOtpMessageResponse(value: unknown): OtpMessageResponse {
  if (!isRecord(value) || typeof value.message !== 'string' || value.message.trim().length === 0) {
    throw invalidContractError('INVALID_OTP_RESPONSE', 'Invalid OTP response')
  }

  return {
    message: value.message,
  }
}

export function assertRefreshSessionResponse(value: unknown): RefreshSessionResponse {
  if (!isRecord(value) || !isAuthTokens(value.tokens)) {
    throw invalidContractError('INVALID_REFRESH_RESPONSE', 'Invalid refresh response')
  }

  return {
    tokens: value.tokens,
  }
}
