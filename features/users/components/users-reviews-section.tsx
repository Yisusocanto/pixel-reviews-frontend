"use client"

import UserReviewCard from "@/features/reviews/components/user-review-card"
import { useUserReviews } from "@/features/users/hooks"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface Props {
  username: string
  ownReview?: boolean
}

function UserReviewSection({ username, ownReview = false }: Props) {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useUserReviews(username)
  const reviews =
    data?.pages
      .flatMap((page) => page.items)
      .filter((review) => Boolean(review.title?.trim() && review.content?.trim())) ?? []

  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <div className="border-t border-t-border">
      <h2 className="font-bol mt-3 font-heading text-2xl">Reviews</h2>
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
        {isFetchingNextPage && <p>Loading reviews...</p>}
        {!hasNextPage && reviews.length > 0 && (
          <p className="text-sm text-muted-foreground">No more reviews</p>
        )}
      </div>
    </div>
  )
}

export default UserReviewSection
