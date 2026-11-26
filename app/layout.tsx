import type { Metadata, Viewport } from "next"
import { Geist_Mono, Merriweather, Outfit } from "next/font/google"

import "./globals.css"
import Providers from "@/components/providers/providers"
import { Toaster } from "@/components/ui/toast"
import {
  buildLanguageAlternates,
  getDictionary,
} from "@/lib/i18n/dictionaries"
import { getServerLocale } from "@/lib/i18n/server"
import { cn } from "@/lib/utils"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const merriweatherHeading = Merriweather({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
})

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-mono",
})

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.pixelreviews.app"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale()
  const dict = getDictionary(locale)
  const alternates = buildLanguageAlternates("/", locale)

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.siteTitle,
      template: "%s | Pixel Reviews",
    },
    description: dict.meta.siteDescription,
    alternates,
    openGraph: {
      type: "website",
      siteName: "Pixel Reviews",
      locale: locale === "es" ? "es_ES" : "en_US",
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      url: alternates.canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
    },
    icons: {
      icon: [
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    verification: {
      google: "Bke7j_wArV8Sfx2SLNvQGpIGyr1b0kt5dgiiTW73ms0",
    },
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0f" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getServerLocale()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable,
        merriweatherHeading.variable
      )}
    >
      <body className="bg-secondary">
        <Providers initialLocale={locale}>
          <Toaster />
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
          {children}
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
