"use client"

import LoginModal from "@/components/auth/login-modal"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type AuthTab = "sign-in" | "sign-up"

interface LandingContextValue {
  openAuth: (tab: AuthTab) => void
}

const LandingContext = createContext<LandingContextValue | null>(null)

export function useLanding() {
  const context = useContext(LandingContext)
  if (!context) {
    throw new Error("useLanding must be used inside LandingShell")
  }
  return context
}

export default function LandingShell({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<AuthTab>("sign-up")

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/feed")
    }
  }, [status, router])

  const value = useMemo<LandingContextValue>(
    () => ({
      openAuth: (nextTab) => {
        setTab(nextTab)
        setOpen(true)
      },
    }),
    []
  )

  return (
    <LandingContext.Provider value={value}>
      <div className="dark relative min-h-svh w-full min-w-0 flex-1 overflow-x-clip bg-background text-foreground">
        {children}
      </div>
      <LoginModal open={open} onOpenChange={setOpen} defaultTab={tab} />
    </LandingContext.Provider>
  )
}
