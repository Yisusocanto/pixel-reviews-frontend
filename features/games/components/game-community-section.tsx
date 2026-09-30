"use client"

import { Separator } from "@/components/ui/separator"
import GameReviewCard from "@/features/games/components/game-review-card"
import { useGameReviews } from "@/features/games/hooks/use-games"
import { useUserGameReview } from "@/features/reviews/hooks"
import { Review } from "@/features/reviews/types"

interface Props {
  gameId: string
  gameSlug: string
  initialUserReview?: Review | null
}

function GameCommunitySection({ gameId, gameSlug, initialUserReview }: Props) {
  const { data: userReview } = useUserGameReview(gameId, initialUserReview)
  const currentUserReview = userReview !== undefined ? userReview : initialUserReview

  const { data } = useGameReviews(gameSlug)

  const reviews = data?.pages
    .flatMap((page) => page.items)
    .filter((review) => review.id !== currentUserReview?.id)

  return (
    <div>
      <h2 className="mb-4 font-heading font-bold tracking-widest text-primary uppercase">
        Community
      </h2>

      {currentUserReview && (
        <div className="my-8">
          <GameReviewCard review={currentUserReview} ownReview />
        </div>
      )}
      <Separator className={"my-4"} />

      {reviews && reviews.length > 0 ? (
        <div className="flex flex-col gap-8">
          {reviews.map((review) => (
            <GameReviewCard review={review} key={review.id} />
          ))}
        </div>
      ) : (
        <div className="flex">
          <span className="m-auto text-center text-muted-foreground">
            No reviews yet
          </span>
        </div>
      )}
    </div>
  )
}

export default GameCommunitySection
