import type { Metadata, Viewport } from "next"
import { Geist_Mono, Outfit, Merriweather } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import Providers from "@/components/providers/providers"
import { Toaster } from "@/components/ui/toast"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pixel Reviews: Community Video Game Reviews & Ratings",
    template: "%s | Pixel Reviews",
  },
  description:
    "Rate the games you finish, read unfiltered player reviews, track your gaming wishlist, and see real community rating distributions on Pixel Reviews.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Pixel Reviews",
    title: "Pixel Reviews: Community Video Game Reviews & Ratings",
    description:
      "Rate the games you finish, read unfiltered player reviews, track your gaming wishlist, and see real community rating distributions on Pixel Reviews.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Reviews: Community Video Game Reviews & Ratings",
    description:
      "Rate the games you finish, read unfiltered player reviews, track your gaming wishlist, and see real community rating distributions on Pixel Reviews.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
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
        <Providers>
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
