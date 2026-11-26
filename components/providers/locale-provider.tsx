"use client"

import {
  AppLocale,
  Dictionary,
  getDictionary,
} from "@/lib/i18n/dictionaries"
import React, { createContext, useContext, useMemo, useState } from "react"

interface LocaleContextValue {
  locale: AppLocale
  dict: Dictionary
  setLocaleState: (next: AppLocale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  dict: getDictionary("en"),
  setLocaleState: () => {},
})

export function LocaleProvider({
  initialLocale = "en",
  children,
}: {
  initialLocale?: AppLocale
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale)

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dict: getDictionary(locale),
      setLocaleState,
    }),
    [locale]
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
