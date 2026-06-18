import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'

import AdminLoginPage from './AdminLoginPage'

const { portalFormMock, loginAdminMock } = vi.hoisted(() => ({
  portalFormMock: vi.fn(),
  loginAdminMock: vi.fn(),
}))

vi.mock('@/features/auth/components/PortalLoginForm', () => ({
  PortalLoginForm: (props: Record<string, unknown>) => {
    portalFormMock(props)
    return <div data-testid="portal-login-form">{String(props.title)}</div>
  },
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({ loginAdmin: loginAdminMock, isLoggedIn: false, role: null }),
}))

describe('AdminLoginPage', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    portalFormMock.mockReset()
    loginAdminMock.mockReset()
  })

  it('renders PortalLoginForm wired with admin props and the admin login fn', () => {
    render(
      <LanguageProvider>
        <AdminLoginPage />
      </LanguageProvider>,
    )

    expect(screen.getByTestId('portal-login-form')).toBeInTheDocument()
    const props = portalFormMock.mock.calls[0][0]
    expect(props).toMatchObject({
      role: 'admin',
      loginFn: loginAdminMock,
      routePrefix: '/admin',
      dashboardPath: '/admin/dashboard',
      idPrefix: 'admin',
      isLoggedIn: false,
      currentRole: null,
    })
    expect(props.title).toBe('Admin Console')
  })
})
