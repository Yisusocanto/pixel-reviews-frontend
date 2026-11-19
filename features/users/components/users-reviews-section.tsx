"use client"

import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton"
import UserReviewCard from "@/features/reviews/components/user-review-card"
import UserReviewCardSkeleton from "@/features/reviews/components/user-review-card-skeleton"
import { ReviewPagination } from "@/features/reviews/types"
import { useUserReviews } from "@/features/users/hooks"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface Props {
  username: string
  ownReview?: boolean
  initialReviews?: ReviewPagination
}

function UserReviewSection({
  username,
  ownReview = false,
  initialReviews,
}: Props) {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useUserReviews(username, initialReviews)
  const reviews =
    data?.pages
      .flatMap((page) => page.items)
      .filter((review) =>
        Boolean(review.title?.trim() && review.content?.trim())
      ) ?? []

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px 0px",
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <SkeletonGroup
        label="Loading reviews"
        className="border-t border-t-border"
      >
        <Skeleton className="mt-3 h-8 w-28" />
        {Array.from({ length: 2 }, (_, i) => (
          <UserReviewCardSkeleton key={i} />
        ))}
      </SkeletonGroup>
    )
  }

  return (
    <div className="border-t border-t-border">
      <h2 className="mt-3 font-heading text-2xl font-bold">Reviews</h2>
      {reviews.length < 1 && (
        <div className="py-4 text-center">
          <span>The user does not have reviews</span>
        </div>
      )}
      {reviews?.map((review) => (
        <UserReviewCard
          key={review.id}
          review={review}
          ownReview={ownReview}
          className="border-b border-b-border last:border-0"
        />
      ))}
      <div ref={ref} className="py-4 text-center">
        {isFetchingNextPage && <UserReviewCardSkeleton />}
        {!hasNextPage && reviews.length > 0 && (
          <p className="text-sm text-muted-foreground">No more reviews</p>
        )}
      </div>
    </div>
  )
}

export default UserReviewSection
