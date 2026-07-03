import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/contracts'

const { apiRequestMock } = vi.hoisted(() => ({ apiRequestMock: vi.fn() }))

vi.mock('@/shared/api/apiClient', () => ({ apiRequest: apiRequestMock }))

import {
  addComment,
  createPost,
  getPost,
  likePost,
  listComments,
  listFeed,
  listUserOOTD,
  unlikePost,
} from './ootdApi'

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

const singlePost = validFeed.items[0]

describe('OOTD feed / detail / comments', () => {
  beforeEach(() => apiRequestMock.mockReset())

  it('listFeed requests /ootd and validates', async () => {
    apiRequestMock.mockResolvedValue(validFeed)
    const res = await listFeed({ page: 2, limit: 20 })
    expect(apiRequestMock).toHaveBeenCalledWith('/ootd?page=2&limit=20', { method: 'GET' })
    expect(res.items).toHaveLength(1)
  })

  it('getPost requests /ootd/{id} and returns a single validated post', async () => {
    apiRequestMock.mockResolvedValue(singlePost)
    const res = await getPost('p1')
    expect(apiRequestMock).toHaveBeenCalledWith('/ootd/p1', { method: 'GET' })
    expect(res.id).toBe('p1')
  })

  it('getPost throws on an invalid post', async () => {
    apiRequestMock.mockResolvedValue({ id: 'p1' })
    await expect(getPost('p1')).rejects.toBeInstanceOf(ApiError)
  })

  it('listComments requests the comments path and validates', async () => {
    apiRequestMock.mockResolvedValue({
      items: [{ id: 'c1', author_name: 'A', body: 'nice', created_at: 't' }],
      pagination: { page: 1, limit: 20, total: 1, total_pages: 1 },
    })
    const res = await listComments('p1')
    expect(apiRequestMock).toHaveBeenCalledWith('/ootd/p1/comments', { method: 'GET' })
    expect(res.items[0].body).toBe('nice')
  })
})

describe('OOTD write actions', () => {
  beforeEach(() => apiRequestMock.mockReset())

  it('likePost POSTs to the like path', async () => {
    apiRequestMock.mockResolvedValue({ liked: true })
    await likePost('p1')
    expect(apiRequestMock).toHaveBeenCalledWith('/ootd/p1/like', { method: 'POST' })
  })

  it('unlikePost DELETEs the like path', async () => {
    apiRequestMock.mockResolvedValue({ liked: false })
    await unlikePost('p1')
    expect(apiRequestMock).toHaveBeenCalledWith('/ootd/p1/like', { method: 'DELETE' })
  })

  it('addComment POSTs the body and returns the new id', async () => {
    apiRequestMock.mockResolvedValue({ id: 'c9' })
    const res = await addComment('p1', 'hello')
    expect(apiRequestMock).toHaveBeenCalledWith('/ootd/p1/comments', { method: 'POST', body: { body: 'hello' } })
    expect(res.id).toBe('c9')
  })

  it('createPost sends a multipart FormData body with photos, caption and product ids', async () => {
    apiRequestMock.mockResolvedValue({ id: 'new-post' })
    const file = new File(['x'], 'outfit.jpg', { type: 'image/jpeg' })

    const res = await createPost({ photos: [file], caption: 'my fit', productIds: ['pr1', 'pr2'] })

    expect(res.id).toBe('new-post')
    const [path, opts] = apiRequestMock.mock.calls[0]
    expect(path).toBe('/ootd')
    expect(opts.method).toBe('POST')
    expect(opts.body).toBeInstanceOf(FormData)
    const form = opts.body as FormData
    expect(form.get('caption')).toBe('my fit')
    expect(form.getAll('product_ids')).toEqual(['pr1', 'pr2'])
    expect(form.getAll('photos')).toHaveLength(1)
  })
})
