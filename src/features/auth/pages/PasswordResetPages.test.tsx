import { MemoryRouter, Route, Routes, useLocation, type InitialEntry } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'

import { ForgotPasswordPage } from './ForgotPasswordPage'
import { ResetPasswordPage } from './ResetPasswordPage'

const {
  forgotPasswordMock,
  resetPasswordMock,
  toastSuccessMock,
  toastErrorMock,
} = vi.hoisted(() => ({
  forgotPasswordMock: vi.fn(),
  resetPasswordMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}))

vi.mock('@/features/auth/api/authApi', () => ({
  forgotPassword: forgotPasswordMock,
  resetPassword: resetPasswordMock,
}))

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}))

function LocationDisplay() {
  const location = useLocation()
  return (
    <pre data-testid="location-display">
      {JSON.stringify({
        pathname: location.pathname,
        state: location.state ?? null,
      })}
    </pre>
  )
}

function renderPasswordPage(initialEntries: InitialEntry[] = ['/forgot-password']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LanguageProvider>
        <Routes>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/login" element={<div>Login destination</div>} />
        </Routes>
        <LocationDisplay />
      </LanguageProvider>
    </MemoryRouter>,
  )
}

describe('Password reset pages', () => {
  beforeEach(() => {
    forgotPasswordMock.mockReset()
    resetPasswordMock.mockReset()
    toastSuccessMock.mockReset()
    toastErrorMock.mockReset()
  })

  it('requests a password reset code and navigates with the email in router state', async () => {
    const user = userEvent.setup()
    forgotPasswordMock.mockResolvedValue({ message: 'OTP sent' })

    renderPasswordPage(['/forgot-password'])

    await user.type(screen.getByLabelText(/email address|địa chỉ email/i), 'customer@example.com')
    await user.click(screen.getByRole('button', { name: /send code|gửi mã/i }))

    await waitFor(() => {
      expect(forgotPasswordMock).toHaveBeenCalledWith('customer@example.com')
    })

    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId('location-display').textContent ?? '')).toEqual({
        pathname: '/reset-password',
        state: { email: 'customer@example.com' },
      })
    })
    expect(toastSuccessMock).toHaveBeenCalledWith('OTP sent')
  })

  it('shows an error toast and stays on forgot password when requesting a code fails', async () => {
    const user = userEvent.setup()
    forgotPasswordMock.mockRejectedValue(new Error('Network down'))

    renderPasswordPage(['/forgot-password'])

    await user.type(screen.getByLabelText(/email address|địa chỉ email/i), 'customer@example.com')
    await user.click(screen.getByRole('button', { name: /send code|gửi mã/i }))

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Network down')
    })
    expect(screen.getByTestId('location-display')).toHaveTextContent('"pathname":"/forgot-password"')
  })

  it('offers recovery links when the reset page is opened without email state', () => {
    renderPasswordPage(['/reset-password'])

    expect(screen.getByRole('link', { name: /request a new code|gửi lại mã/i })).toHaveAttribute(
      'href',
      '/forgot-password',
    )
    expect(screen.getByRole('link', { name: /back to log in|quay lại đăng nhập/i })).toHaveAttribute(
      'href',
      '/login',
    )
    expect(resetPasswordMock).not.toHaveBeenCalled()
  })

  it('requires an OTP before resetting the password and navigating to login', async () => {
    const user = userEvent.setup()
    resetPasswordMock.mockResolvedValue({ message: 'Password reset' })

    renderPasswordPage([
      { pathname: '/reset-password', state: { email: 'customer@example.com' } },
    ])

    await user.type(screen.getByLabelText(/new password|mật khẩu mới/i), 'P@ssw0rd!')
    await user.type(screen.getByLabelText(/confirm password|xác nhận mật khẩu/i), 'P@ssw0rd!')
    await user.click(screen.getByRole('button', { name: /reset password|đặt lại mật khẩu/i }))

    expect(await screen.findByText(/enter the 6-digit code|nhập mã 6 chữ số/i)).toBeInTheDocument()
    expect(resetPasswordMock).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText(/verification code|mã xác minh/i), '123456')
    await user.click(screen.getByRole('button', { name: /reset password|đặt lại mật khẩu/i }))

    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith({
        email: 'customer@example.com',
        otp: '123456',
        newPassword: 'P@ssw0rd!',
      })
    })
    expect(await screen.findByText('Login destination')).toBeInTheDocument()
  })

  it('rejects a weak new password without calling the reset API', async () => {
    const user = userEvent.setup()

    renderPasswordPage([
      { pathname: '/reset-password', state: { email: 'customer@example.com' } },
    ])

    await user.type(screen.getByLabelText(/verification code|mã xác minh/i), '123456')
    await user.type(screen.getByLabelText(/new password|mật khẩu mới/i), 'password')
    await user.type(screen.getByLabelText(/confirm password|xác nhận mật khẩu/i), 'password')
    await user.click(screen.getByRole('button', { name: /reset password|đặt lại mật khẩu/i }))

    expect(
      await screen.findByText(
        /password must be at least 8 characters and include a number and special character|mật khẩu phải có ít nhất 8 ký tự và bao gồm số cùng ký tự đặc biệt/i,
      ),
    ).toBeInTheDocument()
    expect(resetPasswordMock).not.toHaveBeenCalled()
  })

  it('resends the reset code to the email from router state', async () => {
    const user = userEvent.setup()
    forgotPasswordMock.mockResolvedValue({ message: 'OTP sent' })

    renderPasswordPage([
      { pathname: '/reset-password', state: { email: 'customer@example.com' } },
    ])

    await user.click(screen.getByRole('button', { name: /resend code|gửi lại mã/i }))

    await waitFor(() => {
      expect(forgotPasswordMock).toHaveBeenCalledWith('customer@example.com')
    })
  })
})
