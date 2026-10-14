"use client"

import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import FeedCommentsSection from "@/features/comments/components/feed-comments-section"
import ReviewCard from "@/features/reviews/components/review-card"
import { useReviews } from "@/features/reviews/hooks"
import { Review } from "@/features/reviews/types"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

export default function Page() {
  const [selectedReview, setSelectedReview] = useState<Review | undefined>()
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useReviews()
  const reviews = data?.pages
    .flatMap((page) => page.items)
    .filter((review) => Boolean(review.title?.trim() && review.content?.trim()))

  const { ref, inView } = useInView({
    threshold: 0,
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
  console.log(selectedReview)

  return (
    <div className="flex min-h-svh flex-row items-start justify-between gap-6">
      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex h-fit flex-col gap-3 border-b border-b-secondary py-6 sm:flex-row sm:items-end sm:justify-between sm:py-8">
          <div>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase sm:text-sm">
              The games goes on here
            </span>
            <h1 className="font-heading text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Your circle. <br />
              No filters.
            </h1>
          </div>
          <div className="text-xs tracking-widest text-muted-foreground sm:text-sm sm:place-content-end">
            {today}
          </div>
        </div>
        <Separator />
        {reviews && reviews.length > 0 ? (
          <div>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onCommentButtonClick={handleCommentSelection}
                commentsSelected={selectedReview?.id === review.id}
              />
            ))}
            <div ref={ref} className="py-4 text-center">
              {isFetchingNextPage && <Spinner />}
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
