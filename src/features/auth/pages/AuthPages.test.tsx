import { MemoryRouter, Route, Routes, useLocation, type InitialEntry } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'

import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { VerifyEmailPage } from './VerifyEmailPage'

const {
  loginMock,
  registerMock,
  sendVerifyEmailOtpMock,
  verifyEmailOtpMock,
  toastSuccessMock,
  toastErrorMock,
  authState,
  ResizeObserverMock,
} = vi.hoisted(() => ({
  loginMock: vi.fn(),
  registerMock: vi.fn(),
  sendVerifyEmailOtpMock: vi.fn(),
  verifyEmailOtpMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
  ResizeObserverMock: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
  authState: {
    user: null as { email?: string | null } | null,
    role: null as string | null,
    isLoggedIn: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    restoreSession: vi.fn(),
    showLoginPrompt: false,
    promptLogin: vi.fn(),
    dismissPrompt: vi.fn(),
    pendingRedirect: null as string | null,
  },
}))

authState.login = loginMock
authState.register = registerMock

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => authState,
}))

vi.mock('@/features/auth/api/authApi', () => ({
  sendVerifyEmailOtp: sendVerifyEmailOtpMock,
  verifyEmailOtp: verifyEmailOtpMock,
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
        search: location.search,
        state: location.state ?? null,
      })}
    </pre>
  )
}

function renderAuthPage(initialEntries: InitialEntry[] = ['/login']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LanguageProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/email-verified" element={<div>Email verified destination</div>} />
          <Route path="/" element={<div>Home destination</div>} />
        </Routes>
        <LocationDisplay />
      </LanguageProvider>
    </MemoryRouter>,
  )
}

