"use client"

import LoginModal from "@/components/auth/login-modal"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
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
    <header className="flex h-15 items-center justify-between border-b border-b-border bg-secondary px-4">
      <SidebarTrigger />
      {!session && (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => handleOpenAuth("sign-in")}>
            Sign in
          </Button>
          <Button variant="outline" onClick={() => handleOpenAuth("sign-up")}>
            Create account
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
