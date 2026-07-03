/**
 * Cross-component cart change notification.
 *
 * Mutations (add/update/remove/clear) dispatch this browser event so listeners
 * such as the header badge can re-fetch the authoritative cart. The event name
 * is single-sourced here to avoid duplicating the magic string across call
 * sites.
 */

/** Browser event name dispatched after a successful cart mutation. */
export const CART_UPDATED_EVENT = 'wearwhere:cart-updated'

/** Dispatch the cart-updated event so listeners refresh their cart state. */
export function notifyCartUpdated(): void {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT))
}
