import { getAllReviewsAction } from "@/features/reviews/actions"
import FeedReviewsSection from "@/features/reviews/components/feed-reviews-section"
import { ReviewPagination } from "@/features/reviews/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Latest Community Video Game Reviews",
  description:
    "Read the latest unfiltered video game reviews, star ratings, and discussions posted by players right after rolling credits.",
  alternates: {
    canonical: "/feed",
  },
  openGraph: {
    type: "website",
    siteName: "Pixel Reviews",
    title: "Latest Community Video Game Reviews | Pixel Reviews",
    description:
      "Read the latest unfiltered video game reviews, star ratings, and discussions posted by players right after rolling credits.",
    url: "/feed",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest Community Video Game Reviews | Pixel Reviews",
    description:
      "Read the latest unfiltered video game reviews, star ratings, and discussions posted by players right after rolling credits.",
  },
}

export default async function FeedPage() {
  let initialReviews: ReviewPagination | undefined = undefined

  try {
    initialReviews = await getAllReviewsAction(1, 10)
  } catch {
    initialReviews = undefined
  }

  return <FeedReviewsSection initialReviews={initialReviews} />
}
