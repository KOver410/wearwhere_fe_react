import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import type { OOTDPost } from '@/features/ootd/api/contracts'

import { MyOOTDsPage } from './MyOOTDsPage'

const { useUserOOTDMock } = vi.hoisted(() => ({ useUserOOTDMock: vi.fn() }))

vi.mock('@/features/ootd/hooks/useUserOOTD', () => ({
  useUserOOTD: (...args: unknown[]) => useUserOOTDMock(...args),
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-1', name: 'Minh Anh' } }),
}))

vi.mock('@/shared/components/AccountLayout', () => ({
  AccountLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

function makePost(overrides: Partial<OOTDPost> = {}): OOTDPost {
  return {
    id: 'p1',
    author_name: 'Minh Anh',
    caption: 'Sunny day fit',
    photo_urls: ['https://img/1.jpg'],
    like_count: 9,
    comment_count: 4,
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
        <MyOOTDsPage />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('MyOOTDsPage', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    useUserOOTDMock.mockReset()
  })

  it('shows a loading state while posts load', () => {
    useUserOOTDMock.mockReturnValue({ posts: [], loading: true, error: false })
    renderPage()
    expect(screen.getByTestId('ootd-loading')).toBeInTheDocument()
  })

  it('shows an error state when loading fails', () => {
    useUserOOTDMock.mockReturnValue({ posts: [], loading: false, error: true })
    renderPage()
    expect(screen.getByText(/could not load your ootds/i)).toBeInTheDocument()
  })

  it('renders the empty state when the user has no posts', () => {
    useUserOOTDMock.mockReturnValue({ posts: [], loading: false, error: false })
    renderPage()
    expect(screen.getByText(/no ootds yet/i)).toBeInTheDocument()
  })

  it('renders the user posts with like and comment counts', () => {
    useUserOOTDMock.mockReturnValue({ posts: [makePost()], loading: false, error: false })
    renderPage()

    const links = screen.getAllByRole('link')
    expect(links.some((a) => a.getAttribute('href') === '/ootd/p1')).toBe(true)
    // Like count (9) and comment count (4) are rendered from the real DTO.
    expect(screen.getAllByText('9').length).toBeGreaterThan(0)
    expect(screen.getAllByText('4').length).toBeGreaterThan(0)
  })
})
