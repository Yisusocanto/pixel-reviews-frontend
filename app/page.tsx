"use client"

import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import ReviewCard from "@/features/reviews/components/review-card"
import { useReviews } from "@/features/reviews/hooks"
import dayjs from "dayjs"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

export default function Page() {
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

  return (
    <div className="flex min-h-svh flex-col bg-secondary p-6">
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
            <ReviewCard key={review.id} review={review} />
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
  )
}
