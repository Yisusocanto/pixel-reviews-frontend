"use client"

import { LocaleProvider } from "@/components/providers/locale-provider"
import { SessionProvider } from "@/components/providers/session-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppLocale } from "@/lib/i18n/dictionaries"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useState } from "react"

function Providers({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode
  initialLocale?: AppLocale
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <TooltipProvider>
            <LocaleProvider initialLocale={initialLocale}>
              <SessionProvider>{children}</SessionProvider>
            </LocaleProvider>
          </TooltipProvider>
        </SidebarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default Providers
