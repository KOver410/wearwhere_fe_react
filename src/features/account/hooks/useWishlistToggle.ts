import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { toast } from 'sonner'

import { useAuth } from '@/shared/contexts/AuthContext'
import { useLanguage } from '@/shared/i18n/LanguageContext'
import {
  addWishlistProduct,
  getWishlistContains,
  removeWishlistProduct,
} from '@/features/account/api/wishlistApi'

/**
 * Wishlist heart-control behavior shared by the catalog pages.
 *
 * - For authenticated customers, it queries `contains` for exactly the visible
 *   product UUIDs and exposes their membership.
 * - Toggling performs an optimistic local update, calls the backend, and rolls
 *   back with a toast on failure.
 * - For logged-out users, toggling prompts login (with the current location as
 *   the redirect target) and sends no request.
 */
export function useWishlistToggle(visibleIds: string[]) {
  const { isLoggedIn, promptLogin } = useAuth()
  const { v } = useLanguage()
  const location = useLocation()
  const [membership, setMembership] = useState<Record<string, boolean>>({})

  // Per-id in-flight tracking. The ref is the source of truth for the "is this
  // id already being toggled?" guard (read synchronously inside `toggle` so two
  // clicks in the same tick can't both pass). The state mirror exists only so
  // `isPending` reflected in render updates when the set changes.
  const pendingIdsRef = useRef<Set<string>>(new Set())
  const [pendingIds, setPendingIds] = useState<Record<string, true>>({})

  // Stable key so the effect only refires when the actual set of ids changes.
  const idsKey = visibleIds.join(',')

  useEffect(() => {
    if (!isLoggedIn) {
      setMembership({})
      return
    }
    const ids = idsKey ? idsKey.split(',') : []
    if (ids.length === 0) {
      return
    }

    let active = true
    getWishlistContains(ids)
      .then((res) => {
        if (active) {
          setMembership((prev) => ({ ...prev, ...res.in_wishlist }))
        }
      })
      .catch(() => {
        // A failed membership probe leaves hearts in their default (off) state;
        // toggling still works and will surface any real error.
      })
    return () => {
      active = false
    }
  }, [isLoggedIn, idsKey])

  const isInWishlist = useCallback(
    (productId: string): boolean => membership[productId] ?? false,
    [membership],
  )

  const isPending = useCallback(
    (productId: string): boolean => productId in pendingIds,
    [pendingIds],
  )

  const toggle = useCallback(
    (productId: string): void => {
      if (!isLoggedIn) {
        promptLogin(location.pathname + location.search)
        return
      }

      // Ignore a click while a request for this id is already in flight. The
      // ref is checked/updated synchronously so a rapid second click in the
      // same tick is dropped before it can fire a duplicate request.
      if (pendingIdsRef.current.has(productId)) {
        return
      }
      pendingIdsRef.current.add(productId)
      setPendingIds((prev) => ({ ...prev, [productId]: true }))

      // Read the pre-toggle value from live state via the functional updater so
      // the optimistic flip and the rollback target reflect current membership,
      // never a stale closure.
      let wasIn = false
      setMembership((prev) => {
        wasIn = prev[productId] ?? false
        return { ...prev, [productId]: !wasIn }
      })

      const request = wasIn
        ? removeWishlistProduct(productId)
        : addWishlistProduct(productId)

      request
        .catch((error: unknown) => {
          // Roll back exactly the pre-toggle value for this id and report.
          setMembership((prev) => ({ ...prev, [productId]: wasIn }))
          const message =
            error instanceof Error
              ? error.message
              : v('Could not update wishlist', 'Không thể cập nhật danh sách yêu thích')
          toast.error(message)
        })
        .finally(() => {
          pendingIdsRef.current.delete(productId)
          setPendingIds((prev) => {
            const next = { ...prev }
            delete next[productId]
            return next
          })
        })
    },
    [isLoggedIn, promptLogin, location.pathname, location.search, v],
  )

  return { isInWishlist, toggle, isPending }
}
