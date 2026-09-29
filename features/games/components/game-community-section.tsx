"use client"

import { Separator } from "@/components/ui/separator"
import GameReviewCard from "@/features/games/components/game-review-card"
import { useGameReviews } from "@/features/games/hooks/use-games"

interface Props {
  gameSlug: string
}

function GameCommunitySection({ gameSlug }: Props) {
  const { data } = useGameReviews(gameSlug)

  const reviews = data?.pages.flatMap((page) => page.items)
  return (
    <div>
      <h2 className="mb-4 font-heading font-bold tracking-widest text-primary uppercase">
        Community
      </h2>
      <Separator className={"my-2"} />
      {reviews && reviews.length > 0 ? (
        <div>
          {reviews?.map((review) => (
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
