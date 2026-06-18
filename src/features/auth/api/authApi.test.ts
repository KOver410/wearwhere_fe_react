import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthTokens } from '@/shared/api/contracts'

const apiRequestMock = vi.fn()

vi.mock('@/shared/api/apiClient', () => ({
  apiRequest: apiRequestMock,
}))

const customerUser = {
  id: 'user-1',
  email: 'customer@example.com',
  phone: null,
  name: 'Customer Example',
  role: 'customer',
  status: 'active',
  avatar_url: null,
  bio: null,
  email_verified: false,
  phone_verified: false,
  created_at: '2026-06-04T00:00:00.000Z',
}

const tokens: AuthTokens = {
  access_token: 'access-token',
  refresh_token: 'refresh-token',
  token_type: 'Bearer',
  expires_at: '2026-06-05T00:00:00.000Z',
}

describe('authApi', () => {
  beforeEach(() => {
    vi.resetModules()
    apiRequestMock.mockReset()
  })

  it('posts register payload to /auth/register and returns a validated auth response', async () => {
    apiRequestMock.mockResolvedValue({ user: customerUser, tokens })
    const { registerCustomer } = await import('./authApi')

    await expect(
      registerCustomer({
        name: 'Customer Example',
        email: 'customer@example.com',
        password: 'P@ssw0rd!',
      }),
    ).resolves.toEqual({ user: customerUser, tokens })

    expect(apiRequestMock).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: {
        name: 'Customer Example',
        email: 'customer@example.com',
        password: 'P@ssw0rd!',
      },
    })
  })

  it('posts login payload to /auth/login and returns a validated auth response', async () => {
    apiRequestMock.mockResolvedValue({ user: customerUser, tokens })
    const { loginCustomer } = await import('./authApi')

    await expect(
      loginCustomer({
        email: 'customer@example.com',
        password: 'P@ssw0rd!',
      }),
    ).resolves.toEqual({ user: customerUser, tokens })

    expect(apiRequestMock).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: {
        email: 'customer@example.com',
        password: 'P@ssw0rd!',
      },
    })
  })

  it('fails closed when an auth response does not contain runtime-valid tokens', async () => {
    apiRequestMock.mockResolvedValue({
      user: customerUser,
      tokens: {
        access_token: 'missing-refresh-token',
        token_type: 'Bearer',
        expires_at: '2026-06-05T00:00:00.000Z',
      },
    })
    const { loginCustomer } = await import('./authApi')

    await expect(
      loginCustomer({
        email: 'customer@example.com',
        password: 'P@ssw0rd!',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_AUTH_RESPONSE',
    })
  })

  it('calls /me to restore the current session', async () => {
    apiRequestMock.mockResolvedValue({ tokens })
    const { refreshSession } = await import('./authApi')

    await expect(refreshSession('refresh-token')).resolves.toEqual({ tokens })

    expect(apiRequestMock).toHaveBeenCalledWith('/auth/refresh', {
      method: 'POST',
      body: {
        refresh_token: 'refresh-token',
      },
      skipAuth: true,
      skipRefresh: true,
    })
  })

  it('fails closed when the refresh response does not contain runtime-valid tokens', async () => {
    apiRequestMock.mockResolvedValue({ tokens: { access_token: 'broken' } })
    const { refreshSession } = await import('./authApi')

    await expect(refreshSession('refresh-token')).rejects.toMatchObject({
      code: 'INVALID_REFRESH_RESPONSE',
    })
  })

  it('calls /me to fetch the authenticated customer profile', async () => {
    apiRequestMock.mockResolvedValue({ user: customerUser })
    const { getMe } = await import('./authApi')

    await expect(getMe()).resolves.toEqual({ user: customerUser })

    expect(apiRequestMock).toHaveBeenCalledWith('/me', {
      method: 'GET',
    })
  })

  it('posts logout with the refresh token and skipRefresh enabled', async () => {
    apiRequestMock.mockResolvedValue(undefined)
    const { logoutCustomer } = await import('./authApi')

    await expect(logoutCustomer('refresh-token')).resolves.toBeUndefined()

    expect(apiRequestMock).toHaveBeenCalledWith('/auth/logout', {
      method: 'POST',
      body: { refresh_token: 'refresh-token' },
      skipRefresh: true,
    })
  })

  it('posts the verify-email OTP send request with the required purpose body', async () => {
    apiRequestMock.mockResolvedValue({ message: 'OTP sent' })
    const { sendVerifyEmailOtp } = await import('./authApi')

    await expect(sendVerifyEmailOtp('customer@example.com')).resolves.toEqual({
      message: 'OTP sent',
    })

    expect(apiRequestMock).toHaveBeenCalledWith('/auth/otp/send', {
      method: 'POST',
      body: {
        email: 'customer@example.com',
        purpose: 'verify_email',
      },
    })
  })

  it('posts the verify-email OTP verification request with the required purpose body', async () => {
    apiRequestMock.mockResolvedValue({ message: 'Email verified' })
    const { verifyEmailOtp } = await import('./authApi')

    await expect(
      verifyEmailOtp({
        email: 'customer@example.com',
        otp: '123456',
      }),
    ).resolves.toEqual({ message: 'Email verified' })

    expect(apiRequestMock).toHaveBeenCalledWith('/auth/otp/verify', {
      method: 'POST',
      body: {
        email: 'customer@example.com',
        otp: '123456',
        purpose: 'verify_email',
      },
    })
  })

  it('posts the forgot-password request and returns a validated OTP message response', async () => {
    const response = { message: 'If the account exists, an OTP has been sent' }
    apiRequestMock.mockResolvedValue(response)
    const { forgotPassword } = await import('./authApi')

    await expect(forgotPassword('customer@example.com')).resolves.toEqual(response)

    expect(apiRequestMock).toHaveBeenCalledWith('/auth/password/forgot', {
      method: 'POST',
      body: { email: 'customer@example.com' },
    })
  })

  it('posts the reset-password request and returns a validated OTP message response', async () => {
    const response = { message: 'Password reset successfully' }
    apiRequestMock.mockResolvedValue(response)
    const { resetPassword } = await import('./authApi')

    await expect(
      resetPassword({
        email: 'customer@example.com',
        otp: '123456',
        newPassword: 'P@ssw0rd!',
      }),
    ).resolves.toEqual(response)

    expect(apiRequestMock).toHaveBeenCalledWith('/auth/password/reset', {
      method: 'POST',
      body: {
        email: 'customer@example.com',
        otp: '123456',
        new_password: 'P@ssw0rd!',
      },
    })
  })

  it('posts the change-password request and returns a validated OTP message response', async () => {
    const response = { message: 'Password changed successfully' }
    apiRequestMock.mockResolvedValue(response)
    const { changePassword } = await import('./authApi')

    await expect(
      changePassword({
        currentPassword: 'Old1!pass',
        newPassword: 'New1!pass',
      }),
    ).resolves.toEqual(response)

    expect(apiRequestMock).toHaveBeenCalledWith('/me/password', {
      method: 'POST',
      body: {
        current_password: 'Old1!pass',
        new_password: 'New1!pass',
      },
    })
  })

  it('patches /me with name and bio and returns a validated profile response', async () => {
    apiRequestMock.mockResolvedValue({ user: customerUser })
    const { updateProfile } = await import('./authApi')

    await expect(
      updateProfile({ name: 'New Name', bio: 'New bio' }),
    ).resolves.toEqual({ user: customerUser })

    expect(apiRequestMock).toHaveBeenCalledWith('/me', {
      method: 'PATCH',
      body: {
        name: 'New Name',
        bio: 'New bio',
      },
    })
  })

  it('omits an undefined bio when updating the profile name', async () => {
    apiRequestMock.mockResolvedValue({ user: customerUser })
    const { updateProfile } = await import('./authApi')

    await updateProfile({ name: 'Only Name' })

    expect(apiRequestMock).toHaveBeenCalledWith('/me', {
      method: 'PATCH',
      body: {
        name: 'Only Name',
      },
    })
  })

  it('fails closed when the update-profile response is invalid', async () => {
    apiRequestMock.mockResolvedValue({})
    const { updateProfile } = await import('./authApi')

    await expect(updateProfile({ name: 'New Name' })).rejects.toMatchObject({
      code: 'INVALID_ME_RESPONSE',
    })
  })

  it('deletes /me with the password and returns a validated message response', async () => {
    const response = { message: 'Account deleted' }
    apiRequestMock.mockResolvedValue(response)
    const { deleteAccount } = await import('./authApi')

    await expect(deleteAccount('P@ssw0rd!')).resolves.toEqual(response)

    expect(apiRequestMock).toHaveBeenCalledWith('/me', {
      method: 'DELETE',
      body: { password: 'P@ssw0rd!' },
    })
  })

  it('fails closed when the forgot-password response is invalid', async () => {
    apiRequestMock.mockResolvedValue({})
    const { forgotPassword } = await import('./authApi')

    await expect(forgotPassword('customer@example.com')).rejects.toMatchObject({
      code: 'INVALID_OTP_RESPONSE',
    })
  })
})
