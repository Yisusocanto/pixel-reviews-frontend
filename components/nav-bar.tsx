"use client"

import LoginModal from "@/components/auth/login-modal"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

function NavBar() {
  const { data: session } = useSession()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<"sign-in" | "sign-up">("sign-in")

  const handleOpenAuth = (tab: "sign-in" | "sign-up") => {
    setModalTab(tab)
    setModalOpen(true)
  }

  return (
    <header className="sticky top-0 z-30 flex h-15 items-center justify-between gap-2 border-b border-b-border bg-secondary/95 px-3 backdrop-blur-sm sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger />
        <Link
          href="/"
          className="truncate text-lg leading-none font-extrabold tracking-tight md:hidden"
        >
          Pixel Reviews
        </Link>
      </div>
      {!session && (
        <div className="flex shrink-0 gap-1 sm:gap-2">
          <Button variant="ghost" onClick={() => handleOpenAuth("sign-in")}>
            Sign in
          </Button>
          <Button variant="outline" onClick={() => handleOpenAuth("sign-up")}>
            <span className="sm:hidden">Join</span>
            <span className="hidden sm:inline">Create account</span>
          </Button>
          <LoginModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            defaultTab={modalTab}
          />
        </div>
      )}
    </header>
  )
}

export default NavBar
