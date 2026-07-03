import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import { ApiError } from '@/shared/api/contracts'

import { SettingsPage } from './SettingsPage'

const { deleteAccountMock, logoutMock, navigateMock, toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  deleteAccountMock: vi.fn(),
  logoutMock: vi.fn(),
  navigateMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}))

vi.mock('@/features/auth/api/authApi', () => ({
  deleteAccount: deleteAccountMock,
}))

vi.mock('sonner', () => ({
  toast: { success: toastSuccessMock, error: toastErrorMock, message: vi.fn() },
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({ logout: logoutMock }),
}))

vi.mock('@/shared/components/AccountLayout', () => ({
  AccountLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: () => navigateMock }
})

function renderPage() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('SettingsPage delete account', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    deleteAccountMock.mockReset()
    logoutMock.mockReset()
    navigateMock.mockReset()
    toastSuccessMock.mockReset()
    toastErrorMock.mockReset()
  })

  it('deletes the account, logs out, and redirects to /login', async () => {
    deleteAccountMock.mockResolvedValue({ message: 'Account scheduled for deletion within 90 days' })
    logoutMock.mockResolvedValue(undefined)
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /delete account/i }))

    const passwordInput = await screen.findByLabelText(/^password$/i)
    await userEvent.type(passwordInput, 'P@ssw0rd!{Enter}')

    await waitFor(() => expect(deleteAccountMock).toHaveBeenCalledWith('P@ssw0rd!'))
    expect(logoutMock).toHaveBeenCalled()
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/login'))
  })

  it('keeps the modal open and toasts when the password is wrong', async () => {
    deleteAccountMock.mockRejectedValue(new ApiError(401, 'INVALID_CREDENTIALS', 'invalid'))
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /delete account/i }))

    const passwordInput = await screen.findByLabelText(/^password$/i)
    await userEvent.type(passwordInput, 'wrong-pass{Enter}')

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalled())
    expect(logoutMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
  })
})
