"use client"

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
    <div className="flex min-h-svh flex-row items-start justify-between">
      <div className="min-w-0 flex-1">
        <header className="relative isolate overflow-hidden border-b border-border/80 bg-background/60 px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <div className="app-grid pointer-events-none absolute inset-0 -z-10" />
          <div className="pointer-events-none absolute -top-24 right-[-10%] -z-10 size-96 rounded-full bg-primary/12 blur-[100px]" />

          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-block font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                The game goes on here
              </span>
              <h1 className="mt-3 font-heading text-4xl leading-[1.02] font-black tracking-tight sm:text-5xl lg:text-6xl">
                Community Reviews.
                <br />
                <span className="text-primary">No filters</span>
                <span className="ml-[0.06em] inline-block size-[0.14em] bg-foreground align-baseline" />
              </h1>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-1.5 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              <span className="size-1.5 rounded-full bg-primary" />
              {today}
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-10">
          {isLoading ? (
            <SkeletonGroup label="Loading reviews" className="flex flex-col gap-4">
              {Array.from({ length: 3 }, (_, i) => (
                <ReviewCardSkeleton key={i} />
              ))}
            </SkeletonGroup>
          ) : reviews && reviews.length > 0 ? (
            <div className="flex flex-col gap-5">
              {reviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  priority={index < 2}
                  onCommentButtonClick={handleCommentSelection}
                  commentsSelected={selectedReview?.id === review.id}
                />
              ))}
              <div ref={ref} className="py-6 text-center">
                {isFetchingNextPage && <ReviewCardSkeleton />}
                {!hasNextPage && reviews.length > 0 && (
                  <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    End of feed
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card/40 py-16 text-center">
              <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                No reviews yet
              </span>
            </div>
          )}
        </div>
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
