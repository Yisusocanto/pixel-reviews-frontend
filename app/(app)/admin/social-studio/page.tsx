import { auth } from "@/auth"
import SocialStudioWorkspace from "@/features/social-studio/components/social-studio-workspace"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Social Studio",
  description:
    "AI-powered carousel, studio voiceover, and vertical video generator for Pixel Reviews",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminSocialStudioPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  if (session.user.role !== "admin") {
    redirect("/feed")
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SocialStudioWorkspace />
    </div>
  )
}
