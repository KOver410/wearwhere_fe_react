import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import type { AuthUser } from '@/features/auth/api/contracts'

import { ProfilePage } from './ProfilePage'

const { updateProfileMock, applyUserMock, toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  updateProfileMock: vi.fn(),
  applyUserMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
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
