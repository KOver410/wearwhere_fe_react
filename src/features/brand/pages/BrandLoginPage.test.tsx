import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'

import { BrandLoginPage } from './BrandLoginPage'

const { portalFormMock, loginBrandMock } = vi.hoisted(() => ({
  portalFormMock: vi.fn(),
  loginBrandMock: vi.fn(),
}))

vi.mock('@/features/auth/components/PortalLoginForm', () => ({
  PortalLoginForm: (props: Record<string, unknown>) => {
    portalFormMock(props)
    return <div data-testid="portal-login-form">{String(props.title)}</div>
  },
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({ loginBrand: loginBrandMock, isLoggedIn: false, role: null }),
}))

describe('BrandLoginPage', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    portalFormMock.mockReset()
    loginBrandMock.mockReset()
  })

  it('renders PortalLoginForm wired with brand props and the brand login fn', () => {
    render(
      <LanguageProvider>
        <BrandLoginPage />
      </LanguageProvider>,
    )

    expect(screen.getByTestId('portal-login-form')).toBeInTheDocument()
    const props = portalFormMock.mock.calls[0][0]
    expect(props).toMatchObject({
      role: 'brand',
      loginFn: loginBrandMock,
      routePrefix: '/brand',
      dashboardPath: '/brand/dashboard',
      idPrefix: 'brand',
      isLoggedIn: false,
      currentRole: null,
    })
    expect(props.title).toBe('Brand Portal')
  })
})
