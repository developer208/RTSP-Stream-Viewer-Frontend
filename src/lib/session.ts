import { API_URL } from '@/utils/constants'
import type { SESSION_TYPE } from '@/utils/types'

let pendingRefresh: Promise<SESSION_TYPE | null> | null = null

async function requestSession(): Promise<SESSION_TYPE | null> {
  try {
    // `credentials: 'include'` sends the HttpOnly refresh-token cookie to the backend.
    const response = await fetch(`${API_URL}/api/auth/refresh`, { method: 'POST', credentials: 'include' })
    if (!response.ok) {
      return null
    }
    return (await response.json()) as SESSION_TYPE
  } catch {
    // Backend unreachable: treat the visitor as a guest.
    return null
  }
}

/**
 * Asks the backend for a fresh access token and the logged-in user. Resolves to
 * null when nobody is logged in.
 *
 * Each refresh token works only once, so calls that overlap share one request;
 * a second parallel request would be rejected and end the session.
 */
export function refreshSession(): Promise<SESSION_TYPE | null> {
  pendingRefresh ??= requestSession().finally(() => {
    pendingRefresh = null
  })
  return pendingRefresh
}

/** Ends the session on the backend: it deletes the refresh token and clears the cookie. */
export async function endSession(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' })
  } catch {
    // Backend unreachable: the caller still clears the local login state.
  }
}
