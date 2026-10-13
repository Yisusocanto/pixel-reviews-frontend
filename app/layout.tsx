import type { Viewport } from "next"
import { Geist_Mono, Outfit, Merriweather } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import Providers from "@/components/providers/providers"
import { SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import NavBar from "@/components/nav-bar"
import { Toaster } from "@/components/ui/toast"

const merriweatherHeading = Merriweather({
  subsets: ["latin"],
  variable: "--font-heading",
})

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1c1c" },
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
          <AppSidebar />
          <SidebarInset className="flex min-h-svh min-w-0 flex-1 flex-col bg-secondary">
            <NavBar />
            <Toaster />
            <div className="flex min-w-0 flex-1 flex-col bg-secondary">
              {children}
            </div>
          </SidebarInset>
        </Providers>
      </body>
    </html>
  )
}
