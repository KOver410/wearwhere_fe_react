import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import type { AuthUser } from '@/features/auth/api/contracts'

import { AccountLayout } from './AccountLayout'

const { logoutMock } = vi.hoisted(() => ({ logoutMock: vi.fn() }))

const testUser: AuthUser = {
  id: 'user-42',
  email: 'real.person@example.com',
  phone: null,
  name: 'Real Person',
  role: 'customer',
  status: 'active',
  avatar_url: 'https://cdn.example.com/real.jpg',
  bio: null,
  email_verified: true,
  phone_verified: false,
  created_at: '2026-01-01T00:00:00.000Z',
}

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({ user: testUser, logout: logoutMock }),
}))

function renderLayout() {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={['/account/profile']}>
        <AccountLayout>
          <div>child</div>
        </AccountLayout>
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('AccountLayout sidebar identity', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    logoutMock.mockReset()
  })

  it('shows the authenticated user, not the hardcoded mock account', () => {
    renderLayout()

    // The real logged-in user's name is shown.
    expect(screen.getByText('Real Person')).toBeInTheDocument()

    // The mock identity must NOT leak into the sidebar.
    expect(screen.queryByText('Nguyễn Minh Anh')).not.toBeInTheDocument()
    expect(screen.queryByText(/fashionista_vn/i)).not.toBeInTheDocument()
  })
})
