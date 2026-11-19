"use client"

import { Separator } from "@/components/ui/separator"
import { SkeletonGroup } from "@/components/ui/skeleton"
import FeedCommentsSection from "@/features/comments/components/feed-comments-section"
import ReviewCard from "@/features/reviews/components/review-card"
import ReviewCardSkeleton from "@/features/reviews/components/review-card-skeleton"
import { useReviews } from "@/features/reviews/hooks"
import { Review, ReviewPagination } from "@/features/reviews/types"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

interface Props {
  initialReviews?: ReviewPagination
}

export default function FeedReviewsSection({ initialReviews }: Props) {
  const [selectedReview, setSelectedReview] = useState<Review | undefined>()
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useReviews(initialReviews)
  const reviews = data?.pages
    .flatMap((page) => page.items)
    .filter((review) => Boolean(review.title?.trim() && review.content?.trim()))

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px 0px",
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])

  const today = dayjs().format("DD/MM/YYYY")

  const handleCommentSelection = (newReview: Review) => {
    if (selectedReview && selectedReview.id === newReview.id) {
      setSelectedReview(undefined)
      return
    }

    setSelectedReview(newReview)
  }

  return (
    <div className="flex min-h-svh flex-row items-start justify-between gap-6">
      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex h-fit flex-col gap-3 border-b border-b-secondary py-6 sm:flex-row sm:items-end sm:justify-between sm:py-8">
          <div>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase sm:text-sm">
              The game goes on here
            </span>
            <h1 className="font-heading text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Community Reviews. <br />
              No filters.
            </h1>
          </div>
          <div className="text-xs tracking-widest text-muted-foreground sm:place-content-end sm:text-sm">
            {today}
          </div>
        </div>
        <Separator />
        {isLoading ? (
          <SkeletonGroup label="Loading reviews">
            {Array.from({ length: 3 }, (_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </SkeletonGroup>
        ) : reviews && reviews.length > 0 ? (
          <div>
            {reviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                review={review}
                priority={index < 2}
                onCommentButtonClick={handleCommentSelection}
                commentsSelected={selectedReview?.id === review.id}
              />
            ))}
            <div ref={ref} className="py-4 text-center">
              {isFetchingNextPage && <ReviewCardSkeleton />}
              {!hasNextPage && reviews.length > 0 && (
                <p className="text-sm text-muted-foreground">No more reviews</p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <span className="text-muted-foreground">No reviews</span>
          </div>
        )}
      </div>
      {selectedReview && (
        <FeedCommentsSection
          selectedReview={selectedReview}
          onClose={() => setSelectedReview(undefined)}
        />
      )}
    </div>
  )
}
