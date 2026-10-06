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
  const reviews = data?.pages.flatMap((page) => page.items)

  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  })

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
      <div className="min-w-0 flex-3 p-6">
        <div className="flex h-fit justify-between border-b border-b-secondary py-8">
          <div>
            <span className="tracking-wider text-primary uppercase">
              The games goes on here
            </span>
            <h1 className="font-heading text-6xl">
              Your circle. <br />
              No filters.
            </h1>
          </div>
          <div className="place-content-end tracking-widest">{today}</div>
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
          <div>
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
