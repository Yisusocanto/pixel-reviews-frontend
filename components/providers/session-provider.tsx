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
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/" })
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
