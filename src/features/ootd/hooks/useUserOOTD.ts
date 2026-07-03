import { useEffect, useState } from 'react'

import { listUserOOTD } from '@/features/ootd/api/ootdApi'
import type { OOTDPost } from '@/features/ootd/api/contracts'

export type UserOOTDState = {
  posts: OOTDPost[]
  loading: boolean
  error: boolean
}

/**
 * Loads a user's own OOTD posts from the backend. Returns an empty, non-loading
 * state when `userId` is undefined (e.g. before the session is restored). Guards
 * against out-of-order resolutions and unmounts via a per-run `active` flag.
 */
export function useUserOOTD(userId: string | undefined): UserOOTDState {
  const [posts, setPosts] = useState<OOTDPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!userId) {
      setPosts([])
      setError(false)
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    setError(false)
    listUserOOTD(userId, { limit: 50 })
      .then((res) => {
        if (active) setPosts(res.items)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [userId])

  return { posts, loading, error }
}