describe('Auth pages', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock as unknown as typeof ResizeObserver)
    if (!HTMLElement.prototype.hasPointerCapture) {
      HTMLElement.prototype.hasPointerCapture = () => false
    }
    if (!HTMLElement.prototype.setPointerCapture) {
      HTMLElement.prototype.setPointerCapture = () => undefined
    }
    if (!HTMLElement.prototype.releasePointerCapture) {
      HTMLElement.prototype.releasePointerCapture = () => undefined
    }
    if (!HTMLElement.prototype.scrollIntoView) {
      HTMLElement.prototype.scrollIntoView = () => undefined
    }
    loginMock.mockReset()
    registerMock.mockReset()
    sendVerifyEmailOtpMock.mockReset()
    verifyEmailOtpMock.mockReset()
    toastSuccessMock.mockReset()
    toastErrorMock.mockReset()
    authState.user = null
    authState.role = null
    authState.isLoggedIn = false
    authState.isLoading = false
    authState.pendingRedirect = null
  })

  it('submits customer login, disables unsupported controls, and navigates to a safe redirect', async () => {
    const user = userEvent.setup()
    loginMock.mockResolvedValue(undefined)

    renderAuthPage(['/login?redirect=%2Faccount%2Fprofile'])

    expect(screen.getByRole('button', { name: /google.+chưa hỗ trợ/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /facebook.+chưa hỗ trợ/i })).toBeDisabled()

    expect(screen.getAllByText('User').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Customer').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Brand.+Chưa hỗ trợ/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Admin.+Chưa hỗ trợ/).length).toBeGreaterThan(0)

    await user.type(screen.getByLabelText(/email address|địa chỉ email/i), 'customer@example.com')
    await user.type(screen.getByLabelText(/^password$|^mật khẩu$/i), 'P@ssw0rd!')
    await user.click(screen.getByRole('button', { name: /sign in|đăng nhập/i }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith(
        {
          email: 'customer@example.com',
          password: 'P@ssw0rd!',
        },
        false,
      )
    })

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent('/account/profile')
    })
  })

  it('rejects an unsafe login redirect and falls back to /', async () => {
    const user = userEvent.setup()
    loginMock.mockResolvedValue(undefined)

    renderAuthPage(['/login?redirect=%2F%2Fevil.example'])

    await user.type(screen.getByLabelText(/email address|địa chỉ email/i), 'customer@example.com')
    await user.type(screen.getByLabelText(/^password$|^mật khẩu$/i), 'P@ssw0rd!')
    await user.click(screen.getByRole('button', { name: /sign in|đăng nhập/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent('"pathname":"/"')
    })
  })

  it('shows a login error toast and re-enables submit after a failed login', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValue(new Error('Invalid credentials'))

    renderAuthPage(['/login'])

    await user.type(screen.getByLabelText(/email address|địa chỉ email/i), 'customer@example.com')
    await user.type(screen.getByLabelText(/^password$|^mật khẩu$/i), 'wrong-pass')
    const submitButton = screen.getByRole('button', { name: /sign in|đăng nhập/i })

    await user.click(submitButton)

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Invalid credentials')
    })

    expect(submitButton).not.toBeDisabled()
  })

  it('enforces the backend password rule on registration and does not submit invalid passwords', async () => {
    const user = userEvent.setup()

    renderAuthPage(['/register'])

    expect(screen.getByRole('button', { name: /google.+chưa hỗ trợ/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /facebook.+chưa hỗ trợ/i })).toBeDisabled()

    await user.type(screen.getByLabelText(/full name|họ và tên/i), 'Customer Example')
    await user.type(screen.getByLabelText(/email address|địa chỉ email/i), 'customer@example.com')
    await user.type(screen.getByLabelText(/^password$|^mật khẩu$/i), 'password')
    await user.type(screen.getByLabelText(/confirm password|xác nhận mật khẩu/i), 'password')
    await user.click(screen.getByRole('checkbox', { name: /terms of service|điều khoản sử dụng/i }))
    await user.click(screen.getByRole('button', { name: /create account|tạo tài khoản/i }))

    expect(
      await screen.findByText(/password must be at least 8 characters and include a number and special character|mật khẩu phải có ít nhất 8 ký tự và bao gồm số cùng ký tự đặc biệt/i),
    ).toBeInTheDocument()
    expect(registerMock).not.toHaveBeenCalled()
  })

  it('registers with valid data and navigates to /verify-email with the email in router state', async () => {
    const user = userEvent.setup()
    registerMock.mockResolvedValue(undefined)

    renderAuthPage(['/register'])

    await user.type(screen.getByLabelText(/full name|họ và tên/i), 'Customer Example')
    await user.type(screen.getByLabelText(/email address|địa chỉ email/i), 'customer@example.com')
    await user.type(screen.getByLabelText(/^password$|^mật khẩu$/i), 'P@ssw0rd!')
    await user.type(screen.getByLabelText(/confirm password|xác nhận mật khẩu/i), 'P@ssw0rd!')
    await user.click(screen.getByRole('checkbox', { name: /terms of service|điều khoản sử dụng/i }))
    await user.click(screen.getByRole('button', { name: /create account|tạo tài khoản/i }))

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        name: 'Customer Example',
        email: 'customer@example.com',
        password: 'P@ssw0rd!',
      })
    })

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent('"pathname":"/verify-email"')
    })
    expect(screen.getByTestId('location-display')).toHaveTextContent('customer@example.com')
  })

  it('renders a missing-email fallback on verify-email and avoids OTP requests', () => {
    renderAuthPage(['/verify-email'])

    expect(
      screen.getAllByText(/we need your email address to verify this account|chúng tôi cần địa chỉ email để xác minh tài khoản này/i).length,
    ).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /back to log in|quay lại đăng nhập/i })).toHaveAttribute('href', '/login')
    expect(sendVerifyEmailOtpMock).not.toHaveBeenCalled()
    expect(verifyEmailOtpMock).not.toHaveBeenCalled()
  })

  it('requires a six-digit OTP, verifies it, and can resend using the resolved email source', async () => {
    const user = userEvent.setup()
    sendVerifyEmailOtpMock.mockResolvedValue({ message: 'OTP sent' })
    verifyEmailOtpMock.mockResolvedValue({ message: 'Verified' })

    renderAuthPage([
      {
        pathname: '/verify-email',
        state: { email: 'customer@example.com' },
      },
    ])

    await user.click(screen.getByRole('button', { name: /verify email|xác minh email/i }))

    expect(await screen.findByText(/enter the 6-digit code|nhập mã 6 chữ số/i)).toBeInTheDocument()
    expect(verifyEmailOtpMock).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText(/verification code|mã xác minh/i), '123456')
    await user.click(screen.getByRole('button', { name: /verify email|xác minh email/i }))

    await waitFor(() => {
      expect(verifyEmailOtpMock).toHaveBeenCalledWith({
        email: 'customer@example.com',
        otp: '123456',
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Email verified destination')).toBeInTheDocument()
    })

    renderAuthPage([
      {
        pathname: '/verify-email',
        state: { email: 'customer@example.com' },
      },
    ])

    await user.click(screen.getByRole('button', { name: /resend code|gửi lại mã/i }))

    await waitFor(() => {
      expect(sendVerifyEmailOtpMock).toHaveBeenCalledWith('customer@example.com')
    })
  })

  it('shows a verify-email error toast and stays on the page when verification fails', async () => {
    const user = userEvent.setup()
    verifyEmailOtpMock.mockRejectedValue(new Error('Invalid verification code'))

    renderAuthPage([
      {
        pathname: '/verify-email',
        state: { email: 'customer@example.com' },
      },
    ])

    await user.type(screen.getByLabelText(/verification code|mã xác minh/i), '123456')
    await user.click(screen.getByRole('button', { name: /verify email|xác minh email/i }))

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Invalid verification code')
    })

    expect(screen.getByText(/invalid verification code/i)).toBeInTheDocument()
    expect(screen.getByTestId('location-display')).toHaveTextContent('"pathname":"/verify-email"')
    expect(screen.queryByText('Email verified destination')).not.toBeInTheDocument()
  })

  it('shows a resend error toast and stays on the page when resend fails', async () => {
    const user = userEvent.setup()
    sendVerifyEmailOtpMock.mockRejectedValue(new Error('Resend failed'))

    renderAuthPage([
      {
        pathname: '/verify-email',
        state: { email: 'customer@example.com' },
      },
    ])

    await user.click(screen.getByRole('button', { name: /resend code|gửi lại mã/i }))

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Resend failed')
    })

    expect(screen.getByText(/resend failed/i)).toBeInTheDocument()
    expect(screen.getByTestId('location-display')).toHaveTextContent('"pathname":"/verify-email"')
  })
})
