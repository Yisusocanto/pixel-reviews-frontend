import { auth } from "@/auth"
import { SocialSlideTemplate } from "@/components/share/social-slide-template"
import { SocialLanguage, SocialSlide } from "@/features/social-studio/types"
import { ImageResponse } from "next/og"
import { NextRequest, NextResponse } from "next/server"

interface RenderPayload {
  slide: SocialSlide
  slideIndex: number
  totalSlides: number
  language: SocialLanguage
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ detail: "Forbidden" }, { status: 403 })
  }

  let body: RenderPayload | null = null
  try {
    body = (await request.json()) as RenderPayload
  } catch {
    return NextResponse.json({ detail: "Invalid JSON payload" }, { status: 400 })
  }

  if (!body?.slide) {
    return NextResponse.json({ detail: "Missing slide" }, { status: 400 })
  }

  return new ImageResponse(
    <SocialSlideTemplate
      slide={body.slide}
      slideIndex={body.slideIndex ?? 0}
      totalSlides={body.totalSlides ?? 1}
      language={body.language ?? "es"}
    />,
    {
      width: 1080,
      height: 1350,
    }
  )
}
