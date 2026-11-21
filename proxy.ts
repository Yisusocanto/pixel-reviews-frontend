import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const { nextUrl } = req
  const isAuthRoute = nextUrl.pathname.startsWith("/auth")

  if (nextUrl.pathname === "/" && req.auth) {
    return NextResponse.redirect(new URL("/feed", nextUrl))
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

export default proxy

export const config = {
  matcher: ["/", "/auth/:path*"],
}
