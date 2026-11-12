import { auth } from "@/auth"
import DangerZoneSection from "@/features/settings/components/danger-zone-section"
import SecuritySection from "@/features/settings/components/security-section"
import UserInfoSection from "@/features/settings/components/user-info-section"
import { getUserAction } from "@/features/users/actions"
import { redirect } from "next/navigation"

async function SettingsPage() {
  const session = await auth()
  if (!session) {
    redirect("/")
  }

  const user = await getUserAction(session.user.username)

  return (
    <div className="flex flex-col gap-4 p-8">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your identity and account security on Pixel Reviews.
        </p>
      </div>
      <div className="flex justify-between gap-10">
        <div className="flex-2">
          <UserInfoSection user={user} />
        </div>
        <div className="flex-1">
          <SecuritySection />
        </div>
      </div>
      <div>
        <DangerZoneSection user={user} />
      </div>
    </div>
  )
}

export default SettingsPage
