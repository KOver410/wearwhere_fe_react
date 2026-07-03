import { MemoryRouter, Route, Routes } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageProvider } from '@/shared/i18n/LanguageContext'
import type { OOTDPost } from '@/features/ootd/api/contracts'

import { OOTDDetailPage } from './OOTDDetailPage'

const {
  getPostMock,
  listCommentsMock,
  likePostMock,
  unlikePostMock,
  addCommentMock,
  promptLoginMock,
  authState,
} = vi.hoisted(() => ({
  getPostMock: vi.fn(),
  listCommentsMock: vi.fn(),
  likePostMock: vi.fn(),
  unlikePostMock: vi.fn(),
  addCommentMock: vi.fn(),
  promptLoginMock: vi.fn(),
  authState: { isLoggedIn: true },
}))

vi.mock('@/features/ootd/api/ootdApi', () => ({
  getPost: getPostMock,
  listComments: listCommentsMock,
  likePost: likePostMock,
  unlikePost: unlikePostMock,
  addComment: addCommentMock,
}))

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', name: 'Minh Anh' },
    isLoggedIn: authState.isLoggedIn,
    promptLogin: promptLoginMock,
  }),
}))

function makePost(overrides: Partial<OOTDPost> = {}): OOTDPost {
  return {
    id: 'p1',
    author_name: 'Style Queen',
    caption: 'Autumn layers',
    photo_urls: ['https://img/1.jpg'],
    like_count: 10,
    comment_count: 1,
    liked_by_me: false,
    tags: [{ product_id: 'pr1', slug: 'wool-coat', name: 'Wool Coat' }],
    created_at: '2026-06-01T00:00:00Z',
    ...overrides,
  }
}

function renderPage() {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={['/ootd/p1']}>
        <Routes>
          <Route path="/ootd/:id" element={<OOTDDetailPage />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('OOTDDetailPage', () => {
  beforeEach(() => {
    localStorage.setItem('ww-lang', 'en')
    getPostMock.mockReset()
    listCommentsMock.mockReset()
    likePostMock.mockReset()
    unlikePostMock.mockReset()
    addCommentMock.mockReset()
    promptLoginMock.mockReset()
    authState.isLoggedIn = true
  })

  it('loads the post and its comments from the backend', async () => {
    getPostMock.mockResolvedValue(makePost())
    listCommentsMock.mockResolvedValue({
      items: [{ id: 'c1', author_name: 'Urban Guy', body: 'Great fit!', created_at: '2026-06-01T00:00:00Z' }],
      pagination: { page: 1, limit: 50, total: 1, total_pages: 1 },
    })

    renderPage()

    expect(await screen.findByText('Style Queen')).toBeInTheDocument()
    expect(screen.getByText('Autumn layers')).toBeInTheDocument()
    expect(screen.getByText('Great fit!')).toBeInTheDocument()
    // Tagged product chip links by slug.
    expect(screen.getByRole('link', { name: /wool coat/i })).toHaveAttribute('href', '/product/wool-coat')
  })

  it('likes the post optimistically via the like endpoint', async () => {
    getPostMock.mockResolvedValue(makePost())
    listCommentsMock.mockResolvedValue({ items: [], pagination: { page: 1, limit: 50, total: 0, total_pages: 0 } })
    likePostMock.mockResolvedValue(undefined)

    renderPage()
    await screen.findByText('Style Queen')

    await userEvent.click(screen.getByRole('button', { name: /like/i }))

    expect(likePostMock).toHaveBeenCalledWith('p1')
    expect(screen.getByText('11')).toBeInTheDocument()
  })

  it('adds a comment via the backend and appends it', async () => {
    getPostMock.mockResolvedValue(makePost())
    listCommentsMock.mockResolvedValue({ items: [], pagination: { page: 1, limit: 50, total: 0, total_pages: 0 } })
    addCommentMock.mockResolvedValue({ id: 'c9' })

    renderPage()
    await screen.findByText('Style Queen')

    await userEvent.type(screen.getByPlaceholderText(/add a comment/i), 'Love it')
    await userEvent.click(screen.getByRole('button', { name: /send comment/i }))

    await waitFor(() => expect(addCommentMock).toHaveBeenCalledWith('p1', 'Love it'))
    expect(await screen.findByText(/Love it/)).toBeInTheDocument()
  })
})
