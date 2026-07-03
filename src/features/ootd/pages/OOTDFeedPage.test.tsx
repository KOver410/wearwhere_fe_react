import { MemoryRouter } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import type { OOTDPost } from '@/features/ootd/api/contracts'

import { OOTDFeedPage } from './OOTDFeedPage'

const { listFeedMock, likePostMock, unlikePostMock, promptLoginMock, authState } = vi.hoisted(() => ({
  listFeedMock: vi.fn(),
  likePostMock: vi.fn(),
  unlikePostMock: vi.fn(),
  promptLoginMock: vi.fn(),
  authState: { isLoggedIn: true },
}))

vi.mock('@/features/ootd/api/ootdApi', () => ({
  listFeed: listFeedMock,
  likePost: likePostMock,
  unlikePost: unlikePostMock,
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({ isLoggedIn: authState.isLoggedIn, promptLogin: promptLoginMock }),
}))

// react-responsive-masonry does not import cleanly under jsdom; stub it to a
// passthrough so the page's own logic can be tested.
vi.mock('react-responsive-masonry', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ResponsiveMasonry: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

function makePost(overrides: Partial<OOTDPost> = {}): OOTDPost {
  return {
    id: 'p1',
    author_name: 'Minh Anh',
    caption: 'Sunny fit',
    photo_urls: ['https://img/1.jpg'],
    like_count: 5,
    comment_count: 2,
    liked_by_me: false,
    tags: [],
    created_at: '2026-06-01T00:00:00Z',
    ...overrides,
  }
}

function renderPage() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <OOTDFeedPage />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('OOTDFeedPage', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    listFeedMock.mockReset()
    likePostMock.mockReset()
    unlikePostMock.mockReset()
    promptLoginMock.mockReset()
    authState.isLoggedIn = true
  })

  it('loads and renders feed posts from the backend', async () => {
    listFeedMock.mockResolvedValue({
      items: [makePost()],
      pagination: { page: 1, limit: 50, total: 1, total_pages: 1 },
    })

    renderPage()

    expect(await screen.findByText('Minh Anh')).toBeInTheDocument()
    expect(screen.getByText('Sunny fit')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('optimistically likes a post and calls the like endpoint', async () => {
    listFeedMock.mockResolvedValue({
      items: [makePost()],
      pagination: { page: 1, limit: 50, total: 1, total_pages: 1 },
    })
    likePostMock.mockResolvedValue(undefined)

    renderPage()
    await screen.findByText('Minh Anh')

    await userEvent.click(screen.getByRole('button', { name: /like/i }))

    expect(likePostMock).toHaveBeenCalledWith('p1')
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('prompts login instead of liking when logged out', async () => {
    authState.isLoggedIn = false
    listFeedMock.mockResolvedValue({
      items: [makePost()],
      pagination: { page: 1, limit: 50, total: 1, total_pages: 1 },
    })

    renderPage()
    await screen.findByText('Minh Anh')

    await userEvent.click(screen.getByRole('button', { name: /like/i }))

    expect(promptLoginMock).toHaveBeenCalled()
    expect(likePostMock).not.toHaveBeenCalled()
  })
})
