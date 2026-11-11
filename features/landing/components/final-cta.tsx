"use client"

import { PixelGamepadIcon } from "@/components/ui/pixel-gamepad-icon"
import Link from "next/link"
import { useLanding } from "./landing-shell"
import PixelButton from "./pixel-button"

export default function FinalCta() {
  const { openAuth } = useLanding()

  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="landing-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-10 px-5 py-28 sm:px-8 sm:py-40">
        <h2 className="font-heading text-[clamp(3.5rem,13vw,11rem)] leading-[0.9] font-black tracking-tight">
          Press start
          <span className="landing-blink ml-[0.06em] inline-block h-[0.78em] w-[0.34em] translate-y-[0.06em] bg-primary align-baseline" />
        </h2>
        <p className="max-w-md text-lg text-muted-foreground">
          Free to join. Your first review takes about as long as the loading
          screen.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <PixelButton onClick={() => openAuth("sign-up")}>
            Create account
          </PixelButton>
          <PixelButton href="/search" variant="outline">
            Look around first
          </PixelButton>
        </div>
      </div>

      <footer className="relative border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-5 py-6 sm:flex-row sm:items-center sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <PixelGamepadIcon className="h-4 w-8 text-primary" />
              <span className="font-mono text-xs tracking-widest uppercase">
                Pixel Reviews
              </span>
            </Link>
            <span className="font-mono text-xs text-muted-foreground">·</span>
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              For those who play
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
            <Link
              href="/privacy"
              className="transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
            <a
              href="https://www.igdb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              Data by IGDB
            </a>
          </nav>
        </div>
      </footer>
    </section>
  )
}
