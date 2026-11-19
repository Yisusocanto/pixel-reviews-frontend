import { auth } from "@/auth"
import ModerationQueue from "@/features/moderation/components/moderation-queue"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Moderation Queue",
  description: "Administrative moderation panel for managing community reviews",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminModerationPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  if (session.user.role !== "admin") {
    redirect("/feed")
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <ModerationQueue />
    </div>
  )
}
