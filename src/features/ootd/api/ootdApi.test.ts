import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/contracts'

const { apiRequestMock } = vi.hoisted(() => ({ apiRequestMock: vi.fn() }))

vi.mock('@/shared/api/apiClient', () => ({ apiRequest: apiRequestMock }))

import { listUserOOTD } from './ootdApi'

const validFeed = {
  items: [
    {
      id: 'p1',
      author_name: 'Minh Anh',
      photo_urls: ['https://img/1.jpg'],
      like_count: 12,
      comment_count: 3,
      liked_by_me: false,
      tags: [{ product_id: 'pr1', slug: 'denim-jacket', name: 'Denim Jacket' }],
      created_at: '2026-06-01T00:00:00Z',
    },
  ],
  pagination: { page: 1, limit: 50, total: 1, total_pages: 1 },
}

describe('listUserOOTD', () => {
  beforeEach(() => apiRequestMock.mockReset())

  it('requests the user OOTD path with pagination and returns a validated feed', async () => {
    apiRequestMock.mockResolvedValue(validFeed)

    const res = await listUserOOTD('user-1', { limit: 50 })

    expect(apiRequestMock).toHaveBeenCalledWith('/users/user-1/ootd?limit=50', { method: 'GET' })
    expect(res.items).toHaveLength(1)
    expect(res.items[0].id).toBe('p1')
    // caption is omitempty on the backend; normalized to null.
    expect(res.items[0].caption).toBeNull()
  })

  it('omits the query string when no pagination is given', async () => {
    apiRequestMock.mockResolvedValue(validFeed)

    await listUserOOTD('user-1')

    expect(apiRequestMock).toHaveBeenCalledWith('/users/user-1/ootd', { method: 'GET' })
  })

  it('encodes the user id path segment', async () => {
    apiRequestMock.mockResolvedValue(validFeed)

    await listUserOOTD('a/b')

    expect(apiRequestMock).toHaveBeenCalledWith('/users/a%2Fb/ootd', { method: 'GET' })
  })

  it('throws an ApiError on an invalid response shape', async () => {
    apiRequestMock.mockResolvedValue({ items: [{ id: 'x' }], pagination: {} })

    await expect(listUserOOTD('user-1')).rejects.toBeInstanceOf(ApiError)
  })
})
