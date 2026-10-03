import RatingDistributionCard from "@/components/ui/rating-distribution-card"
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
      <RatingDistributionCard
        avgRating={gameStats.avgRatings}
        totalReviews={gameStats.totalReviews}
        distribution={gameStats.ratingDistribution}
      />
    </section>
  )
}

export default GameRatingSection
