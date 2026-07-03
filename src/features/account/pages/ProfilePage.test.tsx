import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import type { AuthUser } from '@/features/auth/api/contracts'

import { ProfilePage } from './ProfilePage'

const { updateProfileMock, applyUserMock, toastSuccessMock, toastErrorMock, useUserOOTDMock } = vi.hoisted(() => ({
  updateProfileMock: vi.fn(),
  applyUserMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
  useUserOOTDMock: vi.fn(() => ({ posts: [], loading: false, error: false })),
}))

const testUser: AuthUser = {
  id: 'user-1',
  email: 'minhanh@example.com',
  phone: null,
  name: 'Minh Anh',
  role: 'customer',
  status: 'active',
  avatar_url: null,
  bio: 'Old bio',
  email_verified: true,
  phone_verified: false,
  created_at: '2026-01-01T00:00:00.000Z',
}

vi.mock('@/features/auth/api/authApi', () => ({
  updateProfile: updateProfileMock,
}))

vi.mock('sonner', () => ({
  toast: { success: toastSuccessMock, error: toastErrorMock, message: vi.fn() },
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({ user: testUser, applyUser: applyUserMock }),
}))

vi.mock('@/features/ootd/hooks/useUserOOTD', () => ({
  useUserOOTD: (...args: unknown[]) => useUserOOTDMock(...args),
}))

vi.mock('@/shared/components/AccountLayout', () => ({
  AccountLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

function renderPage() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('ProfilePage edit', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    updateProfileMock.mockReset()
    applyUserMock.mockReset()
    toastSuccessMock.mockReset()
    toastErrorMock.mockReset()
  })

  it('saves name and bio via updateProfile and applies the returned user', async () => {
    const updated = { ...testUser, name: 'New Name', bio: 'New bio' }
    updateProfileMock.mockResolvedValue({ user: updated })
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /edit profile/i }))

    const nameInput = screen.getByLabelText(/full name/i)
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'New Name')

    const bioInput = screen.getByLabelText(/^bio$/i)
    await userEvent.clear(bioInput)
    await userEvent.type(bioInput, 'New bio')

    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() =>
      expect(updateProfileMock).toHaveBeenCalledWith({ name: 'New Name', bio: 'New bio' }),
    )
    expect(applyUserMock).toHaveBeenCalledWith(updated)
    expect(toastSuccessMock).toHaveBeenCalled()
  })

  it('blocks save and shows an error when the name is empty', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /edit profile/i }))

    const nameInput = screen.getByLabelText(/full name/i)
    await userEvent.clear(nameInput)

    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    expect(updateProfileMock).not.toHaveBeenCalled()
  })
})

describe('ProfilePage header identity', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
  })

  it('renders the authenticated user, not the hardcoded mock identity', () => {
    renderPage()

    // Real user name from useAuth() is shown in the header.
    expect(screen.getByText('Minh Anh')).toBeInTheDocument()

    // Mock account identity must not leak into the header.
    expect(screen.queryByText(/fashionista_vn/i)).not.toBeInTheDocument()
    expect(screen.queryByText('Nguyễn Minh Anh')).not.toBeInTheDocument()
    // Mock follower/following counts must not be rendered.
    expect(screen.queryByText(/1,240/)).not.toBeInTheDocument()
  })
})

describe('ProfilePage OOTD posts', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    useUserOOTDMock.mockReturnValue({
      posts: [
        {
          id: 'p1',
          author_name: 'Minh Anh',
          caption: 'Look one',
          photo_urls: ['https://img/1.jpg'],
          like_count: 12,
          comment_count: 3,
          liked_by_me: false,
          tags: [{ product_id: 'pr1', slug: 'denim-jacket', name: 'Denim Jacket' }],
          created_at: '2026-06-01T00:00:00Z',
        },
      ],
      loading: false,
      error: false,
    })
  })

  it('renders the user OOTD posts from the backend with like counts', () => {
    renderPage()

    const links = screen.getAllByRole('link')
    expect(links.some((a) => a.getAttribute('href') === '/ootd/p1')).toBe(true)
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('renders tagged product chips linking by slug', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /tagged products/i }))

    const chip = screen.getByRole('link', { name: /denim jacket/i })
    expect(chip).toHaveAttribute('href', '/product/denim-jacket')
  })
})
