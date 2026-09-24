"use client"

import { useEffect } from "react"
import {
  SessionProvider as NextAuthSessionProvider,
  signOut,
  useSession,
} from "next-auth/react"

interface SessionProviderProps {
  children: React.ReactNode
}

function SessionWatcher({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    // If token rotation failed on the server, sign out cleanly
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/auth/login?error=SessionExpired" })
    }
  }, [session])

  return <>{children}</>
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider>
      <SessionWatcher>{children}</SessionWatcher>
    </NextAuthSessionProvider>
  )
}
