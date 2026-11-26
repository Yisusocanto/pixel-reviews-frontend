"use client"

import { setLocaleCookieAction } from "@/app/actions/locale"
import { useLocale } from "@/components/providers/locale-provider"
import { AppLocale, buildLocalizedPath } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LanguageSwitcherInner() {
  const { locale, setLocaleState } = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleSelect = async (nextLocale: AppLocale) => {
    if (nextLocale === locale) return
    setLocaleState(nextLocale)
    await setLocaleCookieAction(nextLocale)
    const targetPath = buildLocalizedPath(pathname, nextLocale)
    const qs = searchParams.toString()
    router.push(qs ? `${targetPath}?${qs}` : targetPath)
    router.refresh()
  }

  return (
    <div
      role="group"
      aria-label="Language selector"
      className="inline-flex shrink-0 items-center rounded-lg border border-border bg-card p-0.5 font-mono text-[11px] font-bold"
    >
      {(["es", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => void handleSelect(item)}
          className={cn(
            "rounded-md px-2 py-1 uppercase transition-colors",
            locale === item
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export function LanguageSwitcher() {
  return (
    <Suspense fallback={null}>
      <LanguageSwitcherInner />
    </Suspense>
  )
}

export default LanguageSwitcher
