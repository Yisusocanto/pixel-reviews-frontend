"use client"

import { Separator } from "@/components/ui/separator"
import GameReviewCard from "@/features/reviews/components/game-review-card"
import { useGameReviews } from "@/features/games/hooks/use-games"
import { useUserGameReview } from "@/features/reviews/hooks"
import { Review } from "@/features/reviews/types"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import { Spinner } from "@/components/ui/spinner"

interface Props {
  gameId: string
  gameSlug: string
  initialUserReview?: Review | null
}

function GameCommunitySection({ gameId, gameSlug, initialUserReview }: Props) {
  const { data: userReview } = useUserGameReview(gameId, initialUserReview)
  const currentUserReview =
    userReview !== undefined ? userReview : initialUserReview

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGameReviews(gameSlug)

  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  })

  const hasUserWrittenReview = Boolean(
    currentUserReview?.title?.trim() && currentUserReview?.content?.trim()
  )

  const reviews = data?.pages
    .flatMap((page) => page.items)
    .filter(
      (review) =>
        review.id !== currentUserReview?.id &&
        Boolean(review.title?.trim() && review.content?.trim())
    )

  return (
    <div>
      <h2 className="mb-4 font-heading font-bold tracking-widest text-primary uppercase">
        Community
      </h2>

      {hasUserWrittenReview && currentUserReview && (
        <>
          <div className="my-8">
            <GameReviewCard review={currentUserReview} ownReview />
          </div>
          <Separator className={"my-4"} />
        </>
      )}

      {reviews && reviews.length > 0 ? (
        <div className="flex flex-col gap-8">
          {reviews.map((review) => (
            <GameReviewCard review={review} key={review.id} />
          ))}
          <div ref={ref} className="py-4 text-center">
            {isFetchingNextPage && <Spinner />}
            {!hasNextPage && reviews.length > 0 && (
              <p className="text-sm text-muted-foreground">No more reviews</p>
            )}
          </div>
        </div>
      ) : !hasUserWrittenReview ? (
        <div className="flex">
          <span className="m-auto text-center text-muted-foreground">
            No reviews yet
          </span>
        </div>
      ) : null}
    </div>
  )
}

export default GameCommunitySection
