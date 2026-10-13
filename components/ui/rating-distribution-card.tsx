import RatingDistribution, {
  RatingDistributionRow,
} from "@/components/ui/c-rating-6"
import StarRating from "@/components/ui/star-rating"
import { cn } from "@/lib/utils"

export interface RatingDistributionCardProps {
  avgRating?: number | string | null
  totalReviews?: number | null
  distribution?: RatingDistributionRow[]
  showCount?: boolean
  showPercentage?: boolean
  reviewsLabel?: string
  className?: string
}

export function RatingDistributionCard({
  avgRating,
  totalReviews = 0,
  distribution,
  showCount = true,
  showPercentage = true,
  reviewsLabel = "reviews",
  className,
}: RatingDistributionCardProps) {
  const numericAvg = Number(avgRating) || 0
  const formattedAvg = numericAvg > 0 ? numericAvg.toFixed(1) : "0.0"
  const total = totalReviews ?? 0

  const countText =
    total === 1
      ? `1 ${reviewsLabel.replace(/s$/, "")}`
      : `${total} ${reviewsLabel}`

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-6 backdrop-blur-sm sm:flex-row sm:gap-8 md:gap-10",
        className
      )}
    >
      {/* Left: Score & Star display */}
      <div className="flex w-full shrink-0 flex-col items-center justify-center border-b border-border/40 pb-4 sm:w-auto sm:min-w-44 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8">
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-5xl font-black tracking-tight text-foreground">
            {formattedAvg}
          </span>
          <span className="text-xl font-semibold text-muted-foreground/70">
            / 5
          </span>
        </div>
        <div className="mt-2.5">
          <StarRating value={numericAvg} size="md" readOnly />
        </div>
        <span className="mt-2 text-xs font-medium text-muted-foreground">
          {countText}
        </span>
      </div>

      {/* Right: Distribution bars */}
      <div className="w-full flex-1">
        <RatingDistribution
          distribution={distribution}
          showCount={showCount}
          showPercentage={showPercentage}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default RatingDistributionCard
