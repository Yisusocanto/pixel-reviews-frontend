import OpenGraphImage from "@/app/opengraph-image"
import { ReviewOgTemplate } from "@/components/share/og-card-primitives"
import { getReviewByIdAction } from "@/features/reviews/actions"
import { Review } from "@/features/reviews/types"
import { ImageResponse } from "next/og"

export const alt = "Player Review on Pixel Reviews"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let review: Review | null = null

  try {
    review = await getReviewByIdAction(id)
  } catch {
    return OpenGraphImage()
  }

  if (!review) {
    return OpenGraphImage()
  }

  return new ImageResponse(<ReviewOgTemplate review={review} />, size)
}
