import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { endSession, refreshSession } from '@/lib/session'
import type { AUTH_CONTEXT_TYPE, SESSION_TYPE } from '@/utils/types'

import { AuthContext } from './authContext'

// Renew the access token this long before it actually expires.
const TOKEN_EXPIRY_MARGIN_MS = 30_000

// Holds the logged-in user and the login modal's open state for the whole app.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SESSION_TYPE | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  // The latest session and its expiry time, readable from callbacks without re-rendering.
  const tokenRef = useRef<{ accessToken: string; expiresAt: number } | null>(null)

  const applySession = useCallback((nextSession: SESSION_TYPE | null) => {
    tokenRef.current = nextSession
      ? { accessToken: nextSession.accessToken, expiresAt: Date.now() + nextSession.expiresIn * 1000 }
      : null
    setSession(nextSession)
  }, [])

  // On every page load, ask the backend whether this browser is logged in. This
  // also completes a Google sign-in, which ends with a redirect back to the app.
  useEffect(() => {
    let isActive = true
    void refreshSession().then((restoredSession) => {
      if (isActive) {
        applySession(restoredSession)
        setIsAuthLoading(false)
      }
    })
    return () => {
      isActive = false
    }
  }, [applySession])

  // Access tokens last only a few minutes, so API calls ask for one here and
  // get a renewed token when the current one is about to expire.
  const getAccessToken = useCallback(async () => {
    const token = tokenRef.current
    if (!token) {
      return null
    }
    if (Date.now() < token.expiresAt - TOKEN_EXPIRY_MARGIN_MS) {
      return token.accessToken
    }
    const renewedSession = await refreshSession()
    applySession(renewedSession)
    return renewedSession?.accessToken ?? null
  }, [applySession])

  const value = useMemo<AUTH_CONTEXT_TYPE>(
    () => ({
      user: session?.user ?? null,
      isLoggedIn: session !== null,
      isAuthLoading,
      getAccessToken,
      // Clears the cookie on the backend first, then the logged-in state here.
      logout: () => {
        void endSession().finally(() => applySession(null))
      },
      isLoginModalOpen,
      openLoginModal: () => setIsLoginModalOpen(true),
      closeLoginModal: () => setIsLoginModalOpen(false),
    }),
    [session, isAuthLoading, isLoginModalOpen, getAccessToken, applySession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
