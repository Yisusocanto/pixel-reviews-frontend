import { auth } from "@/auth"
import DangerZoneSection from "@/features/settings/components/danger-zone-section"
import SecuritySection from "@/features/settings/components/security-section"
import UserInfoSection from "@/features/settings/components/user-info-section"
import { getUserAction } from "@/features/users/actions"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your identity and account security on Pixel Reviews.",
  robots: {
    index: false,
    follow: false,
  },
}

async function SettingsPage() {
  const session = await auth()
  if (!session) {
    redirect("/")
  }

  const user = await getUserAction(session.user.username)

  return (
    <div className="flex flex-1 flex-col">
      <header className="relative isolate overflow-hidden border-b border-border/80 bg-background/60 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="app-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute -top-24 right-[-10%] -z-10 size-72 rounded-full bg-primary/10 blur-[90px]" />

        <div className="mx-auto w-full max-w-5xl">
          <span className="inline-block font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
            Account
          </span>
          <h1 className="mt-2 font-heading text-3xl font-black tracking-tight sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Manage your identity and account security on Pixel Reviews.
          </p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-4 sm:p-6 lg:p-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-3">
            <UserInfoSection user={user} />
          </div>
          <div className="lg:col-span-2">
            <SecuritySection />
          </div>
        </div>
        <DangerZoneSection user={user} />
      </div>
    </div>
  )
}

export default SettingsPage
