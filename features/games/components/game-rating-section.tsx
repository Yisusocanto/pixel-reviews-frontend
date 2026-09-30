import RatingDistribution from "@/components/ui/c-rating-6"
import StarRating from "@/components/ui/star-rating"
import { GameStats } from "@/features/games/types"

interface Props {
  className?: string
  gameStats: GameStats
}

function GameRatingSection({ gameStats, className }: Props) {
  return (
    <section className={className}>
      <h2 className="mb-4 font-heading font-bold tracking-widest text-primary uppercase">
        Community Reception
      </h2>
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm sm:flex-row sm:gap-10">
        <div className="flex min-w-44 shrink-0 flex-col items-center justify-center border-border/40 sm:border-r sm:pr-8">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-5xl font-black tracking-tight text-foreground">
              {gameStats.avgRatings
                ? Number(gameStats.avgRatings).toFixed(1)
                : "0.0"}
            </span>
            <span className="text-xl font-semibold text-muted-foreground/70">
              / 5
            </span>
          </div>
          <div className="mt-2.5">
            <StarRating
              value={Number(gameStats.avgRatings) || 0}
              size="md"
              readOnly
            />
          </div>
          <span className="mt-2 text-xs font-medium text-muted-foreground">
            {gameStats.totalReviews === 1
              ? "1 review"
              : `${gameStats.totalReviews ?? 0} reviews`}
          </span>
        </div>
        <div className="w-full flex-1">
          <RatingDistribution
            distribution={gameStats.ratingDistribution}
            className="w-full"
          />
        </div>
      </div>
    </section>
  )
}

export default GameRatingSection
