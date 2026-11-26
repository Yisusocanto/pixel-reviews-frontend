"use server"

import { AppLocale, LOCALE_COOKIE_NAME } from "@/lib/i18n/dictionaries"
import { cookies } from "next/headers"

export async function setLocaleCookieAction(locale: AppLocale): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
}
