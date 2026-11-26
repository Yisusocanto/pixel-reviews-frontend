import { ReviewShareCardTemplate } from "@/components/share/og-card-primitives"
import { getReviewByIdAction } from "@/features/reviews/actions"
import { Review } from "@/features/reviews/types"
import {
  getShareCardDimensions,
  ShareCardFormat,
} from "@/lib/og-image-utils"
import { ImageResponse } from "next/og"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const rawFormat = request.nextUrl.searchParams.get("format")
  const format: ShareCardFormat = rawFormat === "post" ? "post" : "story"
  const dimensions = getShareCardDimensions(format)

  let review: Review | null = null
  try {
    review = await getReviewByIdAction(id)
  } catch {
    return NextResponse.json({ detail: "Review not found" }, { status: 404 })
  }

  return new ImageResponse(
    <ReviewShareCardTemplate review={review} format={format} />,
    {
      ...dimensions,
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600",
      },
    }
  )
}
