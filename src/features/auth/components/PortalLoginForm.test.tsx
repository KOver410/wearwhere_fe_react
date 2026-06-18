import { MemoryRouter } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import { ApiError } from '@/shared/api/contracts'

import { PortalLoginForm } from './PortalLoginForm'

const { navigateMock, toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: { success: toastSuccessMock, error: toastErrorMock, message: vi.fn() },
}))

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: () => navigateMock }
})

function renderForm(loginFn: ReturnType<typeof vi.fn>) {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <PortalLoginForm
          role="brand"
          loginFn={loginFn}
          isLoggedIn={false}
          currentRole={null}
          routePrefix="/brand"
          dashboardPath="/brand/dashboard"
          idPrefix="brand"
          title="Brand Portal"
          subtitle="Sign in to manage your store."
        />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

function renderFormWithState(
  loginFn: ReturnType<typeof vi.fn>,
  fromState: { pathname?: string; search?: string } | undefined,
) {
  const initialEntry = {
    pathname: '/brand/login',
    state: fromState ? { from: fromState } : undefined,
  }
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <PortalLoginForm
          role="brand"
          loginFn={loginFn}
          isLoggedIn={false}
          currentRole={null}
          routePrefix="/brand"
          dashboardPath="/brand/dashboard"
          idPrefix="brand"
          title="Brand Portal"
          subtitle="Sign in to manage your store."
        />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('PortalLoginForm', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    navigateMock.mockReset()
    toastSuccessMock.mockReset()
    toastErrorMock.mockReset()
  })

  it('submits credentials via loginFn and navigates to the dashboard fallback', async () => {
    const loginFn = vi.fn().mockResolvedValue(undefined)
    renderForm(loginFn)

    await userEvent.type(screen.getByLabelText(/email address/i), 'brand@example.com')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'P@ssw0rd!')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() =>
      expect(loginFn).toHaveBeenCalledWith({ email: 'brand@example.com', password: 'P@ssw0rd!' }, false),
    )
    expect(toastSuccessMock).toHaveBeenCalled()
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/brand/dashboard'))
  })

  it('shows an error toast and does not navigate on invalid credentials', async () => {
    const loginFn = vi.fn().mockRejectedValue(new ApiError(401, 'INVALID_CREDENTIALS', 'invalid'))
    renderForm(loginFn)

    await userEvent.type(screen.getByLabelText(/email address/i), 'brand@example.com')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalled())
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('honors deep-link redirect when from.pathname is under the portal prefix', async () => {
    const loginFn = vi.fn().mockResolvedValue(undefined)
    renderFormWithState(loginFn, { pathname: '/brand/orders', search: '?x=1' })

    await userEvent.type(screen.getByLabelText(/email address/i), 'brand@example.com')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'P@ssw0rd!')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/brand/orders?x=1'))
    expect(navigateMock).not.toHaveBeenCalledWith('/brand/dashboard')
  })

  it('falls back to dashboard when from.pathname is outside the portal prefix', async () => {
    const loginFn = vi.fn().mockResolvedValue(undefined)
    renderFormWithState(loginFn, { pathname: '/account/profile' })

    await userEvent.type(screen.getByLabelText(/email address/i), 'brand@example.com')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'P@ssw0rd!')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/brand/dashboard'))
  })

  it('shows ACCOUNT_LOCKED message and does not navigate when account is locked', async () => {
    const loginFn = vi.fn().mockRejectedValue(new ApiError(403, 'ACCOUNT_LOCKED', 'locked'))
    renderForm(loginFn)

    await userEvent.type(screen.getByLabelText(/email address/i), 'brand@example.com')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'P@ssw0rd!')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() =>
      expect(toastErrorMock).toHaveBeenCalledWith(
        'Account temporarily locked after too many attempts. Try again later.',
      ),
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
