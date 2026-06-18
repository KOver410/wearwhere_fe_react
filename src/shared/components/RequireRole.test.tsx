import { MemoryRouter, Route, Routes } from 'react-router'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { RequireRole } from './RequireRole'

const { useAuthMock } = vi.hoisted(() => ({ useAuthMock: vi.fn() }))

vi.mock('@/shared/contexts/AuthContext', () => ({ useAuth: useAuthMock }))

function renderGuarded() {
  return render(
    <MemoryRouter initialEntries={['/brand/dashboard']}>
      <Routes>
        <Route path="/brand/login" element={<div>BRAND LOGIN</div>} />
        <Route
          path="/brand/dashboard"
          element={
            <RequireRole role="brand" loginPath="/brand/login">
              <div>BRAND DASHBOARD</div>
            </RequireRole>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RequireRole', () => {
  beforeEach(() => {
    useAuthMock.mockReset()
  })

  it('shows a loading placeholder while the session is restoring', () => {
    useAuthMock.mockReturnValue({ isLoggedIn: false, isLoading: true, role: null })
    renderGuarded()
    expect(screen.getByTestId('require-role-loading')).toBeInTheDocument()
  })

  it('redirects to the login path when not logged in', () => {
    useAuthMock.mockReturnValue({ isLoggedIn: false, isLoading: false, role: null })
    renderGuarded()
    expect(screen.getByText('BRAND LOGIN')).toBeInTheDocument()
    expect(screen.queryByText('BRAND DASHBOARD')).not.toBeInTheDocument()
  })

  it('redirects when logged in with the wrong role', () => {
    useAuthMock.mockReturnValue({ isLoggedIn: true, isLoading: false, role: 'customer' })
    renderGuarded()
    expect(screen.getByText('BRAND LOGIN')).toBeInTheDocument()
  })

  it('renders children when logged in with the matching role', () => {
    useAuthMock.mockReturnValue({ isLoggedIn: true, isLoading: false, role: 'brand' })
    renderGuarded()
    expect(screen.getByText('BRAND DASHBOARD')).toBeInTheDocument()
  })
})
