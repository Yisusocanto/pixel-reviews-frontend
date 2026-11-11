"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

type PixelButtonVariant = "solid" | "outline"

interface PixelButtonProps {
  children: React.ReactNode
  variant?: PixelButtonVariant
  href?: string
  onClick?: () => void
  className?: string
}

const base =
  "inline-flex h-12 items-center justify-center gap-2 px-6 font-mono text-sm font-bold tracking-wider uppercase transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const variants: Record<PixelButtonVariant, string> = {
  solid:
    "bg-primary text-primary-foreground shadow-[4px_4px_0_0_oklch(0.96_0_0)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_0_oklch(0.96_0_0)] active:translate-x-1 active:translate-y-1 active:shadow-none",
  outline:
    "border border-foreground/30 text-foreground hover:border-primary hover:text-primary",
}

export default function PixelButton({
  children,
  variant = "solid",
  href,
  onClick,
  className,
}: PixelButtonProps) {
  const classes = cn(base, variants[variant], className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
