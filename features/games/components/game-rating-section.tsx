import RatingDistributionCard from "@/components/ui/rating-distribution-card"
import { GameStats } from "@/features/games/types"

interface Props {
  className?: string
  gameStats: GameStats
}

function GameRatingSection({ gameStats, className }: Props) {
  return (
    <section
      id="community-ratings"
      className={className ? `scroll-mt-20 ${className}` : "scroll-mt-20"}
    >
      <h2 className="mb-4 font-mono text-xs font-semibold tracking-[0.22em] text-primary uppercase">
        Community Reception
      </h2>
      <RatingDistributionCard
        avgRating={gameStats.avgRatings}
        totalReviews={gameStats.totalReviews}
        distribution={gameStats.ratingDistribution}
      />
    </section>
  )
}

export default GameRatingSection
