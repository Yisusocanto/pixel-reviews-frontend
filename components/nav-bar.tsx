"use client"

import LoginModal from "@/components/auth/login-modal"
import LanguageSwitcher from "@/components/i18n/language-switcher"
import { useLocale } from "@/components/providers/locale-provider"
import SearchNavbar from "@/components/search-navbar"
import { Button } from "@/components/ui/button"
import { PixelGamepadIcon } from "@/components/ui/pixel-gamepad-icon"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { buildLocalizedPath } from "@/lib/i18n/dictionaries"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

function NavBar() {
  const { data: session } = useSession()
  const { locale, dict } = useLocale()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<"sign-in" | "sign-up">("sign-in")

  const handleOpenAuth = (tab: "sign-in" | "sign-up") => {
    setModalTab(tab)
    setModalOpen(true)
  }

  return (
    <header className="sticky top-0 z-30 flex h-15 items-center justify-between gap-3 border-b border-border/80 bg-background/85 px-3 backdrop-blur-md sm:px-5">
      <div className="flex shrink-0 items-center gap-2">
        <SidebarTrigger />
        <Link
          href={buildLocalizedPath(session ? "/feed" : "/", locale)}
          aria-label="Pixel Reviews Home"
          className="flex items-center gap-2 truncate text-base leading-none font-extrabold tracking-tight md:hidden"
        >
          <PixelGamepadIcon
            aria-hidden="true"
            className="h-5 w-10 shrink-0 text-primary"
          />
          <span className="hidden font-black tracking-tight sm:inline">
            <span className="text-primary">Pixel</span> Reviews
          </span>
        </Link>
      </div>

      <SearchNavbar />

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <LanguageSwitcher />
        {!session && (
          <>
            <Button variant="ghost" onClick={() => handleOpenAuth("sign-in")}>
              {dict.nav.signIn}
            </Button>
            <Button variant="primary" onClick={() => handleOpenAuth("sign-up")}>
              <span className="sm:hidden">{dict.nav.join}</span>
              <span className="hidden sm:inline">{dict.nav.createAccount}</span>
            </Button>
            <LoginModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              defaultTab={modalTab}
            />
          </>
        )}
      </div>
    </header>
  )
}

export default NavBar
