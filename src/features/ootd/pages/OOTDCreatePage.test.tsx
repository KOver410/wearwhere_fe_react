import { MemoryRouter } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'

import { OOTDCreatePage } from './OOTDCreatePage'

const { createPostMock, navigateMock, promptLoginMock, authState } = vi.hoisted(() => ({
  createPostMock: vi.fn(),
  navigateMock: vi.fn(),
  promptLoginMock: vi.fn(),
  authState: { isLoggedIn: true },
}))

vi.mock('@/features/ootd/api/ootdApi', () => ({
  createPost: createPostMock,
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({ isLoggedIn: authState.isLoggedIn, promptLogin: promptLoginMock }),
}))

vi.mock('react-router', async (importActual) => {
  const actual = await importActual<typeof import('react-router')>()
  return { ...actual, useNavigate: () => navigateMock }
})

function renderPage() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <OOTDCreatePage />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('OOTDCreatePage', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    createPostMock.mockReset()
    navigateMock.mockReset()
    promptLoginMock.mockReset()
    authState.isLoggedIn = true
    // jsdom does not implement object URLs.
    URL.createObjectURL = vi.fn(() => 'blob:preview')
    URL.revokeObjectURL = vi.fn()
  })

  it('keeps submit disabled until a photo and caption are provided', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /post ootd/i })).toBeDisabled()
  })

  it('creates a post from the selected photo and caption, then navigates to it', async () => {
    createPostMock.mockResolvedValue({ id: 'new-1' })
    const file = new File(['x'], 'fit.jpg', { type: 'image/jpeg' })

    renderPage()

    await userEvent.upload(screen.getByLabelText(/upload photos/i), file)
    await userEvent.type(screen.getByPlaceholderText(/tell us about your outfit/i), 'My outfit')
    await userEvent.click(screen.getByRole('button', { name: /post ootd/i }))

    await waitFor(() => expect(createPostMock).toHaveBeenCalledWith({ photos: [file], caption: 'My outfit' }))
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/ootd/new-1'))
  })

  it('prompts login instead of posting when logged out', async () => {
    authState.isLoggedIn = false
    const file = new File(['x'], 'fit.jpg', { type: 'image/jpeg' })

    renderPage()

    await userEvent.upload(screen.getByLabelText(/upload photos/i), file)
    await userEvent.type(screen.getByPlaceholderText(/tell us about your outfit/i), 'My outfit')
    await userEvent.click(screen.getByRole('button', { name: /post ootd/i }))

    expect(promptLoginMock).toHaveBeenCalled()
    expect(createPostMock).not.toHaveBeenCalled()
  })
})
