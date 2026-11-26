import { auth } from "@/auth"
import {
  AppLocale,
  LOCALE_COOKIE_NAME,
  LOCALE_HEADER_NAME,
  parseLocale,
  stripLocalePrefix,
} from "@/lib/i18n/dictionaries"
import { NextResponse } from "next/server"

function detectPreferredLocale(
  pathname: string,
  cookieLocale: string | undefined,
  acceptLanguage: string | null
): AppLocale {
  if (pathname === "/es" || pathname.startsWith("/es/")) {
    return "es"
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return "en"
  }
  if (cookieLocale) {
    return parseLocale(cookieLocale)
  }
  if (acceptLanguage && /\bes\b/i.test(acceptLanguage.split(",")[0] ?? "")) {
    return "es"
  }
  return "en"
}

export const proxy = auth((req) => {
  const { nextUrl } = req
  const { pathname } = nextUrl

  const hasEsPrefix = pathname === "/es" || pathname.startsWith("/es/")
  const hasEnPrefix = pathname === "/en" || pathname.startsWith("/en/")
  const cleanPath = stripLocalePrefix(pathname)
  const isAuthRoute = cleanPath.startsWith("/auth")

  const cookieLocale = req.cookies.get(LOCALE_COOKIE_NAME)?.value
  const activeLocale = detectPreferredLocale(
    pathname,
    cookieLocale,
    req.headers.get("accept-language")
  )

  if (hasEnPrefix) {
    const redirectUrl = new URL(cleanPath, nextUrl)
    redirectUrl.search = nextUrl.search
    return NextResponse.redirect(redirectUrl)
  }

  if (cleanPath === "/" && req.auth) {
    const feedPath = hasEsPrefix ? "/es/feed" : "/feed"
    return NextResponse.redirect(new URL(feedPath, nextUrl))
  }

  if (isAuthRoute) {
    const rootPath = hasEsPrefix ? "/es" : "/"
    return NextResponse.redirect(new URL(rootPath, nextUrl))
  }

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set(LOCALE_HEADER_NAME, activeLocale)

  if (hasEsPrefix) {
    const rewriteUrl = new URL(cleanPath, nextUrl)
    rewriteUrl.search = nextUrl.search
    const response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    })
    if (cookieLocale !== "es") {
      response.cookies.set(LOCALE_COOKIE_NAME, "es", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      })
    }
    return response
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
})

export default proxy

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
