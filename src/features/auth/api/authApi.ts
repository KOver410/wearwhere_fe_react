import { apiRequest } from '@/shared/api/apiClient'

import {
  assertAuthResponse,
  assertMeResponse,
  assertOtpMessageResponse,
  assertRefreshSessionResponse,
  type ChangePasswordInput,
  type LoginCustomerInput,
  type OtpMessageResponse,
  type RegisterCustomerInput,
  type RefreshSessionResponse,
  type ResetPasswordInput,
  type UpdateProfileInput,
  type VerifyEmailOtpInput,
} from './contracts'

export async function registerCustomer(input: RegisterCustomerInput) {
  const response = await apiRequest<unknown>('/auth/register', {
    method: 'POST',
    body: input,
  })

  return assertAuthResponse(response)
}

export async function loginCustomer(input: LoginCustomerInput) {
  const response = await apiRequest<unknown>('/auth/login', {
    method: 'POST',
    body: input,
  })

  return assertAuthResponse(response)
}

export async function loginBrand(input: LoginCustomerInput) {
  const response = await apiRequest<unknown>('/auth/brand/login', {
    method: 'POST',
    body: input,
  })

  return assertAuthResponse(response)
}

export async function loginAdmin(input: LoginCustomerInput) {
  const response = await apiRequest<unknown>('/auth/admin/login', {
    method: 'POST',
    body: input,
  })

  return assertAuthResponse(response)
}

export async function logoutCustomer(refreshToken: string): Promise<void> {
  await apiRequest<void>('/auth/logout', {
    method: 'POST',
    body: { refresh_token: refreshToken },
    skipRefresh: true,
  })
}

export async function getMe() {
  const response = await apiRequest<unknown>('/me', {
    method: 'GET',
  })

  return assertMeResponse(response)
}

export async function refreshSession(refreshToken: string): Promise<RefreshSessionResponse> {
  const response = await apiRequest<unknown>('/auth/refresh', {
    method: 'POST',
    body: {
      refresh_token: refreshToken,
    },
    skipAuth: true,
    skipRefresh: true,
  })

  return assertRefreshSessionResponse(response)
}

export async function sendVerifyEmailOtp(email: string): Promise<OtpMessageResponse> {
  const response = await apiRequest<unknown>('/auth/otp/send', {
    method: 'POST',
    body: {
      email,
      purpose: 'verify_email',
    },
  })

  return assertOtpMessageResponse(response)
}

export async function verifyEmailOtp(input: VerifyEmailOtpInput): Promise<OtpMessageResponse> {
  const response = await apiRequest<unknown>('/auth/otp/verify', {
    method: 'POST',
    body: {
      email: input.email,
      otp: input.otp,
      purpose: 'verify_email',
    },
  })

  return assertOtpMessageResponse(response)
}

export async function forgotPassword(email: string): Promise<OtpMessageResponse> {
  const response = await apiRequest<unknown>('/auth/password/forgot', {
    method: 'POST',
    body: { email },
  })

  return assertOtpMessageResponse(response)
}

export async function resetPassword(input: ResetPasswordInput): Promise<OtpMessageResponse> {
  const response = await apiRequest<unknown>('/auth/password/reset', {
    method: 'POST',
    body: {
      email: input.email,
      otp: input.otp,
      new_password: input.newPassword,
    },
  })

  return assertOtpMessageResponse(response)
}

export async function changePassword(input: ChangePasswordInput): Promise<OtpMessageResponse> {
  const response = await apiRequest<unknown>('/me/password', {
    method: 'POST',
    body: {
      current_password: input.currentPassword,
      new_password: input.newPassword,
    },
  })

  return assertOtpMessageResponse(response)
}

export async function updateProfile(input: UpdateProfileInput) {
  const body: Record<string, string> = {}

  if (input.name !== undefined) {
    body.name = input.name
  }

  if (input.bio !== undefined) {
    body.bio = input.bio
  }

  const response = await apiRequest<unknown>('/me', {
    method: 'PATCH',
    body,
  })

  return assertMeResponse(response)
}

export async function deleteAccount(password: string): Promise<OtpMessageResponse> {
  const response = await apiRequest<unknown>('/me', {
    method: 'DELETE',
    body: { password },
  })

  return assertOtpMessageResponse(response)
}
