import { Geist_Mono, Outfit, Merriweather } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import Providers from "@/components/providers/providers"
import { SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import NavBar from "@/components/nav-bar"

const merriweatherHeading = Merriweather({
  subsets: ["latin"],
  variable: "--font-heading",
})

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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
      <body>
        <Providers>
          <AppSidebar />
          <SidebarInset>
            <main>
              <NavBar />
              {children}
            </main>
          </SidebarInset>
        </Providers>
      </body>
    </html>
  )
}
