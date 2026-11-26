import {
  AppLocale,
  LOCALE_COOKIE_NAME,
  LOCALE_HEADER_NAME,
  parseLocale,
} from "@/lib/i18n/dictionaries"
import { cookies, headers } from "next/headers"

export async function getServerLocale(): Promise<AppLocale> {
  const headerStore = await headers()
  const headerLocale = headerStore.get(LOCALE_HEADER_NAME)
  if (headerLocale) {
    return parseLocale(headerLocale)
  }

  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value
  if (cookieLocale) {
    return parseLocale(cookieLocale)
  }

  return "en"
}
